import { waitUntil } from '@open-wc/testing';
import { setViewport } from '@web/test-runner-commands';
import { XMLEditor } from '@openscd/oscd-editor';
import type { EditEventV2, EditV2 } from '@openscd/oscd-api';
import { newEditEventV2 } from '@openscd/oscd-api/utils.js';

import SubscriberLaterBinding from '../oscd-subscriber-later-binding.js';
import { loadFixture } from './fixtures.js';

export { loadFixture };

const tagName = 'oscd-subscriber-later-binding-spec';

if (customElements.get(tagName) === undefined) {
  customElements.define(tagName, SubscriberLaterBinding);
}

export const settingsKey = 'oscd-subscriber-later-binding';

// Browsers report this when a resize observer, as used by lists which draw only
// the rows in view, needs another frame to settle. It does not affect the page
// and is not an error in the plugin.
window.addEventListener(
  'error',
  (event) => {
    if (event.message.includes('ResizeObserver loop')) {
      event.stopImmediatePropagation();
    }
  },
  true
);

const nativeWindowSize = {
  innerHeight: Object.getOwnPropertyDescriptor(window, 'innerHeight'),
  innerWidth: Object.getOwnPropertyDescriptor(window, 'innerWidth')
};

let viewportLayout: 'tall' | 'fit' | undefined;

/**
 * Lists only draw the rows inside the browser window. A window tall enough for
 * every row is too large for the browser to make real when several test pages
 * run together, so for tall layouts the window is only reported as tall, which
 * is all the lists look at. The size is set once for each kind of layout.
 * @param layout - how tall the window should be.
 */
export async function useViewport(layout: 'tall' | 'fit'): Promise<void> {
  if (viewportLayout === layout) {
    return;
  }
  viewportLayout = layout;

  if (layout === 'tall') {
    Object.defineProperty(window, 'innerHeight', {
      configurable: true,
      get: () => 11000
    });
    Object.defineProperty(window, 'innerWidth', {
      configurable: true,
      get: () => 1280
    });
    return;
  }

  Object.entries(nativeWindowSize).forEach(([name, descriptor]) => {
    if (descriptor) {
      Object.defineProperty(window, name, descriptor);
    }
  });
  await setViewport({ width: 1280, height: 800 });
}

export type MountOptions = {
  /** File name within `test/fixtures`. */
  fixture?: string;
  /** An already parsed document, used instead of a fixture. */
  doc?: XMLDocument;
  /** Mount without a document, as before the host has opened a file. */
  noDocument?: boolean;
  /** Settings to put in local storage before the plugin is connected. */
  settings?: Record<string, unknown>;
  /** Exact text to put in local storage, e.g. to test corrupt settings. */
  rawSettings?: string;
  /**
   * How tall the plugin and the browser window are. Lists only draw the rows in
   * view, which is the part of the list inside the window, so specs use a plugin
   * and window tall enough to show every row (the default) and screenshots use
   * ones which fit a typical screen.
   */
  layout?: 'tall' | 'fit';
};

export type MountedPlugin = {
  plugin: SubscriberLaterBinding;
  doc: XMLDocument;
  /**
   * Every `oscd-edit-v2` edit dispatched by the plugin, in order, without
   * merging squashed edits. Use `editor` to see the undoable commits.
   */
  edits: EditV2[];
  /** The undo/redo history, as the host keeps it. */
  editor: XMLEditor;
  /**
   * Dispatches an edit as another plugin would, e.g. a menu plugin which maps
   * data for a specific manufacturer. The host applies it to the document.
   */
  applyEdit: (edit: EditV2) => Promise<void>;
  /** Replaces the document, as the host does when another file is opened. */
  openDocument: (doc: XMLDocument, docName: string) => Promise<void>;
  /** Waits for the plugin and its lists to finish rendering. */
  settle: () => Promise<void>;
  /** Removes the plugin from the page. */
  unmount: () => void;
};

/**
 * Every element below `root`, including in shadow roots, which updates.
 * @param root - where to look.
 * @param found - elements found so far.
 * @returns the elements.
 */
