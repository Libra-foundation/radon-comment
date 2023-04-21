import {describe, test, expect, beforeAll} from "@jest/globals";
import {CCReader} from "../src/readers";
import type { CCEntry, CCReport, Tree } from "../src/types";
import { TEST , type TypeOfTest, CCReporter} from "../src/reporters"
import { assert } from "console";

const {ToTrees} = TEST as TypeOfTest;

describe("Reporters tests", () => {
    let data: CCReport;

    beforeAll(async ()=>{
        data = await CCReader("__tests__/data/cc.json");
    })
    
    test("CC Reporter -- Tree building",()=> {
        const TREES = ToTrees(data);
        expect(TREES).toBeDefined();

        expect(TREES).toHaveLength(1);

        const SRC: Tree<Array<CCEntry>> = TREES[0];

        expect(SRC).toHaveProperty("src")
        expect(SRC).not.toHaveProperty("cvrp")
        console.log(Object.keys(SRC))

        expect(SRC.src).toHaveProperty("cvrp")
        console.log(Object.keys(SRC.src))

        expect(Object.keys((SRC.src as typeof SRC).cvrp)).toHaveLength(5)
        assert(false)
    });

    test("CC Reporter -- Report is created", ()=>{
        const REPORT = CCReporter(data);
        expect(REPORT).toBeDefined();
    })


})