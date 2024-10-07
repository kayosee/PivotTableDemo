export class Header{
    collapsed: boolean;
    field: string;
    value: string | number | Date;
    index: number;
    style:string;
    constructor(collapsed: boolean, field: string, value: string | number | Date, index: number,style:string) {
        this.collapsed = collapsed;
        this.field = field;
        this.value = value;
        this.index = index;
        this.style=style;
    }
}