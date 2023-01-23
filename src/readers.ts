import fs from "fs"
import path from "path"

import { type CCReport } from "./types";
import {IsCCReport} from "./types.guard";

export async function CCReader(cc_path:string): Promise<CCReport>{
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
    if ( IsCCReport(data)){
        return data
    }
    
    throw new Error("Parsing Error: The data found in the provided file does not has the expected structure.");
}