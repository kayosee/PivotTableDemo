<script lang="ts">
import { RowHeader } from '../Pivot/Headers/RowHeader';
import PlainRowItem from './PlainRowItem.vue';
export default {
    name: 'PlainRowArea',
    props: {
        headers: {
            type: Map,
            default: []
        }
    },
    components:{
        PlainRowItem
    }
}
</script>

<template>
    <table class="frame">
        <tr class="row" v-for="row in headers">
            <PlainRowItem :data="row"></PlainRowItem>
        </tr>
        <tr >
            <td><span class="placeholder"></span></td>
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