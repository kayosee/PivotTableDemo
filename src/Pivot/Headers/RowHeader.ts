import { Header } from "./Header";

export class RowHeader extends Header {
    children:Array<RowHeader>=[];
    constructor(field: string, value: string | number | Date, index: number){
        super(field,value,index);
    }
}
