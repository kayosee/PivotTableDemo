export class Cell {
    value: string | number | Date | null;
    text: string | null;
    hidden: boolean;
    style: string | null = null;
    path: Map<string | null, string | null>;
    constructor(value: string | number | Date | null, text: string | null) {
        this.value = value;
        this.text = text;
        this.hidden = false;
        this.style = "";
        this.path = new Map();
    }
}