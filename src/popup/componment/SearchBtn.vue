<template>
    <div class="btns-container">
        <el-input class="search-input" v-model="iputKey" :placeholder="placeholder" @keyup.enter="onClick">
            <template #append>
                <img class="search-icon" :src="Sousuo" alt="search" @click="onClick"/>
            </template>
        </el-input>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Sousuo from '@/assets/imgs/sousuo.png'

const iputKey = ref('') // 输入的key
const placeholder = ref('Search Key')

const onClick = () => {
    if (iputKey.value === '') return;
    const paramsListDom = document.querySelector('#params-list')
    if (!paramsListDom) return;
    const targetDom = paramsListDom.querySelector(`[id^="${iputKey.value}"]`)
    if (targetDom) {
        iputKey.value = ''
        targetDom.scrollIntoView({
            behavior: 'smooth',
            block: 'center'  // 居中
        });

        targetDom.classList.add('highlight-flash')
        setTimeout(() => {
            targetDom.classList.remove('highlight-flash')
        }, 3000)
    } else {
        iputKey.value = ''
        placeholder.value = 'not found key'
    }
}

</script>

<style scoped lang="scss">
.btns-container {
    display: flex;
    height: 30px;
    gap: 20px;

    .search-input {
        height: 24px;
        
        // 使用 :deep() 穿透作用域，修改 Element Plus 组件样式
        :deep(.el-input-group__append) {
            padding: 0px !important;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        // 修改 placeholder 字体大小
        :deep(.el-input__inner::placeholder) {
            font-size: 12px; // 根据需要调整大小
        }
        
        
        .search-icon {
            cursor: pointer;
            width: 14px;
            height: 14px;
            padding: 4px;
            vertical-align: middle;
        }
    }
}
</style>