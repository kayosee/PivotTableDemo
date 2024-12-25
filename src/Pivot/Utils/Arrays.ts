export class Arrays {
    static distinct(data: Array<any>, prop: string): Array<any> {
        return data.map(f => f[prop]).filter((value, index, array) => array.indexOf(value) == index);
    }
    static distinctAll(data: Array<any>): Array<any> {
        let newArr = [];
        let obj: any = {};
        for (let i = 0; i < data.length; i++) {
            if (!obj[JSON.stringify(data[i])]) {
                newArr.push(data[i]);
                obj[JSON.stringify(data[i])] = true;
            }
        }
        return newArr;
    }

    static group(fields: Array<string>, data: Array<any>, result: any) {
        if (fields.length == 0 || result == null)
            return;

        let field = fields.splice(0, 1)[0];
        let group = data.reduce((s, t) => {
            let tmp = {
                key: t[field],
                children: data.filter(f => f[field] == t[field])
            };
            if (s == null || s == undefined)
                debugger; s.push(tmp);
            return s;
        }, []);

        result[field] = group;
        for (let i = 0; i < group.length; i++)
            Arrays.group(group[i], fields, group[i].children)

    }
    static rotate(data: Array<Array<any>>) {
        let deep = data.length;
        let width = data[0].length;
        let temp = new Array<Array<any>>;
        for (let i = 0; i < width; i++) {
            let row: Array<any> = new Array(deep);
            for (let j = 0; j < deep; j++) {
                row[j] = data[j][i];
            }
            temp.push(row);
        }
        return temp;
    }
    static firstNull(array: Array<any>, getter: Function): null | number {
        for (let i = 0; i < array.length; i++) {
            if (getter(array[i]) === null)
                return i;
        }
        return null;
    }
    static lastNull(array: Array<any>, getter: Function): null | number {
        let j = Arrays.firstNull(array, getter);
        if (j == null)
            return null;

        let i = j;
        let k = j;
        while (i < array.length && getter(array[i]) == null) {
            k = i;
            i++;
        }
        return k;
    }
    static getSpan(array: Array<any>, getter: Function) {
        let first = Arrays.firstNull(array, getter);
        let last = Arrays.lastNull(array, getter);
        if (first == null || last == null)
            return 1;
        return (last - first) + 1;
    }

    static paginate(array: Array<any>, pageSize: number, pageNumber: number) {
        // human-readable page numbers usually start with 1, so we reduce 1 in the first argument
        return array.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);
    }
}