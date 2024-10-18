export class Marshal {
    static clone(obj: any): any {
        return JSON.parse(JSON.stringify(obj));
    }
    
}