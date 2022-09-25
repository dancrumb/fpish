import {Either} from '../src/Either';
import {Optional} from '../src/Optional';


describe('Either', () => {
  it('maps Optionals correctly (right)', async () => {
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
  it('maps Optionals correctly (left)', async () => {
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
  it('maps Optionals correctly (both)', async () => {
    expect(
      Either.left(1).map(
        (d) => Optional.of(d as number * 2),
        (d) => Optional.of(d as number * 3)
      )
    ).toBe(2);
    expect(
      Either.right(1).map(
        (d) => Optional.of(d as number * 2),
        (d) => Optional.of(d as number * 3)
      )
    ).toBe(3);
  });

  describe('.isRight', () => {
    it('returns true for right values', () => {
      const e = Either.right('test');
      expect(e.isRight()).toBe(true);
    });
    it('returns false for left values', () => {
      const e = Either.left('test');
      expect(e.isRight()).toBe(false);
    });
  });

  describe('.isLeft', () => {
    it('returns true for left values', () => {
      const e = Either.left('test');
      expect(e.isLeft()).toBe(true);
    });
    it('returns false for right values', () => {
      const e = Either.right('test');
      expect(e.isLeft()).toBe(false);
    });
  });
});
