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
            debugger;
            this.pivot.collapseHeader(header);
        }
    }
}
</script>

<template>
    <table class="pivot-frame">
        <tr class="row" v-for="row in pivot.rowHeaders" :data-id="pivot.isHidden(row)">
            <td class="pivot-cell" v-for="header in row">
                <div v-if="header.value!==null">{{ header.value }}</div>
                <div v-if="header.value===null" v-on:click="collapse(header)">合计</div>
            </td>
        </tr>
    </table>

</template>
<style scoped>
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