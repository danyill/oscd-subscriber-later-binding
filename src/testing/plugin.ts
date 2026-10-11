import { handleEdit, newEditEvent } from '@openscd/open-scd-core';
import type { Edit, EditEvent } from '@openscd/open-scd-core';

import SubscriberLaterBinding from '../oscd-subscriber-later-binding.js';

const tagName = 'oscd-subscriber-later-binding-spec';

if (customElements.get(tagName) === undefined) {
  customElements.define(tagName, SubscriberLaterBinding);
}

export const settingsKey = 'oscd-subscriber-later-binding';

const fixtureCache = new Map<string, string>();

/**
 * Loads an SCL fixture from `test/fixtures` as a fresh document. Each call
 * returns a new document as specs apply edits to it.
 * @param name - File name within `test/fixtures`.
 * @returns the parsed SCL document.
 */
export async function loadFixture(name: string): Promise<XMLDocument> {
  let text = fixtureCache.get(name);
  if (text === undefined) {
    const response = await fetch(`/test/fixtures/${name}`);
    if (!response.ok) {
      throw new Error(`Could not load fixture ${name}: ${response.status}`);
    }
    text = await response.text();
    fixtureCache.set(name, text);
  }
  return new DOMParser().parseFromString(text, 'application/xml');
}

export type MountOptions = {
  /** File name within `test/fixtures`. */
  fixture?: string;
  /** An already parsed document, used instead of a fixture. */
  doc?: XMLDocument;
  /** Settings to put in local storage before the plugin is connected. */
  settings?: Record<string, unknown>;
  /** Exact text to put in local storage, e.g. to test corrupt settings. */
  rawSettings?: string;
};

export type MountedPlugin = {
  plugin: SubscriberLaterBinding;
  doc: XMLDocument;
  /** Every `oscd-edit` event dispatched by the plugin, in order. */
  edits: Edit[];
  /**
   * Dispatches an edit as another plugin would, e.g. a menu plugin which maps
   * data for a specific manufacturer. The host applies it to the document.
   */
  applyEdit: (edit: Edit | Edit[]) => Promise<void>;
  /** Replaces the document, as the host does when another file is opened. */
  openDocument: (doc: XMLDocument, docName: string) => Promise<void>;
  /** Waits for the plugin and its list children to finish rendering. */
  settle: () => Promise<void>;
  /** Removes the plugin from the page. */
  unmount: () => void;
};

/**
 * Mounts the plugin on its own, without the `open-scd` shell, and applies the
 * edits it dispatches to the document just as the host does: the document is
 * changed and `editCount` increased before the plugin sees the edit "after".
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

  const doc =
    options.doc ??
    (await loadFixture(options.fixture ?? 'GOOSE-2007B4-LGOS.scd'));

  const container = document.createElement('div');
  document.body.appendChild(container);

  const plugin = document.createElement(tagName) as SubscriberLaterBinding;
  const edits: Edit[] = [];

  // Listening on the container, below `window`, mirrors the host shell: the
  // edit is applied before the plugin's own "after" listener on `window`.
  container.addEventListener('oscd-edit', (event) => {
    const { detail } = event as EditEvent;
    edits.push(detail);
    handleEdit(detail);
    plugin.editCount += 1;
  });

  plugin.doc = doc;
  plugin.docName = options.fixture ?? 'test.scd';
  plugin.editCount = 0;
  container.appendChild(plugin);

  const settle = async (): Promise<void> => {
    for (let i = 0; i < 3; i += 1) {
       
      await plugin.updateComplete;
       
      await new Promise<void>((resolve) => {
        setTimeout(resolve, 0);
      });
    }
  };

  await settle();

  return {
    plugin,
    doc,
    edits,
    settle,
    applyEdit: async (edit) => {
      container.dispatchEvent(newEditEvent(edit));
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
