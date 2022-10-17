import {expect} from '@jest/globals';
import {Lazy} from '../src/Lazy';

describe('Lazy', () => {
  it('represents a lazy loaded piece of data', async () => {
    const data = Lazy.create(() => 1);
    await expect(data.getValue()).resolves.toBe(1);
    await expect(data.getValue()).resolves.toBe(1);
  });

  it('calls the intializer once', async () => {
    const intializer = jest.fn(() => 42);
    const data = Lazy.create(intializer);
    expect(intializer).not.toBeCalled();
    await expect(data.getValue()).resolves.toBe(42);
    expect(intializer).toBeCalledTimes(1);
    await expect(data.getValue()).resolves.toBe(42);
    expect(intializer).toBeCalledTimes(1);
  });

  it('allows chaining', async () => {
    const data = Lazy.create(() => 'aa');
    const converted = data.chain((v) => parseInt(v, 16));
    await expect(converted.getValue()).resolves.toBe(170);
  });
});
