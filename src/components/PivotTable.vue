<script lang="ts" setup>
import { Comparison } from '../PivotTable/Enums/Comparison.ts';
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

</script>
<template>
    <table class="pivot">
        <thead class="columns">
            <tr v-for="array in pivot.columnHeaders">
                <th v-for="_row in pivot.options.rows"></th>
                <th v-for="header in array">{{ header.value }}</th>
            </tr>
        </thead>

        <tbody>
            <tr v-for="(array, index) in pivot.rowHeaders">
                <td class="row" v-for="header in array">{{ header.value }}</td>
                <td v-for="row in pivot.view[index]">{{ row.value }}</td>
            </tr>
        </tbody>
    </table>
</template>
<style scoped>

.columns {
    position: sticky;
    top: 0;
    /* 首行永远固定在左侧 */
    z-index: 1;
    width: 100%;
    background-color: white;
    overflow: auto;
}

.row {
    z-index: 2;
    background-color: white;
}

.pivot {
    font-size: 12px;
    border-collapse: collapse;
    table-layout: fixed;
    width: 100%;
}

td,th {
    border: 1px solid black;
    width: 50%;
}
</style>