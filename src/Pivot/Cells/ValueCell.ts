import { ValueField } from "../Fields/ValueField";
import { Marshal } from "../Utils/Marshal";

export class ValueCell {
    hidden: boolean;
    rowHeaders: Map<string, string | null>;
    columnHeaders: Map<string, string | null>;
    valueField: ValueField;
    value: number | null;
    text: string;
    style: string | null = null;
    data: Array<any> = [];
    constructor(valueField: ValueField, value: number, text: string, hidden: boolean) {
        this.rowHeaders = new Map<string, string>;
        this.columnHeaders = new Map<string, string>;
        this.valueField = valueField;
        this.value = value;
        this.text = text;
        this.hidden = hidden;
    }
    compute(data: Array<any>) {
        this.data = Marshal.clone(data);
        for (let header of this.rowHeaders) {
            this.data = this.data.filter(f => f[header[0]] == header[1]);
        }
        for (let header of this.columnHeaders) {
            this.data = this.data.filter(f => f[header[0]] == header[1]);
        }
        this.value = this.valueField.compute(this.data);
    }
}