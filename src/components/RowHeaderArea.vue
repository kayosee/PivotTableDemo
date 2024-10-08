<script lang="ts">
import { RowHeader } from '../Pivot/Headers/RowHeader';

export default{
    name:'RowHeaderArea',
    props:{
        rows:{
            type:Array<Array<RowHeader>>
        }
    }
}
</script>