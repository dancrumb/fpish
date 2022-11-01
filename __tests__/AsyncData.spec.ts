import {expect} from '@jest/globals';
import {AsyncData} from '../src/AsyncData';

describe('AsyncData', () => {
  it('represents a remotely loaded piece of data', () => {
    const data = AsyncData.loaded([1, 2, 3, 4]);
    expect(data.value()).toEqual([1, 2, 3, 4]);
  });

  describe('.map', () => {
    it('can map data', () => {
      const data = AsyncData.loaded([1, 2, 3, 4]);
      expect(data.map((x) => 2 * x).value()).toEqual([2, 4, 6, 8]);
    });
    it('handles loading data', () => {
      const data = AsyncData.loading<number>();
      expect(data.map((x) => x + 1).isLoading()).toBe(true);
    });
  });

  describe('.mapValue', () => {
    it('can map data', () => {
      const data = AsyncData.loaded([1, 2, 3, 4]);
      expect(data.mapValue((x) => 2 * x)).toEqual([2, 4, 6, 8]);
    });
    it('throws an error if data is not loaded', () => {
      const data = AsyncData.loading<number>();
      expect(() => data.mapValue((x) => x + 1)).toThrowError();
    });
  });

  describe('.filter', () => {
    it('can filter data', () => {
      const data = AsyncData.loaded([1, 2, 3, 4]);
      expect(data.filter((x) => x % 2 === 0).value()).toEqual([2, 4]);
    });
    it('handles loading data', () => {
      const data = AsyncData.loading<number>();
      expect(data.filter((x) => true).isLoading()).toBe(true);
    });
  });

  describe('.reduce', () => {
    it('can reduce data', () => {
      const data = AsyncData.loaded([1, 2, 3, 4]);
      expect(data.reduce((a, x) => a + x, 0).value()).toEqual([10]);
    });

    it('returns the original value if it is not lodaed', () => {
      expect(
        AsyncData.notAsked()
          .reduce(() => {}, undefined)
          .isLoaded()
      ).toBe(false);
    });
  });

  describe('.isAsked', () => {
    it('returns true if a request is in flight', () => {
      const async = AsyncData.loading();
      expect(async.isAsked()).toBe(true);
    });
    it('returns true if a data is loaded', () => {
      const async = AsyncData.loaded<string>(['']);
      expect(async.isAsked()).toBe(true);
    });
    it('returns true if more data is being loaded', () => {
      const async = AsyncData.loaded<string>(['']).loadMore();
      expect(async.isAsked()).toBe(true);
    });
    it('returns true if there is an error', () => {
      const async = AsyncData.errored(new Error('Dummy error'));
      expect(async.isAsked()).toBe(true);
    });
    it('returns false if no request has been sent', () => {
      const async = AsyncData.notAsked();
      expect(async.isAsked()).toBe(false);
    });
  });

  describe('.isLoaded', () => {
    it('returns false if a request is in flight', () => {
      const async = AsyncData.loading();
      expect(async.isLoaded()).toBe(false);
    });
    it('returns true if a data is loaded', () => {
      const async = AsyncData.loaded<string>(['']);
      expect(async.isLoaded()).toBe(true);
    });
    it('returns false if more data is being loaded', () => {
      const async = AsyncData.loaded<string>(['']).loadMore();
      expect(async.isLoaded()).toBe(false);
    });
    it('returns true if there is an error', () => {
      const async = AsyncData.errored(new Error('Dummy error'));
      expect(async.isLoaded()).toBe(true);
    });
    it('returns false if no request has been sent', () => {
      const async = AsyncData.notAsked();
      expect(async.isLoaded()).toBe(false);
    });
  });

  describe('.getOptional', () => {
    it('can be converted to an empty Optional when no request has been made', async () => {
      const async = AsyncData.notAsked<{}>();
      expect(async.getOptional().isPresent()).toBe(false);
    });

    it('can be converted to an empty Optional when a request has been made', async () => {
      const async = AsyncData.loading<{}>();
      expect(async.getOptional().isPresent()).toBe(false);
    });

    it('can be converted to an Optional if there is data', async () => {
      const async = AsyncData.loaded<string>(['test']);
      expect(async.getOptional().get()).toBe('test');
    });

    it('can be converted to an Optional when a second request has been made', async () => {
      const async = AsyncData.loaded<string>(['test']);
      expect(async.getOptional().isPresent()).toBe(true);
      const reload = async.loadMore();
      expect(reload.getOptional().get()).toBe('test');
      expect;
    });

    it('can be converted to an Optional array if there is data', async () => {
      const async = AsyncData.loaded<string>(['test']);
      expect(async.getAllOptional().get()).toEqual(['test']);
    });

    it('can be converted to an empty Optional if there is an error', async () => {
      const async = AsyncData.errored(new Error('Oh dear'));
      expect(async.getOptional().isPresent()).toBe(false);
    });
  });

  describe('.orElse', () => {
    it('returns the internal value as a single value if there is one', () => {
      expect(AsyncData.loaded([1]).orElse(3)).toEqual(1);
    });
    it('returns the internal value as an array if there is one', () => {
      expect(AsyncData.loaded([1, 2]).orElse([3, 4])).toEqual([1, 2]);
    });
    it('returns the default value if there is no internal value', () => {
      expect(AsyncData.loading().orElse(3)).toEqual(3);
    });
    it('returns the internal value if on a second load', () => {
      expect(AsyncData.loaded([5]).loadMore().orElse(3)).toEqual(5);
    });
    it('returns the default array if there is no internal value', () => {
      expect(AsyncData.loading().orElse([3, 4])).toEqual([3, 4]);
    });
    it('returns the internal array value if on a second load', () => {
      expect(AsyncData.loaded([1, 2]).orElse([3, 4])).toEqual([1, 2]);
    });
  });

  describe('.value', () => {
    it('returns the internal value if successfully loaded', () => {
      const ad = AsyncData.loaded([1]);
      expect(ad.value()).toEqual([1]);
    });
    it('throws an error if data is not loaded', () => {
      const ad = AsyncData.loading();
      expect(() => ad.value()).toThrowError(
        'Trying to access AsyncData before it has data'
      );
    });

    it('does not throw an error if data is loaded, even if in loading state', () => {
      const ad = AsyncData.loaded([1, 2, 3]).loadMore();
      expect(ad.isLoading()).toBe(true);
      expect(() => ad.value()).not.toThrowError(
        'Trying to access AsyncData before it has data'
      );
    });

    it('throws an error if data load failed', () => {
      const ad = AsyncData.errored(new Error('Testing error'));
      expect(() => ad.value()).toThrowError('Testing error');
    });
  });

  describe('.singleValue', () => {
    it('returns the internal value if successfully loaded', () => {
      const ad = AsyncData.loaded([1]);
      expect(ad.singleValue()).toBe(1);
    });

    it('throws an error if not single-valued', () => {
      const ad = AsyncData.loaded([1, 2]);
      expect(() => ad.singleValue()).toThrowError('Data is not single-valued');
    });
    it('throws an error if data is not loaded', () => {
      const ad = AsyncData.loading();
      expect(() => ad.singleValue()).toThrowError(
        'Trying to access AsyncData before it has data'
      );
    });

    it('throws an error if data load failed', () => {
      const ad = AsyncData.errored(new Error('Testing error'));
      expect(() => ad.singleValue()).toThrowError('Testing error');
    });
  });

  describe('.append', () => {
    it('returns a loaded value, if called on a not asked', () => {
      const ad = AsyncData.notAsked();
      expect(ad.isLoaded()).toBe(false);

      const newAd = ad.append([1]);
      expect(newAd.isLoaded()).toBe(true);
      expect(newAd.value()).toEqual([1]);
    });

    it('returns a loaded value, if called on an error', () => {
      const ad = AsyncData.errored(new Error());
      expect(ad.isErrored()).toBe(true);

      const newAd = ad.append([1]);
      expect(newAd.isErrored()).toBe(false);
      expect(newAd.value()).toEqual([1]);
    });

    it('returns an updated value', () => {
      const ad = AsyncData.loaded([1]);
      expect(ad.isLoaded()).toBe(true);
      expect(ad.value()).toEqual([1]);

      const newAd = ad.append([2]);
      expect(newAd.isLoaded()).toBe(true);
      expect(newAd.value()).toEqual([1, 2]);
    });
  });

  describe('.update', () => {
    it('updates the array at the index provided', () => {
      const data = AsyncData.loaded([1, 2, 3]);
      expect(data.update(1, 4).value()).toStrictEqual([1, 4, 3]);
    });

    it('throws an error if the index is too high', () => {
      const data = AsyncData.loaded([1, 2, 3]);
      expect(() => data.update(4, 4)).toThrowError();
    });
    it('throws an error if the index is too low', () => {
      const data = AsyncData.loaded([1, 2, 3]);
      expect(() => data.update(-1, 4)).toThrowError();
    });
  });

  describe('.containsData', () => {
    it('returns false for a not asked value', () => {
      const ad = AsyncData.notAsked();
      expect(ad.containsData()).toBe(false);
    });
    it('returns false for an error value', () => {
      const ad = AsyncData.errored(new Error('Dummy'));
      expect(ad.containsData()).toBe(false);
    });
    it('returns false for an initially loading value', () => {
      const ad = AsyncData.loading();
      expect(ad.containsData()).toBe(false);
    });
    it('returns true for a loaded value', () => {
      const ad = AsyncData.loaded(['test']);
      expect(ad.containsData()).toBe(true);
    });
    it('returns true for a loaded value that is loading more', () => {
      const ad = AsyncData.loaded(['test']).loadMore();
      expect(ad.containsData()).toBe(true);
    });
    it('returns false for a loading value that is loading more', () => {
      const ad = AsyncData.loading().loadMore();
      expect(ad.containsData()).toBe(false);
    });
  });

  describe('.find', () => {
    it('returns undefined if the sought element is not present', () => {
      const data = AsyncData.loaded([1, 2, 3]);
      const item = data.find((elem) => elem === 4);
      expect(item).toBeUndefined();
    });

    it('returns undefined if no data is loaded', () => {
      const data = AsyncData.notAsked();
      const item = data.find((elem) => elem === 4);
      expect(item).toBeUndefined();
    });
  });

  describe('.isEmpty', () => {
    it('returns true if an empty array is loaded', () => {
      const arr = AsyncData.loaded([]);
      expect(arr.isEmpty()).toBe(true);
    });

    it('returns true if the internal array is a single null ', () => {
      const ad = AsyncData.loaded([null]);
      expect(ad.isEmpty()).toBe(true);
    });
  });

  describe('.findIndex', () => {
    it('returns the array index of an element', () => {
      const ad = AsyncData.loaded([1, 2, 3, 4, 5]);
      expect(ad.findIndex((x) => x === 3)).toEqual(2);
    });

    it('returns -1 if there is no match', () => {
      const ad = AsyncData.loaded([1, 2, 3, 4, 5]);
      expect(ad.findIndex((x) => x === 39)).toEqual(-1);
    });
  });

  describe('.concat', () => {
    it('adds additional elements to the loaded data', () => {
      const ad = AsyncData.loaded([1, 2, 3]);
      const newAd = ad.concat([4, 5]);
      expect(newAd.value()).toEqual([1, 2, 3, 4, 5]);
    });
  });

  describe('.sort', () => {
    it('sorts the AsyncData alphabetically', () => {
      const ad = AsyncData.loaded([1, 100, 11]);
      expect(ad.sort()).toEqual([1, 100, 11]);
    });

    it('supports comparison functions', () => {
      const ad = AsyncData.loaded([1, 100, 11]);
      expect(ad.sort((a, b) => a - b)).toEqual([1, 11, 100]);
    });
  });

  describe('.get', () => {
    it('returns the value at the given index', () => {
      const ad = AsyncData.loaded([1, 2, 3, 4]);
      expect(ad.get(1)).toEqual(2);
    });

    it('returns undefined if the index is beyond the end of the data', () => {
      const ad = AsyncData.loaded([1, 2, 3, 4]);
      expect(ad.get(5)).toBeUndefined();
    });
  });

  describe('.remove', () => {
    it('removes the value at the given index', () => {
      const ad = AsyncData.loaded([1, 2, 3, 4]);
      expect(ad.remove(1).value()).toEqual([1, 3, 4]);
    });

    it('does not mutate any source arrays', () => {
      const arr = [1, 2, 3, 4];
      const ad = AsyncData.loaded(arr);
      expect(ad.remove(1).value()).toEqual([1, 3, 4]);
      expect(arr).toEqual([1, 2, 3, 4]);
    });

    it('leaves the data unchanged if the index is beyond the end of the data', () => {
      const ad = AsyncData.loaded([1, 2, 3, 4]);
      expect(ad.remove(5).value()).toEqual([1, 2, 3, 4]);
    });
  });

  describe('.all', () => {
    it('returns true if predicate is true for all elements', () => {
      const ad = AsyncData.loaded([1, 2, 3, 4]);
      expect(ad.all((x) => x < 5)).toBe(true);
    });

    it('returns false if predicate is false for any element', () => {
      const ad = AsyncData.loaded([1, 2, 3, 4]);
      expect(ad.all((x) => x < 4)).toBe(false);
    });

    it('returns true for an empty array', () => {
      const ad = AsyncData.loaded([]);
      expect(ad.all((x) => x < 4)).toBe(true);
    });
  });

  describe('.any', () => {
    it('returns true if predicate is true for any element', () => {
      const ad = AsyncData.loaded([1, 2, 3, 4]);
      expect(ad.any((x) => x < 5)).toBe(true);
    });

    it('returns false if predicate is false for all elements', () => {
      const ad = AsyncData.loaded([1, 2, 3, 4]);
      expect(ad.any((x) => x > 4)).toBe(false);
    });

    it('returns false for an empty array', () => {
      const ad = AsyncData.loaded([]);
      expect(ad.any((x) => x < 4)).toBe(false);
    });
  });
});