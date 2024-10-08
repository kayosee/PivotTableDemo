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
    <div v-for="cell in cells">
        <span>{{ cell. }}</span>
    </div>
</template>