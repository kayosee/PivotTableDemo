import { DataType } from "../Enums/DataType";

export class Field {
    name: string;
    title: string;
    type: DataType;
    index: number;
    style: string;
    constructor(name: string, title: string, type: DataType | string, index: number, style: string) {
        this.name = name;
        this.title = title;
        this.index = index;
        this.style = style;
        if (typeof (type) == 'string')
            this.type = type as DataType;
        else
            this.type = type;
    }
}
