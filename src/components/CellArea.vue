<script lang="ts">
import { ValueCell } from '../Pivot/Cells/ValueCell';
import { Pivot } from '../Pivot/Pivot';
import DrillDownDialog from './dialog/DrillDownDialog.vue';

export default {
    components: {
        DrillDownDialog
    },
    name: 'CellArea',
    props: {
        pivot: {
            type: Pivot,
            default: {}
        }
    },
    methods: {
        drillDown: function (cell: ValueCell) {
            if (cell.path != null) {
                let data = this.pivot.getDetails(cell.path);
                this.$refs.drillDownDialog.open(this.pivot.options.fields, data)
            }
        }
    }
}
</script>
<template>
    <DrillDownDialog ref="drillDownDialog"></DrillDownDialog>
    <table class="pivot-frame">
        <tr class="row" v-for="row in pivot.cells">
            <td v-on:click="drillDown(cell)" class="pivot-cell" :class="{'hidden':cell.hidden}"
                :style="cell.style" v-for="cell in row">{{ cell.text }}</td>
        </tr>
    </table>
</template>

<style scoped>
.hidden {
    display: none
}
</style>