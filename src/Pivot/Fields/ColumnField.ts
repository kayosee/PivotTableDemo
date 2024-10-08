import { Field } from "./Field";
import { DataType } from "../Enums/DataType";
import { SortOrder } from "../Enums/SortOrder";

export class ColumnField extends Field {
    sort: SortOrder;
    constructor(name: string, title: string, type: DataType, index: number, style: string, sort: string) {
        super(name, title, type, index, style);

        this.style = style;
        this.sort = sort as SortOrder;
    }
}
