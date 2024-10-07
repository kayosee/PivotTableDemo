import { Header } from "./Header";

export class ColumnHeader extends Header {
    constructor(collapsed: boolean, field: string, value: string | number | Date, index: number,style:string){
        super(collapsed,field,value,index,style);
    }
}
