import { Optional } from './Optional.js';

export * from './Optional.js';
export * from './AsyncData.js';
export * from './Either.js';
export * from './Lazy.js';
export * from './partial.js';
export * from './utilities.js'

/**
 * Take a function that requires a value of `T` and return a version that takes `Optional<T>`
 *
 * NB: If an empty `Optional` is passed to the new function, a `NoSuchElementException`
 *     will be thrown
 * 
 * @category Utilities
 */
export const makeOptional =
  <T>(f: (o: T) => unknown) =>
    (v: Optional<T>) =>
      f(v.get());

/**
 * Take a function that requires a value of `Optional<T>` and return a version that takes `T`
 * 
 * @category Utilities
 */
export const makeNonOptional =
  <T>(f: (o: Optional<T>) => unknown) =>
    (v: T) =>
      f(Optional.of(v));