

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


export class Pivot {
    options: PivotOptions;
    data: Array<any> = [];
    view: Array<any> = [];
    cells: Array<Array<Cell>> = [];
    rowHeaders: Array<Array<HeaderCell>> = [];
    rowTree: Map<string | null, any> = new Map();
    cellTree: Map<string | null, any> = new Map();
    columnTree: Map<string | null, any> = new Map();
    columnHeaders: Array<Array<HeaderCell>> = [];
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
        this.makeCellMap(this.rowTree, options.rows, new Map(), this.view, this.makeHeaderCell);

        this.columnTree = new Map();
        this.makeCellMap(this.columnTree, options.columns, new Map(), this.view, this.makeHeaderCell);

        this.cellTree = new Map();
        this.makeCellMap(this.cellTree, [...options.rows, ...options.columns], new Map(), this.view, this.makeValueCell);

        this.rowHeaders = [];
        if (this.options.rows.length > 0) {
            //this.rowHeaders = [options.rows.map(_ => new Header(null, null, null, 0, true, false, "", 1, 1, false))]
            this.makeHeaders(this.rowTree as Map<string, any>, new Map(), new Map(), this.rowHeaders, options.rows);
        }
        else
            this.rowHeaders = [[new HeaderCell(null, '', null, 0,)]];

