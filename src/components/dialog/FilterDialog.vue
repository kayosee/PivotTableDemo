<template>
    <el-dialog v-model="show" title="字段选项" :align-center="true">
        <el-form v-model="field">
            <el-form-item label="方法">
                <el-select v-if="field.type == 'number' || field.type == 'date'" v-model="field.comparison">
                    <el-option label="等于" value="equals" />
                    <el-option label="不等于" value="notEquals" />
                    <el-option label="大于" value="greater" />
                    <el-option label="大于或等于" value="greaterOrEquals" />
                    <el-option label="小于" value="less" />
                    <el-option label="小于或等于" value="lessOrEquals" />
                    <el-option label="在区间内" value="between" />
                    <el-option label="在区间外" value="notBetween" />
                </el-select>
                <el-select v-if="field.type == 'string'" v-model="field.comparison">
                    <el-option label="等于" value="equals" />
                    <el-option label="不等于" value="notEquals" />
                    <el-option label="包含" value="contains" />
                    <el-option label="不包含" value="notContains" />
                    <el-option label="模式匹配" value="like" />
                    <el-option label="模式不匹配" value="notLike" />
                </el-select>
            </el-form-item>
            <el-form-item :label="getName(field.comparison)"
                v-if="['equals', 'notEquals', 'greater', 'greaterOrEquals', 'less', 'lessOrEquals','like','notLike'].find(f => f == field.comparison)">
                <el-input v-model="field.critera"></el-input>
            </el-form-item>
            <el-form-item :label="getName(field.comparison)" v-if="['between','notBetween','contains','notContains'].find(f => f == field.comparison)">
                <el-input v-model="field.critera.start"></el-input>
            </el-form-item>
            <el-form-item :label="getName(field.comparison)" v-if="['between','notBetween','contains','notContains'].find(f => f == field.comparison)">
                <el-input v-model="field.critera.end"></el-input>
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="show = false">取消</el-button>
                <el-button type="primary" @click="save">
                    确定
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script lang="ts">
import { ComparisonName } from '../../Pivot/Enums/ComparisonName';
import { FilterField } from '../../Pivot/Fields/FilterField';

export default {
    name: 'FilterDialog',
    data: function () {
        return {
            show: false,
            field: null,
            handler: null,
        }
    },
    methods: {
        getName:function(key:keyof typeof ComparisonName):string{
            return ComparisonName[key];
        },
        save: function () {
            this.show = false;
            if (this.handler != null)
                this.handler(this.field);
        },
        open: function (field: FilterField, handler: Function) {
            this.show = true;
            this.field = field;
            this.handler = handler;
        }
    }
}
</script>