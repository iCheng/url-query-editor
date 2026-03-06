<template>
    <div class="btns-container">
        <div class="btns-row">
            <AddBtn></AddBtn>
            <SearchBtn></SearchBtn>
        </div>
        <div class="btns-row">
            <span class="env-label">切换环境</span>
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
    padding-bottom: 8px;
    border-bottom: 1px solid #f0f1f5;

    .btns-row {
        display: flex;
        height: 32px;
        justify-content: space-between;
        align-items: center;
        gap: 10px;
        margin-bottom: 6px;

        &:last-child {
            margin-bottom: 0;
        }
    }

    .env-label {
        flex-shrink: 0;
        font-size: 12px;
        font-weight: 500;
        color: #6b7280;
        user-select: none;
        white-space: nowrap;
    }
}
</style>