import fs from "fs"
import path from "path"

import { type CCReport, type HalReport } from "./types";
import {IsCCReport, IsHalReport} from "./types.guard";

type Reader<T> = (path:string)=> Promise<T>

function ReaderFactory<T>(checker : (obj:unknown)=>obj is T): Reader<T>{
    return async (cc_path:string): Promise<T> => {
        const RESOLVED:string = path.resolve(cc_path);
        let data: unknown = undefined
        try {
            data = JSON.parse(await fs.promises.readFile(RESOLVED, {encoding:"utf-8"}));
        } catch(err) {
            if (err instanceof SyntaxError){
                throw err
            }
            throw new Error(`Error: Unable to read the file ${RESOLVED}`);
        }
        if ( checker(data)){
            return data
        }
        
        throw new Error("Parsing Error: The data found in the provided file does not has the expected structure.");
    }
}

export const CCReader:Reader<CCReport> = ReaderFactory<CCReport>(IsCCReport);
export const HalReader:Reader<HalReport> = ReaderFactory<HalReport>(IsHalReport);