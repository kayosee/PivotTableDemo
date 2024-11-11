<script lang="ts">
import { Field } from '../Pivot/Fields/Field';
import { PivotOptions } from '../Pivot/PivotOptions';
import { Area } from '../Pivot/Enums/Area';

export default {
    name: 'FieldsPanel',
    props: {
        options: {
            type: PivotOptions,
            default: {}
        }
    },
    methods: {
        allowDrop: function (e: any) {
            e.preventDefault();
        },
        drag: function (e: any, area: string, field: Field) {
            e.dataTransfer.setData("from", area);
            e.dataTransfer.setData("field", field.name);
        },
        drop: function (e: any, area: string) {
            e.preventDefault();
            var from: Area = e.dataTransfer.getData('from');
            var field: string = e.dataTransfer.getData('field');
            switch (area) {
                case Area.field:
                    {
                        let array: Array<Field> | null = null;
                        switch (from) {
                            case Area.column:
                                array = this.options.columns;
                                break;
                            case Area.filter:
                                array = this.options.filters;
                                break;
                            case Area.row:
                                array = this.options.rows;
                                break;
                            case Area.value:
                                array = this.options.values;
                                break;
                            default:
                                console.error();
                        }
                        if (array != null) {
                            let index = array.findIndex(f => f.name == field);
                            if (index > -1)
                                array.splice(index, 1);
                        }
                    }
            }
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
            <td colspan="2" v-on:drop="(e) => drop(e, 'field')" v-on:dragover="allowDrop">
                <div v-for="field in options.fields" draggable="true" v-on:dragstart="(e) => drag(e, 'field', field)">
                    <label>{{ field.title }}</label>
                </div>
            </td>
        </tr>
        <tr class="row">
            <td class="label">筛选</td>
            <td class="label">行列</td>
        </tr>
        <tr class="row">
            <td v-on:drop="(e) => drop(e, 'filter')" v-on:dragover="allowDrop">
                <div v-for="field in options.filters" draggable="true" v-on:dragstart="(e) => drag(e, 'filter', field)">
                    <label>{{ field.title }}</label>
                </div>
            </td>
            <td v-on:drop="(e) => drop(e, 'row')" v-on:dragover="allowDrop">
                <div v-for="field in options.rows" draggable="true" v-on:dragstart="(e) => drag(e, 'row', field)">
                    <label>{{ field.title }}</label>
                </div>
            </td>
        </tr>
        <tr class="row">
            <td class="label">列头</td>
            <td class="label">数值</td>
        </tr>
        <tr class="row">
            <td v-on:drop="(e) => drop(e, 'column')" v-on:dragover="allowDrop">
                <div v-for="field in options.filters" draggable="true" v-on:dragstart="(e) => drag(e, 'column', field)">
                    <label>{{ field.title }}</label>
                </div>
            </td>
            <td v-on:drop="(e) => drop(e, 'value')" v-on:dragover="allowDrop">
                <div v-for="field in options.values" draggable="true" v-on:dragstart="(e) => drag(e, 'value', field)">
                    <label>{{ field.title }}</label>
                </div>
            </td>
        </tr>
    </table>
</template>
<style lang="css" scoped>
table {
    width: 100%;
    height: 100%;
}

.label {
    text-align: center;
}

div {
    text-align: center;
}
</style>