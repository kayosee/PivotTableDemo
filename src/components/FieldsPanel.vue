<script lang="ts">
import { Field } from '../Pivot/Fields/Field';
import { PivotOptions } from '../Pivot/PivotOptions';
import { Area } from '../Pivot/Enums/Area';
import { ColumnField } from '../Pivot/Fields/ColumnField';
import { RowField } from '../Pivot/Fields/RowField';
import { FilterField } from '../Pivot/Fields/FilterField';
import { ValueField } from '../Pivot/Fields/ValueField';
export default {
    name: 'FieldsPanel',
    data: function () {
        var rowColumnField: RowField | ColumnField | null = null;
        var valueField: ValueField | null = null;
        return {
            showRowColumnFieldOptions: false,
            showValueFieldOptions: false,
            rowColumnField: rowColumnField,
            valueField: valueField
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
            switch (area) {
                case Area.column:
                case Area.row:
                    this.rowColumnField = field;
                    this.showRowColumnFieldOptions = true;
                    break;
                case Area.value:
                    this.valueField = field;
                    this.showValueFieldOptions = true;
                    break;
            }
        },
        saveFieldOptions: function () {
            this.showValueFieldOptions = false;
            this.showRowColumnFieldOptions = false;
            if (this.options != null)
                this.options.onPropertyChanged();
        }
    }
}
</script>

<template>
    <el-dialog v-model="showRowColumnFieldOptions" title="字段选项" :align-center="true">
        <el-form v-model="rowColumnField">
            <el-form-item label="排序">
                <el-select v-model="rowColumnField.sort" placeholder="排序规则">
                    <el-option label="不排序" value="none" />
                    <el-option label="升序" value="asc" />
                    <el-option label="降序" value="desc" />
                </el-select>
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="showRowColumnFieldOptions = false">取消</el-button>
                <el-button type="primary" @click="saveFieldOptions">
                    确定
                </el-button>
            </div>
        </template>
    </el-dialog>
    <el-dialog v-model="showValueFieldOptions" title="字段选项" :align-center="true">
        <el-form v-model="valueField">
            <el-form-item label="排序">
                <el-select v-model="valueField.sort" placeholder="排序规则">
                    <el-option label="不排序" value="none" />
                    <el-option label="升序" value="asc" />
                    <el-option label="降序" value="desc" />
                </el-select>
            </el-form-item>
            <el-form-item label="计算">
                <el-select v-model="valueField.aggregator" placeholder="排序规则">
                    <el-option label="求和" value="sum" />
                    <el-option label="平均" value="avg" />
                    <el-option label="最大" value="max" />
                    <el-option label="最小" value="min" />
                    <el-option label="计数" value="count" />
                    <el-option label="按键计数" value="distcount" />
                </el-select>
            </el-form-item>
            <el-form-item label="格式">
                <el-select v-model="valueField.format" placeholder="排序规则">
                    <el-option label="日期" value="date" />
                    <el-option label="时间" value="time" />
                    <el-option label="日期和时间" value="datetime" />
                    <el-option label="整数" value="integer" />
                    <el-option label="小数" value="decimal" />
                    <el-option label="金额" value="money" />
                    <el-option label="百分比" value="percentage" />
                </el-select>
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="showValueFieldOptions = false">取消</el-button>
                <el-button type="primary" @click="saveFieldOptions">
                    确定
                </el-button>
            </div>
        </template>
    </el-dialog>
    <table class="frame">
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