<script lang="ts">
import { ValueCell } from '../Pivot/Cells/ValueCell';

export default {
    name: 'CellArea',
    props: {
        cells: {
            type: Array<Array<ValueCell>>
        }
    }
}
</script>
<template>
    <table class="frame">
        <tr class="row" v-for="row in cells">
            <td class="cell" v-for="cell in row">{{ cell.value }}</td>
        </tr>
    </table>
    

</template>

<style scoped>
.frame{
    top: 0;
    left:0;
    position: absolute;
    
}
</style>