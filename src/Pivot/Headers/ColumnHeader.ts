import { Header } from "./Header";

export class ColumnHeader extends Header {
    keys: Map<string, string>;
    constructor(field: string, value: string | number | Date, index: number) {
        super(field, value, index);
        this.keys = new Map<string, string>();
    }
}
