<script lang="ts">
import { Area } from "../Pivot/Enums/Area";
import { Header } from "../Pivot/Header";
import { Pivot } from "../Pivot/Pivot";

export default {
    name: "ColumnHeaderArea",
    props: {
        pivot: {
            type: Pivot,
            default: {}
        }
    },
    methods: {
        collapse: function (header: Header) {
            this.pivot.collapse(header, Area.column);
        },
        getAggregators(): Array<any> {
            let headers = this.pivot.columnHeaders.filter(f=>!f.hidden);
            let values = this.pivot.options.values;
            let result: Array<any> = [];
            for (let i = 0; i < headers.length; i++) {
                for (let value of values) {
                    let item: any = {};
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
        <tr>
            <td class="pivot-cell header-row" v-for="(header) in pivot.columnHeaders" :class="{'hidden':header.hidden}" >
                <div class="pivot-cell header" v-for="(cell, j) in header.trim()"  :class="{'hidden':cell.hidden,'even':j!=0}" v-bind:style="{height:100/header.trim().length+'%'}" >
                    <span v-if="cell.value !== null">{{ cell.value }}</span>
                    <span v-if="cell.value === null" v-on:click="collapse(header)">合计</span>
                </div>
            </td>
            <td><span class="placeholder"></span></td>
        </tr>
        <tr class="row">
            <td class="pivot-cell" v-for="(value) in getAggregators()">
                    {{ value.title}}
            </td>
            <td><span class="placeholder"></span></td>
        </tr> 

    </table>

</template>
<style scoped>
.placeholder {
    display: inline-block;
    width: 50px;
}
.header,.value{
    border: none;
    display: flex;
    justify-content: center;
    align-items: center;
}
.header-row .even{
    border-top: 1px solid;
}
.hidden{
    display: none;
}
</style>