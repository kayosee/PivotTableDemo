import { Cell } from "./Cell";
export class TotalCell extends Cell {
    constructor(field: string, text: string, style: string, checked: boolean) {
        super(field, text, style, checked);
    }
}