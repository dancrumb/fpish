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


export const logError = (e: Error) => {
    console.error(e)
}