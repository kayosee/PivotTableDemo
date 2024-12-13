import { ValueField } from "../Fields/ValueField";

export class ValueCell {
    valueField: ValueField;
    value: number | null;
    text: string | null;
    style: string | null = null;
    data: Array<any> = [];
    path: Map<string | null, string | null> = new Map();
    hidden:boolean;
    constructor(valueField: ValueField, value: number, text: string,hidden:boolean) {
        this.valueField = valueField;
        this.value = value;
        this.text = text;
        this.hidden = hidden;
    }
}