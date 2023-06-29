import {Column, Table} from "../src/table";
import {describe, test, expect} from "@jest/globals";

describe("Column tests", () => {
  test("Column value adding", () => {
    const COL = new Column<string>("test");

    expect(COL.header).toEqual("test");
    expect(COL.length).toBe(0);

    COL.push("value");
    expect(COL.length).toBe(1);
    expect(COL.get(0)).toBe("value");

    COL.push("value 2", "value 2", "value 3");
    expect(COL.length).toBe(4);
    expect(COL.get(3)).toBe("value 3");
    expect(COL.get(4)).toBeUndefined();
  });

  test("Column iterating", () => {
    const COL = new Column<string>("test");
    const VALUES = ["1", "2", "3", "4"];

    COL.push(...VALUES);

    let index = 0;
    for (const V of COL) {
      expect(V).toBe(VALUES[index]);
      index += 1;
    }
  });
});

describe("Table tests", () => {
  test("Adding columns", () => {
    const TABLE = new Table();
    const COL = new Column<string>("test");

    TABLE.addColumns(COL);

    expect(TABLE.get(COL.header)).toBe(COL);

    expect(TABLE.get(COL.header.concat(""))).toBe(COL);

    expect(TABLE.get("")).toBeUndefined();

    expect(TABLE.get(COL.header.concat(" "))).toBeUndefined();

    TABLE.addColumns(new Column<string>("test"));
    expect(TABLE.get(COL.header)).not.toBe(COL);

    TABLE.addColumns(
      new Column<string>("test 1"),
      new Column<string>("test 2"),
      new Column<string>("test 3"),
      new Column<string>("test 4"),
      new Column<string>("test"),
      COL
    );

    COL.push("hi");

    expect(TABLE.get("test 1")).not.toBeUndefined();
    expect(TABLE.get("test 2")).not.toBeUndefined();
    expect(TABLE.get("test 3")).not.toBeUndefined();
    expect(TABLE.get("test 4")).not.toBeUndefined();

    expect(TABLE.get(COL.header)?.length).toBe(1);
  });

  test("Iterating over rows", () => {
    const TABLE = new Table();

    TABLE.addColumns(
      new Column<string>("test 1"),
      new Column<string>("test 2"),
      new Column<string>("test 3"),
      new Column<string>("test")
    );

    TABLE.get("test 1")?.push(...["t", "t", "t", "t"]);
    TABLE.get("test 2")?.push(...["1", "2", "3", "4"]);
    TABLE.get("test 3")?.push(...["", ""]);
    let index = 0;
    const EXPECTED = [
      ["t", "1", "", ""],
      ["t", "2", "", ""],
      ["t", "3", undefined, ""],
      ["t", "4", undefined, ""]
    ];
    for (const ROW of TABLE) {
      expect(ROW).toEqual(EXPECTED[index]);
      index += 1;
    }

    expect(index).toBe(0);

    TABLE.get("test")?.push(...["", "", ""]);

    for (const ROW of TABLE) {
      expect(ROW).toEqual(EXPECTED[index]);
      index += 1;
    }

    expect(index).toBe(2);
  });

  test("Ietrating over empty table", () => {
    const TABLE = new Table();

    let index = 0;

    for (const ROW of TABLE) {
      index += 1;
      console.log(ROW);
    }

    expect(index).toBe(0);
  });

  test("toMD capability", () => {
    const TABLE = new Table();

    expect(TABLE.toMD()).not.toBeUndefined();
    expect(TABLE.toMD()).not.toBeNull();

    TABLE.addColumns(new Column<string>("test 1"), new Column<string>("test"));

    expect(TABLE.toMD()).not.toBeUndefined();
    expect(TABLE.toMD()).not.toBeNull();

    expect(TABLE.toMD().includes("test")).toBe(true);
    expect(TABLE.toMD().includes("test 1")).toBe(true);

    TABLE.get("test")?.push(...["", "should be", "shouldn't"]);
    TABLE.get("test 1")?.push(...["t", "t"]);

    expect(TABLE.toMD()).not.toBeUndefined();
    expect(TABLE.toMD()).not.toBeNull();

    expect(TABLE.toMD().includes("should be")).toBe(true);
    expect(TABLE.toMD().includes("shouldn't")).toBe(false);
  });
});
