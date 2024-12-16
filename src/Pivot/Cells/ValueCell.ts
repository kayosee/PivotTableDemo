import { ValueField } from "../Fields/ValueField";
import { Cell } from "./Cell";

export class ValueCell extends Cell {
    valueField: ValueField;
    value: number | null;
    style: string | null = null;
    data: Array<any> = [];
    constructor(valueField: ValueField, value: number, text: string) {
        super(value, text);
        this.valueField = valueField;
        this.value = value;
    }
}