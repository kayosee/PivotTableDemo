<script lang="ts">
import { ValueField } from "../Pivot/Fields/ValueField";

export default {
    name: "ColumnHeaderArea",
    props: {
        headers: {
            type: Array<Array<any>>,
            default: () => { }
        },
        valueFields: {
            type: Array<ValueField>,
            default: []
        }
    },
    methods: {
        getAggregators(): Array<any> {
            let last = this.headers[this.headers.length - 1];
            let result: Array<any> = [];
            for (let i = 0; i < last.length; i++) {
                for (let value of this.valueFields) {
                    let item: any = {};
                    item.keys = [];
                    for (let j = 0; j < this.headers.length - 1; j++) {
                        item.keys.push(this.headers[j][i])
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
        <tr class="row" v-for="row in headers">
            <td :colspan="valueFields.length" class="pivot-cell" v-for="cell in row">{{ cell }}</td>
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