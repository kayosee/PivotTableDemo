import { ColumnField } from "./Fields/ColumnField";
import { Field } from "./Fields/Field";
import { FilterField } from "./Fields/FilterField";
import { FIELD_NOT_EXISTS } from "./locale";
import { RowField } from "./Fields/RowField";
import { ValueField } from "./Fields/ValueField";
import { ShowFieldsPanel } from "./Enums/ShowFieldsPanel";
import { Area } from "./Enums/Area";

export class PivotOptions {
    fields: Field[] = [];
    columns: ColumnField[] = [];
    rows: RowField[] = [];
    values: ValueField[] = [];
    filters: FilterField[] = [];
    width: Number = 1200;
    height: Number = 600;
    nullValue: string = "(空白)";
    showFieldsPanel: ShowFieldsPanel = ShowFieldsPanel.right;
    onPropertyChanged: Function | null = null;
    constructor(options: any) {
        if (options.hasOwnProperty("nullValue"))
            this.nullValue = options["nullValue"];

        if (options.hasOwnProperty("width"))
            this.width = new Number(options["width"]);

        if (options.hasOwnProperty("height"))
            this.height = new Number(options["height"]);

        if (options.hasOwnProperty('showFieldsPanel'))
            this.showFieldsPanel = options.showFieldsPanel;

        for (let i = 0; i < options.fields.length; i++) {
            let field = options.fields[i];
            this.fields.push(
                new Field(field.name, field.title, field.type, i, field.style)
            );
        }

        for (let i = 0; i < options.columns.length; i++) {
            let column = options.columns[i];
            let field = this.fields.find(f => f.name == column.field);
            if (field == null) {
                throw FIELD_NOT_EXISTS;
            }
            this.columns.push(new ColumnField(field.name, field.title, field.type, i, column.style, column.sort));
        }

        for (let i = 0; i < options.rows.length; i++) {
            let row = options.rows[i];
            let field = this.fields.find(f => f.name == row.field);
            if (field == null) {
                throw FIELD_NOT_EXISTS;
            }
            this.rows.push(new RowField(field.name, field.title, field.type, i, row.style, row.sort));
        }

        for (let i = 0; i < options.values.length; i++) {
            let value = options.values[i];
            let field = this.fields.find(f => f.name == value.field);
            if (field == null) {
                throw FIELD_NOT_EXISTS;
            }
            this.values.push(new ValueField(field.name, field.title, field.type, i, value.style, value.aggregator,value.format, value.formatter, value.sort));
        }

        for (let i = 0; i < options.filters.length; i++) {
            let filter = options.filters[i];
            let field = this.fields.find(f => f.name == filter.field);
            if (field == null) {
                throw FIELD_NOT_EXISTS;
            }
            this.filters.push(new FilterField(field.name, field.title, field.type, i, field.style, filter.comparison, filter.critera));
        }
    }

    public moveField(from: Area, to: Area, toIndex: number, field: Field): boolean {
        let toArray: Array<Field> | null = null;
        switch (to) {
            case Area.column:
                toArray = this.columns;
                break;
            case Area.filter:
                toArray = this.filters;
                break;
            case Area.row:
                toArray = this.rows;
                break;
            case Area.value:
                toArray = this.values;
                break;
            case Area.field:
                return this.removeField(from, field);
            default:
                return false;
        }

        let fromArray: Array<Field> | null = null;
        switch (from) {
            case Area.column:
                fromArray = this.columns;
                break;
            case Area.filter:
                fromArray = this.filters;
                break;
            case Area.row:
                fromArray = this.rows;
                break;
            case Area.value:
                fromArray = this.values;
                break;
            case Area.field:
                return this.addField(to, toIndex, field);
            default:
                return false;
        }

        let fromIndex = -1;
        if (fromArray != null) {
            fromIndex = fromArray.findIndex(f => f.name == field.name);
            if (fromIndex < 0)
                return false;
        }

        if (fromArray && toArray) {
            toArray.splice(toIndex, 0, field);
            fromArray.splice(fromIndex, 1);
            if (this.onPropertyChanged != null)
                this.onPropertyChanged();
            return true;
        }
        return false;
    }

    public removeField(from: Area, field: Field): boolean {
        let fromArray: Array<Field> | null = null;
        switch (from) {
            case Area.column:
                fromArray = this.columns;
                break;
            case Area.filter:
                fromArray = this.filters;
                break;
            case Area.row:
                fromArray = this.rows;
                break;
            case Area.value:
                fromArray = this.values;
                break;
            default:
                return false;
        }

        let fromIndex = -1;
        if (fromArray != null) {
            fromIndex = fromArray.findIndex(f => f.name == field.name);
            if (fromIndex >= 0)
                fromArray.splice(fromIndex, 1);
            else
                return false;
        }
        if (this.onPropertyChanged != null)
            this.onPropertyChanged();
        return true;
    }

    public addField(to: Area, pos: number, field: Field): boolean {
        let toArray: Array<Field> | null = null;
        switch (to) {
            case Area.column:
                toArray = this.columns;
                break;
            case Area.filter:
                toArray = this.filters;
                break;
            case Area.row:
                toArray = this.rows;
                break;
            case Area.value:
                toArray = this.values;
                break;
            default:
                return false;
        }

        if (toArray != null) {
            if (pos < 0)
                toArray.splice(0, 0, field)
            else if(pos>toArray.length)
                toArray.push(field);
            else
                toArray.splice(pos, 0, field)
        }
        if (this.onPropertyChanged != null)
            this.onPropertyChanged();
        return true;
    }
}
