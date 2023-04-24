import { type CCReport, type CCEntry, RadonType, RadonRank, type Report } from "./types";
import { Tree } from "./tree";
import * as path from "path"

const PATH_ENDS: Array<string> = [
    ".",
    "/"
]

/*/*
function ToTrees<T> (data: Readonly<Report<T>>): Array<Tree<T>> {
    type TreeType = Tree<T>;
    const TREES: Array<TreeType> = [];
    const ROOT_MAP: Record<string, TreeType> = {};

    let current_tree: TreeType = {};
    let temp_tree: TreeType = {};
    let current_name:string = "";
    for (const F_NAME in data) {
        current_tree = {};

        current_tree[path.basename(F_NAME)] = data[F_NAME];
        current_name = path.dirname(F_NAME);

        while (!PATH_ENDS.includes(current_name)) {
            temp_tree = {};
            temp_tree[path.basename(current_name)] = current_tree;
            current_tree = temp_tree;
            current_name = path.dirname(F_NAME)

        }
    }

    for (const KEY in current_tree){
        if (KEY in ROOT_MAP){
            TreeMerge(ROOT_MAP[KEY], current_tree)
        } else {
            TREES.push(current_tree)
            ROOT_MAP[KEY] = current_tree
        }
    }

    return TREES;
}*/


class ReportTree<T> extends Tree<T> {

    public static from<T>(report :Readonly<Report<T>>) : ReportTree<T>{
        const TREE:ReportTree<T> = new ReportTree<T>()

        let current_tree: ReportTree<T>;
        let temp_tree: ReportTree<T> = new ReportTree<T>();
        let current_name: string = "";

        for (const F_NAME in report) {
            current_tree  = new ReportTree<T>();
    
            current_tree.set(path.basename(F_NAME), report[F_NAME]);
            current_name = path.dirname(F_NAME);
    
            while (!PATH_ENDS.includes(current_name)) {
                temp_tree = new ReportTree<T>();
                temp_tree.set(path.basename(current_name), current_tree);
                current_tree = temp_tree;
                current_name = path.dirname(current_name)
            }

            TREE.merge(current_tree);

        }

        return TREE;
    }
}


/*
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

/**Convert a report into a Tree of its entries. The tree represent the folder architecture of the project.
 * The leafs of the trees are the sets of entries which correspond to the files in the corresponding folder.
 * 
 * @param data The report to convert.
 *//*

function GetComplexityRank(complexity :number): RadonRank{
    // Radon has a better way of doing this. I don't know how to cleanly copy their way of working.
    // see https://radon.readthedocs.io/en/latest/api.html#module-radon.complexity for more information.
    if (complexity < 6){
        return RadonRank.A;
    } else if (complexity < 11) {
        return RadonRank.B;
    } else if (complexity < 21) {
        return RadonRank.C;
    } else if (complexity < 31) {
        return RadonRank.D;
    } else if (complexity < 41) {
        return RadonRank.E;
    }
    return RadonRank.F;
}

// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types -- Almost impossible to make readonly and still being useful.
function ReportTree2(data: Readonly<Tree<Array<CCEntry>>>): string {
    let output: string = "";
    let key: string = "";
    let table: string = "";
    let min_complex: number, mean_complex: number, max_complex: number;
    let counter: number;
    while (Object.keys(data).length === 1){
        key = Object.keys(data)[0];
        if (Array.isArray(data[key])) {
            break;
        } else {
            output += `/${key}`;
            data = data[key] as Tree<Array<CCEntry>>;
        }
    }

    output = 
        `<details><summary>${output}</summary>\n` +
        "<table>";

    for (key of Object.keys(data)){
        if (Array.isArray(data[key])){
            table = "";
            
            min_complex = Number.MAX_SAFE_INTEGER;
            mean_complex = 0;
            max_complex = Number.MIN_SAFE_INTEGER;
            counter = 0;

            for (const ENTRY of data[key] as Array<CCEntry>){
                if (ENTRY.type === RadonType.M){ // Methods are registered both in the class and in the file.
                    continue;
                }

                if (min_complex > ENTRY.complexity){
                    min_complex = ENTRY.complexity;
                }

                if (max_complex < ENTRY.complexity) {
                    max_complex = ENTRY.complexity;
                }

                mean_complex += ENTRY.complexity;
                counter ++;

                table += `<tr><td>${ENTRY.name}</td><td>${ENTRY.complexity }</td><td>${ENTRY.rank}</td></tr>\n`;
            }

            output +=
                `<tr><td><details><summary>${key}</summary>\n` + 
                "<table><tr><th>name</th><th>complexity</th><th>rank</th></tr>\n" + 
                table + 
                "</table></details></td>";

            if (min_complex === max_complex) {
                output +=
                    `<td>${max_complex}</td>` +
                    `<td><strong>${GetComplexityRank(max_complex)}</strong></td>`;
            } else {
                output +=
                    `<td>${max_complex}/${(mean_complex/counter).toFixed(2)}/${min_complex}</td>` +
                    `<td><strong>${GetComplexityRank(mean_complex/counter)}</strong></td>\n`;
            }

            output += "</td></tr>";
        }
    }

    output += "</table></details>";

    return output;
}

// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types -- Almost impossible to make readonly and still being useful.
export function CCReporter(data: Readonly<CCReport>): string{
    const TREES: Array<Tree<Array<CCEntry>>> = ToTrees(data);

    let output:string = "";

    for (const TREE of TREES){
        output += ReportTree(TREE);
    }

    return output
}
*/

/* eslint-disable @typescript-eslint/naming-convention -- The test interface only map existing tokens. Name checking isn't needed there. */
export interface TypeOfTest {
    ReportTree : typeof ReportTree;
}
/* eslint-enable @typescript-eslint/naming-convention */

export const TEST:TypeOfTest|null  = process.env.NODE_ENV?.toUpperCase() === 'TEST'
    ? {ReportTree}
    : null