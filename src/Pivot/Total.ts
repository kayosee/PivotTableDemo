export class Total {
    fieldName: string|null;
    fieldValue: string | null;
    data: Array<any>;
    values: Map<string, number> = new Map<string, number>;

    constructor(fieldName: string|null, fieldValue: string | null, data: Array<any>) {
        this.fieldName = fieldName;
        this.fieldValue = fieldValue;
        this.data = data;
    }
}