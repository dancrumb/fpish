import { expect, describe, test, vi } from 'vitest';

import { Either } from './Either.js';
import { Optional } from './Optional.js';
import { NoSuchElementException } from './exceptions/NoSuchElementException.js';

describe('Either', () => {
  test('maps Optionals correctly (right)', async () => {
    const e = Either.right(1);
    e.mapRight((d) => Optional.of(d)).apply(
      () => {
        throw new Error('Wrong function called');
      },
      (f) => {
        expect(f).toBe(1);
      }
    );
  });
  test('maps Optionals correctly (left)', async () => {
    const e = Either.left(1);
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
      Either.left(1).map(
        (d) => Optional.of((d as number) * 2),
        (d) => Optional.of((d as number) * 3)
      )
    ).toBe(2);
    expect(
      Either.right(1).map(
        (d) => Optional.of((d as number) * 2),
        (d) => Optional.of((d as number) * 3)
      )
    ).toBe(3);
  });

  describe('.isRight', () => {
    test('returns true for right values', () => {
      const e = Either.right('test');
      expect(e.isRight()).toBe(true);
    });
    test('returns false for left values', () => {
      const e = Either.left('test');
      expect(e.isRight()).toBe(false);
    });
  });

  describe('.isLeft', () => {
    test('returns true for left values', () => {
      const e = Either.left('test');
      expect(e.isLeft()).toBe(true);
    });
    test('returns false for right values', () => {
      const e = Either.right('test');
      expect(e.isLeft()).toBe(false);
    });
  });
  describe('.proceedLeft', () => {
    test('handles regular functions', () => {
      const e = Either.left('test');
      expect(e.proceedLeft((x) => Either.left(x + 'ing')).getLeft()).toBe('testing');
    });
    test('handles async functions', async () => {
      const e = Either.left('test');
      const proceeded = await e.proceedLeft((x) =>
        Promise.resolve(Either.left(x + 'ing'))
      );
      expect(proceeded.getLeft()).toBe('testing');
    });
    test('handles right values', () => {
      const e = Either.right<string, string>('test');
      expect(e.proceedLeft<string>((x) => 'left' as any).getRight()).toBe('test');
      expect(() => e.proceedLeft<string>((x) => 'left' as any).getLeft()).toThrow(NoSuchElementException)
    });
  });
  describe('.proceedRight', () => {
    test('handles regular functions', () => {
      const e = Either.right('test');
      expect(e.proceedRight((x) => Either.right(x + 'ing')).getRight()).toBe('testing');
    });
    test('handles async functions', async () => {
      const e = Either.right('test');
      const proceeded = await e.proceedRight((x) =>
        Promise.resolve(Either.right(x + 'ing'))
      );
      expect(proceeded.getRight()).toBe('testing');
    });
    test('handles left values', () => {
      const e = Either.left<string, string>('test');
      expect(e.proceedRight<string>((x) => 'left' as any).getLeft()).toBe('test');
      expect(() => e.proceedRight<string>((x) => 'left' as any).getRight()).toThrow(NoSuchElementException)
    });
  });
  describe('.ifLeft', () => {
    test('calls a function if the value is left', () => {
      const func = vi.fn();
      Either.left(1).ifLeft(func);
      expect(func).toBeCalled();
    })
    test('does not call a function if the value is right', () => {
      const func = vi.fn();
      Either.right(1).ifLeft(func);
      expect(func).not.toBeCalled();
    })
  })
  describe('.ifRight', () => {
    test('calls a function if the value is right', () => {
      const func = vi.fn();
      Either.right(1).ifRight(func);
      expect(func).toBeCalled();
    })
    test('does not call a function if the value is left', () => {
      const func = vi.fn();
      Either.left(1).ifRight(func);
      expect(func).not.toBeCalled();
    })
  })
});
