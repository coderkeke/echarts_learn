<template>
    <div>
        <div v-for="item of items" :key="item.uid">
            <Item :uid="item.uid"/>
        </div>
    </div>
</template>

<script>
    import Item from './Item'
    export default {
        name: 'root',
        components: {Item: Item},
        data() {
            return {
                items: []
            }
        },
        created() {
            for (let i = 0; i < 1; i++) {
                this.items.push({uid: `unique_${i}`})
            }
        }
    }
</script>


