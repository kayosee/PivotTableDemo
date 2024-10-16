

import { ColumnHeader } from "./Headers/ColumnHeader";
import { DataTable } from "./DataTable";
import { DataType } from "./Enums/DataType";
import { Field } from "./Fields/Field";
import { FilterField } from "./Fields/FilterField";
import { DATA_TYPE_INVALID } from "./locale";
import { PivotOptions } from "./PivotOptions";
import { RowHeader } from "./Headers/RowHeader";
import { ValueCell } from "./Cells/ValueCell";
import { Marshal } from "./Utils/Marshal";
import { Header } from "./Headers/Header";
import { PlainHeader } from "./Headers/PlainHeader";

export class Pivot {
    options: PivotOptions;
    rowHeaders: Array<RowHeader[]> = [];
    columnHeaders: Array<ColumnHeader[]> = [];
    data: Array<any> = [];
    cells: Array<Array<ValueCell>> = [];
    rows: Map<string | null, any> = new Map();
    columns: Map<string | null, any> = new Map();
    constructor(options: PivotOptions) {
        this.options = options;
    }
    load(data: Array<object>) {

        this.data = this.convert(data, this.options.fields);
        let stringFields = this.options.filters.filter(f => this.options.fields.findIndex(s => s.name == f.name && s.type == DataType.String) > 0)

        //this.cells = this.filter(this.data, stringFields);
        //this.cells = this.compute(this.cells);

        this.generateHeaders(this.rows, null, null, this.options.rows.map(f => f.name), this.data);
        this.generateHeaders(this.columns, null, null, this.options.columns.map(f => f.name), this.data);
        console.log(this.rows);
        console.log(this.columns);

        let r:Array<Array<string>>=[];
        let t:Array<Array<any>>=[];
        let s:Array<string>=[];
        let v:Array<string>=[];
        this.gen4(this.rows as Map<string, any>,s,this.options.rows.length,r);
        this.gen5(this.rows as Map<string, any>,v,t);
        console.log(v,t);
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
                            if (Number.isNaN(row[field.name]))
                                row[field.name] = 0;
                            else
                                row[field.name] = new Number(data[i][field.name]).valueOf();                            
                            break;
                        case DataType.String:
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
        let result: Array<any> = Marshal.clone(data);
        for (let i = 0; i < filters.length; i++) {
            let filter = filters[i];
            result = result.filter(f => filter.compare(f));
        }
        return result;
    }
    private compute(data: Array<any>): Array<Array<ValueCell>> {

        let copy: Array<any> = Marshal.clone(data);
        let rowTable: DataTable | null = null;
        for (let x of this.options.rows.map(f => f.name)) {
            if (rowTable == null) {
                rowTable = DataTable.fromArray(copy, x);
            }
            else
                rowTable = rowTable.join(DataTable.fromArray(copy, x))
        }

        if (rowTable != null) {
            for (let row of rowTable.data) {
                let headers = new Array<RowHeader>();
                let i = 0;
                for (let col of rowTable.columns) {
                    headers.push(new RowHeader(col, row[col], i++));
                }
                this.rowHeaders.push(headers);
            }
        }

        let colTable: DataTable | null = null;
        for (let x of this.options.columns.map(f => f.name)) {
            if (colTable == null)
                colTable = DataTable.fromArray(copy, x);
            else
                colTable = colTable.join(DataTable.fromArray(copy, x))
        }

        if (colTable != null) {
            colTable = colTable.rotate();

            let i = 0;
            let keys: Array<string> = [];
            for (let column of this.options.columns) {
                keys.push(column.name);
                let headers = new Array<ColumnHeader>();
                for (let j = 0; j < colTable.columns.length; j++) {
                    let header = new ColumnHeader(column.name, colTable.getByIndex(i, j), j)
                    for (let k = i; k >= 0; k--) {
                        header.keys.set(this.options.columns[k].name, colTable.getByIndex(k, j))
                    }
                    headers.push(header);
                }
                i++;
                this.columnHeaders.push(headers);
            }
        }

        let values: Array<ValueCell[]> = [];
        if (this.options.values.length > 0) {
            for (let row of this.rowHeaders) {
                let valueRow: Array<ValueCell> = [];
                for (let col of this.columnHeaders[this.columnHeaders.length - 1]) {

                    for (let value of this.options.values) {
                        let valueCell = new ValueCell(value, 0, "0", 0, 0);
                        row.forEach(f => {
                            valueCell.rowHeaders.set(f.field, f.value.toString())
                        });
                        valueCell.columnHeaders = col.keys;
                        valueCell.compute(copy);
                        valueRow.push(valueCell);
                    }
                }
                values.push(valueRow);
            }
        }
        return values;
    }

    private generateHeaders(root: Map<string | null, any>, parentField: string | null, parentValue: string | null, fields: Array<string>, array: Array<any>) {
        let header = new PlainHeader(parentField, parentValue, array)
        for (let value of this.options.values) {
            header.values.set(value.name, value.compute(array))
        }
        root.set(null, header);

        if (fields.length == 0 || !root)
            return;

        let field = fields[0];
        array.forEach(f => {
            if (root.get(f[field]))
                return;

            root.set(f[field], new Map());
        });

        for (let key of root.keys()) {
            if (key == null)
                continue;
            this.generateHeaders(root.get(key), field, key, fields.filter((_v, _i) => _i > 0), array.filter(f => f[field] == key.toString()))
        }
    }

    private gen4(data: Map<string, any>, temp: Array<string>, deep: number, result: Array<Array<string | null>>) {
        if (temp.length >= deep) {
            result.push(temp);
            return;
        }

        for (let i of data) {
            if (i[1] instanceof Map) {
                this.gen4(i[1] as Map<string, any>, [...temp, i[0]], deep, result)
            }
        }
    }
    private gen5(data: Map<string, any>, temp: Array<string>, result: Array<Array<any>>) {
        for (let i of data) {
            if (i[0] == null) {
                let header = (i[1] as PlainHeader)
                result.push([...temp, header.values])
            }
            if (i[1] instanceof Map) {
                this.gen5(i[1] as Map<string, any>, [...temp, i[0]], result)
            }
        }
    }
}