import moment from "moment";
import { DataType } from "../Enums/DataType";
import { OrderBy } from "./OrderBy";

export class Sort {
    data: Array<any>;
    orders: Array<OrderBy> = [];
    constructor(data: Array<any>) {
        this.data = data;
    }
    orderBy(field: string | Function, type: DataType, isDescend: boolean): Sort {
        this.orders.push(new OrderBy(field, type, isDescend));
        return this;
    }
    do() {
        this.data.sort((a, b) => {
            var result: number = 0;
            for (let i of this.orders) {
                let left: any = null;
                let right: any = null;
                if (typeof (i.field) == 'function') {
                    left = i.field(a);
                    right = i.field(b)
                }
                else {
                    left = a[i.field];
                    right = b[i.field];
                }
                if (left == null || right == null) {
                    if (left == null) {
                        if (!i.isDescend)
                            result = -1;
                        else
                            result = 1;
                    }
                    if (right == null) {
                        if (!i.isDescend)
                            result = 1;
                        else
                            result = -1;
                    }
                }
                else {
                    if ((i.type) == DataType.number) {
                        if (!i.isDescend) {
                            if (isNaN(Number(left)))
                                result = 1;
                            else if (isNaN(Number(right)))
                                result - 1;
                            else
                                result = (left - (right));
                        }
                        else {
                            if (isNaN(Number(left)))
                                result = -1;
                            else if (isNaN(Number(right)))
                                result = 1;
                            else
                                result = (right - (left));
                        }
                    }
                    else if ([DataType.date, DataType.datetime, DataType.time].find(f => f == i.type)) {
                        if (!i.isDescend) {
                            if (!moment(left).isValid())
                                result = 1;
                            else if (!moment(right).isValid())
                                result = -1;
                            else
                                result = moment(left).valueOf() - moment(right).valueOf();
                        }
                        else {
                            if (!moment(left).isValid())
                                result = -1;
                            else if (!moment(right).isValid())
                                result = 1;
                            else
                                result = moment(right).valueOf() - moment(left).valueOf();
                        }
                    }
                    else //当字符串
                    {
                        if (!i.isDescend)
                            result = (left.toString().localeCompare(right.toString(), 'zh-Hans-CN', { sensitivity: 'accent' }));
                        else
                            result = (right.toString().localeCompare(left.toString(), 'zh-Hans-CN', { sensitivity: 'accent' }));
                    }
                }
                if (result != 0)
                    break;
            }
            return result;
        })
    }
}