export function IsTree<T extends Tree<any>>(obj: unknown): obj is T {
  if (obj === null) {
    return false;
  }

  const TYPED: Tree<T> = obj as Tree<T>;
  return (
    (typeof TYPED === "object" || typeof TYPED === "function") &&
    typeof TYPED.merge === "function"
  );
}

export class Tree<T> implements Iterable<string> {
  protected readonly CHILDS: Map<string, T | this> = new Map<
    string,
    T | this
  >();

  public merge(other: Readonly<this>): void {
    let tree: unknown;
    for (const KEY of other) {
      if (this.has(KEY)) {
        tree = this.CHILDS.get(KEY);
        if (IsTree<this>(tree)) {
          tree.merge(other.get(KEY) as this);
        } else {
          this.set(KEY, other.get(KEY) as T | this);
        }
      } else {
        this.set(KEY, other.get(KEY) as T | this);
      }
    }
  }

  public get(key: string): T | this | undefined {
    return this.CHILDS.get(key);
  }

  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types -- Readonly would create a type incoherance.
  public set(key: string, value: T | this): void {
    this.CHILDS.set(key, value);
  }

  public has(key: string): boolean {
    return this.CHILDS.has(key);
  }

  public isLeaf(): boolean {
    return this.CHILDS.size === 0;
  }

  public [Symbol.iterator](): Iterator<string> {
    return this.CHILDS.keys()[Symbol.iterator]();
  }
}
