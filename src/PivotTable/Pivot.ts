

import { Cell } from "./Cells/Cell";
import { ColumnHeader } from "./Headers/ColumnHeader";
import { DataTable } from "./DataTable";
import { DataType } from "./Enums/DataType";
import { Field } from "./Fields/Field";
import { FilterField } from "./Fields/FilterField";
import { DATA_TYPE_INVALID, FIELD_NOT_EXISTS } from "./locale";
import { PivotOptions } from "./PivotOptions";
import { RowHeader } from "./Headers/RowHeader";
import { GroupCell } from "./Cells/GroupCell";
import { ValueField } from "./Fields/ValueField";
import { TotalCell } from "./Cells/TotalCell";

export class Pivot {
    options: PivotOptions;

    rowHeaders: RowHeader[] = [];
    columnHeaders: ColumnHeader[] = [];
    cells: Cell[] = [];
    data: Array<any> = [];
    view: Array<any> = [];
    constructor(options: PivotOptions) {
        this.options = options;
    }
    load(data: Array<object>) {

        this.data = this.convert(data, this.options.fields);
        let stringFields = this.options.filters.filter(f => this.options.fields.findIndex(s => s.name == f.name && s.type == DataType.String) > 0)
        let valueFields = this.options.filters.filter(f => this.options.fields.findIndex(s => s.name == f.name && s.type != DataType.String) > 0)

        this.view = this.filter(this.data, stringFields);

        let fields = this.options.rows.concat(this.options.columns);

        //this.view = this.join(this.view);
        //this.view = this.filter(this.view, valueFields);
        this.view = this.transform(fields, this.options.values, this.view);

    }
    private convert(data: Array<any>, fields: Array<Field>): Array<any> {
        let result: Array<any> = [];
        for (let i = 0; i < data.length; i++) {
            let row: any = {};
            for (let j = 0; j < fields.length; j++) {
                let field = fields[j];
                if (data[i].hasOwnProperty(field.name)) {
                    switch (field.type) {
                        case DataType.Date:
                            row[field.name] = new Date(data[i][field.name]);
                            break;
                        case DataType.Number:
                            row[field.name] = new Number(data[i][field.name]);
                            break;
                        case DataType.String:
                            row[field.name] = new String(data[i][field.name])
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
        let result: Array<any> = JSON.parse(JSON.stringify(data));
        for (let i = 0; i < filters.length; i++) {
            let filter = filters[i];
            result = result.filter(f => filter.compare(f));
        }
        return result;
    }
    private join(data: Array<any>): Array<any> {

        let copy: Array<any> = JSON.parse(JSON.stringify(data));
        let table: DataTable | null = null;
        for (let x of this.options.rows.map(f => f.name)) {
            if (table == null)
                table = this.distinct(copy, x);
            else
                table = table.join(this.distinct(copy, x))
        }

        for (let x of this.options.columns.map(f => f.name)) {
            if (table != null)
                table = table.join(this.distinct(copy, x));
        }

        if (table != null) {
            for (let row of table.data) {
                let temp = [...copy];
                for (let prop in row) {
                    temp = temp.filter(f => f[prop] == row[prop]);
                }
                for (let value of this.options.values) {
                    row[value.name] = value.compute(temp);
                }
            }

            table.data = table.data.filter(f => {
                for (let value of this.options.values) {
                    if (f[value.name] != 0)
                        return true;
                }
                return false;
            });

            return table.data;
        }
        return [];
    }

    private distinct(data: Array<any>, prop: string): DataTable {
        let table: DataTable = new DataTable(prop);
        table.add(...data.map(f => f[prop]).filter((value, index, array) => array.indexOf(value) == index).map(f => {
            let x: any = {};
            x[prop] = f;
            return x;
        }));
        return table;
    }


    private extract(field: string, list: Array<any>): Array<any> {
        return list.map(f => f[field]).concat("").filter((value, index, array) => array.indexOf(value) == index)
    }

    private transform(fields: Array<Field>, values: Array<ValueField>, data: Array<any>) {

        let result: Array<GroupCell> = [];
        let first = fields[0];
        let keys = this.extract(first.name, data);
        for (let key of keys) {
            let child = new GroupCell(first.name, key, first.style, false);
            child.length = data.filter(f => f[first.name] == key).length;
            for (let value of values) {
                let valueCell = new TotalCell(value.name, value.compute(data.filter(f => f[first.name] == key)), value.style, false);
                child.children.push(valueCell);
            }
            result.push(child);
        }

        for (let i = 0; i < result.length; i++) {
            let path: Array<Field> = [];
            let temp = data.filter(f => f[first.name] == result[i].text);
            for (let j = 1; j < fields.length; j++) {
                path.push(fields[j]);
                this.fill(path, 0, result[i], temp, values);
            }
        }

        console.log(result);
        return result;

    }

    private fill(path: Array<Field>, index: number, cell: GroupCell, src: Array<any>, values: Array<ValueField>) {
        if (path.length <= index)
            return;

        let keys = this.extract(path[index].name, src);

        for (let key of keys) {
            let child = new GroupCell(path[index].name, key, path[index].style, false);
            src = src.filter(f => f[path[index].name] == key);
            child.length = src.length;
            for (let value of values) {
                let valueCell = new TotalCell(value.name, value.compute(src), value.style, false);
                child.children.push(valueCell);
            }
            this.fill(path, index + 1, child, src, values);
            cell.children.push(child);
        }
    }
}