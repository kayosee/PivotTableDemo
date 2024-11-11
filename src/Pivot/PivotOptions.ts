import { ColumnField } from "./Fields/ColumnField";
import { Field } from "./Fields/Field";
import { FilterField } from "./Fields/FilterField";
import { FIELD_NOT_EXISTS } from "./locale";
import { RowField } from "./Fields/RowField";
import { ValueField } from "./Fields/ValueField";
import { ShowFieldsPanel } from "./Enums/ShowFieldsPanel";

export class PivotOptions {
    fields: Field[] = [];
    columns: ColumnField[] = [];
    rows: RowField[] = [];
    values: ValueField[] = [];
    filters: FilterField[] = [];
    width: Number = 800;
    height: Number = 400;
    nullValue: string = "(空白)";
    showFieldsPanel:ShowFieldsPanel=ShowFieldsPanel.right;
    constructor(options: any) {
        if (options.hasOwnProperty("nullValue"))
            this.nullValue = options["nullValue"];

        if (options.hasOwnProperty("width"))
            this.width = new Number(options["width"]);

        if (options.hasOwnProperty("height"))
            this.height = new Number(options["height"]);

        if(options.hasOwnProperty('showFieldsPanel'))
            this.showFieldsPanel=options.showFieldsPanel;
        
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
            this.values.push(new ValueField(field.name, field.title, field.type, i, value.style, value.aggregator, value.formatter));
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
}
