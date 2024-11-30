import { Field } from "./Field";
import { DataType } from "../Enums/DataType";
import { SortOrder } from "../Enums/SortOrder";
import { ISortable } from "./ISortable";

export class RowField extends Field implements ISortable {
    sort: SortOrder;
    constructor(name: string, title: string, type: DataType, index: number, style: string|Function|null, format: string|null, formatter: Function|null, sort: string) {
        super(name, title, type, index, style, format, formatter);
        this.style = style;
        if (sort == 'desc')
            this.sort = SortOrder.desc;
        else if (sort == 'asc')
            this.sort = SortOrder.asc;
        else
            this.sort = SortOrder.none;
    }
}
