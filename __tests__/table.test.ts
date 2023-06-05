import { Column } from "../src/table";
import {describe, test, expect} from "@jest/globals";

describe("Table tests", () => {

    test("Column value adding", () => {
        const COL = new Column<string>("test");

        expect(COL.header).toEqual("test");
        expect(COL.length).toBe(0);

    });

})
