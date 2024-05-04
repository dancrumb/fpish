import {expect, describe, test} from 'vitest';

import {Result} from '../src/Result';
import {Optional} from '../src/Optional';

describe('Result', () => {
  test('maps Optionals correctly (right)', async () => {
    const e = Result.error(new Error('Test'));
    e.mapRight((d) => Optional.of(d)).apply(
      () => {
        throw new Error('Wrong function called');
      },
      (f) => {
        expect(f).toBeInstanceOf(Error);
      }
    );
  });
  test('maps Optionals correctly (left)', async () => {
    const e = Result.success(1);
    e.mapLeft((d) => Optional.of(d)).apply(
      (f) => {
        expect(f).toBe(1);
      },
      () => {
        throw new Error('Wrong function called');
      }
    );
  });
  test('maps Optionals correctly (both)', async () => {
    expect(
      Result.success(1).map(
        (d) => Optional.of((d as number) * 2),
        (d) => Optional.of(0)
      )
    ).toBe(2);
    expect(
      Result.error(new Error('Test')).map(
        (d) => Optional.of((d as number) * 2),
        (d) => Optional.of(0)
      )
    ).toBe(0);
  });

  describe('.isError', () => {
    test('returns true for right values', () => {
      const e = Result.error(new Error('Test'));
      expect(e.isError()).toBe(true);
    });
    test('returns false for left values', () => {
      const e = Result.success('test');
      expect(e.isError()).toBe(false);
    });
  });

  describe('.isSuccess', () => {
    test('returns true for left values', () => {
      const e = Result.success('test');
      expect(e.isSuccess()).toBe(true);
    });
    test('returns false for right values', () => {
      const e = Result.error(new Error('Test'));
      expect(e.isSuccess()).toBe(false);
    });
  });
});
