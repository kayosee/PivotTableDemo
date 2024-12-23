<script lang="ts">
import { HeaderCell } from '../Pivot/Cells/HeaderCell';
import { Area } from '../Pivot/Enums/Area';
import { Header } from '../Pivot/Header';
import { Pivot } from '../Pivot/Pivot';
import { Arrays } from '../Pivot/Utils/Arrays';


export default {
    name: 'RowHeaderArea',
    props: {
        rowTable: null,
        pivot: {
            type: Pivot,
            default: {}
        },
        headers: {
            type: Array<Array<HeaderCell>>,
            default: []
        },
        resize: {
            type: Function,
            default:()=>{}
        }
    },
    methods: {
        collapse: function (header: Header) {
            this.pivot.collapse(header, Area.row);
        },
        trim: function (row: Array<HeaderCell>) {
            let first = Arrays.firstNull(row, (f: HeaderCell) => f.value);
            let last = Arrays.lastNull(row, (f: HeaderCell) => f.value);
            if (first == null || last != row.length - 1)
                return row;
            return row.slice(0, first + 1);
        }
    },
    mounted: function () {
        let me = this;
        this.$nextTick(() => {
            let ele: any = this.$refs.table;
            new ResizeObserver(() => me.resize(ele.offsetWidth, ele.offsetHeight)).observe(ele);
        })

    }
}
</script>

<template>
    <table ref="table" class="pivot-frame">
        <tr class="row" v-for="(header) in pivot.rowHeaders" :key="header.id" :class="{'unwindable':!header.collapseable()}">
            <td class="pivot-cell" v-for="(cell) in header.trim()" :key="cell.id" :colspan="cell.rowspan"
                :class="{ 'hidden': cell.hidden }">
                <div v-if="cell.value !== null">{{ cell.value }}</div>
                <div class="total" v-if="cell.value === null" v-on:click="collapse(header)">
                    <span>合计</span>
                    <svg v-if="!header.collapsed" t="1734919220506" class="icon" viewBox="0 0 1024 1024" version="1.1"
                        xmlns="http://www.w3.org/2000/svg" p-id="2336" width="200" height="200">
                        <path
                            d="M972.8 998.4H51.2a25.6 25.6 0 0 1-25.6-25.6V51.2A25.6 25.6 0 0 1 51.2 25.6h921.6a25.6 25.6 0 0 1 25.6 25.6v921.6a25.6 25.6 0 0 1-25.6 25.6z m-896-51.2h870.4V76.8H76.8v870.4z"
                            p-id="2337"></path>
                        <path d="M870.4 537.6H153.6a25.6 25.6 0 1 1 0-51.2h716.8a25.6 25.6 0 1 1 0 51.2z" p-id="2338">
                        </path>
                    </svg>
                    <svg v-if="header.collapsed" t="1734919298496" class="icon" viewBox="0 0 1024 1024" version="1.1"
                        xmlns="http://www.w3.org/2000/svg" p-id="2609" width="200" height="200">
                        <path
                            d="M972.8 25.6H51.2a25.6 25.6 0 0 0-25.6 25.6v921.6a25.6 25.6 0 0 0 25.6 25.6h921.6a25.6 25.6 0 0 0 25.6-25.6V51.2a25.6 25.6 0 0 0-25.6-25.6z m-25.6 921.6H76.8V76.8h870.4v870.4z"
                            p-id="2610"></path>
                        <path
                            d="M153.6 537.6h332.8v332.8a25.6 25.6 0 1 0 51.2 0V537.6h332.8a25.6 25.6 0 1 0 0-51.2H537.6V153.6a25.6 25.6 0 1 0-51.2 0v332.8H153.6a25.6 25.6 0 1 0 0 51.2z"
                            p-id="2611"></path>
                    </svg>
                </div>
            </td>
        </tr>
        <tr class="row">
            <td :rowspan="pivot.options.rows.length"><br /></td>
        </tr>
    </table>

</template>
<style scoped>
.hidden {
    display: none;
}

.pivot-cell {
    white-space: nowrap;
}

.pivot-frame {
    position: absolute;
    left: 0;
    top: 0;
}

.placeholder {
    display: inline-block;
    width: 50px;
    ;
}
</style>