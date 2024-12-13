<script lang="ts">
import { Header } from '../Pivot/Headers/Header';
import { Pivot } from '../Pivot/Pivot';


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
                return 0;
            return this.pivot.options.rows.length - index;
        },
        firstNull: function (row: Array<Header>) {
            let last = row.findIndex(f => f.value == null);
            if (last == -1)
                return row;
            return row.slice(0, last + 1);
        }
    }
}
</script>

<template>
    <table class="pivot-frame">
        <tr class="row" v-for="row in pivot.rowHeaders">
            <td class="pivot-cell" v-for="(header, j) in firstNull(row)" :colspan="getColspan(header, j)" :class="{'hidden':header.hidden}">
                <div v-if="header.value !== null">{{ header.value }}</div>
                <div v-if="header.value === null" v-on:click="collapse(header)">合计</div>
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