<script lang="ts">
import { ValueCell } from '../Pivot/Cells/ValueCell';
import { ValueFormat } from '../Pivot/Enums/ValueFormat';
import { ValueField } from '../Pivot/Fields/ValueField';
import { Summary } from '../Pivot/Summary';

export default {
    name: 'CellArea',
    props: {
        cells: {
            type: Array<Array<ValueCell>>,
            default: []
        },
        data: {
            type: Map<string | null, any>,
            default: {}
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
                var header: Summary | null = null;
                if (temp instanceof Summary)
                    header = temp as Summary;
                else if (temp instanceof Map && temp.has(null))
                    header = temp.get(null) as Summary;
                if (header != null) {
                    var value = header.values.get(cell.valueField.name);
                    if (value == null)
                        return '';
                    
                    debugger;
                    switch (cell.valueField.format) {
                        case ValueFormat.integer:
                            return value?.toFixed(0);
                        case ValueFormat.money:
                            return value?.toFixed(2);
                        case ValueFormat.percentage:
                            return ((value * 100).toFixed(4)).toString() + '%';
                        case ValueFormat.date:
                        case ValueFormat.datetime:
                        case ValueFormat.time:
                        case ValueFormat.decimal:
                            return value;
                        case ValueFormat.custom:
                            return cell.valueField.formatter(value);
                        default:
                            return value;
                    }
                }
            }
            return ''
        },
        getPath(cell: ValueCell) {
            return [...cell.rowHeaders.values(), ...cell.columnHeaders.values()].join('.');
        }
    }
}
</script>
<template>
    <table class="frame">
        <tr class="row" v-for="row in cells">
            <td class="cell" v-for="cell in row" :data-path="getPath(cell)">{{ getValue(cell) }}</td>
        </tr>
    </table>


</template>

<style scoped>
.frame {}
</style>