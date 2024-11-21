<script lang="ts">
import { Field } from '../Pivot/Fields/Field';
import { PivotOptions } from '../Pivot/PivotOptions';
import { Area } from '../Pivot/Enums/Area';
import { ColumnField } from '../Pivot/Fields/ColumnField';
import { RowField } from '../Pivot/Fields/RowField';
import { FilterField } from '../Pivot/Fields/FilterField';
import { ValueField } from '../Pivot/Fields/ValueField';
import FilterDialog from './dialog/FilterDialog.vue'
import RowColumnDialog from './dialog/RowColumnDialog.vue';
import ValueDialog from './dialog/ValueDialog.vue';
export default {
    components: {
        RowColumnDialog,
        ValueDialog,
        FilterDialog
    },
    name: 'FieldsPanel',
    data: function () {
        return {
        }
    },
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
            this.moveField(from, area as Area, this.getIndex(e), field);
            this.$forceUpdate();
        },
        getIndex: function (e: any): number {
            if (e.target.nodeName == 'TD') {
                if (e.y < e.target.height / 2)
                    return 0;
                else
                    return e.target.attributes['field-count'].value;
            }
            var target: any = e.target;
            if (e.target.nodeName == 'LABEL') {
                target = e.target.parentElement;
            }
            var index: number = parseInt(target.attributes['field-index'].value)
            if (e.y < target.height / 2)
                return index;
            else
                return index + 1;
        },
        moveField: function (from: Area, to: Area, index: number, fieldName: string) {
            if (to == Area.column || to == Area.row || to == Area.field) {
                var field: Field | undefined = this.options.fields.find(f => f.name == fieldName);
                if (field != undefined)
                    this.options.moveField(from, to, index, field);
            }
        },
        setFieldOptions: function (area: string, field: RowField | ColumnField | FilterField | ValueField) {
            let me = this;
            switch (area) {
                case Area.column:
                case Area.row:
                    this.$refs.rowColumnDialog.open(field, function (result: RowField | ColumnField) {
                        let which = field as RowField | ColumnField;
                        which.sort = result.sort;
                        which.format = result.format;
                        which.formatter = result.formatter;
                        which.style = result.style;
                        which.fraction = result.fraction;
                        me.options.onPropertyChanged();
                    });
                    break;
                case Area.value:
                    this.$refs.valueDialog.open(field, function (result: ValueField) {
                        let which = field as ValueField;
                        which.aggregator = result.aggregator;
                        which.sort = result.sort;
                        which.format = result.format;
                        which.formatter = result.formatter;
                        which.style = result.style;
                        which.fraction = result.fraction;
                        me.options.onPropertyChanged();
                    });
                    break;
                case Area.filter:
                    this.$refs.filterDialog.open(field, function (result: FilterField) {
                        let which = field as FilterField;
                        which.comparison = result.comparison;
                        which.critera = result.critera;
                        which.start = result.start;
                        which.end = result.end;
                        which.list = result.list;
                        which.format = result.format;
                        which.formatter = result.formatter;
                        which.style = result.style;
                        which.fraction = result.fraction;
                        me.options.onPropertyChanged();
                    });
                    break;
            }
        }
    }
}
</script>

<template>
    <FilterDialog ref="filterDialog"></FilterDialog>
    <RowColumnDialog ref="rowColumnDialog"></RowColumnDialog>
    <ValueDialog ref="valueDialog"></ValueDialog>
    <table class="pivot-frame">
        <tr class="row">
            <td colspan="2" class="label">所有列</td>
        </tr>
        <tr class="row">
            <td colspan="2" v-on:drop="(e) => drop(e, 'field')" v-on:dragover="allowDrop"
                :field-count="options.fields.length">
                <div class="field" v-for="(field, index) in options.fields" draggable="true"
                    v-on:dragstart="(e) => drag(e, 'field', field)" :field-index="index">
                    <label>{{ field.title }}</label>
                </div>
            </td>
        </tr>
        <tr class="row">
            <td class="label">筛选</td>
            <td class="label">行列</td>
        </tr>
        <tr class="row">
            <td v-on:drop="(e) => drop(e, 'filter')" v-on:dragover="allowDrop" :field-count="options.filters.length">
                <div class="field" v-for="(field, index) in options.filters" draggable="true"
                    v-on:click="setFieldOptions('filter', field)" v-on:dragstart="(e) => drag(e, 'filter', field)"
                    :field-index="index">
                    <label>{{ field.title }}</label>
                </div>
            </td>
            <td v-on:drop="(e) => drop(e, 'row')" v-on:dragover="allowDrop" :field-count="options.rows.length">
                <div class="field" v-for="(field, index) in options.rows" draggable="true"
                    v-on:click="setFieldOptions('row', field)" v-on:dragstart="(e) => drag(e, 'row', field)"
                    :field-index="index">
                    <label>{{ field.title }}</label>
                </div>
            </td>
        </tr>
        <tr class="row">
            <td class="label">列头</td>
            <td class="label">数值</td>
        </tr>
        <tr class="row">
            <td v-on:drop="(e) => drop(e, 'column')" v-on:dragover="allowDrop" :field-count="options.columns.length">
                <div class="field" v-for="(field, index) in options.columns" draggable="true"
                    v-on:click="setFieldOptions('column', field)" v-on:dragstart="(e) => drag(e, 'column', field)"
                    :field-index="index">
                    <label>{{ field.title }}</label>
                </div>
            </td>
            <td v-on:drop="(e) => drop(e, 'value')" v-on:dragover="allowDrop" :field-count="options.values.length">
                <div class="field" v-for="(field, index) in options.values" draggable="true"
                    v-on:click="setFieldOptions('value', field)" v-on:dragstart="(e) => drag(e, 'value', field)"
                    :field-index="index">
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