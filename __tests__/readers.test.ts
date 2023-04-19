import {describe, test, expect} from "@jest/globals";
import {CCReader, HalReader, MIReader} from "../src/readers";

// TODO : Test with corrupted/incompleat/wrong data
describe("Readers tests", () => {

    test("CC Reader -- does read", async ()=> {

        const DATA = await CCReader("__tests__/data/cc.json");

        expect(DATA).toBeDefined();

        expect(Object.keys(DATA)).toHaveLength(5)

    });

    test("Hal Reader -- does read", async ()=> {

        const DATA = await HalReader("__tests__/data/hal.json");

        expect(DATA).toBeDefined();

        expect(Object.keys(DATA)).toHaveLength(10)

    });

    test("MI Reader -- does read", async ()=> {

        const DATA = await MIReader("__tests__/data/mi.json");

        expect(DATA).toBeDefined();

        expect(Object.keys(DATA)).toHaveLength(10)

    });


})
