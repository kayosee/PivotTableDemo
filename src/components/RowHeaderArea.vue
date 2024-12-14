<script lang="ts">
import { Header } from '../Pivot/Headers/Header';
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
            type: Array<Array<Header>>,
            default: []
        }
    },
    methods: {
        collapse: function (header: Header) {
            this.pivot.collapseHeader(header);
        },
        getColspan: function (header: Header, index: number) {
            if (header.value !== null)
                return 1;
            return this.pivot.options.rows.length - index;
        },
        trim: function (row: Array<Header>) {
            let first = Arrays.firstNull(row, (f: Header) => f.value);
            let last = Arrays.lastNull(row, (f: Header) => f.value);
            if (first == null || last != row.length - 1)
                return row;
            return row.slice(0, first + 1);
        }
    }
}
</script>

<template>
    <table class="pivot-frame">
        <tr class="row" v-for="(row,i) in pivot.rowHeaders">
            <td class="pivot-cell" v-for="(header, j) in trim(row)" :colspan="getColspan(header,j)" :class="{'hidden':header.hidden}">
                <div v-if="header.value !== null">{{ header.value }}</div>
                <div v-if="header.value === null&&header.collapseable" v-on:click="collapse(header)">合计</div>
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