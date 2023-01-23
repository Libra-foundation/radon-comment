/*
 * Generated type guards for "types.d.ts".
 * WARNING: Do not manually change this file.
 */
import { RadonType, RadonRank, CCEntry, CCReport } from "./types";

export function IsCCEntry(obj: unknown): obj is CCEntry {
    const typedObj = obj as CCEntry
    return (
        (typedObj !== null &&
            typeof typedObj === "object" ||
            typeof typedObj === "function") &&
        (typedObj["type"] === RadonType.C ||
            typedObj["type"] === RadonType.M ||
            typedObj["type"] === RadonType.F) &&
        (typedObj["rank"] === RadonRank.A ||
            typedObj["rank"] === RadonRank.B ||
            typedObj["rank"] === RadonRank.C ||
            typedObj["rank"] === RadonRank.D ||
            typedObj["rank"] === RadonRank.E ||
            typedObj["rank"] === RadonRank.F) &&
        typeof typedObj["name"] === "string" &&
        typeof typedObj["col_offset"] === "number" &&
        typeof typedObj["complexity"] === "number" &&
        typeof typedObj["endline"] === "number" &&
        typeof typedObj["lineno"] === "number" &&
        (typeof typedObj["methods"] === "undefined" ||
            Array.isArray(typedObj["methods"]) &&
            typedObj["methods"].every((e: any) =>
                IsCCEntry(e) as boolean
            )) &&
        (typeof typedObj["classname"] === "undefined" ||
            typeof typedObj["classname"] === "string") &&
        (typeof typedObj["closures"] === "undefined" ||
            Array.isArray(typedObj["closures"]))
    )
}

export function IsCCReport(obj: unknown): obj is CCReport {
    const typedObj = obj as CCReport
    return (
        (typedObj !== null &&
            typeof typedObj === "object" ||
            typeof typedObj === "function") &&
        Object.entries<any>(typedObj)
            .every(([key, value]) => (Array.isArray(value) &&
                value.every((e: any) =>
                    IsCCEntry(e) as boolean
                ) &&
                typeof key === "string"))
    )
}
