export function IsTree<T extends Tree<any>>(obj:unknown): obj is T{
    if (obj === null) {
        return false;
    }

    const TYPED: Tree<T> = obj as Tree<T>;
    return (
            typeof TYPED === "object" ||
            typeof TYPED === "function"
        ) && 
        typeof TYPED.merge === "function";
}

export class Tree<T> implements Iterable<string>{
    
    protected readonly CHILDS: Record<string, T | this> = {}

    public merge(other: Readonly<this>):void {
        let tree: unknown;
        for (const KEY of other){
            if (KEY in this){
                tree = this.CHILDS[KEY]
                if (IsTree<this>(tree)){
                    tree.merge(other.get(KEY) as this);
                } else {
                    this.set(KEY , other.get(KEY) as T | this);
                }
                
            } else {
                this.set(KEY, other.get(KEY) as T | this)
            }
        }
    }

    public get(key:string): T | this {
        return this.CHILDS[key]
    }

    // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types -- Readonly would create a type incoherance.
    public set(key:string, value: T | this):void{
        this.CHILDS[key] = value
    }

    public has(key: string): boolean{
        return key in this.CHILDS;
    }

    public [Symbol.iterator]():Iterator<string> {
        return Object.keys(this.CHILDS)[Symbol.iterator]()
    }

}