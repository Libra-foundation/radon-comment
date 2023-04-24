import {describe, test, expect} from "@jest/globals";
import { Tree } from "../src/tree";

describe("Tree tests", () => {

    test("Tree -- getter and setters", () => {
        const TREE: Tree<string> = new Tree<string>()

        TREE.set('test', 'test')
        expect(TREE.get('test')).toEqual('test');
        
        TREE.set('test', 'override')
        expect(TREE.get('test')).toEqual('override');
    });

    test("Tree -- has", () => {
        const TREE: Tree<string> = new Tree<string>()

        expect(TREE.has('test')).toBe(false);
        TREE.set('test', 'test')
        expect(TREE.has('test')).toBe(true);
    });

    test("Tree -- merge: simple", () => {
        const TREE: Tree<string> = new Tree<string>()
        const TREE_2: Tree<string> = new Tree<string>()
        
        TREE.set('test', 'test')
        TREE_2.set('test_2', 'test_2')

        TREE.merge(TREE_2);

        expect(TREE.has('test_2')).toBe(true);
        expect(TREE_2.has('test')).toBe(false);

    });

    test("Tree -- merge: recursive", () => {
        expect(true).toBe(true); // TODO
    });

    test("Tree -- iteration", () => {
        expect(true).toBe(true); // TODO
    });

});