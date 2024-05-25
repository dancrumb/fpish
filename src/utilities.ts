import { Optional } from "./Optional.js"

/**
 * This is the identity function - it returns whatever you pass in
 * 
 * @category Utilities
 */
export const identity = <T>(t: T) => t
/**
 * A synonym for {@link identity}
 * 
 * @category Utilities
 */
export const asIs = identity

/**
 * This function returns undefined, whatever you pass in
 * 
 * @category Utilities
 */
export const drop = (t: unknown): void => void undefined
/**
 * This does the same as {@link drop}, but is typed to return undefined (rather than void)
 * 
 * @category Utilities
 */
export const asUndefined = (t: unknown) => undefined

/**
 * Logs an error and moves on
 * 
 * @category Utilities
 */
export const logError = (e: Error) =>
    console.error(e)

/**
 * This is a handy utility function that just throws an error
 * that exists in an Either. Useful for Either.apply
 * 
 * @category Utilities
 */
export const throwError = (e: Error) => {
    throw e
}

/**
 * Sometimes, all you're looking to do is extract a single property from and object.
 * That's what this function does
 * 
 * @category Utilities
 */
export const extractProperty = <O extends object>(key: keyof O) => (o: O) => o[key]

/**
 * Sometimes, you want a subset of an object, with just a few properties
 * That's what this function does
 * 
 * @category Utilities
 */
export const pickProperties = <O extends object>(keys: (keyof O)[]) => (o: O): Partial<O> => {
    return keys.reduce((acc, key) => key in o ? ({ ...acc, [key]: o[key] }) : acc, {} satisfies Partial<O>);
}

/**
 * Take function that returns a value and make that return an Optional
 * 
 * @category Utilities
 */
export const asOptional = <A extends any[], R>(f: (...args: A) => R) => {
    return (...args: A) => Optional.of<R>(f(...args))
}