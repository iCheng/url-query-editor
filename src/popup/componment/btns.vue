<template>
    <div class="btns-container">
        <div class="sort-btn btn-item">排序</div>
        <div class="search-btn btn-item">搜索</div>
        <div class="add-btn btn-item">添加</div>
    </div>
</template>

<script setup lang="ts"> 
</script>

<style scoped lang="scss">
.btns-container {
    display: flex;
    height: 30px;
    gap: 20px;
    .btn-item {
        height: 20px;
        width: 30px;
        height: 20px;
        width: 50px;
        display: flex;
        justify-content: center;
        align-items: center;
        background: gray;
        border-radius: 5px;
    }
}
</style>