import { Field } from "./Field";
import { DataType } from "../Enums/DataType";
import { Aggregator } from "../Enums/Aggregator";
import { ISortable } from "./ISortable";
import { SortOrder } from "../Enums/SortOrder";
import { Arrays } from "../Utils/Arrays";

export class ValueField extends Field implements ISortable {
    distinct: boolean;//去重后再计算
    keys: Array<string> | null;//指定属性后再计算
    aggregator: Aggregator | Function;
    sort: SortOrder;
    private static aggregators: Map<string, Function> = new Map<string, Function>([
        ["sum", function (rows: Array<number>) { return rows.reduce((a, b) => a + b, 0); }],
        ["avg", function (rows: Array<number>) { let sum = rows.reduce((a, b) => a + b, 0); return rows.length > 0 ? sum / rows.length : null; }],
        ["max", function (rows: Array<number | Date>) {
            return rows.length > 0 ?
                rows.sort((a, b) => {
                    if (typeof (a) == 'number' && typeof (b) == 'number')
                        return a - b;
                    return a > b ? 1 : (a == b ? 0 : -1);
                })[rows.length - 1] : null;
        }],
        ["min", function (rows: Array<number | Date>) {
            return rows.length > 0 ? rows.sort((a, b) => {
                if (typeof (a) == 'number' && typeof (b) == 'number')
                    return a - b;
                return a > b ? 1 : (a == b ? 0 : -1);
            })[0] : null;
        }],
        ["count", function (rows: Array<any>) {
            return rows.length;
        }]
    ])
    compute(rows: Array<any>) {
        if (typeof (this.aggregator) == 'function')
            return (this.aggregator as Function)(rows);
        var method = this.aggregator.toString();
        if (ValueField.aggregators.has(method)) {
            let array: Array<any> = [];
            if (this.keys) {
                rows.forEach(f => {
                    let item: any = {};
                    item[this.name] = f[this.name];
                    this.keys?.forEach(s => item[s] = f[s]);
                    array.push(item);
                })
            }
            else
                rows.forEach(f => array.push(f));

            if (this.distinct)
                array = Arrays.distinctAll(array);
            return (ValueField.aggregators.get(method))?.(array.map(f => f[this.name]));
        }
    }
    constructor(name: string, title: string, type: DataType, index: number, style: string | Function | null, format: string | null, formatter: Function | null, fraction: number | null, aggregator: string | Function, distinct: boolean, keys: Array<string> | null, sort: string) {
        super(name, title, type, index, style, format, formatter, fraction);
        if (typeof (aggregator) == 'string')
            this.aggregator = aggregator as Aggregator;
        else
            this.aggregator = aggregator ?? Aggregator.sum;
        this.distinct = distinct ?? false;
        this.keys = keys;
        this.style = style;
        if (sort == 'desc')
            this.sort = SortOrder.desc;
        else
            this.sort = SortOrder.asc;
        this.fraction = fraction ?? 2;
    }
    clone(): ValueField {
        return new ValueField(this.name, this.title, this.type, this.index, this.style, this.format, this.formatter, this.fraction, this.aggregator, this.distinct, this.keys, this.sort);
    }
}
