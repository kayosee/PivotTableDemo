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
            this.$refs.drillDownDialog.open(this.pivot.options.fields, cell.data)
        }
    }
}
</script>
<template>
    <DrillDownDialog ref="drillDownDialog"></DrillDownDialog>
    <table class="pivot-frame">
        <tr class="row" v-for="row in pivot.cells" :class="pivot.isHidden(row) ? 'hidden' : ''">
            <td v-on:click="drillDown(cell)" class="pivot-cell"
                :style="cell.style" v-for="cell in row">{{ cell.text }}</td>
        </tr>
    </table>
</template>

<style scoped>
.hidden {
    display: none
}
</style>