<script lang="ts">
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
        let table: any;
        let overflowX: boolean = false;
        let overflowY: boolean = false;
        return {
            table,
            overflowX,
            overflowY,
            drillDownDialog: drillDownDialog
        }
    },
    props: {
        pivot: {
            type: Object,
            default: new Pivot()
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
        setTimeout(() => {
            me.table = this.$refs.table;
            new ResizeObserver(() => {
                if (me.table && me.table.parentElement) {
                    let parentWidth = me.table.parentElement.offsetWidth;
                    let parentHeight = me.table.parentElement.offsetHeight;
                    me.overflowX = me.table.offsetWidth > parentWidth;
                    me.overflowY = me.table.offsetHeight > parentHeight;
                }
            }).observe(me.table);
            me.drillDownDialog = this.$refs.drillDownDialog;
        }, 1)
    }
}
</script>
<template>
    <DrillDownDialog ref="drillDownDialog"></DrillDownDialog>
    <table ref="table" class="pivot-frame" :class="{ 'border-right': !overflowX, 'border-bottom': !overflowY }">
        <tr class="row" v-for="row in pivot.cells">
            <td v-on:click="drillDown(cell)" class="pivot-cell" :class="{ 'hidden': cell.hidden }" :style="cell.style"
                v-for="cell in row">{{ cell.text }}</td>
        </tr>
    </table>
</template>

<style scoped>
.pivot-cell{
    background-color: #fff;
}
.hidden {
    display: none
}

.border-right {
    border-right: 1px solid lightgray;
}

.border-bottom {
    border-bottom: 1px solid lightgray;
}
</style>