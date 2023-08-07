import {expect, describe, test} from '@jest/globals';

import {partial, partialRight} from '../src';

describe('partial', () => {
  test('peforms partial application', () => {
    const add = (a: number, b: number) => a + b;
    const add2 = partial(add, 2);
    expect(add2(3)).toBe(5);
  });

  test('supports partial application with multiple applied args', () => {
    const add = (a: number, b: number, c: number) => a + b + c;
    const add5 = partial(add, 2, 3);
    expect(add5(3)).toBe(8);
  });

  test('supports complete application with multiple applied args', () => {
    const add = (a: number, b: number) => a + b;
    const is5 = partial(add, 2, 3);
    expect(is5()).toBe(5);
  });
});
describe('partialRight', () => {
  test('peforms partial application', () => {
    const add = (a: number, b: number) => a + b;
    const add2 = partialRight(add, 2);
    expect(add2(3)).toBe(5);
  });

  test('supports partial application with multiple applied args', () => {
    const add = (a: number, b: number, c: number) => a + b + c;
    const add5 = partialRight(add, 2, 3);
    expect(add5(3)).toBe(8);
  });

  test('supports complete application with multiple applied args', () => {
    const add = (a: number, b: number) => a + b;
    const is5 = partialRight(add, 2, 3);
    expect(is5()).toBe(5);
  });
});
