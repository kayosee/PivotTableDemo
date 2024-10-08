import { FIELD_NOT_EXISTS, OUT_OF_RANGE } from './locale';
export class DataTable {
    columns: Array<string>;
    data: Array<any>;
    constructor(...columns: Array<string>) {
        this.columns = columns;
        this.data = [];
    }
    add(...rows: Array<any>) {
        for (let row of rows) {
            let temp: any = {};
            for (let column of this.columns) {
                if (row.hasOwnProperty(column)) {
                    temp[column] = row[column];
                }
            }
            this.data.push(temp);
        }
    }
    getByName(row: number, field: string) {
        return this.data[row][field];
    }
    getByIndex(row:number,col:number){
        return this.data[row][this.columns[col]];
    }
    set(row: number, field: string, value: any) {
        if (row >= this.data.length)
            throw new Error(OUT_OF_RANGE);

        if (this.columns.find(f => f == field) != null)
            this.data[row][field] = value;
        else
            throw new Error(FIELD_NOT_EXISTS);
    }
    join(table: DataTable): DataTable {
        let columns: Array<string> = JSON.parse(JSON.stringify(this.columns));
        for (let col of table.columns) {
            if (columns.find(f => f == col))
                continue;

            columns.push(col);
        }

        let temp = new DataTable(...columns);

        for (let i = 0; i <= this.data.length; i++) {
            for (let j = 0; j <= table.data.length; j++) {
                let row:any = {};
                for (let r1 of this.columns) {
                    for (let r2 of table.columns) {
                        row[r1] = this.data[i]?.[r1]??'';
                        row[r2] = table.data[j]?.[r2]??'';
                    }
                }
                temp.add(row);
            }
        }

        return temp;
    }

    rotate(): DataTable {
        let cols = this.data.map((_value, index) => index.toString());
        let temp = new DataTable(...cols);
        for (let i = 0; i < this.columns.length; i++) {
            let composite: any = {};
            for (let j = 0; j < this.data.length; j++) {                
                composite[j] = this.getByIndex(j, i);
            }
            temp.add(composite);
        }
        return temp;
    }
}