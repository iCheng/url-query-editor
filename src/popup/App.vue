<template>
    <div class="popup-container">
        <Btns />
        <ParamsList></ParamsList>
    </div>
</template>

<script setup lang="ts">
import Btns from './componment/btns.vue'
import ParamsList from './componment/ParamsList.vue'

</script>

<style scoped lang="scss">
.popup-container {
    padding: 16px 0 20px;
    width: 400px;
    max-height: 500px;
    min-height: 250px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background: linear-gradient(180deg, #fffdf9 0%, #ffffff 60%);
}
</style>