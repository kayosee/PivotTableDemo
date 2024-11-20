import moment from "moment";
import { DataType } from "../Enums/DataType";
import { OrderBy } from "./Order";

export class Sort {
    data: Array<any>;
    orders: Array<OrderBy> = [];
    constructor(data: Array<any>) {
        this.data = data;
    }
    orderBy(field: string, type: DataType, isDescend: boolean): Sort {
        this.orders.push(new OrderBy(field, type, isDescend));
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
                    if ((i.type) == DataType.number) {
                        if (!i.isDescend) {
                            if (isNaN(Number(a[i.field])))
                                result = 1;
                            else if (isNaN(Number(b[i.field])))
                                result - 1;
                            else
                                result = (a[i.field] - (b[i.field]));
                        }
                        else {
                            if (isNaN(Number(a[i.field])))
                                result = -1;
                            else if (isNaN(Number(b[i.field])))
                                result = 1;
                            else
                                result = (b[i.field] - (a[i.field]));
                        }
                    }
                    else if ([DataType.date, DataType.datetime, DataType.time].find(f => f == i.type)) {
                        if (!i.isDescend) {
                            if (!moment(a[i.field]).isValid())
                                result = 1;
                            else if (!moment(b[i.field]).isValid())
                                result = -1;
                            else
                                result = moment(a[i.field]).valueOf() - moment(b[i.field]).valueOf();
                        }
                        else {
                            if (!moment(a[i.field]).isValid())
                                result = -1;
                            else if (!moment(b[i.field]).isValid())
                                result = 1;
                            else
                                result = moment(b[i.field]).valueOf() - moment(a[i.field]).valueOf();
                        }
                    }
                    else //当字符串
                    {
                        if (!i.isDescend)
                            result = (a[i.field].toString().localeCompare(b[i.field].toString(), 'zh-Hans-CN', { sensitivity: 'accent' }));
                        else
                            result = (b[i.field].toString().localeCompare(a[i.field].toString(), 'zh-Hans-CN', { sensitivity: 'accent' }));
                    }
                }

                if (result != 0)
                    break;
            }
            return result;
        })
    }
}