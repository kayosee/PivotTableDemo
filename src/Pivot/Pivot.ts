

import { DataType } from "./Enums/DataType";
import { Field } from "./Fields/Field";
import { FilterField } from "./Fields/FilterField";
import { DATA_TYPE_INVALID } from "./locale";
import { PivotOptions } from "./PivotOptions";
import { ValueCell } from "./Cells/ValueCell";
import { Total } from "./Total";
import { Arrays } from "./Utils/Arrays";
import { Sort } from "./Utils/Sort";
import { SortOrder } from "./Enums/SortOrder";
import { Area } from "./Enums/Area";
import { Header } from "./Headers/Header";


export class Pivot {
    options: PivotOptions;
    data: Array<any> = [];
    view: Array<any> = [];
    cells: Array<Array<ValueCell>> = [];
    rowHeaders: Array<Array<Header>> = [];
    rowTree: Map<string | null, any> = new Map();
    cellTree: Map<string | null, any> = new Map();
    columnTree: Map<string | null, any> = new Map();
    columnHeaders: Array<Array<Header>> = [];
    hiddenRows: Array<string> = [];
    hiddenColumns: Array<string> = [];
    onPropertyChanged: Function | null = null;
    constructor(options: PivotOptions) {
        this.options = options;
    }
    calc() {
        let options = this.options;
        this.view = this.filter(this.data, options.filters);

        this.rowTree = new Map();
        this.makeCellMap(this.rowTree, options.rows, new Map(), this.view);

        this.columnTree = new Map();
        this.makeCellMap(this.columnTree, options.columns, new Map(), this.view);

        this.cellTree = new Map();
        this.makeCellMap(this.cellTree, [...options.rows, ...options.columns], new Map(), this.view);

        debugger;

        this.rowHeaders = [];
        if (this.options.rows.length > 0)
            this.makeHeaders(this.rowTree as Map<string, any>, new Map(), [], this.rowHeaders, options.rows);
        else
            this.rowHeaders = [[new Header(null, null, null, 0, true, false, "", 1, 1, false)]];

        this.columnHeaders = [];
        if (this.options.columns.length > 0)
            this.makeHeaders(this.columnTree as Map<string, any>,new Map(), [], this.columnHeaders, options.columns);
        else
            this.columnHeaders = [[new Header(null, null, null, 0, true, false, "", 1, 1, false)]];

        this.sort();
        this.makeCells();
        this.columnHeaders = Arrays.rotate(this.columnHeaders);
        console.log(this.rowHeaders);
    }
    load(data: Array<object>) {
        this.data = this.convert(data, this.options.fields);
        this.calc();
    }
    private sort() {
        var sort = new Sort(this.columnHeaders);
        for (let i = 0; i < this.options.columns.length; i++) {
            if (this.options.columns[i].sort == SortOrder.none)
                continue;
            sort.orderBy(((f: Array<Header>) => f[i].value), this.options.columns[i].type, this.options.columns[i].sort == SortOrder.desc);
        }
        sort.do();

        sort = new Sort(this.rowHeaders);
        for (let i = 0; i < this.options.rows.length; i++) {
            if (this.options.rows[i].sort == SortOrder.none)
                continue;

            sort.orderBy(((f: Array<Header>) => f[i].value), this.options.rows[i].type, this.options.rows[i].sort == SortOrder.desc);
        } sort.do();
    }
    private makeCells() {
        this.cells = [];
        let options = this.options;
        for (let row of this.rowHeaders) {
            let one: Array<ValueCell> = [];
            for (let col of this.columnHeaders) {
                for (let value of options.values) {
                    let temp: Map<string | null | any, any> | Total = this.cellTree;
                    let cell = new ValueCell(value, 0, '0', false);

                    row.forEach(f => {
                        if (temp instanceof Map && temp.has(f.value)) {
                            temp = temp.get(f.value)
                            cell.path.set(f.field ? f.field.name : null, f.value ? f.value.toString() : null)
                        }
                    });
                    col.forEach(f => {
                        if (temp instanceof Map && temp.has(f.value)) {
                            temp = temp.get(f.value)
                            cell.path.set(f.field ? f.field.name : null, f.value ? f.value.toString() : null)
                        }
                    });

                    var array: Array<any> | null = null;
                    if (temp instanceof Array)
                        array = temp as Array<any>;
                    if (array != null) {
                        cell.data = array;
                        cell.value = value.compute(array);
                        cell.text = value.getText(cell.value);
                        cell.style = value.getStyle(cell.value);
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

            if (filter.type == DataType.string)
                filter.constants = Arrays.distinct(this.data, filter.name);
            result = result.filter(f => filter.compare(f));
        }
        return result;
    }

    private makeValueCell(path: Map<string | null, string | null>, data: Array<any>): Map<string, ValueCell> {
        let result: Map<string, ValueCell> = new Map();
        for (let value of this.options.values) {
            let cell = new ValueCell(value, 0, "", false);
            //cell.data = data;
            cell.path = path;
            cell.value = value.compute(data);
            cell.text = value.getText(cell.value);
            cell.style = value.getStyle(cell.value);
            result.set(value.name, cell);
        }
        return result;
    }

    private makeCellMap(root: Map<string | null, any>, fields: Array<Field>, path: Map<string | null, string | null>, array: Array<any>) {

        if (fields.length == 0) {
            return;
        }

        let field = fields[0];
        root.set(null, new Map());
        if (fields.length == 1)
            root.set(null, this.makeValueCell(new Map(path).set(field.name, null), array));
        else {
            root.set(null, new Map());
            this.makeCellMap(root.get(null), fields.filter((_v, _i) => _i > 0), new Map(path).set(field.name, null), array)
        }

        array.forEach(f => {
            let key = field.getText(f[field.name]);
            if (root.get(key))
                return;

            if (fields.length == 1)
                root.set(key, this.makeValueCell(new Map(path).set(field.name, key), array.filter(s => field.getText(s[field.name]) == key)));
            else {
                root.set(key, new Map());
                this.makeCellMap(root.get(key), fields.filter((_v, _i) => _i > 0), new Map(path).set(field.name, key), array.filter(s => field.getText(s[field.name]) == key))
            }
        });
    }
    private makeHeaderMap(root: Map<string | null, any>, parentField: string | null, parentValue: string | null, fields: Array<Field>, array: Array<any>) {
        let header = new Total(parentField, parentValue, array)
        for (let value of this.options.values) {
            header.values.set(value.name, value.compute(array))
        }
        root.set(null, header);

        if (fields.length == 0 || !root)
            return;

        let field = fields[0];
        array.forEach(f => {
            let text = field.getText(f[field.name]);
            if (root.get(text))
                return;

            root.set(text, new Map());
        });

        for (let key of root.keys()) {
            if (key == null)
                continue;
            this.makeHeaderMap(root.get(key), field.name, key, fields.filter((_v, _i) => _i > 0), array.filter(f => field.getText(f[field.name]) == key.toString()))
        }
    }

    private makeHeaders(data: Map<string, any>, path: Map<string | null, any>, temp: Array<Header>, result: Array<Array<Header>>, fields: Array<Field>): any {
        if (fields.length == 0) {
            result.push(temp);
            return null;
        }
        let value: string = [...data][0][0];
        let key = fields[0].name;
        temp.push(new Header(new Map(path).set(key, value), fields[0], value, 0, value == null, false, "", 0, 0, false));
        return this.makeHeaders(new Map([...data][0][1]), new Map(path).set(key, value), temp, result, fields.filter((_, i) => i > 0));
    }

    public moveField(from: Area, to: Area, toIndex: number, field: Field): boolean {
        var result = this.options.moveField(from, to, toIndex, field);
        if (result == true) {
            this.calc();
            if (to == Area.filter) {
                (field as FilterField).constants = Arrays.distinct(this.view, field.name);
            }
        }
        return result;
    }

    public collapseColumn(header: Header) {
        header.collapsed = !header.collapsed;
        if (header.path == null)
            return;

        let path = [...header.path];
        let key = JSON.stringify(Object.fromEntries(path)).replace(/[{}]/g, '');
        if (!header.collapsed) {
            let index = this.hiddenColumns.findIndex(f => f == key);
            if (index > -1)
                this.hiddenColumns.splice(index, 1);
        }
        else
            this.hiddenRows.push(key)


        this.hideCells();
        this.hideHeaders();
        if (this.onPropertyChanged)
            this.onPropertyChanged(false);
    }
    public collapseRow(header: Header) {
        header.collapsed = !header.collapsed;
        if (header.path == null)
            return;

        let path = [...header.path];
        let key = JSON.stringify(Object.fromEntries(path)).replace(/[{}]/g, '');
        if (!header.collapsed) {
            let index = this.hiddenRows.findIndex(f => f == key);
            if (index > -1)
                this.hiddenRows.splice(index, 1);
        }
        else
            this.hiddenRows.push(key)


        this.hideCells();
        this.hideHeaders();
        if (this.onPropertyChanged)
            this.onPropertyChanged(false);
    }

    public hideCells() {
        for (let row of this.cells) {
            for (let cell of row)
                cell.hidden = this.isHidden(cell);
        }
    }
    public hideHeaders() {
        for (let header of this.rowHeaders)
            if (header.find(f => this.isHidden(f)))
                header.forEach(f => f.hidden = true);
    }
    public isHidden(cell: ValueCell | Header): boolean {
        if (cell.path == null)
            return false;

        let path = [...cell.path];
        let key = JSON.stringify(Object.fromEntries(path)).replace(/[{}]/g, '');
        if (this.hiddenColumns.find(f => f == key))
            return false;
        return this.hiddenKey.findIndex(f => key.indexOf(f) != -1) >= 0;
    }
}