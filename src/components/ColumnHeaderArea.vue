<script lang="ts">
import { ColumnField } from "../Pivot/Fields/ColumnField";
import { ColumnHeader } from "../Pivot/Headers/ColumnHeader";

export default {
    name: "ColumnHeaderArea",
    props: {
        headers: {
            type: Array<Array<ColumnHeader>>,
            default: () => { }
        },
        left:{
            type:Number
        }
    },
    methods: {

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
</style>