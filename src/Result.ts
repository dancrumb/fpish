import {Either} from './Either';

/**
 * A Result is a value that represents either success or failure. It's a special case of an Either.
 */
export class Result<T, E extends Error = Error> extends Either<E, T> {}
