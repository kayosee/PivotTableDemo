import { Field } from "../Fields/Field";
import { DataType } from "../Enums/DataType";
import { Comparison } from "../Enums/Comparison";
import moment from "moment";

export class FilterField extends Field {
    compare(f: any) {
        if (typeof (this.comparison) == 'function')
            return (this.comparison as Function)(f);
        var method = this.comparison.toString();
        if (FilterField.comparisons.has(method)) {
            let func = FilterField.comparisons.get(method);
            if ([Comparison.between, Comparison.notBetween].find(f => f == method))
                return (func)?.(this.type, f[this.name], this.start, this.end);
            else if ([Comparison.contains, Comparison.notContains].find(f => f == method))
                return (func)?.(this.type, f[this.name], this.list);
            else if ([Comparison.like, Comparison.notLike].find(f => f == method))
                return (func)?.(f[this.name], this.critera);
            return (func)?.(this.type, f[this.name], this.critera);
        }
    }
    critera: string | number | Date | null = null;
    start: number | Date | null = null;
    end: number | Date | null = null;
    list: Array<number | Date | string> | null = [];
    constants: Array<string> | null = null;
    comparison: Comparison | Function;
    private static comparisons: Map<string, Function> = new Map<string, Function>([
        [Comparison.less, function (type: DataType, a: number | Date, b: number | Date) { return cast(type, a) < cast(type, b); }],
        [Comparison.lessOrEquals, function (type: DataType, a: number | Date, b: number | Date) { return cast(type, a) <= cast(type, b); }],
        [Comparison.greater, function (type: DataType, a: number | Date, b: number | Date) { return cast(type, a) > cast(type, b); }],
        [Comparison.greaterOrEquals, function (type: DataType, a: number | Date, b: number | Date) { return cast(type, a) >= cast(type, b); }],
        [Comparison.equals, function (type: DataType, a: number | Date, b: number | Date) { return cast(type, a) == cast(type, b); }],
        [Comparison.between, function (type: DataType, a: number | Date, b: number | Date, c: number | Date) { return cast(type, a) >= cast(type, b) && cast(type, a) <= cast(type, c); }],
        [Comparison.notBetween, function (type: DataType, a: number | Date, b: number | Date, c: number | Date) { return !(cast(type, a) >= cast(type, b) && cast(type, a) <= cast(type, c)); }],
        [Comparison.like, function (_: DataType, a: string, b: string) { return new RegExp(b).test(a); }],
        [Comparison.notLike, function (_: DataType, a: string, b: string) { return !new RegExp(b).test(a); }],
        [Comparison.contains, function (_: DataType, a: any, b: Array<number | Date | string>) { return b.findIndex(f => f == a) >= 0; }],
        [Comparison.notContains, function (_: DataType, a: any, b: Array<number | Date | string>) { return b.findIndex(f => f == a) == -1; }]
    ])
    constructor(name: string, title: string, type: DataType, index: number, style: string | Function | null, comparison: string | Function, critera: string | number | Date | null, start: number | Date | null, end: number | Date | null, list: Array<number | Date | string> | null,constants:Array<string>|null) {
        super(name, title, type, index, style, null, null);
        if (typeof (comparison) == 'string')
            this.comparison = comparison as Comparison;
        else
            this.comparison = comparison;

        this.critera = critera;
        this.start = start;
        this.end = end;
        this.list = list;
        this.constants=constants;
    }
}

function cast(type: DataType, value: number | Date) {
    switch (type) {
        case DataType.date:
        case DataType.datetime:
            if (moment(value).isValid())
                return moment(value).valueOf();
            return 0;
        case DataType.time:
            if (moment('2000-01-01 ' + value).isValid())
                return moment('2000-01-01 ' + value).valueOf();
            return 0;
        default:
            return value;
    }
}