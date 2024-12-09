<script lang="ts">
import { Header } from '../Pivot/Headers/Header';


export default {
    name: 'RowHeaderArea',
    props: {
        headers: {
            type: Array<Array<Header>>,
            default: []
        }
    }
}
</script>

<template>
    <table class="pivot-frame">
        <tr class="row" v-for="row in headers">            
            <td class="pivot-cell" v-for="header in row">
                <div v-if="!header.isTotal">{{ header.value }}</div>
                <div v-if="header.isTotal==true">合计</div>                
            </td>
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