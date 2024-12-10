import { DataType } from "../Enums/DataType";

export class OrderBy {
    field: string|Function;
    type: DataType;
    isDescend: boolean;
    constructor(field: string|Function, type: DataType, isDescend: boolean) {
        this.field = field;
        this.type = type;
        this.isDescend = isDescend;
    }
}