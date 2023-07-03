import {describe, test, expect, beforeAll} from "@jest/globals";
import {CCReader} from "../src/readers";
import type {CCEntry, CCReport} from "../src/types";
import {TEST, type TypeOfTest} from "../src/reporters";
import {IsTree} from "../src/tree";

const {ReportTree} = TEST as TypeOfTest;

describe("Reporters tests", () => {
  let data: CCReport;

  beforeAll(async () => {
    data = await CCReader("__tests__/data/cc.json");
  });

  test("CC Reporter -- Tree building", () => {
    const TREE = ReportTree.from<Array<CCEntry>>(data);
    expect(TREE).toBeDefined();

    expect(TREE.get).toBeDefined();
    expect(TREE.has).toBeDefined();

    /*console.log("Root Tree nodes :")
    for (const ENTRY of TREE) {
        console.log(ENTRY)
    }*/
    expect(TREE.has("src")).toBe(false);
    expect(TREE.has("src/cvrp")).toBe(true);

    expect(IsTree<typeof TREE>(TREE.get("src/cvrp"))).toBe(true);

    const SRC: typeof TREE = TREE.get("src/cvrp") as typeof TREE;

    let counter = 0;
    // console.log("src Tree nodes :")
    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- Iterations is kinda needed.
    for (const ENTRY of SRC) {
      // console.log(ENTRY)
      counter += 1;
    }

    expect(SRC.has("src")).toBe(false);
    expect(SRC.has("cvrp")).toBe(false);
    expect(SRC.has("src/cvrp")).toBe(false);

    expect(counter).toBe(5);
  });

  test("CC Reporter -- Report is created", () => {
    const TREE = ReportTree.from<Array<CCEntry>>(data);
    const TABLE = TREE.toTable();

    expect(TABLE).toBeDefined();

    //console.log(TABLE.toMD());
  });
});
