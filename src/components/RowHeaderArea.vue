<script lang="ts">
import { RowHeader } from '../Pivot/Headers/RowHeader';

export default {
    name: 'RowHeaderArea',
    props: {
        headers: {
            type: Array<Array<any>>,
            default: []
        }
    }
}
</script>

<template>
    <table class="frame">
        <tr class="row" v-for="row in headers">
            <td class="cell" v-for="cell in row">{{ cell }}</td>
        </tr>
    </table>

</template>
<style scoped>
.cell{
    white-space: nowrap;
}
.frame {
    position: absolute;
    left: 0;
    top: 0;
}
.placeholder{
    display: inline-block;
    width: 50px;;
}
</style>