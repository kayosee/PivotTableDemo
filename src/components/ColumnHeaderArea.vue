<script lang="ts">
import { Pivot } from "../Pivot/Pivot";

export default {
    name: "ColumnHeaderArea",
    props: {
        pivot:{
            type:Pivot,
            default:{}
        }
    },
    methods: {
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
        <tr class="row" v-for="row in pivot.columnHeaders">
            <td :colspan="pivot.options.values.length" class="pivot-cell" v-for="cell in row">{{ cell.value }}</td>
            <td><span class="placeholder"></span></td>
        </tr>
        <tr class="row">
            <td class="pivot-cell" v-for="cell in getAggregators()">{{ cell.title }}</td>
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