<script lang="ts" setup>
import { ref } from 'vue';
import { Pivot } from '../Pivot/Pivot.ts';
import { PivotOptions } from '../Pivot/PivotOptions';
import { data } from '../Pivot/data';
import CellArea from './CellArea.vue'
import ColumnHeaderArea from './ColumnHeaderArea.vue';
import RowHeaderArea from './RowHeaderArea.vue';
var options = new PivotOptions({
    canvas: 'cc',
    fields: [
        { name: 'item_code', title: '代码', type: 'string' },
        { name: 'item_name', title: '名称', type: 'string' },
        { name: 'complete_qty', title: '完成数量', type: 'number' },
        { name: 'inferior_qty', title: '次品数量', type: 'number' },
        { name: 'stall', title: '精度', type: 'string' },
        { name: 'pack', title: '包装', type: 'string' },
        { name: 'status', title: '状态', type: 'string' },
        { name: 'end_worker', title: '工人', type: 'string' },
        { name: 'route', title: '工艺路线', type: 'string' }
    ],
    columns: [
        { field: 'pack', style: {} },
        { field: 'stall', style: {} },
    ],
    rows: [
        { field: 'route', style: {} },    
        { field: 'end_worker', style: {} },        
    ],
    values: [
        {
            field: 'complete_qty', aggregator: 'sum', style: {}, formatter: function (value: number) {
                if (value > 0)
                    return 'color:red';
                return 'color:black';
            }
        }
    ],
    filters: [
        {
            field: 'status', comparison: 'equals', critera: '已完工'
        },
        {
            field: 'pack', comparison: 'in', critera: ['T0', 'T8']
        }
    ]
})

var pivot = new Pivot(options);
pivot.load(data);

let scrollTop = ref(0);
let scrollLeft = ref(0);
let onScroll = function (e: any) {
    if (e.target != null) {
        scrollTop.value = e.target.scrollTop
        scrollLeft.value = e.target.scrollLeft;
    }
}
</script>
<template>
    <table class="pivot" :style="{ width: options.width + 'px', height: options.height + 'px' }">
        <tr style="height: 30px;">
            <td></td>
            <td style="width:70%" class="holder columns" v-bind:scrollLeft="scrollLeft">
                <ColumnHeaderArea :headers="pivot.columnHeaders" :left="scrollLeft"></ColumnHeaderArea>
            </td>
        </tr>
        <tr>
            <td style="padding:0">
                <div style="position: relative;height: 100%;overflow-y: hidden" v-bind:scrollTop="scrollTop"><RowHeaderArea :headers="pivot.rowHeaders" :top="scrollTop"></RowHeaderArea></div>                
            </td>
            <td style="padding: 0">
                <div v-on:scroll="onScroll" style="height:100%;overflow:auto"><CellArea :cells="pivot.cells"></CellArea></div>
            </td>
        </tr>
    </table>

</template>
<style scoped>

.holder{
    position: relative;
    padding: 0;
}
.columns,.rows{
    overflow: hidden;
}
.pivot {
    font-size: 12px;
    border-collapse: collapse;
    table-layout: fixed;
}

td,th {
    border: 1px solid black;
    overflow: auto
}
</style>