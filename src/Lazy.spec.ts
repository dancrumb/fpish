import {expect, describe, test, vi} from 'vitest';
import {Lazy} from './Lazy';

describe('Lazy', () => {
  test('represents a lazy loaded piece of data', async () => {
    const data = Lazy.create(() => 1);
    await expect(data.getValue()).resolves.toBe(1);
    await expect(data.getValue()).resolves.toBe(1);
  });

  test('calls the intializer once', async () => {
    const intializer = vi.fn(() => 42);
    const data = Lazy.create(intializer);
    expect(intializer).not.toBeCalled();
    await expect(data.getValue()).resolves.toBe(42);
    expect(intializer).toBeCalledTimes(1);
    await expect(data.getValue()).resolves.toBe(42);
    expect(intializer).toBeCalledTimes(1);
  });

  test('allows chaining', async () => {
    const data = Lazy.create(() => 'aa');
    const converted = data.chain((v) => parseInt(v, 16));
    await expect(converted.getValue()).resolves.toBe(170);
  });
});
