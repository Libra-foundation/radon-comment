export enum RadonType {
    C = "class",
    M = "method",
    F = "function"
}

export enum RadonRank {
    A = "A",
    B = "B",
    C = "C",
    D = "D",
    E = "E",
    F = "F"
}

/** @see {IsCCEntry} ts-auto-guard:type-guard */
export interface CCEntry {
    type: RadonType ,
    rank: RadonRank,
    name: string,
    // eslint-disable-next-line @typescript-eslint/naming-convention -- Radon chosed the name, not me.
    col_offset: number,
    complexity: number,
    endline: number,
    lineno: number,
    methods?: Array<CCEntry>,
    classname?: string,
    closures?: Array<unknown>
}

/** @see {IsHalEntry} ts-auto-guard:type-guard */
export interface HalEntry {
    total: Array<number> ,
    functions: Array<Array<Array<number> | string>>
}

/** @see {IsMIEntry} ts-auto-guard:type-guard */
export interface MIEntry {
    mi: number,
    rank: RadonRank
}

export type Report<T> = Record<string, T>

/** @see {IsCCReport} ts-auto-guard:type-guard */
export type CCReport = Report<Array<CCEntry>>

/** @see {IsHalReport} ts-auto-guard:type-guard */
export type HalReport = Report<HalEntry>

/** @see {IsMIReport} ts-auto-guard:type-guard */
export type MIReport = Report<MIEntry>

export interface Tree<T> {
    [x: string]: T | Tree<T>;
}
