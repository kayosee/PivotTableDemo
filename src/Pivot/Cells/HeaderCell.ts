import { Cell } from "./Cell";
import { Field } from "../Fields/Field";

export class HeaderCell extends Cell {
    field: Field | null;
    index: number | null;
    collapseable: boolean;
    collapsed: boolean;
    rowspan: number;
    colspan: number;
    parents: HeaderCell[] | null;
    constructor(value: string | number | Date | null, text: string, field: Field | null, index: number) {
        super(value, text);
        this.field = field;
        this.index = index;
        this.collapseable = false;
        this.collapsed = false;
        this.rowspan = 1;
        this.colspan = 1;
        this.parents = null;
    }
}