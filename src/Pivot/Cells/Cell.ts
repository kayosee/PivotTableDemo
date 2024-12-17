export class Cell {
    static seed: number = 1;
    id: number;
    value: string | number | Date | null;
    text: string | null;
    hidden: boolean;
    style: string | null = null;
    path: Map<string | null, string | null> | null;
    constructor(value: string | number | Date | null, text: string | null, path: Map<string | null, string | null> | null) {
        this.id = Cell.seed++;
        this.value = value;
        this.text = text;
        this.hidden = false;
        this.style = "";
        this.path = path;
    }
}