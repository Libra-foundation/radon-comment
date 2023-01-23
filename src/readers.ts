import fs from "fs"
import path from "path"

import { type CCReport } from "./types";

export async function CCReader(cc_path:string): Promise<CCReport>{
    const RESOLVED:string = path.resolve(cc_path);
    
    try {
        const DATA: unknown = JSON.parse(await fs.promises.readFile(RESOLVED, {encoding:"utf-8"}));
        return DATA as CCReport
    } catch(err) {
        if (err instanceof SyntaxError){
            throw err
        }
        throw new Error(`Error: Unable to read the file ${RESOLVED}`);
    }
}