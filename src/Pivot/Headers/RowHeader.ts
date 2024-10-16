import { Header } from "./Header";

export class RowHeader extends Header {
    children:Array<RowHeader>=[];
    constructor(field: string|null, value: string | number | Date|null, index: number|null){
        super(field,value,index);
    }
}
