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

export interface CCEntry {
    type: RadonType ,
    rank: RadonRank,
    name: string,
    // eslint-disable-next-line @typescript-eslint/naming-convention -- Radon chose the name, not me.
    col_offset: number,
    complexity: number,
    endline: number,
    lineno: number,
    methods?: Array<CCEntry>,
    classname?: string,
    closures?: Array<unknown>
}

export type CCReport = Record<string,Array<CCEntry>>