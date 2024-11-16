

import { ColumnHeader } from "./Headers/ColumnHeader";
import { DataType } from "./Enums/DataType";
import { Field } from "./Fields/Field";
import { FilterField } from "./Fields/FilterField";
import { DATA_TYPE_INVALID } from "./locale";
import { PivotOptions } from "./PivotOptions";
import { RowHeader } from "./Headers/RowHeader";
import { ValueCell } from "./Cells/ValueCell";
import { Marshal } from "./Utils/Marshal";
import { Summary } from "./Summary";
import { Arrays } from "./Utils/Arrays";
import { Sort } from "./Utils/Sort";
import { SortOrder } from "./Enums/SortOrder";


export class Pivot {
    options: PivotOptions;
    rowHeaders: Array<RowHeader[]> = [];
    columnHeaders: Array<ColumnHeader[]> = [];
    data: Array<any> = [];
    view: Array<any> = [];
    cells: Array<Array<ValueCell>> = [];
    rowKeys: Array<Array<string | null>> = [];
    rowTree: Map<string | null, any> = new Map();
    cellTree: Map<string | null, any> = new Map();
    columnTree: Map<string | null, any> = new Map();
    columnKeys: Array<Array<string | null>> = [];
    constructor(options: PivotOptions) {
        this.options = options;
    }
    calc() {
        let options = this.options;
        let stringFields = options.filters.filter(f => options.fields.findIndex(s => s.name == f.name && s.type == DataType.string) > 0)
        this.view = this.filter(this.data, stringFields);

        this.rowTree = new Map();
        this.genTree(this.rowTree, null, null, options.rows, this.view);

        this.columnTree = new Map();
        this.genTree(this.columnTree, null, null, options.columns, this.view);

        this.cellTree = new Map();
        this.genTree(this.cellTree, null, null, [...options.rows, ...options.columns], this.view);

        this.rowKeys = [];
        if (this.options.rows.length > 0)
            this.genKey(this.rowTree as Map<string, any>, [], this.rowKeys, options.rows.length);
        else
            this.rowKeys = [[null]];

        this.columnKeys = [];
        if (this.options.columns.length > 0)
            this.genKey(this.columnTree as Map<string, any>, [], this.columnKeys, options.columns.length);
        else
            this.columnKeys = [[null]];

        this.sort();
        this.cells = [];
        this.genCells();

        this.columnKeys = Arrays.rotate(this.columnKeys);
        //console.log(this.columnKeys, this.columnKeys, this.cellTree, this.cells);
    }
    load(data: Array<object>) {

        this.data = this.convert(data, this.options.fields);
        this.calc();
    }
    private sort() {
        var sort = new Sort(this.columnKeys);
        for (let i = 0; i < this.options.columns.length; i++)
            sort.orderBy(i.toString(), this.options.columns[i].sort == SortOrder.desc);
        sort.do();

        sort = new Sort(this.rowKeys);
        for (let i = 0; i < this.options.rows.length; i++)
            sort.orderBy(i.toString(), this.options.rows[i].sort == SortOrder.desc);
        sort.do();

    }
    private genCells() {
        let options = this.options;
        let length = options.rows.length + options.columns.length;
        for (let row of this.rowKeys) {
            let one: Array<ValueCell> = [];
            for (let col of this.columnKeys) {
                for (let value of options.values) {
                    let step = 0;
                    let temp: Map<string | null | any, any> | Summary = this.cellTree;
                    let cell = new ValueCell(value, 0, '', 0, 0);
                    let terminated = false;
                    options.rows.forEach((v, i) => {
                        cell.rowHeaders.set(v.name, row[i]);
                        if (!terminated) {
                            if (temp instanceof Map && temp.has(row[i])) {
                                temp = temp.get(row[i])
                                step++;
                            }
                            else
                                terminated = true;
                        }
                    });
                    options.columns.forEach((v, i) => {
                        cell.columnHeaders.set(v.name, col[i]);
                        if (!terminated) {
                            if (temp instanceof Map && temp.has(col[i])) {
                                temp = temp.get(col[i]);
                                step++;
                            }
                            else
                                terminated = true;
                        }
                    });
                    if (step == length) {
                        var header: Summary | null = null;
                        if (temp instanceof Summary)
                            header = temp as Summary;
                        else if (temp instanceof Map && temp.has(null))
                            header = temp.get(null) as Summary;
                        if (header != null) {
                            cell.value = header.values.get(value.name) ?? null;
                            cell.text = value.getText(cell.value);
                            cell.style = value.getStyle(cell.value);
                        }
                    }

                    one.push(cell);
                }
            }
            this.cells.push(one);
        }
    }
    private convert(data: Array<any>, fields: Array<Field>): Array<any> {
        let result: Array<any> = [];
        for (let i = 0; i < data.length; i++) {
            let row: any = {};
            for (let j = 0; j < fields.length; j++) {
                let field = fields[j];
                if (data[i].hasOwnProperty(field.name)) {
                    switch (field.type) {
                        case DataType.datetime:
                        case DataType.time:
                        case DataType.date:
                            row[field.name] = new Date(data[i][field.name]);
                            break;
                        case DataType.number:
                            if (isNaN(Number(data[i][field.name])))
                                row[field.name] = 0;
                            else
                                row[field.name] = new Number(data[i][field.name]).valueOf();
                            break;
                        case DataType.string:
                            if (!data[i][field.name])
                                row[field.name] = this.options.nullValue;
                            else
                                row[field.name] = data[i][field.name];
                            break;
                        default:
                            throw new Error(DATA_TYPE_INVALID);
                    }
                }
            }
            result.push(row);
        }
        return result;
    }
    private filter(data: Array<any>, filters: Array<FilterField>): Array<any> {
        let result: Array<any> = data;
        for (let i = 0; i < filters.length; i++) {
            let filter = filters[i];
            result = result.filter(f => filter.compare(f));
        }
        return result;
    }

    private genTree(root: Map<string | null, any>, parentField: string | null, parentValue: string | null, fields: Array<Field>, array: Array<any>) {
        let header = new Summary(parentField, parentValue, array)
        for (let value of this.options.values) {
            header.values.set(value.name, value.compute(array))
        }
        root.set(null, header);

        if (fields.length == 0 || !root)
            return;

        let field = fields[0];
        array.forEach(f => {
            if (root.get(f[field.name]))
                return;

            root.set(field.getText(f[field.name]), new Map());
        });

        for (let key of root.keys()) {
            if (key == null)
                continue;
            this.genTree(root.get(key), field.name, key, fields.filter((_v, _i) => _i > 0), array.filter(f => field.getText(f[field.name]) == key.toString()))
        }
    }

    private genKey(data: Map<string, any>, temp: Array<string>, result: Array<Array<any>>, length: number) {
        for (let i of data) {
            if (i[0] == null) {
                result.push([...temp, ...new Array(length - temp.length).fill(null)])
            }
            if (i[1] instanceof Map) {
                this.genKey(i[1] as Map<string, any>, [...temp, i[0]], result, length)
            }
        }
    }
}