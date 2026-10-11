import { expect } from '@open-wc/testing';

import { getSearchRegex } from './search.js';

const matches = (search: string, text: string): boolean =>
  getSearchRegex(search).test(text);

describe('getSearchRegex', () => {
  it('matches everything for an empty expression', () => {
    expect(matches('', '')).to.equal(true);
    expect(matches('', 'anything at all')).to.equal(true);
  });

  it('matches everything for a whitespace-only expression', () => {
    expect(matches('   ', 'anything')).to.equal(true);
  });

  it('is case insensitive', () => {
    expect(matches('goose', 'A GOOSE control')).to.equal(true);
    expect(matches('GOOSE', 'a goose control')).to.equal(true);
  });

  it('matches a substring', () => {
    expect(matches('ntr', 'control')).to.equal(true);
    expect(matches('xyz', 'control')).to.equal(false);
  });

  [
    ['both terms present in order', 'one two', 'one two', true],
    ['both terms present out of order', 'one two', 'two one', true],
    ['only the first term present', 'one two', 'one', false],
    ['only the second term present', 'one two', 'two', false],
    ['extra whitespace between terms', '  one    two  ', 'two one', true]
  ].forEach(([name, search, text, expected]) => {
    it(`ANDs multiple terms: ${name}`, () => {
      expect(matches(search as string, text as string)).to.equal(expected);
    });
  });

  describe('wildcards', () => {
    it('matches any run of characters with an asterisk', () => {
      expect(matches('a*c', 'ac')).to.equal(true);
      expect(matches('a*c', 'abbbc')).to.equal(true);
      expect(matches('a*c', 'ab')).to.equal(false);
    });

    it('matches exactly one character with a question mark', () => {
      expect(matches('a?c', 'abc')).to.equal(true);
      expect(matches('a?c', 'ac')).to.equal(false);
    });

    it('allows wildcards with multiple terms', () => {
      expect(matches('a*c d?f', 'abc def')).to.equal(true);
      expect(matches('a*c d?f', 'abc df')).to.equal(false);
    });
  });

  describe('quoting', () => {
    it('keeps a double quoted phrase together', () => {
      expect(matches('"foo bar"', 'a foo bar b')).to.equal(true);
      expect(matches('"foo bar"', 'bar foo')).to.equal(false);
    });

    it('keeps a single quoted phrase together', () => {
      expect(matches("'foo bar'", 'a foo bar b')).to.equal(true);
      expect(matches("'foo bar'", 'bar foo')).to.equal(false);
    });

    it('combines a quoted phrase with other terms', () => {
      expect(matches('"foo bar" baz', 'baz foo bar')).to.equal(true);
      expect(matches('"foo bar" baz', 'foo bar')).to.equal(false);
    });

    it('does not include the quote characters in the match', () => {
      expect(matches('"foo"', 'foo')).to.equal(true);
    });
  });

  describe('special characters', () => {
    it('treats a dot literally', () => {
      expect(matches('a.c', 'a.c')).to.equal(true);
      expect(matches('a.c', 'abc')).to.equal(false);
    });

    ['(', ')', '[', ']', '{', '}', '+', '^', '$', '|', '\\'].forEach((char) => {
      it(`does not throw for "${char}" and matches it literally`, () => {
        expect(() => getSearchRegex(`a${char}b`)).to.not.throw();
        expect(matches(`a${char}b`, `xa${char}bx`)).to.equal(true);
        expect(matches(`a${char}b`, 'ab')).to.equal(false);
      });
    });

    it('matches SCL object references', () => {
      expect(matches('LD0/CSWI', 'IED1 LD0/CSWI 1 Pos')).to.equal(true);
    });
  });
});
