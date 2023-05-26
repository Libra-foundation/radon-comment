import {describe, test, expect, beforeAll} from "@jest/globals";
import {CCReader} from "../src/readers";
import type { CCEntry, CCReport } from "../src/types";
import { TEST , type TypeOfTest} from "../src/reporters";
import { IsTree} from "../src/tree";

const {ReportTree} = TEST as TypeOfTest;

describe("Reporters tests", () => {
    let data: CCReport;

    beforeAll(async ()=>{
        data = await CCReader("__tests__/data/cc.json");
    })
    
    test("CC Reporter -- Tree building",()=> {
        const TREE = ReportTree.from<Array<CCEntry>>(data);
        expect(TREE).toBeDefined();

        expect(TREE.get).toBeDefined()
        expect(TREE.has).toBeDefined()

        /* console.log("Root Tree nodes :")
        for (const ENTRY of TREE) {
            console.log(ENTRY)
        }*/
        expect(TREE.has('src')).toBe(true)
        expect(TREE.has('cvrp')).toBe(false)


        expect(IsTree<typeof TREE>(TREE.get('src'))).toBe(true)

        const SRC: typeof TREE = TREE.get('src') as typeof TREE;

        /*console.log("Src Tree nodes :")
        for (const ENTRY of SRC) {
            console.log(ENTRY)
        }*/

        expect(SRC.has('src')).toBe(false)
        expect(SRC.has('cvrp')).toBe(true)

        expect(IsTree<typeof SRC>(SRC.get('cvrp'))).toBe(true)

        let counter = 0;
        // console.log("Cvrp Tree nodes :")
        // eslint-disable-next-line @typescript-eslint/no-unused-vars -- Iterations is kinda needed.
        for (const ENTRY of SRC.get('cvrp')) {
            // console.log(ENTRY)
            counter += 1;
        }

        expect(counter).toBe(5);
    });

    test("CC Reporter -- Report is created", ()=>{
        const TREE = ReportTree.from<Array<CCEntry>>(data);
        const TABLE = TREE.toTable();
        
        expect(TABLE).toBeDefined();

        console.log(TABLE.toMD());


    });


})