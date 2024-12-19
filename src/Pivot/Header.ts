import { HeaderCell } from "./Cells/HeaderCell";
import { ValueCell } from "./Cells/ValueCell";

export class Header {
    headerCells: Array<HeaderCell> = [];
    valueCells: Array<ValueCell> = [];
    collapsed: boolean = false;
    path: Map<string | null, string | null> = new Map();
}