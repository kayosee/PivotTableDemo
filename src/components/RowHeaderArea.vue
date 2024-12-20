<script lang="ts">
import { HeaderCell } from '../Pivot/Cells/HeaderCell';
import { Area } from '../Pivot/Enums/Area';
import { Header } from '../Pivot/Header';
import { Pivot } from '../Pivot/Pivot';
import { Arrays } from '../Pivot/Utils/Arrays';


export default {
    name: 'RowHeaderArea',
    props: {
        pivot: {
            type: Pivot,
            default: {}
        },
        headers: {
            type: Array<Array<HeaderCell>>,
            default: []
        }
    },
    methods: {
        collapse: function (header: Header) {
            this.pivot.collapse(header,Area.row);
        },
        getColspan: function (header: Header, index: number) {
            if (header.value !== null)
                return 1;
            return this.pivot.options.rows.length - index;
        },
        trim: function (row: Array<HeaderCell>) {
            let first = Arrays.firstNull(row, (f: HeaderCell) => f.value);
            let last = Arrays.lastNull(row, (f: HeaderCell) => f.value);
            if (first == null || last != row.length - 1)
                return row;
            return row.slice(0, first + 1);
        }
    }
}
</script>

<template>
    <table class="pivot-frame">
        <tr class="row" v-for="(header,i) in pivot.rowHeaders">
            <td class="pivot-cell" v-for="(cell, j) in header.trim()" :colspan="cell.colspan" :class="{'hidden':cell.hidden}">
                <div v-if="cell.value !== null">{{ cell.value }}</div>
                <div v-if="cell.value === null" v-on:click="collapse(header)">合计</div>
            </td>
        </tr>
    </table>

</template>
<style scoped>
.hidden{
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