<script lang="ts">
import { Area } from "../Pivot/Enums/Area";
import { Header } from "../Pivot/Header";
import { Pivot } from "../Pivot/Pivot";

export default {
    name: "ColumnHeaderArea",
    props: {
        pivot: {
            type: Pivot,
            default: new Pivot()
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
            <td class="pivot-cell header-row" v-for="(header) in pivot.columnHeaders" :key="header.id" :class="{'hidden':header.hidden}" >
                <div class="pivot-cell header" v-for="(cell, j) in header.trim()" :key="cell.id"  :class="{'hidden':cell.hidden,'even':j!=0,'unwindable':!header.collapseable()}" v-bind:style="{height:100/header.trim().length+'%'}" >
                    <span v-if="cell.value !== null">{{ cell.value }}</span>
                    <div class="total" v-if="cell.value === null" v-on:click="collapse(header)">
                        <span>合计</span>
                        <svg v-if="!header.collapsed" t="1734919220506" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2336" width="200" height="200"><path d="M972.8 998.4H51.2a25.6 25.6 0 0 1-25.6-25.6V51.2A25.6 25.6 0 0 1 51.2 25.6h921.6a25.6 25.6 0 0 1 25.6 25.6v921.6a25.6 25.6 0 0 1-25.6 25.6z m-896-51.2h870.4V76.8H76.8v870.4z" p-id="2337"></path><path d="M870.4 537.6H153.6a25.6 25.6 0 1 1 0-51.2h716.8a25.6 25.6 0 1 1 0 51.2z" p-id="2338"></path></svg>
                        <svg v-if="header.collapsed" t="1734919298496" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2609" width="200" height="200"><path d="M972.8 25.6H51.2a25.6 25.6 0 0 0-25.6 25.6v921.6a25.6 25.6 0 0 0 25.6 25.6h921.6a25.6 25.6 0 0 0 25.6-25.6V51.2a25.6 25.6 0 0 0-25.6-25.6z m-25.6 921.6H76.8V76.8h870.4v870.4z" p-id="2610"></path><path d="M153.6 537.6h332.8v332.8a25.6 25.6 0 1 0 51.2 0V537.6h332.8a25.6 25.6 0 1 0 0-51.2H537.6V153.6a25.6 25.6 0 1 0-51.2 0v332.8H153.6a25.6 25.6 0 1 0 0 51.2z" p-id="2611"></path></svg>
                    </div>
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