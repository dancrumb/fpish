import { expect, describe, test } from 'vitest';
import { AsyncDatum } from './AsyncDatum.js';

describe('AsyncDatum', () => {
  test('represents a remotely loaded piece of data', () => {
    const data = AsyncDatum.loaded([1, 2, 3, 4]);
    expect(data.value()).toEqual([1, 2, 3, 4]);
  });



  describe('.isAsked', () => {
    test('returns true if a request is in flight', () => {
      const async = AsyncDatum.loading();
      expect(async.isAsked()).toBe(true);
    });
    test('returns true if a data is loaded', () => {
      const async = AsyncDatum.loaded<string>('');
      expect(async.isAsked()).toBe(true);
    });
    test('returns true if there is an error', () => {
      const async = AsyncDatum.errored(new Error('Dummy error'));
      expect(async.isAsked()).toBe(true);
    });
    test('returns false if no request has been sent', () => {
      const async = AsyncDatum.notAsked();
      expect(async.isAsked()).toBe(false);
    });
  });

  describe('.isLoaded', () => {
    test('returns false if a request is in flight', () => {
      const async = AsyncDatum.loading();
      expect(async.isLoaded()).toBe(false);
    });
    test('returns true if a data is loaded', () => {
      const async = AsyncDatum.loaded<string>('');
      expect(async.isLoaded()).toBe(true);
    });
    
    test('returns true if there is an error', () => {
      const async = AsyncDatum.errored(new Error('Dummy error'));
      expect(async.isLoaded()).toBe(true);
    });
    test('returns false if no request has been sent', () => {
      const async = AsyncDatum.notAsked();
      expect(async.isLoaded()).toBe(false);
    });
  });

  describe('.getOptional', () => {
    test('can be converted to an empty Optional when no request has been made', async () => {
      const async = AsyncDatum.notAsked<{}>();
      expect(async.getOptional().isPresent()).toBe(false);
    });

    test('can be converted to an empty Optional when a request has been made', async () => {
      const async = AsyncDatum.loading<{}>();
      expect(async.getOptional().isPresent()).toBe(false);
    });

    test('can be converted to an Optional if there is data', async () => {
      const async = AsyncDatum.loaded<string>('test');
      expect(async.getOptional().get()).toBe('test');
    });

    test('can be converted to an Optional array if there is data', async () => {
      const async = AsyncDatum.loaded<string>('test');
      expect(async.getOptional().get()).toEqual('test');
    });

    test('can be converted to an empty Optional if there is an error', async () => {
      const async = AsyncDatum.errored(new Error('Oh dear'));
      expect(async.getOptional().isPresent()).toBe(false);
    });
  });

  describe('.orElse', () => {
    test('returns the internal value as a single value if there is one', () => {
      expect(AsyncDatum.loaded(1).orElse(3)).toEqual(1);
    });
    test('returns the internal value as an array if there is one', () => {
      expect(AsyncDatum.loaded([1, 2]).orElse([3, 4])).toEqual([1, 2]);
    });
    test('returns the default value if there is no internal value', () => {
      expect(AsyncDatum.loading().orElse(3)).toEqual(3);
    });
    test('returns the default array if there is no internal value', () => {
      expect(AsyncDatum.loading().orElse([3, 4])).toEqual([3, 4]);
    });
    test('returns the internal array value if on a second load', () => {
      expect(AsyncDatum.loaded([1, 2]).orElse([3, 4])).toEqual([1, 2]);
    });
  });

  describe('.value', () => {
    test('returns the internal value if successfully loaded', () => {
      const ad = AsyncDatum.loaded([1]);
      expect(ad.value()).toEqual([1]);
    });
    test('throws an error if data is not loaded', () => {
      const ad = AsyncDatum.loading();
      expect(() => ad.value()).toThrowError(
        'Trying to access AsyncDatum before it has data'
      );
    });

    test('throws an error if data load failed', () => {
      const ad = AsyncDatum.errored(new Error('Testing error'));
      expect(() => ad.value()).toThrowError('Testing error');
    });
  });

  describe('.value', () => {
    test('returns the internal value if successfully loaded', () => {
      const ad = AsyncDatum.loaded(1);
      expect(ad.value()).toBe(1);
    });
    test('throws an error if data is not loaded', () => {
      const ad = AsyncDatum.loading();
      expect(() => ad.value()).toThrowError(
        'Trying to access AsyncDatum before it has data'
      );
    });

    test('throws an error if data load failed', () => {
      const ad = AsyncDatum.errored(new Error('Testing error'));
      expect(() => ad.value()).toThrowError('Testing error');
    });
  });

  describe('.containsData', () => {
    test('returns false for a not asked value', () => {
      const ad = AsyncDatum.notAsked();
      expect(ad.containsData()).toBe(false);
    });
    test('returns false for an error value', () => {
      const ad = AsyncDatum.errored(new Error('Dummy'));
      expect(ad.containsData()).toBe(false);
    });
    test('returns false for an initially loading value', () => {
      const ad = AsyncDatum.loading();
      expect(ad.containsData()).toBe(false);
    });
    test('returns true for a loaded value', () => {
      const ad = AsyncDatum.loaded('test');
      expect(ad.containsData()).toBe(true);
    });

  });
});
