<script lang="ts">
import { ValueCell } from '../Pivot/Cells/ValueCell';
import { PivotOptions } from '../Pivot/PivotOptions';
import DrillDownDialog from './dialog/DrillDownDialog.vue';

export default {
    components:{
        DrillDownDialog
    },
    name: 'CellArea',
    props: {
        cells: {
            type: Array<Array<ValueCell>>,
            default: []
        },
        options:{
            type:PivotOptions,
            default:{}
        }
    },
    methods: {
        getPath(cell: ValueCell) {
            return [...cell.rowHeaders.values(), ...cell.columnHeaders.values()].join('.');
        },
        drillDown:function(cell:ValueCell){
            this.$refs.drillDownDialog.open(this.options.fields,cell.data)
        }
    }
}
</script>
<template>
    <DrillDownDialog ref="drillDownDialog"></DrillDownDialog>
    <table class="pivot-frame">
        <tr class="row" v-for="row in cells">
            <td v-on:click="drillDown(cell)" class="pivot-cell" :style="cell.style" v-for="cell in row" :data-path="getPath(cell)">{{ cell.text }}</td>
        </tr>
    </table>
</template>

<style scoped>
.pivot-frame {}
</style>