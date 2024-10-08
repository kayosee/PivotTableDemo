export class Cell {
    checked: boolean;
    text: string;
    style: string;
    field: string;
    constructor(field: string, text: string, style: string, checked: boolean) {
        this.checked = checked;
        this.text = text;
        this.style = style;
        this.field = field;
    }
}
