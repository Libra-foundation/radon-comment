import {describe, test, expect} from "@jest/globals";
import {CCReader} from "../src/readers";

describe("Readers tests", () => {

    test("CC Reader -- does read", async ()=> {

        const DATA = await CCReader("__tests__/data/cc.json");

        expect(DATA).toBeDefined();

        expect(Object.keys(DATA)).toHaveLength(5)
        
        for (const F_NAME in DATA){
            expect(DATA[F_NAME]).toBeDefined()
            for (const ENTRY of DATA[F_NAME]) {
                expect(Object.keys(ENTRY).length).toBeGreaterThan(6)
            }
        }

    });


})
