import { Field } from "../Fields/Field";
import { DataType } from "../Enums/DataType";
import { Comparison } from "../Enums/Comparison";

export class FilterField extends Field {
    compare(f: any) {
        if (typeof (this.comparison) == 'function')
            return (this.comparison as Function)(f);
        var method = this.comparison.toString();
        if (FilterField.comparisons.has(method)) {
            return (FilterField.comparisons.get(method))?.(f[this.name], this.critera);
        }
    }
    critera: string | number | Date;
    comparison: Comparison | Function;
    private static comparisons: Map<string, Function> = new Map<string, Function>([
        ["less", function (a: number | Date, b: number | Date) { return a < b; }],
        ["lessOrEquals", function (a: number | Date, b: number | Date) { return a <= b; }],
        ["great", function (a: number | Date, b: number | Date) { return a > b; }],
        ["greatOrEquals", function (a: number | Date, b: number | Date) { return a >= b; }],
        ["equals", function (a: number | Date, b: number | Date) { return a == b; }],
        ["between", function (a: number | Date, b: number | Date, c: number | Date) { return a >= b && a <= c; }],
        ["in", function (a: any, b: Array<any>) { return b.findIndex(f => f == a) > -1; }]
    ])
    constructor(name: string, title: string, type: DataType, index: number, style: string | Function | null, comparison: string | Function, critera: string | number | Date) {
        super(name, title, type, index, style, null, null);
        this.critera = critera;
        if (typeof (comparison) == 'string')
            this.comparison = comparison as Comparison;
        else
            this.comparison = comparison;
    }
}
