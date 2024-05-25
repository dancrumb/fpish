import { expect, describe, test } from 'vitest';
import { asOptional, extractProperty, pickProperties } from './utilities.js';
import { Optional } from './Optional.js';

// We may need to play fast and loose with typing here, just to test edge cases
describe('extractProperty', () => {
    test('works on an empty object', () => {
        expect(extractProperty('')({} as any)).toBeUndefined()
    })
    test('returns undefined for a non-existent key', () => {
        expect(extractProperty('a')({} as any)).toBeUndefined()
    })
    test('returns undefined for a non-existent key', () => {
        expect(extractProperty('a')({} as any)).toBeUndefined()
    })
    test('returns a single value', () => {
        expect(extractProperty('a')({ a: 42 })).toBe(42)
    })
})

describe('pickProperties', () => {
    test('works on an empty object', () => {
        expect(pickProperties([''])({} as any)).toStrictEqual({})
    })
    test('returns undefined for a non-existent key', () => {
        expect(pickProperties(['a'])({} as any)).toStrictEqual({})
    })
    test('returns undefined for a non-existent key', () => {
        expect(pickProperties(['a'])({} as any)).toStrictEqual({})
    })
    test('returns an object with a single property', () => {
        expect(pickProperties(['a'])({ a: 42 })).toStrictEqual({ a: 42 })
    })
    test('does not include non-existent properties', () => {
        expect(pickProperties(['a', 'b'])({ a: 42 } as any)).toStrictEqual({ a: 42 })
    })
    test('does include explicitly undefined properties', () => {
        expect(pickProperties(['a', 'b'])({ a: 42, b: undefined } as any)).toStrictEqual({ a: 42, b: undefined })
    })
    test('handles duplicated properties', () => {
        expect(pickProperties(['a', 'a'])({ a: 42, b: undefined } as any)).toStrictEqual({ a: 42, })
    })
})

describe('asOptional', () => {
    test('converts a function that returns a value to one that returns an Optional', () => {
        const foo = () => 42
        const oFoo = asOptional(foo);
        expect(oFoo).toBeTypeOf('function')
        expect(oFoo()).toBeInstanceOf(Optional)
    })

})