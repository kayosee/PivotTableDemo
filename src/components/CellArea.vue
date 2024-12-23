<script lang="ts">
import { nextTick } from 'vue';
import { Pivot } from '../Pivot/Pivot';
import DrillDownDialog from './dialog/DrillDownDialog.vue';
import { Cell } from '../Pivot/Cells/Cell';

export default {
    components: {
        DrillDownDialog
    },
    name: 'CellArea',
    data: function () {
        let drillDownDialog: any = {};
        return {
            drillDownDialog: drillDownDialog
        }
    },
    props: {
        pivot: {
            type: Pivot,
            default: {}
        }
    },
    methods: {
        drillDown: function (cell: Cell) {
            if (cell.path != null) {
                let data = this.pivot.getDetails(cell.path);
                this.drillDownDialog.open(this.pivot.options.fields, data)
            }
        }
    },
    mounted: function () {
        let me = this;
        nextTick(() => {
            me.drillDownDialog = me.$refs.drillDownDialog;
        })
    }
}
</script>
<template>
    <DrillDownDialog ref="drillDownDialog"></DrillDownDialog>
    <table class="pivot-frame">
        <tr class="row" v-for="row in pivot.cells">
            <td v-on:click="drillDown(cell)" class="pivot-cell" :class="{ 'hidden': cell.hidden }" :style="cell.style"
                v-for="cell in row">{{ cell.text }}</td>
        </tr>
    </table>
</template>

<style scoped>
.hidden {
    display: none
}
</style>