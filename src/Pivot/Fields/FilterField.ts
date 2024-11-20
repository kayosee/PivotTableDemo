import { Field } from "../Fields/Field";
import { DataType } from "../Enums/DataType";
import { Comparison } from "../Enums/Comparison";

export class FilterField extends Field {
    compare(f: any) {
        if (typeof (this.comparison) == 'function')
            return (this.comparison as Function)(f);
        var method = this.comparison.toString();
        if (FilterField.comparisons.has(method)) {
            let func = FilterField.comparisons.get(method);
            if ([Comparison.between, Comparison.notBetween].findIndex(f => f == method) > -1)
                return (func)?.(f[this.name], this.start, this.end);
            else if ([Comparison.contains, Comparison.notContains].findIndex(f => f == method) > -1)
                return (func)?.(f[this.name], this.list);
            return (func)?.(f[this.name], this.critera);
        }
    }
    critera: string | number | Date | null = null;
    start: number | Date | null = null;
    end: number | Date | null = null;
    list: Array<number | Date | string> | null = [];
    comparison: Comparison | Function;
    private static comparisons: Map<string, Function> = new Map<string, Function>([
        [Comparison.less, function (a: number | Date, b: number | Date) { return a < b; }],
        [Comparison.lessOrEquals, function (a: number | Date, b: number | Date) { return a <= b; }],
        [Comparison.greater, function (a: number | Date, b: number | Date) { return a > b; }],
        [Comparison.greaterOrEquals, function (a: number | Date, b: number | Date) { return a >= b; }],
        [Comparison.equals, function (a: number | Date, b: number | Date) { return a == b; }],
        [Comparison.between, function (a: number | Date, b: number | Date, c: number | Date) { return a >= b && a <= c; }],
        [Comparison.notBetween, function (a: number | Date, b: number | Date, c: number | Date) { return !(a >= b && a <= c); }],
        [Comparison.like, function (a: string, b: string) { return new RegExp(b).test(a); }],
        [Comparison.notLike, function (a: string, b: string) { return !new RegExp(b).test(a); }],
        [Comparison.contains, function (a: any, b: Array<number | Date | string>) { return b.findIndex(f => f == a) >= 0; }],
        [Comparison.notContains, function (a: any, b: Array<number | Date | string>) { return b.findIndex(f => f == a) == -1; }]
    ])
    constructor(name: string, title: string, type: DataType, index: number, style: string | Function | null, comparison: string | Function, ...critera: string[] | number[] | Date[]) {
        super(name, title, type, index, style, null, null);
        if (typeof (comparison) == 'string')
            this.comparison = comparison as Comparison;
        else
            this.comparison = comparison;

        if ([Comparison.between, Comparison.notBetween].find(f => f == this.comparison)) {
            if ((typeof (critera[0]) == 'number' && typeof (critera[1]) == 'number') ||
                (critera[0] instanceof Date && critera[1] instanceof Date)) {
                this.start = critera[0];
                this.end = critera[1];
            }
        } else if ([Comparison.contains, Comparison.notContains].find(f => f == this.comparison)) {
            if (critera[0] instanceof Array)
                this.list = critera[0];
        }
        else
            this.critera = critera[0];
    }
}
