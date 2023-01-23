import {describe, test, expect} from "@jest/globals";
import {CCReader} from "../src/readers";

describe("Readers tests", () => {

    test("CC Reader -- does read", async ()=> {

        const DATA = await CCReader("__tests__/data/cc.json");

        expect(DATA).toBeDefined();

        expect(Object.keys(DATA)).toHaveLength(5)

    });


})
