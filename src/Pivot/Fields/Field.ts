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
    fraction: number = 2;
    getStyle(value: any): string {
        if (typeof (this.style) == 'function')
            return this.style(value);
        return this.style ?? '';
    }
    getText(value: any): string | null {
        if (value == null)
            return null;

        const NA: string = 'N/A';

        switch (this.format) {
            case ValueFormat.auto:
                switch (this.type) {
                    case DataType.date:
                        if (moment(value).isValid())
                            return moment(value).format('YYYY-MM-DD');
                        return value;
                    case DataType.datetime:
                        if (moment(value).isValid())
                            return moment(value).format('YYYY-MM-DD HH:MM');
                        return value;
                    case DataType.time:
                        if (moment(value).isValid())
                            return moment(value).format('HH:MM');
                        return value;
                    default:
                        return value;
                }
            case ValueFormat.integer:
                if (this.type == DataType.number)
                    return value?.toFixed(0);
                return NA;
            case ValueFormat.money:
                if (this.type == DataType.number)
                    return value?.toFixed(2).replace(/(?!^)(?=(\d{3})+$)/g, ',');
                return NA;
            case ValueFormat.percentage:
                if (this.type == DataType.number)
                    return ((value * 100).toFixed(4)).toString() + '%';
                return NA;
            case ValueFormat.date:
                if (moment(value).isValid())
                    return moment(value).format('YYYY-MM-DD'); //`${value.getFullYear()}-${value.getMonth() + 1}-${value.getDate()}`;
                return NA;
            case ValueFormat.datetime:
                if (moment(value).isValid())
                    return moment(value).format('YYYY-MM-DD HH:MM');//`${value.getFullYear()}-${value.getMonth() + 1}-${value.getDate()} ${value.getHours()}:${value.getMinutes()}:${value.getSeconds()}`;
                return NA;
            case ValueFormat.time:
                if (moment(value).isValid())
                    return moment(value).format('HH:MM');//`${value.getHours()}:${value.getMinutes()}:${value.getSeconds()}`;
                return NA;
            case ValueFormat.decimal:
                if (this.type == DataType.number)
                    return this.fraction ? value.toFixed(this.fraction) : value;
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
