<template>
    <div class="btns-container">
        <AddBtn></AddBtn>
        <SearchBtn></SearchBtn>
    </div>
</template>

<script setup lang="ts"> 
import AddBtn from './AddBtn.vue'
import SearchBtn from './SearchBtn.vue'

</script>

<style scoped lang="scss">
.btns-container {
    display: flex;
    height: 30px;
    gap: 20px;
    // padding: 0px 20px 10px 20px;
    margin: 0px 20px 10px 20px;
    justify-content: space-between;
    align-items: center;
}
</style>