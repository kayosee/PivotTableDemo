export class Marshal {
    static clone(obj: any): any {
        return JSON.parse(JSON.stringify(obj));
    }
    static distinct(data: Array<any>, prop: string): Array<any> {
        return data.map(f => f[prop]).filter((value, index, array) => array.indexOf(value) == index);        
    }
}