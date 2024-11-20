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
                v-if="['equals', 'notEquals', 'greater', 'greaterOrEquals', 'less', 'lessOrEquals', 'like', 'notLike'].find(f => f == field.comparison)">
                <el-input v-if="field.type=='string'" v-model="field.critera"></el-input>
                <el-input-number v-if="field.type=='number'" v-model="field.critera"></el-input-number>
                <el-date-picker type="date" v-if="field.type=='date'" v-model="field.critera"></el-date-picker>
                <el-date-picker type="datetime" v-if="field.type=='datetime'" v-model="field.critera"></el-date-picker>
                <el-time-picker v-if="field.type=='time'" v-model="field.critera" />
            </el-form-item>
            <el-form-item label="起始区间" v-if="['between', 'notBetween'].find(f => f == field.comparison)">
                <el-input v-if="field.type=='string'" v-model="field.start"></el-input>
                <el-input-number v-if="field.type=='number'" v-model="field.start"></el-input-number>
                <el-date-picker type="date" v-if="field.type=='date'" v-model="field.start"></el-date-picker>
                <el-date-picker type="datetime" v-if="field.type=='datetime'" v-model="field.start"></el-date-picker>
                <el-time-picker v-if="field.type=='time'" v-model="field.start" />
            </el-form-item>
            <el-form-item label="结束区间" v-if="['between', 'notBetween'].find(f => f == field.comparison)">
                <el-input v-if="field.type=='string'" v-model="field.end"></el-input>
                <el-input-number v-if="field.type=='number'" v-model="field.end"></el-input-number>
                <el-date-picker type="date" v-if="field.type=='date'" v-model="field.end"></el-date-picker>
                <el-date-picker type="datetime" v-if="field.type=='datetime'" v-model="field.end"></el-date-picker>
                <el-time-picker v-if="field.type=='time'" v-model="field.end" />
            </el-form-item>
            <el-form-item label="列表" v-if="['contains', 'notContains'].find(f => f == field.comparison)">
                <div class="flex gap-2">
                    <el-tag v-for="tag in field.list" :key="tag" closable :disable-transitions="false"
                        @close="handleClose(tag)">
                        {{ tag }}
                    </el-tag>
                    <el-input v-if="inputVisible" ref="inputRef" v-model="inputValue" class="w-20" size="small"
                        @keyup.enter="handleInputConfirm" @blur="handleInputConfirm" />
                    <el-button v-else class="button-new-tag" size="small" @click="showInput">
                        + New Tag
                    </el-button>
                </div>
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
import { nextTick } from 'vue';
import { ComparisonName } from '../../Pivot/Enums/ComparisonName';
import { FilterField } from '../../Pivot/Fields/FilterField';
import { Marshal } from '../../Pivot/Utils/Marshal';

export default {
    name: 'FilterDialog',
    data: function () {
        return {
            show: false,
            field: null,
            handler: null,
            inputVisible: false,
            inputValue: ''
        }
    },
    methods: {
        getName: function (key: keyof typeof ComparisonName): string {
            return ComparisonName[key];
        },
        save: function () {
            this.show = false;
            if (this.handler != null)
                this.handler(this.field);
        },
        open: function (field: FilterField, handler: Function) {
            this.show = true;
            this.field = Marshal.clone(field);
            this.handler = handler;
        },
        handleClose: function (tag: string | Date | number) {
            this.field.list.splice(this.field.list.indexOf(tag), 1);
        },
        showInput: function () {
            this.inputVisible = true;
            nextTick(() => {
                this.$refs.inputRef.value!.input!.focus();
            })
        },
        handleInputConfirm: function () {
            if (this.inputValue) {
                this.field.list.push(this.inputValue)
            }
            this.inputVisible = false
            this.inputValue = ''
        }
    }
}
</script>