        this.columnHeaders = [];
        if (this.options.columns.length > 0) {
            //this.columnHeaders = [options.columns.map(_ => new Header(null, null, null, 0, true, false, "", 1, 1, false))]
            this.makeHeaders(this.columnTree as Map<string, any>, new Map(), new Map(), this.columnHeaders, options.columns);
        }
        else
            this.columnHeaders = [[new HeaderCell(null, '', null, 0,)]];

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
            sort.orderBy(((f: Array<HeaderCell>) => f[i].value), this.options.columns[i].type, this.options.columns[i].sort == SortOrder.desc);
        }
        sort.do();

        sort = new Sort(this.rowHeaders);
        for (let i = 0; i < this.options.rows.length; i++) {
            if (this.options.rows[i].sort == SortOrder.none)
                continue;

            sort.orderBy(((f: Array<HeaderCell>) => f[i].value), this.options.rows[i].type, this.options.rows[i].sort == SortOrder.desc);
        } sort.do();
    }

    private makeCells() {
        this.cells = [];
        for (let row of this.rowHeaders) {
            let path: Map<string | null, any> = new Map();
            let root = this.rowTree;
            let part1: Map<string | null, any> | ValueCell = this.cellTree;
            row.forEach(f => {
                if (root.has(f.value))
                    root = root.get(f.value);

                if (f.field == null)
                    return;
                if (part1 instanceof Map) {
                    if (!part1.has(f.value as string))
                        part1.set(f.value as string, new Map());
                    part1 = part1.get(f.value as string);
                }
                path.set(f.field?.name, f.value);
            });
            if (root instanceof HeaderCell) {
                let node = (root as HeaderCell);
                node.parents = row.filter(f => f.field?.name != node.field?.name);
                debugger;
            }
            let one: Array<ValueCell> = [];
            for (let col of this.columnHeaders) {
                root = this.columnTree;
                let part2: Map<string | null, any> | ValueCell = part1;
                col.forEach(f => {
                    if (root.has(f.value))
                        root = root.get(f.value);
                    if (f.field == null)
                        return;
                    if (part2 instanceof Map) {
                        if (!part2.has(f.value as string))
                            part2.set(f.value as string, new Map());
                        part2 = part2.get(f.value as string);
                    }
                    path.set(f.field?.name, f.value);
                });
                if (root instanceof HeaderCell) {
                    let node = (root as HeaderCell);
                    node.parents = col.filter(f => f.field?.name != node.field?.name);
                    debugger;
                }
                for (let value of this.options.values) {
                    if (!part2.has(value.name)) {
                        let nullCell = new ValueCell(value, 0, '0');
                        nullCell.path = path;
                        part2.set(value.name, nullCell)
                        one.push(nullCell);
                    }
                    else if (part2.get(value.name) instanceof ValueCell)
                        one.push(part2.get(value.name) as ValueCell);
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

    private makeValueCell(_field: Field, _value: string | number | Date | null, path: Map<string | null, string | null>, data: Array<any>): Map<string, ValueCell> {
        let result: Map<string, ValueCell> = new Map();
        for (let value of this.options.values) {
            let cell = new ValueCell(value, 0, "");
            cell.data = data;
            cell.path = path;
            cell.value = value.compute(data);
            cell.text = value.getText(cell.value);
            cell.style = value.getStyle(cell.value);
            result.set(value.name, cell);
        }
        return result;
    }

    private makeHeaderCell(field: Field, value: string | number | Date | null, path: Map<string | null, string | null>, _data: Array<any>): HeaderCell {
        let cell = new HeaderCell(value, value ? value.toString() : '', field, path.size);
        cell.path = path;
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

    private makeHeaders(data: Map<string, any>, path: Map<string | null, any>, temp: Map<string, HeaderCell>, result: Array<Array<HeaderCell>>, fields: Array<Field>): any {
        if (fields.length == 0) {
            let array = [...path.values()].map(f => f ? '1' : '0').join(',');
            if (/^(1.?)*(0.?)*$/.test(array))//不要中间NULL或者中间非NULL
                result.push(Array.from(temp.values()));
        } else {
            for (let i of data) {
                let key = fields[0].name;
                let value: string = i[0];
                let cell: HeaderCell;
                if (i[1] instanceof HeaderCell)
                    cell = i[1] as HeaderCell;
                else {
                    cell = new HeaderCell(value, value, fields[0], path.size);
                    cell.path = new Map(path).set(key, value);
                }
                cell.collapseable = value == null;
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
                (field as FilterField).constants = Arrays.distinct(this.view, field.name);
            }
        }
        return result;
    }

    public collapseColumn(header: HeaderCell, area: Area) {
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

        let path = [...header.path].slice(0, -1);
        let key = JSON.stringify(Object.fromEntries(path)).replace(/[{}]/g, '');
        if (!header.collapsed) {
            let index = array.findIndex(f => f == key);
            if (index > -1)
                array.splice(index, 1);
        }
        else
            array.push(key)

        this.hideCells(new Map(path), header.collapseable);
        this.hideHeaders(new Map(path), area, header.collapsed);
        if (this.onPropertyChanged)
            this.onPropertyChanged(false);
    }

    public hideCells(path: Map<string | null, any>, hidden: boolean) {
        let temp = this.cellTree;
        for (let i of path) {
            if (temp.has(i[0]))
                temp = temp.get(i[0])
        }
        this.doHide(temp, hidden);
    }
    public doHide(tree: Map<string | null, any>, hidden: boolean) {
        for (let i of tree) {
            if (i[1] instanceof Map)
                this.doHide(i[1], hidden);
            else if (i[1] instanceof ValueCell)
                i[1].hidden = hidden;
        }
    }
    public hideHeaders(path: Map<string | null, any>, area: Area, hidden: boolean) {
        let array: Array<Array<HeaderCell>>;
        if (area == Area.column)
            array = this.columnHeaders;
        else if (area == Area.row)
            array = this.rowHeaders;
        else
            return;

        for (let header of array)
            if (header.find(f => this.isHidden(f)))
                header.forEach(f => f.hidden = true);

    }
    public isHidden(cell: ValueCell | HeaderCell): boolean {
        if (cell.path == null)
            return false;

        let path = [...cell.path];
        let key = JSON.stringify(Object.fromEntries(path)).replace(/[{}]/g, '');
        if (this.hiddenColumns.find(f => f == key))
            return false;
        return this.hiddenKey.findIndex(f => key.indexOf(f) != -1) >= 0;
    }

}