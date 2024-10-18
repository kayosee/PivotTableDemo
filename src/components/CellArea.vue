<script lang="ts">
import { ValueCell } from '../Pivot/Cells/ValueCell';

export default {
    name: 'CellArea',
    props: {
        cells: {
            type: Array<Array<ValueCell>>
        },
        rows:{
            type:Array<Array<any>>
        },
        columns:{

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
    
}
</style>