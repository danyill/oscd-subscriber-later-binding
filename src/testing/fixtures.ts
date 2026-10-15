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
