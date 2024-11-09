export class OrderBy{
    field:string;
    isDescend:boolean;
    constructor(field:string,isDescend:boolean){
        this.field=field;
        this.isDescend=isDescend;
    }
}