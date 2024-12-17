import { ValueField } from "../Fields/ValueField";
import { Cell } from "./Cell";

export class ValueCell extends Cell {
    valueField: ValueField;
    value: number | null;
    style: string | null = null;
    data: Array<any> = [];
    constructor(value: number, text: string, path: Map<string | null, string | null> | null, valueField: ValueField) {
        super(value, text, path);
        this.valueField = valueField;
        this.value = value;
    }
}