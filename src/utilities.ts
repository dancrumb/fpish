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
export const drop = (t: unknown) => undefined
/**
 * {@link drop}
 */
export const asUndefined = drop;


export const logError = (e: Error) => {
    console.error(e)
}