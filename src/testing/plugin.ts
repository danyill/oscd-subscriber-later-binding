import { handleEdit } from '@openscd/oscd-editor';
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
};

export type MountedPlugin = {
  plugin: SubscriberLaterBinding;
  doc: XMLDocument;
  /** Every `oscd-edit-v2` edit dispatched by the plugin, in order. */
  edits: EditV2[];
  /**
   * Dispatches an edit as another plugin would, e.g. a menu plugin which maps
   * data for a specific manufacturer. The host applies it to the document.
   */
  applyEdit: (edit: EditV2) => Promise<void>;
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

  const container = document.createElement('div');
  document.body.appendChild(container);

  const plugin = document.createElement(tagName) as SubscriberLaterBinding;
  const edits: EditV2[] = [];

  // Listening on the container, below `window`, mirrors the host shell: the
  // edit is applied before the plugin's own "after" listener on `window`.
  let version = 0;
  container.addEventListener('oscd-edit-v2', (event) => {
    const { edit } = (event as EditEventV2).detail;
    edits.push(edit);
    handleEdit(edit);
    version += 1;
    plugin.docVersion = version;
  });

  plugin.doc = doc;
  plugin.docName = options.fixture ?? 'test.scd';
  plugin.docVersion = version;
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
