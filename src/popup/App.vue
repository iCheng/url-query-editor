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
    margin-top: 20px;
    margin-bottom: 20px;
    width: 400px;
    max-height: 500px;
    min-height: 200px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}
</style>