import {Either} from './Either';
import {Optional} from './Optional';

/**
 * A Result is a value that represents either success or failure. It's a special case of an Either.
 */
export class Result<T, E extends Error = Error> extends Either<T, E> {
  private static fromEither<ET, EE extends Error = Error>(either: Either<ET, EE>) {
    const left: Optional<ET> = Optional.of(either.isLeft() ? either.getLeft() : null);
    const right: Optional<EE> = Optional.of(either.isRight() ? either.getRight() : null);

    return new Result<ET, EE>(left, right);
  }

  /**
   * Convert a value (Optional or not) into a successful result
   */
  public static success<NT, NE extends Error = Error>(
    value: NT | Optional<NT>
  ): Result<NT, NE> {
    return Result.fromEither(Either.left<NT, NE>(value));
  }

  /**
   * Convert a value (Optional or not) into an error result
   */
  public static error<NT, NE extends Error = Error>(value: NE): Result<NT, NE> {
    return Result.fromEither(Either.right<NT, NE>(value));
  }

  public isSuccess() {
    return this.isLeft();
  }

  public isError() {
    return this.isRight();
  }

  /**
   * See {@link Result.mapLeft}
   */
  public mapSuccess(...args: Parameters<Either<T, E>['mapLeft']>) {
    return this.mapLeft(...args);
  }

  /**
   * See {@link Result.proceedLeft}
   */
  public proceedWithSuccess(...args: Parameters<Either<T, E>['proceedLeft']>) {
    return this.proceedLeft(...args);
  }

  /**
   * See {@link Result.mapRight}
   */
  public mapError(...args: Parameters<Either<T, E>['mapRight']>) {
    return this.mapRight(...args);
  }

  /**
   * See {@link Result.proceedRight}
   */
  public proceedsWithError(...args: Parameters<Either<T, E>['proceedRight']>) {
    return this.proceedRight(...args);
  }
}
