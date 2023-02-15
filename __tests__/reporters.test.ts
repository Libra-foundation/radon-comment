import {describe, test, expect, beforeAll} from "@jest/globals";
import {CCReader} from "../src/readers";
import type { CCEntry, CCReport, Tree } from "../src/types";
import { TEST , type TypeOfTest, CCReporter} from "../src/reporters"

const {ToTree} = TEST as TypeOfTest;

describe("Reporters tests", () => {
    let data: CCReport;

    beforeAll(async ()=>{
        data = await CCReader("__tests__/data/cc.json");
    })
    
    test("CC Reporter -- Tree building",()=> {
        const TREES = ToTree(data);
        expect(TREES).toBeDefined();

        expect(TREES).toHaveLength(1);

        const SRC: Tree<Array<CCEntry>> = TREES[0];

        expect(SRC).toHaveProperty("src")

        expect(SRC.src).toHaveProperty("cvrp")

        expect(Object.keys((SRC.src as typeof SRC).cvrp)).toHaveLength(5)
    });

    test("CC Reporter -- WIP report", ()=>{
        const REPORT = CCReporter(data);
        console.log(REPORT)
        expect(REPORT).toBeDefined();
    })


})