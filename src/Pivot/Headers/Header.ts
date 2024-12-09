import { Field } from "../Fields/Field";

export class Header {
    collapsed: boolean;
    field: Field;
    value: string | number | Date | null;
    index: number | null;
    style: string;
    isTotal: boolean = false;
    constructor(field: Field, value: string | number | Date | null, index: number | null, isTotal: boolean, collapsed: boolean, style: string) {
        this.field = field;
        this.value = value;
        this.index = index;
        this.isTotal = isTotal;
        this.collapsed = collapsed;
        this.style = style;
    }
}