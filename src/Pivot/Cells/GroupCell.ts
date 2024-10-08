import { Cell } from "./Cell";

export class GroupCell extends Cell {
    collapsed: boolean;
    children: Array<Cell>;
    length:number;
    constructor(field: string, text: string, style: string, checked: boolean) {
        super(field, text, style, checked);
        this.collapsed = false;
        this.children = new Array<Cell>();
        this.length=0;
    }
}