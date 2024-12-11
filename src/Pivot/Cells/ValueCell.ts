import { ValueField } from "../Fields/ValueField";

export class ValueCell {
    valueField: ValueField;
    value: number | null;
    text: string | null;
    style: string | null = null;
    data: Array<any> = [];
    path: Map<string | null, string | null> = new Map();
    constructor(valueField: ValueField, value: number, text: string) {
        this.valueField = valueField;
        this.value = value;
        this.text = text;
    }
}