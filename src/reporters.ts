import { type CCReport, type CCEntry, RadonType, RadonRank, type Report,type IToString, type IToMD } from "./types";
import { IsTree, Tree } from "./tree";
import { IsIToMD } from "./types.guard";
import * as path from "path"

const PATH_ENDS: Array<string> = [
    ".",
    "/"
]

class Column<T extends IToMD|IToString> {
    public header: string;
    protected data: Array<T> = [];

    public constructor(header: string){
        this.header = header;
    }

    public push(...values: ReadonlyArray<T>):void{
        this.data.push(...values);
    }

    public [Symbol.iterator]():Iterator<T> {
        return this.data[Symbol.iterator]()
    }

    public get(index: number): T {
        return this.data[index]
    }

    public get length() : number {
        return this.data.length;
    }

}

class Table<T extends IToMD|IToString> implements IToMD {

    protected readonly DATA: Map<string, Column<T>> = new Map<string, Column<T>>();

    // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types -- Columns will be mutated
    public addColumns (...columns: Array< Column<T>>):void{
        for( const COLUMN of columns){
            this.DATA.set(COLUMN.header, COLUMN);
        }
    }

    public *[Symbol.iterator]():Iterator<Array<T>> {
        const COLUMNS : Array<Column<T>> = Array.from(this.DATA).map(v => v[1]);
        const LENGTH:number = Math.min(...COLUMNS.map(c => c.length));
        
        for (let index:number =0; index<LENGTH ;index++){
            yield COLUMNS.map(c => c.get(index));
        }
    }

    public toMD ():string {
        let output: string = "";
        
        output += "<table><tr>";

        for (const HEADER in this.DATA){
            output += `<th>${HEADER}</th>`;
        }

        output += "</tr>";

        for (const ROW of this){
            output += "<tr>";
            for(const VALUE of ROW){
                if ( IsIToMD(VALUE) ){
                    output += `<td>${VALUE.toMD()}</td>`;
                } else {
                    output += `<td>${VALUE.toString()}</td>`;
                }
            }
            output += "</tr>";
        }
        
        output += "</table>";
        return output;
    }

}

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

    public toString() : string {

        let output : string = "";

        output += "Report\n";

        for (const CHILD_NAME of this) {
            const CHILD: T | this = this.get(CHILD_NAME);
            if (IsTree(CHILD)){
                output += CHILD.toString()
            } else {
                output += "A string reprsentation of a report";
            }
        }

        return output;
    }
}


/*

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