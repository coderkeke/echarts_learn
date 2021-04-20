<!--
针对于/sellerPage这条路径二显示出来的
-->
<template>
    <div class="com-page">
        <Seller/>
    </div>
</template>

<script>
    import Seller from '@/components/Seller'

    export default {
        name: "SellerPage",
        components: {Seller}
    }
</script>

<style scoped>

</style>