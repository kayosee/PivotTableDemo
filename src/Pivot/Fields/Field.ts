import moment from "moment";
import { DataType } from "../Enums/DataType";
import { ValueFormat } from "../Enums/ValueFormat";

export class Field {
    name: string;
    title: string;
    type: DataType;
    index: number;
    style: string | Function | null;

    format: ValueFormat | null = null;
    formatter: Function | null = null;
    getStyle(value: any): string {
        if (typeof (this.style) == 'function')
            return this.style(value);
        return this.style ?? '';
    }
    getText(value: any): string {
        if (value == null)
            return '';

        const NA: string = 'N/A';
        if (value == null)
            return '';

        switch (this.format) {
            case ValueFormat.integer:
                if (this.type == DataType.number)
                    return value?.toFixed(0);
                return NA;
            case ValueFormat.money:
                if (this.type == DataType.number)
                    return value?.toFixed(2);
                return NA;
            case ValueFormat.percentage:
                if (this.type == DataType.number)
                    return ((value * 100).toFixed(4)).toString() + '%';
                return NA;
            case ValueFormat.date:
                if ((this.type == DataType.date) && value instanceof Date && !isNaN(value))
                    return moment(value).format('YYYY-MM-DD'); //`${value.getFullYear()}-${value.getMonth() + 1}-${value.getDate()}`;
                return NA;
            case ValueFormat.datetime:
                if ((this.type == DataType.date || this.type == DataType.datetime) && value instanceof Date && !isNaN(value))
                    return moment(value).format('YYYY-MM-DD HH:MM');//`${value.getFullYear()}-${value.getMonth() + 1}-${value.getDate()} ${value.getHours()}:${value.getMinutes()}:${value.getSeconds()}`;
                return NA;
            case ValueFormat.time:
                if ((this.type == DataType.date || this.type == DataType.datetime || this.type == DataType.time) && value instanceof Date && !isNaN(value))
                    return moment(value).format('HH:MM');//`${value.getHours()}:${value.getMinutes()}:${value.getSeconds()}`;
                return NA;
            case ValueFormat.decimal:
                if (this.type == DataType.number)
                    return value;
                return NA;
            case ValueFormat.custom:
                return this.formatter ?? (value);
            default:
                return value;
        }
    }
    constructor(name: string, title: string, type: DataType | string, index: number, style: string | Function | null, format: string | null, formatter: Function | null) {
        this.name = name;
        this.title = title;
        this.index = index;
        this.style = style;

        if (typeof (format) == 'string')
            this.format = format as ValueFormat;
        else
            this.format = format ?? ValueFormat.auto;
        this.formatter = formatter;

        if (typeof (type) == 'string')
            this.type = type as DataType;
        else
            this.type = type;
    }
}
