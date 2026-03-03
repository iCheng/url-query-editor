<template>
    <div class="search-btn-box">
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
    flex: 1;

    .search-input {
        width: 100%;

        :deep(.el-input__wrapper) {
            border-radius: 7px;
            box-shadow: 0 0 0 1px #e5e7eb inset;
            background: #f9fafb;
            padding: 0 2px 0 10px;
            height: 28px;
            transition: all 0.2s;

            &:hover {
                box-shadow: 0 0 0 1px #ffd199 inset;
                background: #fffdf9;
            }

            &.is-focus {
                box-shadow: 0 0 0 1.5px #ff8c00 inset;
                background: #ffffff;
            }
        }

        :deep(.el-input__inner) {
            font-size: 12px;
            color: #374151;
            height: 28px;

            &::placeholder {
                font-size: 12px;
                color: #9ca3af;
            }
        }

        :deep(.el-input-group__append) {
            padding: 0 !important;
            display: flex;
            align-items: center;
            justify-content: center;
            background: transparent;
            border: none;
            box-shadow: none;
        }

        .search-icon {
            cursor: pointer;
            width: 13px;
            height: 13px;
            padding: 5px;
            vertical-align: middle;
            opacity: 0.45;
            transition: opacity 0.2s;

            &:hover {
                opacity: 1;
            }
        }
    }
}
</style>