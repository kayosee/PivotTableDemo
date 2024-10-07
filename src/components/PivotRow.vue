<template>
    <td :rowspan="getChildrenLength(cell)">
        <span>{{ cell.text }}</span>

    </td>
    <PivotRow v-for="child in getChildren(cell)" :cell="child"></PivotRow>

</template>
<script lang="ts">
import { ref, computed } from "vue";
import { Cell } from "../PivotTable/Cells/Cell"
import { GroupCell } from "../PivotTable/Cells/GroupCell";

export default {
    name: "PivotRow",
    props: {
        cell: {
            type: Cell,
            default: () => { }
        }
    },
    methods: {
        getChildrenLength(cell: Cell): number {
            if (cell instanceof GroupCell) {
                (cell as GroupCell).length;
            }
            return 0;
        },
        getChildren(cell: Cell): Array<Cell> {
            return cell instanceof GroupCell ? (cell as GroupCell).children : [];
        }
    }
}
</script>
