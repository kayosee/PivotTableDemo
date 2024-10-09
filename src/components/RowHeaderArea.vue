<script lang="ts">
import { RowHeader } from '../Pivot/Headers/RowHeader';

export default {
    name: 'RowHeaderArea',
    props: {
        headers: {
            type: Array<Array<RowHeader>>
        }
    }
}
</script>

<template>
    <table class="frame">
        <tr class="row" v-for="row in headers">
            <td class="cell" v-for="cell in row">{{ cell.value }}</td>
        </tr>
    </table>

</template>
<style scoped>
.frame{
    min-width: 100%;
    position: absolute;
    left: 0;
    top: 0;
}
</style>