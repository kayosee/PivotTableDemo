<template>
    <el-dialog v-model="show" title="下钻" width="800">
        <el-table :data="details" style="width: 100%" height="400">
            <el-table-column v-for="header in headers" :prop="header.name" :label="header.title" width="180"
                :formatter="format" />
        </el-table></el-dialog>
</template>
<script lang="ts">
import moment from 'moment';
import { Field } from '../../Pivot/Fields/Field';
import { DataType } from '../../Pivot/Enums/DataType';

export default {
    name: 'DrillDownDialog',
    data: function () {
        let details: Array<any> = [];
        let headers: Array<Field> = [];
        return {
            show: false,
            details: details,
            headers: headers
        }
    },
    methods: {
        open: function (headers: Array<Field>, details: Array<any>) {
            this.headers = headers;
            this.details = details;
            this.show = true;
        },
        format: function (column: any, cellValue: any) {
            let field: Field | undefined = (this.headers as Array<Field>).find(f => f.name == column.property);
            if (field) {
                switch (field.type) {
                    case DataType.date:
                        return moment(cellValue).isValid() ? moment(cellValue).format('YYYY-MM-DD') : '';
                        break;
                    case DataType.datetime:
                        return moment(cellValue).isValid() ? moment(cellValue).format('YYYY-MM-DD HH:MM:ss') : '';
                        break;
                    case DataType.time:
                        return moment(cellValue).isValid() ? moment(cellValue).format('HH:MM:ss') : '';
                    default:
                        return cellValue;
                }
            }
            return cellValue;
        }
    }
}
</script>