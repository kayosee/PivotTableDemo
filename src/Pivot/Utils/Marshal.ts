export class Marshal {
    static clone(obj: any): any {
        return JSON.parse(JSON.stringify(obj));
    }
    static distinct(data: Array<any>, prop: string): Array<any> {
        return data.map(f => f[prop]).filter((value, index, array) => array.indexOf(value) == index);
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
            Marshal.group(group[i], fields, group[i].children)

    }
}