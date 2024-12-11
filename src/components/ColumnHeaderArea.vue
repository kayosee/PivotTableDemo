<script lang="ts">
import { Header } from "../Pivot/Headers/Header";
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
        collapse: function (header: Header) {
            this.pivot.collapseHeader(header);
        },
        getColspan: function (header: Header, index: number) {
            if (header.value !== null)
                return 0;
            return this.pivot.options.rows.length - index;
        },
        firstNull:function(row:Array<Header>,index:number){
            for(var i=0;i<this.pivot.collapseHeader.length-1;i++)
                if(this.pivot.collapseHeader[i][index].value==null)
                    break;

            if(i==-1)
                return row;
            return row.slice(0,i+1);
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
        <tr class="row" v-for="(row,i) in pivot.columnHeaders">
            <td :colspan="pivot.options.values.length" class="pivot-cell" v-for="(header,j) in row"  :rowspan="getColspan(header, j)">
                <span v-if="header.value!==null">{{ header.value }}</span>
                <span v-if="header.value===null">合计</span>
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