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
    height: 32px;
    gap: 10px;
    margin: 0 16px;
    padding-bottom: 12px;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #f0f1f5;
}
</style>