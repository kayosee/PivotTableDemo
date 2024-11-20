<template>
    <el-dialog v-model="show" title="字段选项" :align-center="true">
        <el-form v-model="field">
            <el-form-item label="排序">
                <el-select v-model="field.sort" placeholder="排序规则">
                    <el-option label="不排序" value="none" />
                    <el-option label="升序" value="asc" />
                    <el-option label="降序" value="desc" />
                </el-select>
            </el-form-item>
            <el-form-item label="统计">
                <el-select v-model="field.aggregator" placeholder="统计方法">
                    <el-option label="求和" value="sum" />
                    <el-option label="平均" value="avg" />
                    <el-option label="最大" value="max" />
                    <el-option label="最小" value="min" />
                    <el-option label="计数" value="count" />
                    <el-option label="按键计数" value="distcount" />
                </el-select>
            </el-form-item>
            <el-form-item label="格式">
                <el-select v-model="field.format" placeholder="显示格式">
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
                <el-button @click="show = false">取消</el-button>
                <el-button type="primary" @click="save">
                    确定
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>
<script lang="ts">
import { ValueField } from '../../Pivot/Fields/ValueField';
import { Marshal } from '../../Pivot/Utils/Marshal';

export default {
    name: 'ValueDialog',
    data: function () {
        return {
            show: false,
            field: null,
            handler: null,
        }
    },
    methods: {
        save: function () {
            this.show = false;
            if (this.handler != null)
                this.handler(this.field);
        },
        open: function (field: ValueField, handler: Function) {
            this.field = Marshal.clone(field);
            this.handler = handler;
            this.show = true;
        }
    }
}
</script>