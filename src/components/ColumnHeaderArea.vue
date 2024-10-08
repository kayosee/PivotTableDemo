<template>

</template>
<script lang="ts">
import { ColumnField } from "../Pivot/Fields/ColumnField";

export default {
    name: "ColumnHeaderArea",
    props: {
        headers: {
            type: Array<Array<ColumnField>>,
            default: () => { }
        }
    },
    methods: {

    }
}
</script>
