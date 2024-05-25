import { Optional } from "./Optional.js"

/**
 * This is the identity function - it returns whatever you pass in
 */
export const identity = <T>(t: T) => t
/**
 * {@link identity}
 */
export const asIs = identity

/**
 * This function returns undefined, whatever you pass in
 */
export const drop = (t: unknown): void => void undefined
/**
 * This does the same as {@link drop}, but is typed to return undefined (rather than void)
 */
export const asUndefined = (t: unknown) => undefined


export const logError = (e: Error) =>
    console.error(e)

/**
 * Sometimes, all you're looking to do is extract a single property from and object.
 * That's what this function does
 */
export const extractProperty = <O extends object>(key: keyof O) => (o: O) => o[key]

/**
 * Sometimes, you want a subset of an object, with just a few properties
 * That's what this function does
 */
export const pickProperties = <O extends object>(keys: (keyof O)[]) => (o: O): Partial<O> => {
    return keys.reduce((acc, key) => key in o ? ({ ...acc, [key]: o[key] }) : acc, {} satisfies Partial<O>);
}

/**
 * Take function that returns a value and make that return an Optional
 */
export const asOptional = <A extends any[], R>(f: (...args: A) => R) => {
    return (...args: A) => Optional.of<R>(f(...args))
}