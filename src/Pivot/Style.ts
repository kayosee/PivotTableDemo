export class Style {
    fontSize: number;
    fontWight: string;
    fontColor: string;
    critera: number | Date | null;
    constructor(fontSize: number, fontWight: string, fontColor: string, critera: number | Date | null) {
        this.fontSize = fontSize;
        this.fontWight = fontWight;
        this.fontColor = fontColor;
        this.critera = critera;
    }
}