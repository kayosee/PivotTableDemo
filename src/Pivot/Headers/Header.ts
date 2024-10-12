export class Header {
    collapsed: boolean;
    field: string;
    value: string | number | Date;
    index: number;
    style: string;
    isTotal: boolean = false;
    constructor(field: string, value: string | number | Date, index: number) {
        this.collapsed = false;
        this.field = field;
        this.value = value;
        this.index = index;
        this.style = "";
    }
}