<template>
    <div class="btns-container">
        <div class="btns-row">
            <AddBtn></AddBtn>
            <SearchBtn></SearchBtn>
        </div>
        <div class="btns-row">
            <EnvExchangeBtn></EnvExchangeBtn>
        </div>
    </div>
</template>

<script setup lang="ts"> 
import AddBtn from './AddBtn.vue'
import SearchBtn from './SearchBtn.vue'
import EnvExchangeBtn from './EnvExchangeBtn.vue'

</script>

<style scoped lang="scss">
.btns-container {
    margin: 0 16px;
    padding-bottom: 12px;
    border-bottom: 1px solid #f0f1f5;
    .btns-row {
        display: flex;
        height: 32px;
        justify-content: space-between;
        align-items: center;
        gap: 10px;
    }
}
</style>