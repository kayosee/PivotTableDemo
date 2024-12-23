import { HeaderCell } from "./Cells/HeaderCell";
import { ValueCell } from "./Cells/ValueCell";
import { Arrays } from "./Utils/Arrays";

export class Header {
    static seed: number = 1;
    id: number;
    headerCells: Array<HeaderCell> = [];
    valueCells: Array<ValueCell> = [];
    collapsed: boolean = false;
    hidden: boolean = false;
    path: Map<string | null, string | null> = new Map();
    trimedHeaderCells: Array<HeaderCell> | null = null;
    constructor(headerCells: Array<HeaderCell>) {
        this.id = Header.seed++;
        this.headerCells = headerCells;
    }
    public trim(): Array<HeaderCell> {

        let first = Arrays.firstNull(this.headerCells, (f: HeaderCell) => f.value);
        let last = Arrays.lastNull(this.headerCells, (f: HeaderCell) => f.value);
        if (first == null || last != this.headerCells.length - 1)
            return this.headerCells;
        return this.headerCells.slice(0, first + 1);
    }
    public collapseable(): boolean {
        return this.headerCells.find(f => f.value == null) != null;
    }
}