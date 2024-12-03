<template>
    <el-dialog v-model="show" title="字段选项" :align-center="true">
        <el-form ref="form" :model="field" label-width="auto">
            <el-form-item label="字段">
                <el-input v-model="field.title" disabled></el-input>
            </el-form-item>
            <el-form-item label="方法" prop="comparison" required :rules="[{ required: true, message: '请选择方法' }]">
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
            <el-form-item prop="critera" :label="getName(field.comparison)"
                :rules="[{ required: true, message: '请输入内容' }]"
                v-if="['equals', 'notEquals', 'greater', 'greaterOrEquals', 'less', 'lessOrEquals', 'like', 'notLike'].find(f => f == field.comparison)">
                <el-input v-if="field.type == 'string'" v-model="field.critera"></el-input>
                <el-input-number v-if="field.type == 'number'" v-model="field.critera"></el-input-number>
                <el-date-picker type="date" v-if="field.type == 'date'" v-model="field.critera"></el-date-picker>
                <el-date-picker type="datetime" v-if="field.type == 'datetime'"
                    v-model="field.critera"></el-date-picker>
                <el-time-picker v-if="field.type == 'time'" v-model="field.critera" />
            </el-form-item>
            <el-form-item label="区间" required v-if="['between', 'notBetween'].find(f => f == field.comparison)">
                <el-col :span="11" class="sub">
                    <el-form-item prop="start" :rules="[{ required: true, message: '请输入内容或选择时间' }]">
                        <el-input-number style="width: 100%" v-if="field.type == 'number'"
                            v-model="field.start"></el-input-number>
                        <el-date-picker style="width: 100%" type="date" v-if="field.type == 'date'"
                            v-model="field.start"></el-date-picker>
                        <el-date-picker style="width: 100%" type="datetime" v-if="field.type == 'datetime'"
                            v-model="field.start"></el-date-picker>
                        <el-time-picker style="width: 100%" v-if="field.type == 'time'"
                            v-model="field.start" /></el-form-item>
                </el-col>
                <el-col :span="2" class="text-center">
                    <span class="text-gray-500">-</span>
                </el-col>
                <el-col :span="11" class="sub">
                    <el-form-item prop="start" :rules="[{ required: true, message: '请输入内容或选择时间' }]">
                        <el-input-number style="width: 100%" v-if="field.type == 'number'"
                            v-model="field.end"></el-input-number>
                        <el-date-picker style="width: 100%" type="date" v-if="field.type == 'date'"
                            v-model="field.end"></el-date-picker>
                        <el-date-picker style="width: 100%" type="datetime" v-if="field.type == 'datetime'"
                            v-model="field.end"></el-date-picker>
                        <el-time-picker style="width: 100%" v-if="field.type == 'time'"
                            v-model="field.end" /></el-form-item>
                </el-col>
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
                        添加
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
            this.$refs.form.validate((valid: boolean) => {
                if (valid) {
                    this.show = false;
                    if (this.handler != null)
                        this.handler(this.field);
                }
            });
        },
        open: function (field: FilterField, handler: Function) {
            this.show = true;
            this.field = new FilterField(field.name, field.title, field.type, field.index, field.style, field.comparison, field.critera, field.start, field.end, field.list);
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
<style scoped>
.text-center {
    text-align: center;
}
</style>
