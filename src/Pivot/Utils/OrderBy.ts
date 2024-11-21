import { DataType } from "../Enums/DataType";

export class OrderBy {
    field: string;
    type: DataType;
    isDescend: boolean;
    constructor(field: string, type: DataType, isDescend: boolean) {
        this.field = field;
        this.type = type;
        this.isDescend = isDescend;
    }
}