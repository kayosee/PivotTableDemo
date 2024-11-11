<script lang="ts">
import { PivotOptions } from '../Pivot/PivotOptions';

export default {
    name:'FieldsPanel',
    props:{
        options:{
            type:PivotOptions,
            default:{}
        }
    }
}
</script>

<template>
<table class="frame">
    <tr class="row">
        <td colspan="2" class="label">所有列</td>
    </tr>
    <tr class="row">
        <td colspan="2">
            <div v-for="field in options.fields">
                <label>{{ field.title }}</label>
            </div>
        </td>
    </tr>
    <tr class="row">
        <td class="label">筛选</td>
        <td class="label">行列</td>
    </tr>
    <tr class="row">
        <td>
            <div v-for="field in options.filters">
                <label>{{ field.title }}</label>
            </div>
        </td>
        <td>
            <div v-for="field in options.rows">
                <label>{{ field.title }}</label>
            </div>
        </td>
    </tr>    
    <tr class="row">
        <td class="label">列头</td>
        <td class="label">数值</td>
    </tr>
    <tr class="row">
        <td>
            <div v-for="field in options.filters">
                <label>{{ field.title }}</label>
            </div>
        </td>
        <td>
            <div v-for="field in options.values">
                <label>{{ field.title }}</label>
            </div>
        </td>
    </tr>
</table>
</template>
<style lang="css" scoped>
table{
    width:100%;
    height:100%;
}
.label{
    text-align: center;
}
div{
    text-align: center;
}
</style>