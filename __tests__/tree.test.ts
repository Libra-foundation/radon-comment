import {describe, test, expect} from "@jest/globals";
import {Tree, IsTree} from "../src/tree";

describe("Tree tests", () => {
  test("Tree -- getter and setters", () => {
    const TREE: Tree<string> = new Tree<string>();

    TREE.set("test", "test");
    expect(TREE.get("test")).toEqual("test");

    TREE.set("test", "override");
    expect(TREE.get("test")).toEqual("override");
  });

  test("Tree -- has", () => {
    const TREE: Tree<string> = new Tree<string>();

    expect(TREE.has("test")).toBe(false);
    TREE.set("test", "test");
    expect(TREE.has("test")).toBe(true);
  });

  test("Tree -- merge: simple", () => {
    const TREE: Tree<string> = new Tree<string>();
    const TREE_2: Tree<string> = new Tree<string>();

    TREE.set("test", "test");
    TREE_2.set("test_2", "test_2");

    TREE.merge(TREE_2);

    expect(TREE.has("test_2")).toBe(true);
    expect(TREE.get("test_2")).toEqual("test_2");

    expect(TREE_2.has("test")).toBe(false);

    TREE_2.set("test_2", "test_3");
    TREE.merge(TREE_2);

    expect(TREE.get("test_2")).toEqual("test_3");
  });

  test("Tree -- merge: recursive", () => {
    const TREE: Tree<string> = new Tree<string>();
    const TREE_2: Tree<string> = new Tree<string>();
    const TREE_3: Tree<string> = new Tree<string>();

    TREE.set("test", "test");
    TREE_2.set("test_2", TREE_3);
    TREE_3.set("test_3", "test_3");

    TREE.merge(TREE_2);

    expect(TREE.has("test_2")).toBe(true);
    expect(TREE_2.has("test")).toBe(false);

    expect(IsTree(TREE.get("test_2"))).toBe(true);

    expect((TREE.get("test_2") as Tree<string>).has("test_3")).toBe(true);
    expect((TREE.get("test_2") as Tree<string>).get("test_3")).toEqual(
      "test_3"
    );

    TREE_3.set("test_3", "test_4");
    expect((TREE.get("test_2") as Tree<string>).get("test_3")).toEqual(
      "test_4"
    );

    const TREE_4: Tree<string> = new Tree<string>();
    const TREE_5: Tree<string> = new Tree<string>();

    TREE_4.set("test_2", TREE_5);
    TREE_5.set("test_5", "test_5");
    TREE.merge(TREE_4);

    expect(TREE.has("test_2")).toBe(true);

    expect(IsTree(TREE.get("test_2"))).toBe(true);
    expect(IsTree(TREE.get("test_2"))).toBe(true);
    expect((TREE.get("test_2") as Tree<string>).has("test_3")).toBe(true);
    expect((TREE.get("test_2") as Tree<string>).has("test_5")).toBe(true);

    expect((TREE.get("test_2") as Tree<string>).get("test_3")).toEqual(
      "test_4"
    );
    expect((TREE.get("test_2") as Tree<string>).get("test_5")).toEqual(
      "test_5"
    );
  });

  test("Tree -- iteration", () => {
    const TREE: Tree<string> = new Tree<string>();

    TREE.set("test", "test");
    TREE.set("test_2", "test");
    TREE.set("test_3", "test");
    TREE.set("test_4", "test");

    let counter = 0;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- The var is needed for the iteration to occur
    for (const KEY of TREE) {
      // console.log(KEY)
      counter++;
    }

    expect(counter).toBe(4);
  });
});
