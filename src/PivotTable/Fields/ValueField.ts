import { Field } from "./Field";
import { DataType } from "../Enums/DataType";
import { Aggregator } from "../Enums/Aggregator";

export class ValueField extends Field {
    aggregator: Aggregator | Function;
    formatter: Function;
    private static aggregators: Map<string, Function> = new Map<string, Function>([
        ["sum", function (rows: Array<number>) { return rows.length > 0 ? rows.reduce((a, b) => a + b, 0) : null; }],
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
        }],
        ["distcount", function (rows: Array<any>) {
            return rows.filter((value, index, array) => array.indexOf(value) == index).length;
        }]
    ])
    compute(rows: Array<any>) {
        if (typeof (this.aggregator) == 'function')
            return (this.aggregator as Function)(rows);
        var method = this.aggregator.toString();
        if (ValueField.aggregators.has(method)) {
            return (ValueField.aggregators.get(method))?.(rows.map(f => f[this.name]));
        }
    }
    constructor(name: string, title: string, type: DataType, index: number, style: string, aggregator: string | Function, formatter: Function) {
        super(name, title, type, index, style);
        if (typeof (aggregator) == 'string')
            this.aggregator = aggregator as Aggregator;
        else
            this.aggregator = aggregator;
        this.style = style;
        this.formatter = formatter;
    }
}
