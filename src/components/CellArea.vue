<script lang="ts">
import { ValueCell } from '../Pivot/Cells/ValueCell';

export default {
    name: 'CellArea',
    props: {
        cells: {
            type: Array<Array<ValueCell>>,
            default: []
        },
        data: {
            type: Map<string | null, any>,
            default: {}
        }
    },
    methods: {
        getPath(cell: ValueCell) {
            return [...cell.rowHeaders.values(), ...cell.columnHeaders.values()].join('.');
        }
    }
}
</script>
<template>
    <table class="frame">
        <tr class="row" v-for="row in cells">
            <td class="cell" :style="cell.style" v-for="cell in row" :data-path="getPath(cell)">{{ cell.text }}</td>
        </tr>
    </table>


</template>

<style scoped>
.frame {}
</style>