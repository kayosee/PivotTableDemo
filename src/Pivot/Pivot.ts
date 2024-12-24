

import { DataType } from "./Enums/DataType";
import { Field } from "./Fields/Field";
import { FilterField } from "./Fields/FilterField";
import { DATA_TYPE_INVALID } from "./locale";
import { PivotOptions } from "./PivotOptions";
import { ValueCell } from "./Cells/ValueCell";
import { Arrays } from "./Utils/Arrays";
import { Sort } from "./Utils/Sort";
import { SortOrder } from "./Enums/SortOrder";
import { Area } from "./Enums/Area";
import { Cell } from "./Cells/Cell";
import { HeaderCell } from "./Cells/HeaderCell";
import { Header } from "./Header";


export class Pivot {
    options: PivotOptions;
    data: Array<any> = [];
    view: Array<any> = [];
    cells: Array<Array<Cell>> = [];
    rowHeaders: Array<Header> = [];
    rowMap: Map<string | null, any> = new Map();
    cellMap: Map<string | null, any> = new Map();
    columnMap: Map<string | null, any> = new Map();
    columnHeaders: Array<Header> = [];
    hiddenRows: Array<string> = [];
    hiddenColumns: Array<string> = [];
    onPropertyChanged: Function | null = null;
    constructor() {
        this.options = new PivotOptions({});
    }
    init(options: PivotOptions) {
        this.options = options;
    }
    calc() {
        let options = this.options;
        this.view = this.filter(this.data, options.filters);

        this.rowMap = new Map();
        this.makeCellMap(this.rowMap, options.rows, new Map(), this.view, this.makeHeaderCell);

        this.columnMap = new Map();
        this.makeCellMap(this.columnMap, options.columns, new Map(), this.view, this.makeHeaderCell);

        this.cellMap = new Map();
        this.makeCellMap(this.cellMap, [...options.rows, ...options.columns], new Map(), this.view, this.makeValueCell);

        this.rowHeaders = [];
        if (this.options.rows.length > 0) {
            this.makeHeaders(this.rowMap as Map<string, any>, new Map(), new Map(), this.rowHeaders, options.rows);
        }
        else
            this.rowHeaders = [new Header([new HeaderCell(null, null, null, 0)])];

        this.columnHeaders = [];
        if (this.options.columns.length > 0) {
            this.makeHeaders(this.columnMap as Map<string, any>, new Map(), new Map(), this.columnHeaders, options.columns);
        }
        else
            this.columnHeaders = [new Header([new HeaderCell(null, null, null, 0)])];

        this.sort();
        this.makeCells();
    }
    load(data: Array<object>) {

        this.data = this.convert(data, this.options.fields);
        this.calc();
    }
    private sort() {
        var sort = new Sort(this.columnHeaders);
        for (let i = 0; i < this.options.columns.length; i++) {
            sort.orderBy(((f: Header) => f.headerCells[i].value), this.options.columns[i].type, this.options.columns[i].sort == SortOrder.desc);
        }
        sort.do();

        sort = new Sort(this.rowHeaders);
        for (let i = 0; i < this.options.rows.length; i++) {
            sort.orderBy(((f: Header) => f.headerCells[i].value), this.options.rows[i].type, this.options.rows[i].sort == SortOrder.desc);
        } sort.do();
    }

