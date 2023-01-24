import { type CCReport, type CCEntry, type Tree } from "./types";
import * as path from "path"

const PATH_ENDS: Array<string> = [
    ".",
    "/"
]

// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types -- I am mutating an argument
function TreeMerge<T>(first: Tree<T>, second: Readonly<Tree<T>>):void{
    for (const KEY in second){
        if (KEY in first){
            TreeMerge(first[KEY] as Tree<T>, second[KEY] as Tree<T>);
        } else {
            first[KEY] = second[KEY]
        }
    }
}

// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types -- Almost impossible to make readonly and still being useful.
function ToTree (data: Readonly<CCReport>) : Array<Tree<Array<CCEntry>>> {
    const TREES: Array<Tree<Array<CCEntry>>> = [];
    const ROOT_MAP: Record<string,Tree<Array<CCEntry>>> = {}
    for (const F_NAME in data){
        let tree: Tree<Array<CCEntry>> = {};
        let temp_tree: Tree<Array<CCEntry>> = {};

        tree[path.basename(F_NAME)] = data[F_NAME]

        let current_name:string = path.dirname(F_NAME);

        while (!PATH_ENDS.includes(current_name)){
            temp_tree[path.basename(current_name)] = tree;
            tree = temp_tree;
            temp_tree = {};
            current_name = path.dirname(current_name)
        }

        if(Object.keys(tree)[0] in ROOT_MAP){
            TreeMerge(ROOT_MAP[Object.keys(tree)[0]],tree)
        }else {
            TREES.push(tree)
            ROOT_MAP[Object.keys(tree)[0]] = tree
        }

    }
    return TREES
}

// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types -- Almost impossible to make readonly and still being useful.
export function CCReporter(data: Readonly<CCReport>): string{
    const TREES: Array<Tree<Array<CCEntry>>> = ToTree(data);

    return ""
}

export interface TypeOfTest {
    ToTree : typeof ToTree;
}

export const TEST:TypeOfTest|null  = process.env.NODE_ENV?.toUpperCase() === 'TEST'
    ? {ToTree}
    : null