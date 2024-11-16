<template>
    <el-dialog v-model="show" title="字段选项" :align-center="true">
        <el-form v-model="field">
            <el-form-item label="方法">
                <el-select v-if="field.type=='number'||field.type=='date'" v-model="field.comparison">
                    <el-option label="等于" value="equals" />
                    <el-option label="不等于" value="notEquals" />
                    <el-option label="大于" value="greater" />
                    <el-option label="大于或等于" value="greaterOrEquals" />
                    <el-option label="小于" value="less" />
                    <el-option label="小于或等于" value="lessOrEquals" />
                    <el-option label="在区间内" value="between" />
                    <el-option label="在区间外" value="notBetween" />
                </el-select>
                <el-select v-if="field.type=='string'" v-model="field.comparison">
                    <el-option label="等于" value="equals" />
                    <el-option label="不等于" value="notEquals" />
                    <el-option label="包含" value="contains" />
                    <el-option label="不包含" value="notContains" />
                    <el-option label="模式匹配" value="like" />
                    <el-option label="模式不匹配" value="notLike" />
                </el-select>
            </el-form-item>
            <el-form-item label="等于" v-if="field.comparison=='equals'">
                <el-input v-model="equalsValue"></el-input>
            </el-form-item>
            <el-form-item label="不等于" v-if="field.comparison=='notEquals'">
                <el-input v-model="notEqualsValue"></el-input>
            </el-form-item>
            <el-form-item label="大于" v-if="field.comparison=='greater'">
                <el-input v-model="greaterValue"></el-input>
            </el-form-item>
            <el-form-item label="大于或等于" v-if="field.comparison=='greaterOrEquals'">
                <el-input v-model="greaterOrEqualsValue"></el-input>
            </el-form-item>
            <el-form-item label="小于" v-if="field.comparison=='less'">
                <el-input v-model="lessValue"></el-input>
            </el-form-item>
            <el-form-item label="小于或等于" v-if="field.comparison=='lessOrEquals'">
                <el-input v-model="lessOrEqualsValue"></el-input>
            </el-form-item>
            <el-form-item label="在区间内(起始)" v-if="field.comparison=='between'">
                <el-input v-model="betweenValue1"></el-input>
            </el-form-item>
            <el-form-item label="在区间内(结束)" v-if="field.comparison=='between'">
                <el-input v-model="betweenValue2"></el-input>
            </el-form-item>
            <el-form-item label="在区间外(起始)" v-if="field.comparison=='notBetween'">
                <el-input v-model="notBetweenValue1"></el-input>
            </el-form-item>
            <el-form-item label="在区间外(结束)" v-if="field.comparison=='notBetween'">
                <el-input v-model="notBetweenValue2"></el-input>
            </el-form-item>
            <el-form-item label="包含" v-if="field.comparison=='contains'">
                <el-input v-model="containsValue"></el-input>
            </el-form-item>
            <el-form-item label="不包含" v-if="field.comparison=='notContains'">
                <el-input v-model="notContainsValue"></el-input>
            </el-form-item>
            <el-form-item label="模式匹配" v-if="field.comparison=='like'">
                <el-input v-model="likeValue"></el-input>
            </el-form-item>
            <el-form-item label="模式不匹配" v-if="field.comparison=='notLike'">
                <el-input v-model="notLikeValue"></el-input>
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
import { FilterField } from '../Pivot/Fields/FilterField';

export default {
    name: 'FilterDialog',
    data: function () {
        return {
            show:this.show,
            equalsValue:null,
            notEqualsValue:null,
            greaterValue:0,
            greaterOrEqualsValue:0,
            lessValue:0,
            lessOrEqualsValue:0,
            betweenValue1:0,
            betweenValue2:0,
            notBetweenValue1:0,
            notBetweenValue2:0,
            likeValue:'',
            notLikeValue:'',
            containsValue:'',
            notContainsValue:''
        }
    },
    methods:{
        save:function(){

        }
    },
    props: {
        field: {
            type: FilterField,
            default: {}
        },
        show: {
            type: Boolean,
            default: false
        }
    }
}
</script>