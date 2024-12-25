<script lang="ts">
import { Ref, ref } from 'vue';
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
        let width = ref(0);
        let height = ref(0);
        let autosize = false;
        let scrollTop = ref(0);
        let scrollLeft = ref(0);
        let rowAreaWidth = ref(0);

        let table: any;
        return {
            pivot,
            table,
            width,
            height,
            autosize,
            scrollTop,
            scrollLeft,
            rowAreaWidth,
        }
    },
    methods: {
        resize: function (width: number, _: number) {
            this.rowAreaWidth = width;
        },
        onScroll: function (e: any) {
            if (e.target != null) {
                this.scrollTop = e.target.scrollTop
                this.scrollLeft = e.target.scrollLeft;
            }
        },
        init: function (options: Ref<PivotOptions>) {
            if (options != null) {
                this.pivot.init(options.value);
                this.autosize = options.value.autosize;
                if (!this.autosize) {
                    this.width = options.value.width.valueOf();
                    this.height = options.value.height.valueOf();
                }
            }
        },
        load: function (data: Array<any>) {
            this.pivot.load(data);
        },
        pageSizeChange: function (size: number) {
            this.pivot.page(1, size);
        },
        pageNumChange: function (num: number) {
            this.pivot.page(num, this.pivot.pageSize);
        }
    },
    props: {
        options: {
            type: PivotOptions
        }
    },
    mounted: function () {
        setTimeout(() => {
            this.table = this.$refs.table;
            new ResizeObserver(() => {
                if (this.autosize) {
                    this.width = this.table.parentElement.offsetWidth;
                    this.height = this.table.parentElement.offsetHeight;
                }
            }).observe(this.table.parentElement);
        })
    }
}


</script>
<template>
    <table ref="table" v-if="pivot.options" class="pivot" :style="{ width: width + 'px', height: height + 'px' }">
        <tr style="height: 30px;">
            <td v-bind:width="rowAreaWidth-2"></td>
            <td style="width:99%" class="holder columns" v-bind:scrollLeft="scrollLeft">
                <ColumnHeaderArea :pivot="pivot" :left="scrollLeft">
                </ColumnHeaderArea>
            </td>
            <td style="width: 200px;padding: 0;" rowspan="2">
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
        <tr v-if="pivot.options.pagination"><td colspan="3" style="padding:3px">
            <el-pagination size="default" layout="total, sizes, prev, pager, next, jumper"
       :page-size="pivot.pageSize" :page-count="pivot.pageCount" :current-page="pivot.pageNumber" :total="pivot.rowHeaders.length"
      @size-change="pageSizeChange"
      @current-change="pageNumChange"
    />
        </td></tr>
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