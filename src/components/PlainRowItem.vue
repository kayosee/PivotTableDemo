<script lang="ts">
import { PlainHeader } from '../Pivot/Headers/PlainHeader';
import { RowHeader } from '../Pivot/Headers/RowHeader';

export default {
    name: 'PlainRowItem',
    props: {
        data: {
            type: Array,
            default: []
        }
    },
    methods:{
        isHeader(obj:any):boolean{
            return obj instanceof PlainHeader;
        },
        isMap(obj:any):boolean{
            return obj instanceof Map;
        }
    }
}
</script>

<template>
    <td v-if="data!=null">{{ data[0] }}</td>
    <tr>
        <PlainRowItem v-if="data!=null&&isMap(data[1])" v-for="i in data[1]" :data="i"></PlainRowItem>
    </tr>
    
</template>
<style scoped>
.cell{
    white-space: nowrap;
}
.frame {
    position: absolute;
    left: 0;
    top: 0;
}
.placeholder{
    display: inline-block;
    width: 50px;;
}
</style>