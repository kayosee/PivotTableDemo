import { Field } from "../Fields/Field";

export class Header {
    path: Map<string | null, any> | null;
    field: Field | null;
    value: string | number | Date | null;
    index: number | null;
    style: string;
    collapseable: boolean;
    collapsed: boolean;
    rowspan: number;
    colspan: number;
    constructor(path: Map<string | null, any> | null, field: Field | null, value: string | number | Date | null, index: number | null, collapseable: boolean, collapsed: boolean, style: string, rowspan: number, colspan: number) {
        this.path = path;
        this.field = field;
        this.value = value;
        this.index = index;
        this.collapseable = collapseable;
        this.collapsed = collapsed;
        this.style = style;
        this.rowspan = rowspan;
        this.colspan = colspan;
    }
}