<script lang="ts">
import { ValueCell } from '../Pivot/Cells/ValueCell';
import { ValueField } from '../Pivot/Fields/ValueField';
import { PlainHeader } from '../Pivot/Headers/PlainHeader';

export default {
    name: 'CellArea',
    props: {
        cells:{
            type:Array<Array<ValueCell>>,
                default:[]
        },
        data:{
            type:Map<string|null,any>,
            default:{}
        }
    },
    methods: {
        getValue(cell: ValueCell) {
            
            let path = [...cell.rowHeaders.values(), ...cell.columnHeaders.values()];
            let temp: any = this.data;
            let i = 0;
            for (; i < path.length; i++) {
                if (temp instanceof Map && temp.has(path[i]))
                    temp = temp.get(path[i])
                else 
                    break;
            }
            if (i == path.length) {
                if (temp instanceof PlainHeader) {
                    var header = temp as PlainHeader;
                    return header.values.get(cell.valueField.name);
                }
            }
            return ''
        }
    }
}
</script>
<template>
    <table class="frame">
        <tr class="row" v-for="row in cells">
            <td class="cell" v-for="cell in row">{{ getValue(cell) }}</td>
        </tr>
    </table>


</template>

<style scoped>
.frame {}
</style>