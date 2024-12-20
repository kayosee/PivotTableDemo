import { Cell } from "./Cell";
import { Field } from "../Fields/Field";
import { Header } from "../Header";

export class HeaderCell extends Cell {
    field: Field | null;
    index: number;
    rowspan: number = 1;
    colspan: number = 1;
    parent: Header | null = null;
    constructor(value: string | number | Date | null, text: string | null, path: Map<string | null, string | null> | null, field: Field | null, index: number) {
        super(value, text, path);
        this.field = field;
        this.index = index;
    }
}