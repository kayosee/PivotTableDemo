<script lang="ts">
import { HeaderCell } from "../Pivot/Cells/HeaderCell";
import { Pivot } from "../Pivot/Pivot";
import { Arrays } from "../Pivot/Utils/Arrays";

export default {
    name: "ColumnHeaderArea",
    props: {
        pivot: {
            type: Pivot,
            default: {}
        }
    },
    methods: {
        collapse: function (header: HeaderCell) {
            this.pivot.collapseHeader(header);
        },
        trim: function (row: Array<HeaderCell>, i: number) {
            let size = row.length;
            for (let k = 0; k < size; k++) {
                if (Arrays.firstNull(this.pivot.columnHeaders,(f: HeaderCell[])=>f[k].value) == i)
                    row[k].rowspan = this.getRowspan(k);
                else
                    row[k].rowspan = 1
            }

            let result = [];
            for (let j = 0; j < size; j++) {
                let first = Arrays.firstNull(this.pivot.columnHeaders,(f:HeaderCell[])=>f[j].value);
                if (row[j].value == null && first != null && first < i)
                    continue;

                result.push(row[j])
            }
            return result;
        },
        getRowspan: function (column: number) {
            let first = Arrays.firstNull(this.pivot.columnHeaders,(f: HeaderCell[])=>f[column].value);
            let last = Arrays.lastNull(this.pivot.columnHeaders,(f: HeaderCell[])=>f[column].value);
            if (first == null || last == null)
                return 1;
            return (last - first) + 1;
        },
        getAggregators(): Array<any> {
            let headers = this.pivot.columnHeaders;
            let values = this.pivot.options.values;
            let last = headers[headers.length - 1];
            let result: Array<any> = [];
            for (let i = 0; i < last.length; i++) {
                for (let value of values) {
                    let item: any = {};
                    item.keys = [];
                    for (let j = 0; j < headers.length - 1; j++) {
                        item.keys.push(headers[j][i].value)
                    }
                    item.field = value.name;
                    item.title = value.title;
                    result.push(item);
                }
            }
            return result;
        }
    }
}
</script>
<template>

    <table class="pivot-frame">
        <tr class="row" v-for="(row, i) in pivot.columnHeaders">
            <td class="pivot-cell" v-for="(header, j) in trim(row, i)" :rowspan="header.rowspan">
                <span v-if="header.value !== null">{{ header.value }}</span>
                <span v-if="header.value === null">合计</span>
            </td>
            <td><span class="placeholder"></span></td>
        </tr>
        <tr class="row">
            <td class="pivot-cell" v-for="header in getAggregators()">{{ header.title }}</td>
            <td><span class="placeholder"></span></td>
        </tr>
    </table>

</template>
<style scoped>
.placeholder {
    display: inline-block;
    width: 50px;
}
</style>