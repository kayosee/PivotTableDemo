<template>
    <el-dialog v-model="show" title="字段选项" :align-center="true">
        <el-form :model="field" :ref="(e:any)=>{form=e;}" label-width="auto">
            <el-form-item label="字段">
                <el-input v-model="field.title" disabled></el-input>
            </el-form-item>
            <el-form-item label="排序" prop="sort" required>
                <el-select v-model="field.sort" placeholder="排序规则">
                    <el-option label="升序" value="asc" />
                    <el-option label="降序" value="desc" />
                </el-select>
            </el-form-item>
            <el-form-item label="格式" prop="format" required>
                <el-select v-model="field.format" placeholder="显示格式">
                    <el-option label="自动" value="auto" />
                    <el-option label="日期" value="date" />
                    <el-option label="时间" value="time" />
                    <el-option label="日期和时间" value="datetime" />
                    <el-option label="整数" value="integer" />
                    <el-option label="小数" value="decimal" />
                    <el-option label="金额" value="money" />
                    <el-option label="百分比" value="percentage" />
                </el-select>
            </el-form-item>
            <el-form-item v-if="field.type == 'number' && field.format == 'decimal'" label="小数位" prop="fraction"
                required>
                <el-input-number v-model="field.fraction" min="0"></el-input-number>
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
import { ColumnField } from '../../Pivot/Fields/ColumnField';
import { RowField } from '../../Pivot/Fields/RowField';
import { Field } from '../../Pivot/Fields/Field';
export default {
    name: 'RowColumnDialog',
    data: function () {
        let field: any = {};
        let handler: any = {};
        let form: any = {};
        return {
            show: false,
            field: field,
            handler: handler,
            form: form
        }
    },
    methods: {
        save: function () {
            this.form.validate((valid: boolean) => {
                if (valid) {
                    this.show = false;
                    if (this.handler != null)
                        this.handler(this.field);
                }
            });
        },
        open: function (field: ColumnField | RowField | Field, handler: Function) {
            if (field instanceof RowField || field instanceof ColumnField)
                this.field = field.clone();
            else
                this.field = new ColumnField(field.name, field.title, field.type, field.index, field.style, field.format, field.formatter, field.fraction, "asc");

            this.handler = handler;
            this.show = true;
        }
    },
    mounted: function () {
        setTimeout(() => {
            this.form = this.$refs.form;
        }, 1)
    }
}
</script>