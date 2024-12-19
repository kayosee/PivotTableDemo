import { Cell } from "./Cell";
import { Field } from "../Fields/Field";
import { ValueCell } from "./ValueCell";

export class HeaderCell extends Cell {
    field: Field | null;
    index: number;
    collapseable: boolean;
    collapsed: boolean;
    rowspan: number;
    colspan: number;
    peers: HeaderCell[] | null;
    cells: ValueCell[] | null;
    constructor(value: string | number | Date | null, text: string | null, path: Map<string | null, string | null> | null, field: Field | null, index: number, collapseable: boolean) {
        super(value, text, path);
        this.field = field;
        this.index = index;
        this.collapseable = collapseable;
        this.collapsed = false;
        this.rowspan = 1;
        this.colspan = 1;
        this.peers = null;
        this.cells = null;
    }
}