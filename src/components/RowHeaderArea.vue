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
    <table class="pivot-frame">
        <tr class="row" v-for="row in headers">
            <td class="pivot-cell" v-for="cell in row">{{ cell }}</td>
        </tr>
    </table>

</template>
<style scoped>
.pivot-cell{
    white-space: nowrap;
}
.pivot-frame {
    position: absolute;
    left: 0;
    top: 0;
}
.placeholder{
    display: inline-block;
    width: 50px;;
}
</style>