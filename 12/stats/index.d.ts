declare module 'stats' {
    type Compare<T> = (a: T, b: T) => number
    type GetIndex = <T>(input: T[], comparator: Compare<T>) => number
    type GetElement = <T>(input: T[], comparator: Compare<T>) => T | null
    type GetAverage = <T>(input: T[], f: (cur: T) => number) => number | null
    export const getMaxIndex: GetIndex
    export const getMinIndex: GetIndex
    export const getMedianIndex: GetIndex
    export const getMaxElement: GetElement
    export const getMinElement: GetElement
    export const getMedianElement: GetElement
    export const getAverageValue: GetAverage
}