    private makeCells() {
        this.cells = [];
        for (let row of this.rowHeaders) {
            let path: Map<string | null, any> = new Map();
            let part1: Map<string | null, any> | ValueCell = this.cellMap;

            row.headerCells.forEach((f, i) => {
                if (f.field == null)
                    return;
                if (f.value == null)
                    f.rowspan = row.headerCells.length - i;
                if (part1 instanceof Map) {
                    if (!part1.has(f.value as string))
                        part1.set(f.value as string, new Map());
                    part1 = part1.get(f.value as string);
                }
                path.set(f.field?.name, f.value);
            });

            let one: Array<ValueCell> = [];
            for (let col of this.columnHeaders) {
                let part2: Map<string | null, any> | ValueCell = part1;
                col.headerCells.forEach((f, i) => {
                    if (f.field == null)
                        return;
                    if (f.value == null)
                        f.rowspan = col.headerCells.length - i;
                    if (part2 instanceof Map) {
                        if (!part2.has(f.value as string))
                            part2.set(f.value as string, new Map());
                        part2 = part2.get(f.value as string);
                    }
                    path.set(f.field?.name, f.value);
                });
                for (let value of this.options.values) {
                    let valueCell: ValueCell;
                    if (!part2.has(value.name)) {
                        valueCell = new ValueCell(0, path, value);
                        part2.set(value.name, valueCell)
                    }
                    else
                        valueCell = part2.get(value.name) as ValueCell;

                    col.valueCells.push(valueCell);
                    one.push(valueCell);
                }
            }
            row.valueCells.push(...one);
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

    private makeValueCell(_field: Field, _value: string | number | Date | null, path: Map<string | null, string | null>, data: Array<any>): Map<string, ValueCell> {
        let result: Map<string, ValueCell> = new Map();
        for (let value of this.options.values) {
            let cell = new ValueCell(0, path, value);
            //cell.data = data;
            cell.value = value.compute(data);
            cell.text = value.getText(cell.value);
            cell.style = value.getStyle(cell.value);
            result.set(value.name, cell);
        }
        return result;
    }

    private makeHeaderCell(field: Field, value: string | number | Date | null, path: Map<string | null, string | null>, _data: Array<any>): HeaderCell {
        let cell = new HeaderCell(value, path, field, path.size);
        return cell;
    }

    private makeCellMap(root: Map<string | null, any>, fields: Array<Field>, path: Map<string | null, string | null>, array: Array<any>, setter: Function) {
        if (fields.length == 0) {
            return;
        }

        let field = fields[0];
        root.set(null, new Map());
        if (fields.length == 1)
            root.set(null, setter.call(this, field, null, new Map(path).set(field.name, null), array));
        else {
            root.set(null, new Map());
            this.makeCellMap(root.get(null), fields.filter((_v, _i) => _i > 0), new Map(path).set(field.name, null), array, setter)
        }

        array.forEach(f => {
            let key = field.getText(f[field.name]);
            if (root.get(key))
                return;

            if (fields.length == 1)
                root.set(key, setter.call(this, field, key, new Map(path).set(field.name, key), array.filter(s => field.getText(s[field.name]) == key)));
            else {
                root.set(key, new Map());
                this.makeCellMap(root.get(key), fields.filter((_v, _i) => _i > 0), new Map(path).set(field.name, key), array.filter(s => field.getText(s[field.name]) == key), setter)
            }
        });
    }

    private makeHeaders(data: Map<string, any>, path: Map<string | null, any>, temp: Map<string, HeaderCell>, result: Array<Header>, fields: Array<Field>): any {
        if (fields.length == 0) {
            let array = [...path.values()].map(f => f ? '1' : '0').join(',');
            if (/^(1.?)*(0.?)*$/.test(array))//不要中间NULL或者中间非NULL
            {
                let mapping = Array.from(temp.values());
                let header = new Header(mapping.map(f => new HeaderCell(f.value, f.path, f.field, f.index)));
                header.path = path;
                mapping.forEach(f => f.parent = header);
                result.push(header);
            }
        } else {
            for (let i of data) {
                let key = fields[0].name;
                let value: string = i[0];
                let cell: HeaderCell;
                if (i[1] instanceof HeaderCell) {
                    cell = i[1] as HeaderCell;
                }
                else {
                    cell = new HeaderCell(value, new Map(path).set(key, value), fields[0], path.size);
                }
                temp.set(fields[0].name, cell);
                this.makeHeaders((i[1] as Map<string, any>), new Map(path).set(key, value), temp, result, fields.filter((_, i) => i > 0));
            }
        }

    }
    public moveField(from: Area, to: Area, toIndex: number, field: Field): boolean {
        var result = this.options.moveField(from, to, toIndex, field);
        if (result == true) {
            this.calc();
            if (to == Area.filter) {
                (field as FilterField).constants = Arrays.distinct(this.data, field.name);
            }
        }
        return result;
    }

    public collapse(header: Header, area: Area) {
        let array: Array<string>;
        if (area == Area.column)
            array = this.hiddenColumns;
        else if (area == Area.row)
            array = this.hiddenRows;
        else
            return;

        header.collapsed = !header.collapsed;
        if (header.path == null)
            return;

        let path = [...header.path].filter(f => f[1] != null);
        let key = JSON.stringify(Object.fromEntries(path)).replace(/[{}]/g, '');
        if (!header.collapsed) {
            let index = array.findIndex(f => f == key);
            if (index > -1)
                array.splice(index, 1);
        }
        else
            array.push(key)

        if (area == Area.column)
            this.hideCells(new Map(path), this.columnMap, header.collapsed);
        else if (area == Area.row)
            this.hideCells(new Map(path), this.rowMap, header.collapsed);

        if (this.onPropertyChanged)
            this.onPropertyChanged(false);
    }

    public hideCells(path: Map<string | null, any>, root: Map<string | null, any>, hidden: boolean) {
        let temp = root;
        for (let i of path) {
            if (temp.has(i[1]))
                temp = temp.get(i[1])
        }
        let tree = [...temp].filter(f => f[0] != null);
        this.doHide(new Map(tree), hidden);
    }
    public doHide(tree: Map<string | null, any>, hidden: boolean) {
        for (let i of tree) {
            if (i[1] instanceof Map)
                this.doHide(i[1], hidden);
            else if (i[1] instanceof HeaderCell && i[1].parent != null) {
                i[1].parent.hidden = hidden;
                i[1].parent.headerCells.forEach(f => f.hidden = hidden);
                i[1].parent.valueCells.forEach(f => f.hidden = hidden);
            }
        }
    }
    public getDetails(path: Map<string | null, string | null>): Array<any> {
        let details = this.view;
        for (let i of path) {
            if (i[0] != null && i[1] != null) {
                let key: string = i[0] as string;
                details = details.filter(f => f[key] == i[1]);
            }
        }
        return details;
    }
}