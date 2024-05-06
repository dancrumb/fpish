import {Optional} from './Optional';

/**
 * The `Either<R,L>` type represents 2 possible values of 2 possible types.
 *
 * A common use case it to use this to represent the outcome of a function that could
 * be an error or a value: `const result: Either<ErrorType, ValueType>`. Convention has
 * `ErrorType` as the left-value and `ValueType` as the right-value.
 *
 * The type will only ever be single-valued, but it will always be single-valued
 */
export class Either<L, R> {
  /**
   * Create a Left-valued `Either`
   * @param value
   */
  public static left<NL, NR>(value: NL | Optional<NL>): Either<NL, NR> {
    return new Either<NL, NR>(Optional.of(value), Optional.empty());
  }

  /**
   * Create a Right-valued `Either`
   * @param value
   */
  public static right<NL, NR>(value: NR | Optional<NR>): Either<NL, NR> {
    return new Either<NL, NR>(Optional.empty<NL>(), Optional.of<NR>(value));
  }

  private readonly left: Optional<L>;
  private readonly right: Optional<R>;

  constructor(l: Optional<L>, r: Optional<R>) {
    this.left = l;
    this.right = r;
  }

  /**
   * Returns whether or not the value is left-valued
   */
  public isLeft() {
    return this.left.isPresent();
  }

  /**
   * Gets the left-value of the object.
   *
   * This will result in an error, if the object is not left-valued
   *
   * @throws {NoSuchElementException}
   */
  public getLeft(): L {
    return this.left.get();
  }

  /**
   * Returns whether or not the value is right-valued
   */
  public isRight() {
    return this.right.isPresent();
  }

  /**
   * Gets the right-value of the object.
   *
   * This will result in an error, if the object is not right-valued
   *
   * @throws {NoSuchElementException}
   */
  public getRight(): R {
    return this.right.get();
  }

  /**
   * Maps the `Either<L,R>` object to a simple object of type `T`.
   *
   * Each of the mapping functions must return the same type, so that this `Either` object can
   * be mapped.
   *
   * Only one of the functions will be called, so no side-effects should be relied upon.
   *
   * @param lFunc
   * @param rFunc
   */
  public map<O>(
    lFunc: (val: L) => O | Optional<O>,
    rFunc: (val: R) => O | Optional<O>
  ): O;
  public map<T>(lFunc: (val: L) => T, rFunc: (val: R) => T): T;
  public map<T>(lFunc: (val: L) => T, rFunc: (val: R) => T): T {
    return this.left.map(lFunc).orElseGet(() => this.right.map(rFunc).get());
  }

  /**
   * Map the left-value of one type to a different value of another type.
   *
   * If this object is right-valued, then this doesn't change that, but it does
   * change the overall type of the `Either` object
   *
   * @param lFunc
   */
  public mapLeft<O>(lFunc: (val: L) => Optional<O>): Either<O, R>;
  public mapLeft<T>(lFunc: (val: L) => T): Either<T, R>;
  public mapLeft<T>(lFunc: (val: L) => T): Either<T, R> {
    return new Either(this.left.map(lFunc), this.right);
  }

  /**
   * Map the right-value of one type to a different value of another type.
   *
   * If this object is leftt-valued, then this doesn't change that, but it does
   * change the overall type of the `Either` object
   *
   * @param rFunc
   */
  public mapRight<O>(rFunc: (val: R) => Optional<O>): Either<L, O>;
  public mapRight<T>(rFunc: (val: R) => T): Either<L, T>;
  public mapRight<T>(rFunc: (val: R) => T): Either<L, T> {
    return new Either(this.left, this.right.map(rFunc));
  }

  /**
   * Much like `{@link mapLeft}`, this converts an `Either` from one type to another.
   *
   * The difference here is that the mapping function returns an `Either` of its own, rather
   * than just a left-value. This allows you to chain a series of `Either`s together, only operating
   * if you are getting left-valued `Either`s
   *
   * @param lFunc
   */
  public proceedLeft<T>(lFunc: (val: L) => Promise<Either<T, R>>): Promise<Either<T, R>>;
  public proceedLeft<T>(lFunc: (val: L) => Either<T, R>): Either<T, R>;
  public proceedLeft<T>(
    lFunc: ((val: L) => Either<T, R>) | ((val: L) => Promise<Either<T, R>>)
  ): Either<T, R> | Promise<Either<T, R>> {
    if (this.left.isPresent()) {
      return lFunc(this.left.get());
    }

    return Either.right<T, R>(this.right.get());
  }

  /**
   * Much like `{@link mapRight}`, this converts an `Either` from one type to another.
   *
   * The difference here is that the mapping function returns an `Either` of its own, rather
   * than just a right-value. This allows you to chain a series of `Either`s together, only operating
   * if you are getting right-valued `Either`s
   *
   * @param rFunc
   */
  public proceedRight<T>(rFunc: (val: R) => Promise<Either<L, T>>): Promise<Either<L, T>>;
  public proceedRight<T>(rFunc: (val: R) => Either<L, T>): Either<L, T>;
  public proceedRight<T>(
    rFunc: ((val: R) => Either<L, T>) | ((val: R) => Promise<Either<L, T>>)
  ): Either<L, T> | Promise<Either<L, T>> {
    if (this.right.isPresent()) {
      return rFunc(this.right.get());
    }

    return Either.left<L, T>(this.left.get());
  }

  /**
   * Collapses an `Either` that may contain a left-value that is an `Either`
   * @param either
   */
  public static joinLeft<JL, JR>(either: Either<Either<JL, JR>, JR>): Either<JL, JR> {
    if (either.isLeft()) {
      return either.getLeft();
    }
    return Either.right(either.getRight());
  }

  /**
   * Collapses an `Either` that may contain a right-value that is an `Either`
   * @param either
   */
  public static joinRight<JL, JR>(either: Either<JL, Either<JL, JR>>): Either<JL, JR> {
    if (either.isRight()) {
      return either.getRight();
    }
    return Either.left(either.getLeft());
  }

  /**
   * Applies a function to the internal value. Since this returns void and takes functions that return
   * void, this relies entirely on side-effects..
   * @param lFunc
   * @param rFunc
   */
  public apply(lFunc: (val: L) => void, rFunc: (val: R) => void): void {
    this.left.ifPresent(lFunc);
    this.right.ifPresent(rFunc);
  }
}


/**
 * This is a handy utility function that just throws an error
 * that exists in an Either. Useful for Either.apply
 */
export const throwError = (e:Error) => {
  throw e
}