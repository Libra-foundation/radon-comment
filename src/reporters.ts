import { type CCReport, type CCEntry, type Tree, RadonType, RadonRank } from "./types";
import * as path from "path"
import {IsCCEntry} from "./types.guard";

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

function ReportTree(data: Tree<Array<CCEntry>>): string {
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
    const TREES: Array<Tree<Array<CCEntry>>> = ToTree(data);

    let output:string = "";

    for (const TREE of TREES){
        output += ReportTree(TREE);
    }

    return output
}

export interface TypeOfTest {
    ToTree : typeof ToTree;
}

export const TEST:TypeOfTest|null  = process.env.NODE_ENV?.toUpperCase() === 'TEST'
    ? {ToTree}
    : null