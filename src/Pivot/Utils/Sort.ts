import { OrderBy } from "./Order";

export class Sort {
    data: Array<any>;
    orders: Array<OrderBy> = [];
    constructor(data: Array<any>) {
        this.data = data;
    }
    orderBy(field: string, isDescend: boolean): Sort {
        this.orders.push(new OrderBy(field, isDescend));
        return this;
    }
    do() {
        this.data.sort((a, b) => {
            var result: number = 0;
            for (let i of this.orders) {
                if (a[i.field] == null || b[i.field] == null) {
                    if (a[i.field] == null) {
                        if (!i.isDescend)
                            result = -1;
                        else
                            result = 1;
                    }
                    if (b[i.field] == null) {
                        if (!i.isDescend)
                            result = 1;
                        else
                            result = -1;
                    }
                }
                else {
                    if (typeof (a[i.field]) == 'number' && typeof (b[i.field]) == 'number') {
                        if (!i.isDescend)
                            result = (a[i.field] - (b[i.field]));
                        else
                            result = (b[i.field] - (a[i.field]));
                    }
                    else //当字符串
                    {
                        if (!i.isDescend)
                            result = (a[i.field].toString().localeCompare(b[i.field].toString()));
                        else
                            result = (b[i.field].toString().localeCompare(a[i.field].toString()));
                    }
                }

                if (result != 0)
                    break;
            }
            return result;
        })
    }
}