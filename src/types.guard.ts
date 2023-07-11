/*
 * Generated type guards for "types.ts".
 * WARNING: Do not manually change this file.
 */
import {
  RadonType,
  RadonRank,
  CCEntry,
  HalEntry,
  MIEntry,
  CCReport,
  HalReport,
  MIReport,
  IToString,
  IToMD
} from "./types";

export function IsCCEntry(obj: unknown): obj is CCEntry {
  const typedObj = obj as CCEntry;
  return (
    ((typedObj !== null && typeof typedObj === "object") ||
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
      (Array.isArray(typedObj["methods"]) &&
        typedObj["methods"].every((e: any) => IsCCEntry(e) as boolean))) &&
    (typeof typedObj["classname"] === "undefined" ||
      typeof typedObj["classname"] === "string") &&
    (typeof typedObj["closures"] === "undefined" ||
      Array.isArray(typedObj["closures"]))
  );
}

export function IsHalEntry(obj: unknown): obj is HalEntry {
  const typedObj = obj as HalEntry;
  return (
    ((typedObj !== null && typeof typedObj === "object") ||
      typeof typedObj === "function") &&
    Array.isArray(typedObj["total"]) &&
    typedObj["total"].every((e: any) => typeof e === "number") &&
    Array.isArray(typedObj["functions"]) &&
    typedObj["functions"].every(
      (e: any) =>
        Array.isArray(e) &&
        e.every(
          (e: any) =>
            typeof e === "string" ||
            (Array.isArray(e) && e.every((e: any) => typeof e === "number"))
        )
    )
  );
}

export function IsMIEntry(obj: unknown): obj is MIEntry {
  const typedObj = obj as MIEntry;
  return (
    ((typedObj !== null && typeof typedObj === "object") ||
      typeof typedObj === "function") &&
    typeof typedObj["mi"] === "number" &&
    (typedObj["rank"] === RadonRank.A ||
      typedObj["rank"] === RadonRank.B ||
      typedObj["rank"] === RadonRank.C ||
      typedObj["rank"] === RadonRank.D ||
      typedObj["rank"] === RadonRank.E ||
      typedObj["rank"] === RadonRank.F)
  );
}

export function IsCCReport(obj: unknown): obj is CCReport {
  const typedObj = obj as CCReport;
  return (
    ((typedObj !== null && typeof typedObj === "object") ||
      typeof typedObj === "function") &&
    Object.entries<any>(typedObj).every(
      ([key, value]) =>
        Array.isArray(value) &&
        value.every((e: any) => IsCCEntry(e) as boolean) &&
        typeof key === "string"
    )
  );
}

export function IsHalReport(obj: unknown): obj is HalReport {
  const typedObj = obj as HalReport;
  return (
    ((typedObj !== null && typeof typedObj === "object") ||
      typeof typedObj === "function") &&
    Object.entries<any>(typedObj).every(
      ([key, value]) =>
        (IsHalEntry(value) as boolean) && typeof key === "string"
    )
  );
}

export function IsMIReport(obj: unknown): obj is MIReport {
  const typedObj = obj as MIReport;
  return (
    ((typedObj !== null && typeof typedObj === "object") ||
      typeof typedObj === "function") &&
    Object.entries<any>(typedObj).every(
      ([key, value]) => (IsMIEntry(value) as boolean) && typeof key === "string"
    )
  );
}

export function IsIToString(obj: unknown): obj is IToString {
  const typedObj = obj as IToString;
  return (
    ((typedObj !== null && typeof typedObj === "object") ||
      typeof typedObj === "function") &&
    typeof typedObj["toString"] === "function"
  );
}

export function IsIToMD(obj: unknown): obj is IToMD {
  const typedObj = obj as IToMD;
  return (
    ((typedObj !== null && typeof typedObj === "object") ||
      typeof typedObj === "function") &&
    typeof typedObj["toMD"] === "function"
  );
}
