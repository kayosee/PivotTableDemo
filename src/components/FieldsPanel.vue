<script lang="ts">
import { Field } from '../Pivot/Fields/Field';
import { Pivot } from '../Pivot/Pivot';
import { Area } from '../Pivot/Enums/Area';
import { ColumnField } from '../Pivot/Fields/ColumnField';
import { RowField } from '../Pivot/Fields/RowField';
import { FilterField } from '../Pivot/Fields/FilterField';
import { ValueField } from '../Pivot/Fields/ValueField';
import FilterDialog from './dialog/FilterDialog.vue'
import ColumnDialog from './dialog/ColumnDialog.vue';
import RowDialog from './dialog/RowDialog.vue';
import ValueDialog from './dialog/ValueDialog.vue';
import { Arrays } from '../Pivot/Utils/Arrays';
export default {
    components: {
        ColumnDialog,
        RowDialog,
        ValueDialog,
        FilterDialog
    },
    name: 'FieldsPanel',
    data: function () {
        let valueDialog: any = {};
        let filterDialog: any = {};
        let rowDialog: any = {};
        let columnDialog: any = {};
        return {
            valueDialog: valueDialog,
            filterDialog: filterDialog,
            rowDialog: rowDialog,
            columnDialog: columnDialog
        }
    },
    props: {
        pivot: {
            type: Object,
            default: new Pivot()
        },

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
        },
        getIndex: function (e: any): number {
            let target = e.target;
            let rect: DOMRect = target.getBoundingClientRect();
            if (target.nodeName == 'TD') {
                if (e.y < rect.top + (rect.height / 2))
                    return 0;
                else
                    return target.attributes['field-count'].value;
            }

            if (target.nodeName == 'LABEL') {
                target = target.parentElement;
            }
            rect = target.getBoundingClientRect();
            var index: number = parseInt(target.attributes['field-index'].value)
            if (e.y < rect.top + (rect.height / 2))
                return index;
            else
                return index + 1;
        },
        moveField: function (from: Area, to: Area, index: number, fieldName: string) {
            let me = this;
            let field: Field | undefined = this.pivot.options.fields.find((f:Field) => f.name == fieldName);
            let dialog: any = null;
            if (field != undefined) {
                if (to == Area.field) {
                    me.pivot.moveField(from, to, index, field);
                    me.$forceUpdate();
                    return;
                }
                if (to == Area.column) {
                    dialog = this.$refs.columnDialog;
                }
                else if (to == Area.row) {
                    dialog = this.$refs.rowDialog;
                }
                else if (to == Area.filter) {
                    if (this.pivot.options.filters.find((f:Field) => f.name == fieldName))
                        return;
                    (field as FilterField).constants = Arrays.distinct(this.pivot.data, field.name);
                    dialog = this.$refs.filterDialog;
                }
                else if (to == Area.value) {
                    dialog = this.$refs.valueDialog;
                }
                dialog.open(field, function (result: Field) {
                    me.pivot.moveField(from, to, index, result);
                    me.$forceUpdate();
                }, [...this.pivot.options.fields]);
            }
        },
        setFieldOptions: function (area: string, field: RowField | ColumnField | FilterField | ValueField) {
            let me = this;
            switch (area) {
                case Area.column:
                    this.columnDialog.open(field, function (result: RowField | ColumnField) {
                        let which = field as RowField | ColumnField;
                        which.sort = result.sort;
                        which.format = result.format;
                        which.formatter = result.formatter;
                        which.style = result.style;
                        which.fraction = result.fraction;
                        me.pivot.calc();
                    });
                    break;
                case Area.row:
                    this.rowDialog.open(field, function (result: RowField | ColumnField) {
                        let which = field as RowField | ColumnField;
                        which.sort = result.sort;
                        which.format = result.format;
                        which.formatter = result.formatter;
                        which.style = result.style;
                        which.fraction = result.fraction;
                        me.pivot.calc();
                    });
                    break;
                case Area.value:
                    this.valueDialog.open(field, function (result: ValueField) {
                        let which = field as ValueField;
                        which.aggregator = result.aggregator;
                        which.distinct = result.distinct;
                        which.keys = result.keys;
                        which.sort = result.sort;
                        which.format = result.format;
                        which.formatter = result.formatter;
                        which.style = result.style;
                        which.fraction = result.fraction;
                        me.pivot.calc();
                    }, [...this.pivot.options.fields]);
                    break;
                case Area.filter:
                    this.filterDialog.open(field, function (result: FilterField) {
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
                        me.pivot.calc();
                    });
                    break;
            }
        }
    },
    mounted: function () {
        setTimeout(() => {
            this.valueDialog = this.$refs.valueDialog;
            this.filterDialog = this.$refs.filterDialog;
            this.rowDialog = this.$refs.rowDialog;
            this.columnDialog = this.$refs.columnDialog;
        }, 1);
    }
}
</script>

<template>
    <FilterDialog ref="filterDialog"></FilterDialog>
    <ColumnDialog ref="columnDialog"></ColumnDialog>
    <RowDialog ref="rowDialog"></RowDialog>
    <ValueDialog ref="valueDialog"></ValueDialog>
    <table class="pivot-frame panel">
        <tr class="row">
            <td colspan="2" class="label">所有字段</td>
        </tr>
        <tr class="row">
            <td colspan="2" v-on:drop="(e) => drop(e, 'field')" v-on:dragover="allowDrop"
                :field-count="pivot.options.fields.length">
                <div class="field" v-for="(field, index) in pivot.options.fields" draggable="true"
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
            <td v-on:drop="(e) => drop(e, 'filter')" v-on:dragover="allowDrop"
                :field-count="pivot.options.filters.length">
                <div class="field" v-for="(field, index) in pivot.options.filters" draggable="true"
                    v-on:click="setFieldOptions('filter', field)" v-on:dragstart="(e) => drag(e, 'filter', field)"
                    :field-index="index">
                    <label>{{ field.title }}</label>
                </div>
            </td>
            <td v-on:drop="(e) => drop(e, 'row')" v-on:dragover="allowDrop" :field-count="pivot.options.rows.length">
                <div class="field" v-for="(field, index) in pivot.options.rows" draggable="true"
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
            <td v-on:drop="(e) => drop(e, 'column')" v-on:dragover="allowDrop"
                :field-count="pivot.options.columns.length">
                <div class="field" v-for="(field, index) in pivot.options.columns" draggable="true"
                    v-on:click="setFieldOptions('column', field)" v-on:dragstart="(e) => drag(e, 'column', field)"
                    :field-index="index">
                    <label>{{ field.title }}</label>
                </div>
            </td>
            <td v-on:drop="(e) => drop(e, 'value')" v-on:dragover="allowDrop"
                :field-count="pivot.options.values.length">
                <div class="field" v-for="(field, index) in pivot.options.values" draggable="true"
                    v-on:click="setFieldOptions('value', field)" v-on:dragstart="(e) => drag(e, 'value', field)"
                    :field-index="index">
                    <label>{{ field.title }}</label>
                </div>
            </td>
        </tr>
    </table>
</template>
<style lang="css" scoped>
.panel {
    width: 100%;
    height: 100%;
}
.panel td{
    padding: 0;
}
.label {
    text-align: center;
}

.panel div {
    text-align: center;
}
</style>