import chai, {expect} from 'chai';
import chaiAsPromises from 'chai-as-promised';
import sinonChai from 'sinon-chai';
import {Either} from '../src/Either';
import {Optional} from '../src/Optional';

chai.use(sinonChai);
chai.use(chaiAsPromises);

describe('Either', () => {
  it('maps Optionals correctly (right)', async () => {
    const e = Either.right(1);
    e.mapRight((d) => Optional.of(d)).apply(
      () => {
        expect.fail();
      },
      (f) => {
        expect(f).to.equal(1);
      }
    );
  });
  it('maps Optionals correctly (left)', async () => {
    const e = Either.left(1);
    e.mapLeft((d) => Optional.of(d)).apply(
      (f) => {
        expect(f).to.equal(1);
      },
      () => {
        expect.fail();
      }
    );
  });
  it('maps Optionals correctly (both)', async () => {
    expect(
      Either.left(1).map(
        (d) => Optional.of(d as number * 2),
        (d) => Optional.of(d as number * 3)
      )
    ).to.equal(2);
    expect(
      Either.right(1).map(
        (d) => Optional.of(d as number * 2),
        (d) => Optional.of(d as number * 3)
      )
    ).to.equal(3);
  });

  describe('.isRight', () => {
    it('returns true for right values', () => {
      const e = Either.right('test');
      expect(e.isRight()).to.be.true;
    });
    it('returns false for left values', () => {
      const e = Either.left('test');
      expect(e.isRight()).to.be.false;
    });
  });

  describe('.isLeft', () => {
    it('returns true for left values', () => {
      const e = Either.left('test');
      expect(e.isLeft()).to.be.true;
    });
    it('returns false for right values', () => {
      const e = Either.right('test');
      expect(e.isLeft()).to.be.false;
    });
  });
});
