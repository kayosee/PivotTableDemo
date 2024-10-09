import { ValueField } from "../Fields/ValueField";
import { ColumnHeader } from "../Headers/ColumnHeader";
import { RowHeader } from "../Headers/RowHeader";
import { Marshal } from "../Utils/Marshal";

export class ValueCell {
    rowHeaders: Map<string, string>;
    columnHeaders: Map<string, string>;
    valueField: ValueField;
    value: number;
    text: string;
    x: number;
    y: number;
    data: Array<any> = [];
    constructor(valueField: ValueField, value: number, text: string, x: number, y: number) {
        this.rowHeaders = new Map<string, string>;
        this.columnHeaders = new Map<string, string>;
        this.valueField = valueField;
        this.value = value;
        this.text = text;
        this.x = x;
        this.y = y;
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