function updatingElements(root: ParentNode, found: Element[] = []): Element[] {
  root.querySelectorAll('*').forEach((element) => {
    if ('updateComplete' in element) {
      found.push(element);
    }
    if (element.shadowRoot !== null) {
      updatingElements(element.shadowRoot, found);
    }
  });
  return found;
}

/**
 * Mounts the plugin on its own, without the `open-scd` shell, and applies the
 * edits it dispatches to the document just as the host does: the document is
 * changed and `docVersion` increased before the plugin sees the edit "after".
 * @param options - fixture, document and settings to mount with.
 * @returns the plugin with helpers.
 */
export async function mountPlugin(
  options: MountOptions = {}
): Promise<MountedPlugin> {
  localStorage.clear();
  if (options.settings !== undefined) {
    localStorage.setItem(settingsKey, JSON.stringify(options.settings));
  }
  if (options.rawSettings !== undefined) {
    localStorage.setItem(settingsKey, options.rawSettings);
  }

  const doc = options.noDocument
    ? (undefined as unknown as XMLDocument)
    : (options.doc ??
      (await loadFixture(options.fixture ?? 'GOOSE-2007B4-LGOS.scd')));

  await useViewport(options.layout === 'fit' ? 'fit' : 'tall');

  const container = document.createElement('div');
  // wide enough for the lists to be side by side, as on a desktop
  container.style.width = '1280px';
  if (options.layout !== 'fit') {
    container.style.setProperty(
      '--oscd-subscriber-later-binding-height',
      '11000px'
    );
  }
  document.body.appendChild(container);

  const plugin = document.createElement(tagName) as SubscriberLaterBinding;
  const editor = new XMLEditor();
  const edits: EditV2[] = [];

  // Listening on the container, below `window`, mirrors the host shell: the
  // edit is applied before the plugin's own "after" listener on `window`, and
  // an edit marked `squash` is merged into the previous undoable commit.
  let version = 0;
  container.addEventListener('oscd-edit-v2', (event) => {
    const { edit, title, squash } = (event as EditEventV2).detail;
    edits.push(edit);
    editor.commit(edit, { title, squash });
    version += 1;
    plugin.docVersion = version;
  });

  plugin.doc = doc;
  plugin.docName = options.fixture ?? 'test.scd';
  plugin.docVersion = version;
  container.appendChild(plugin);

  /**
   * Lists draw their rows after a layout. In a tall plugin every row is drawn,
   * so a list is ready when it has a row in the DOM for each item.
   * @returns whether every list has drawn all of its rows.
   */
  const allRowsDrawn = (): boolean =>
    updatingElements(plugin.shadowRoot!)
      .filter(element => element.tagName === 'VIRTUALIZED-FILTERED-LIST')
      .every((list) => {
        const { items } = list as Element & { items: unknown[] };
        return (
          list.shadowRoot!.querySelectorAll('oscd-list-item').length ===
          items.length
        );
      });

  const settle = async (): Promise<void> => {
    for (let i = 0; i < 3; i += 1) {
      await plugin.updateComplete;
      await Promise.all(
        updatingElements(plugin.shadowRoot!).map(
          element =>
            (element as Element & { updateComplete: Promise<unknown> })
              .updateComplete
        )
      );
      await new Promise<void>((resolve) => {
        setTimeout(resolve, 0);
      });
    }
    if (options.layout !== 'fit') {
      await waitUntil(allRowsDrawn, 'the lists did not draw all their rows', {
        interval: 5,
        timeout: 3000
      });
    }
  };

  await settle();

  return {
    plugin,
    doc,
    edits,
    editor,
    settle,
    applyEdit: async (edit) => {
      container.dispatchEvent(newEditEventV2(edit));
      await settle();
    },
    openDocument: async (newDoc, docName) => {
      plugin.doc = newDoc;
      plugin.docName = docName;
      await settle();
    },
    unmount: () => {
      container.remove();
      localStorage.clear();
    }
  };
}
