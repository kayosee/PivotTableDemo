<script lang="ts">
import { ref } from 'vue';
import { Pivot } from '../Pivot/Pivot.ts';
import CellArea from './CellArea.vue'
import ColumnHeaderArea from './ColumnHeaderArea.vue';
import RowHeaderArea from './RowHeaderArea.vue';
import FieldsPanel from './FieldsPanel.vue';
import { PivotOptions } from '../Pivot/PivotOptions.ts';
export default {
    name: 'PivotTable',
    
    components: {
        ColumnHeaderArea,
        RowHeaderArea,
        FieldsPanel,
        CellArea,
    },
    data: function () {
        var pivot: Pivot = new Pivot();
        let scrollTop = ref(0);
        let scrollLeft = ref(0);
        let rowAreaWidth = ref(0);

        return {
            pivot,
            scrollTop,
            scrollLeft,
            rowAreaWidth,
        }
    },
    methods: {
        resize: function (width: number, height: number) {
            this.rowAreaWidth = width;
        },
        onScroll: function (e: any) {
            if (e.target != null) {
                this.scrollTop = e.target.scrollTop
                this.scrollLeft = e.target.scrollLeft;
            }
        },
        init: function (options: PivotOptions) {
            this.pivot.init(options);
        },
        load: function (data: Array<any>) {
            this.pivot.load(data);
        }
    },
    props: {
        options: {
            type: PivotOptions
        }
    }
}


</script>
<template>
    <table v-if="pivot.options" class="pivot" :style="{ width: pivot.options.width + 'px', height: pivot.options.height + 'px' }">
        <tr style="height: 30px;">
            <td v-bind:width="rowAreaWidth"></td>
            <td style="width:99%" class="holder columns" v-bind:scrollLeft="scrollLeft">
                <ColumnHeaderArea :pivot="pivot" :left="scrollLeft">
                </ColumnHeaderArea>
            </td>
            <td style="width: 200px;" rowspan="2">
                <FieldsPanel :pivot="pivot"></FieldsPanel>
            </td>
        </tr>
        <tr>
            <td style="padding:0">
                <div style="position: relative;height: 100%;overflow-y: hidden" v-bind:scrollTop="scrollTop">
                    <RowHeaderArea :pivot="pivot" :top="scrollTop" :resize="resize"></RowHeaderArea>
                </div>
            </td>
            <td style="padding: 0">
                <div v-on:scroll="onScroll" style="height:100%;overflow:auto">
                    <CellArea :pivot="pivot"></CellArea>
                </div>
            </td>
        </tr>
    </table>
</template>
<style scoped>
.holder {
    position: relative;
    padding: 0;
}

.columns,
.rows {
    overflow: hidden;
}

.pivot {
    font-size: 12px;
    border-collapse: collapse;
    table-layout: fixed;
}

td,
th {
    border: 1px solid black;
    overflow: auto
}
</style>