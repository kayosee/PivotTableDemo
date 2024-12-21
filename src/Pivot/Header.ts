import { HeaderCell } from "./Cells/HeaderCell";
import { ValueCell } from "./Cells/ValueCell";
import { Arrays } from "./Utils/Arrays";

export class Header {
    headerCells: Array<HeaderCell> = [];
    valueCells: Array<ValueCell> = [];
    collapsed: boolean = false;
    collapseable: boolean = false;
    hidden: boolean = false;
    path: Map<string | null, string | null> = new Map();
    constructor(headerCells: Array<HeaderCell>) {
        this.headerCells = headerCells;
    }
    public trim(): Array<HeaderCell> {
        let first = Arrays.firstNull(this.headerCells, (f: HeaderCell) => f.value);
        let last = Arrays.lastNull(this.headerCells, (f: HeaderCell) => f.value);
        if (first == null || last != this.headerCells.length - 1)
            return this.headerCells;
        return this.headerCells.slice(0, first + 1);
    }
}