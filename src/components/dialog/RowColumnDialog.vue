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

export default {
    name: 'RowColumnDialog',
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
        open: function (field: RowField | ColumnField, handler: Function) {
            this.field = field;
            this.handler = handler;
            this.show = true;
        }
    }
}
</script>