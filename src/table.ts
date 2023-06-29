import {type IToString, type IToMD} from "./types";
import {IsIToMD} from "./types.guard";

export class Column<T extends IToMD | IToString> {
  public header: string;
  protected data: Array<T> = [];

  public constructor(header: string) {
    this.header = header;
  }

  public push(...values: ReadonlyArray<T>): void {
    this.data.push(...values);
  }

  public [Symbol.iterator](): Iterator<T> {
    return this.data[Symbol.iterator]();
  }

  public get(index: number): T {
    return this.data[index];
  }

  public get length(): number {
    return this.data.length;
  }
}

export class Table<T extends IToMD | IToString> implements IToMD {
  protected readonly DATA: Map<string, Column<T>> = new Map<
    string,
    Column<T>
  >();

  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types -- Columns will be mutated
  public addColumns(...columns: Array<Column<T>>): void {
    for (const COLUMN of columns) {
      this.DATA.set(COLUMN.header, COLUMN);
    }
  }

  public get(name: string): Column<T> | undefined {
    return this.DATA.get(name);
  }

  public *[Symbol.iterator](): Iterator<Array<T>> {
    const COLUMNS: Array<Column<T>> = Array.from(this.DATA).map(v => v[1]);
    const LENGTH: number =
      COLUMNS.length > 0 ? Math.min(...COLUMNS.map(c => c.length)) : 0;

    for (let index: number = 0; index < LENGTH; index++) {
      yield COLUMNS.map(c => c.get(index));
    }
  }

  public toMD(): string {
    let output: string = "";

    output += "<table><tr>";

    for (const HEADER of this.DATA.keys()) {
      output += `<th>${HEADER}</th>`;
    }

    output += "</tr>";

    for (const ROW of this) {
      output += "<tr>";
      for (const VALUE of ROW) {
        if (IsIToMD(VALUE)) {
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
