export class Header {
    collapsed: boolean;
    field: string|null;
    value: string | number | Date|null;
    index: number|null;
    style: string;
    isTotal: boolean = false;
    constructor(field: string|null, value: string | number | Date|null, index: number|null) {
        this.collapsed = false;
        this.field = field;
        this.value = value;
        this.index = index;
        this.style = "";
    }
}