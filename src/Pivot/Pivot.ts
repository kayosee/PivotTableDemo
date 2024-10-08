

import { ColumnHeader } from "./Headers/ColumnHeader";
import { DataTable } from "./DataTable";
import { DataType } from "./Enums/DataType";
import { Field } from "./Fields/Field";
import { FilterField } from "./Fields/FilterField";
import { DATA_TYPE_INVALID } from "./locale";
import { PivotOptions } from "./PivotOptions";
import { RowHeader } from "./Headers/RowHeader";
import { ValueCell } from "./Cells/ValueCell";

export class Pivot {
    options: PivotOptions;

    rowHeaders: Array<RowHeader[]> = [];
    columnHeaders: Array<ColumnHeader[]> = [];
    data: Array<any> = [];
    cells: Array<Array<ValueCell>> = [];
    constructor(options: PivotOptions) {
        this.options = options;
    }
    load(data: Array<object>) {

        this.data = this.convert(data, this.options.fields);
        let stringFields = this.options.filters.filter(f => this.options.fields.findIndex(s => s.name == f.name && s.type == DataType.String) > 0)
 
        this.cells = this.filter(this.data, stringFields);
        this.cells = this.compute(this.cells);
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
    private compute(data: Array<any>): Array<Array<ValueCell>> {

        let copy: Array<any> = JSON.parse(JSON.stringify(data));
        let rowTable: DataTable | null = null;
        for (let x of this.options.rows.map(f => f.name)) {
            if (rowTable == null)
                rowTable = this.distinct(copy, x);
            else
                rowTable = rowTable.join(this.distinct(copy, x))
        }

        if (rowTable != null) {
            for (let row of rowTable.data) {
                let headers = new Array<RowHeader>();
                let i = 0;
                for (let col of rowTable.columns) {
                    headers.push(new RowHeader(false, col, row[col], i++, ""));
                }
                this.rowHeaders.push(headers);
            }
        }

        let colTable: DataTable | null = null;
        for (let x of this.options.columns.map(f => f.name)) {
            if (colTable == null)
                colTable = this.distinct(copy, x);
            else
                colTable = colTable.join(this.distinct(copy, x))
        }

        if (colTable != null) {
            colTable = colTable.rotate();

            let i = 0;
            let keys: Array<string> = [];
            for (let column of this.options.columns) {
                keys.push(column.name);
                let headers = new Array<ColumnHeader>();
                for (let j = 0; j < colTable.columns.length; j++) {
                    let header = new ColumnHeader(false, column.name, colTable.getByIndex(i, j), j, "")
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
            for (let row of this.rowHeaders) {let valueRow: Array<ValueCell> = [];
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
                    
                    
                }values.push(valueRow);
            }
        }
        return values;
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
}