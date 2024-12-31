import { Field } from "./Field";
import { DataType } from "../Enums/DataType";
import { SortOrder } from "../Enums/SortOrder";
import { ISortable } from "../ISortable";

export class RowField extends Field implements ISortable {
    sort: SortOrder;
    constructor(name: string, title: string, type: DataType, index: number, style: string | Function | null, format: string | null, formatter: Function | null, fraction: number | null, sort: string) {
        super(name, title, type, index, style, format, formatter, fraction);
        this.style = style;
        if (sort == 'desc')
            this.sort = SortOrder.desc;
        else
            this.sort = SortOrder.asc;
    }
    static clone(source:any): RowField {
        return new RowField(source.name, source.title, source.type, source.index, source.style, source.format, source.formatter, source.fraction, source.sort);
    }
}
