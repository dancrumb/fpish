import {expect, describe, test} from '@jest/globals';

import {Optional} from '../src/Optional';
import {NoSuchElementException} from '../src/exceptions/NoSuchElementException';

describe('Optional', () => {
  describe('#of', () => {
    test('can be created by being passed an Optional', () => {
      const opt = Optional.of(Optional.of(42));
      expect(opt.get()).toEqual(42);
    });

    test('represents a value which is possibly set', () => {
      const data = Optional.of(1);
      expect(data.get()).toBe(1);
    });

    test('returns an empty Optional if passed null', () => {
      expect(Optional.of(null).isPresent()).toBe(false);
    });
  });

  describe('#get', () => {
    test('throws an error if the Optional is empty', () => {
      const data = Optional.empty();
      expect(() => data.get()).toThrowError(NoSuchElementException);
    });
  });

  describe('#isPresent', () => {
    test('reports when a value is present in the Optional', () => {
      const data = Optional.of(1);
      expect(data.isPresent()).toBe(true);
    });
    test('reports when a value is not present in the Optional', () => {
      const data = Optional.empty();
      expect(data.isPresent()).toBe(false);
    });
  });
  describe('#orElse', () => {
    test('returns the internal value if set', () =>
      expect(Optional.of(2).orElse(3)).toBe(2));
    test('returns the orElse value if not set', () =>
      expect(Optional.empty().orElse(3)).toBe(3));
  });
  describe('#orNothing', () => {
    test('returns the internal value if set', () =>
      expect(Optional.of(2).orNothing()).toBe(2));
    test('returns undefined value if not set', () =>
      expect(Optional.empty().orNothing()).toBeUndefined());
  });
  describe('#orNull', () => {
    test('returns the internal value if set', () =>
      expect(Optional.of(2).orNull()).toBe(2));
    test('returns null value if not set', () =>
      expect(Optional.empty().orNull()).toBeNull());
  });
  describe('#equals', () => {
    test('compares two Optionals with identical values as equal', () => {
      expect(Optional.of(1).equals(Optional.of(1))).toBe(true);
    });
    test('compares two Optionals with different values as not equal', () => {
      expect(Optional.of(1).equals(Optional.of(2))).toBe(false);
    });
    test('compares two empty Optionals as not equal', () => {
      expect(Optional.empty().equals(Optional.empty())).toBe(false);
    });
    test('compares two Optionals with identical complex values as equal', () => {
      expect(
        Optional.of({id: 1, age: 3}).equals(
          Optional.of({id: 1, age: 4}),
          (a, b) => a.id === b.id
        )
      ).toBe(true);
    });
  });
  describe('#map', () => {
    test('maps one Optional to another', () => {
      expect(
        Optional.of(1)
          .map((x) => x + 3)
          .get()
      ).toBe(4);
    });
    test('maps while squashing internal Optionals', () => {
      expect(
        Optional.of(1)
          .map((x) => Optional.of(x + 3))
          .get()
      ).toBe(4);
    });
    test('maps empty to empty', () => {
      expect(
        Optional.empty()
          .map((x) => x)
          .isPresent()
      ).toBe(false);
    });
  });
  describe('#filter', () => {
    test('filters an Optional to the same value if the filter matches', () => {
      expect(
        Optional.of(2)
          .filter((x) => x === 2)
          .get()
      ).toBe(2);
    });
    test('filters an Optional to empty if the filter does not match', () => {
      expect(
        Optional.of(2)
          .filter((x) => x !== 2)
          .isPresent()
      ).toBe(false);
    });
    test('filters empty to empty', () => {
      expect(
        Optional.empty()
          .filter((x) => true)
          .isPresent()
      ).toBe(false);
    });
  });
  describe('#toJSON', () => {
    test('returns undefined when JSON stringified', () => {
      const data = Optional.empty();
      expect(JSON.stringify(data)).toBeUndefined();
      expect(JSON.stringify({data})).toBe('{}');
    });
    test('returns correct JSON  stringified', () => {
      expect(JSON.stringify(Optional.of(1))).toBe('1');
      expect(JSON.stringify(Optional.of(true))).toBe('true');
      expect(JSON.stringify(Optional.of('test'))).toBe('"test"');
      expect(JSON.stringify(Optional.of(null))).toBeUndefined();
      expect(JSON.stringify(Optional.of({}))).toBe('{}');
    });
    test('handles nested optionals when stringified', () => {
      expect(
        JSON.stringify(
          Optional.of({
            a: Optional.empty,
          })
        )
      ).toBe('{}');
      expect(
        JSON.stringify(
          Optional.of({
            a: Optional.of(1),
          })
        )
      ).toBe('{"a":1}');
    });
  });

  describe('#property', () => {
    type Opt = {
      a: number;
      b: string;
      c?: string;
    };
    const getOptional = (): Optional<Opt> =>
      Optional.of({
        a: 1,
        b: 'bee',
      });
    test('returns the enclosed property', () => {
      expect(getOptional().property('a')).toBe(1);
      expect(getOptional().property('b')).toBe('bee');
    });
    test('returns undefined if no default provided', () => {
      expect(Optional.empty<{a: number}>().property('a')).toBeUndefined();
    });
    test('returns the default value for an empty', () => {
      expect(Optional.empty<{a: number}>().property('a', 9)).toBe(9);
    });
    test('returns handles falsy defaults', () => {
      expect(Optional.empty<{a: number}>().property('a', 0)).toBe(0);
    });
    test('returns the default value for an undefined', () => {
      expect(Optional.of(getOptional()).property('c', 'test')).toBe('test');
      expect(Optional.of<Opt>(undefined).property('c', '')).toBe('');
    });

    test('handles the Ahana use case', () => {});
  });

  describe('#ifPresent', () => {
    test('calls a function with the value, if there is one', () => {
      const fn = jest.fn();
      Optional.of(3).ifPresent(fn);
      expect(fn).toBeCalledWith(3);
    });
    test('calls a function with the value, if there is one and not the else function', () => {
      const fn = jest.fn((v) => {});
      const elseFn = jest.fn(() => {});
      Optional.of(3).ifPresent(fn).orElse(elseFn);
      expect(fn).toBeCalledWith(3);
      expect(elseFn).not.toBeCalled();
    });
    test("calls the else function without a value, if there isn't one", () => {
      const fn = jest.fn((v) => {});
      const elseFn = jest.fn(() => {});
      Optional.empty().ifPresent(fn).orElse(elseFn);
      expect(fn).not.toBeCalled();
      expect(elseFn).toBeCalled();
    });
  });
});
