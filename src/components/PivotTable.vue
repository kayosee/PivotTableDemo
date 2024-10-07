<script lang="ts" setup>
import { Pivot } from '../PivotTable/Pivot.ts';
import { PivotOptions } from '../PivotTable/PivotOptions';
import { data } from '../PivotTable/data';
import PivotRow from './PivotRow.vue';
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
        { name: 'end_worker', title: '工人', type: 'string' }

    ],
    columns: [
        { field: 'pack', style: {} },
        { field: 'stall', style: {} },
    ],
    rows: [
        { field: 'end_worker', style: {} }
    ],
    values: [
        {
            field: 'complete_qty', aggregator: 'sum', style: {}, formatter: function (value: number) {
                if (value > 0)
                    return 'color:red';
                return 'color:black';
            }
        },
        {
            field: 'inferior_qty', aggregator: 'sum', style: {}, formatter: function (value: number) {
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
            field: 'inferior_qty', comparison: 'great', critera: 0
        }
    ]
})

var pivot = new Pivot(options);
pivot.load(data);

</script>
<template>
    <table>
        <tr v-for="cell in pivot.view">
            <PivotRow :cell="cell"></PivotRow>
        </tr>
    </table>
</template>