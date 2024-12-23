<script setup lang="ts">
import { onMounted, ref } from 'vue';
import PivotTable from './components/PivotTable.vue';
import { PivotOptions } from './Pivot/PivotOptions';

import { data } from './Pivot/data';
let pivotTable: any = ref(null);
let options = ref(new PivotOptions({
  height: 500,
  width: 1200,
  showFieldsPanel: 'right',
  fields: [
    { name: 'item_code', title: '代码', type: 'string' },
    { name: 'item_name', title: '名称', type: 'string' },
    { name: 'plan_task_no', title: '生产任务号', type: 'string' },
    { name: 'product_task', title: '工单号', type: 'string' },
    { name: 'task_no', title: '批次号', type: 'string' },
    { name: 'plan_qty', title: '计划数量', type: 'number' },
    { name: 'complete_qty', title: '完成数量', type: 'number' },
    { name: 'inferior_qty', title: '次品数量', type: 'number' },
    { name: 'stall', title: '精度', type: 'string' },
    { name: 'pack', title: '包装', type: 'string' },
    { name: 'status', title: '状态', type: 'string' },
    { name: 'end_worker', title: '工人', type: 'string' },
    { name: 'route', title: '工艺路线', type: 'string' },
    { name: 'start_time', title: '开工时间', type: 'date', format: 'date' },
    { name: 'end_time', title: '报工时间', type: 'date', format: 'date' },

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
      field: 'complete_qty', aggregator: 'sum', style: function (value: number) {
        if (value > 5000)
          return 'color:red;font-weight:bold';
        return 'color:black';
      }, format: 'decimal'
    }
  ],
  filters: [
    {
      field: 'status', comparison: 'equals', critera: '已完工'
    },
    {
      field: 'start_time', comparison: 'greater', critera: '2021-01-02'
    }
  ]
}));

onMounted(() => {

  pivotTable.value.init(options);
  pivotTable.value.load(data);
})
</script>

<template>
  <PivotTable ref="pivotTable"></PivotTable>
</template>

<style scoped></style>
