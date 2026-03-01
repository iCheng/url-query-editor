<template>
    <div class="btn-item add">
        <el-popover
            ref="popoverRef"
            placement="bottom-start"
            popper-class="add-params-popover"
            trigger="click"
            :popper-style="customStyle"
        >
            <div class="add-params-box">
                <div class="title">key: </div>
                <el-input size="small" class="input" v-model="iputKey" placeholder="Input Key" @keyup.enter="onClick"/>
                <div class="title">value: </div>
                <el-input size="small" v-model="inputValue" placeholder="Input Value" @keyup.enter="onClick"/>
                <el-button class="confirm-btn" size="small" @click="onClick">Confirm</el-button>
            </div>
            <template #reference>
                <el-button color="Orange" size="small" >Add</el-button>
            </template>
        </el-popover>
    </div>
</template>

<script setup lang="ts"> 
import { ref } from 'vue'
import type { ElPopover } from 'element-plus'
import { useParamsRefresh } from '../composables/useParamsRefresh'

const { triggerRefresh } = useParamsRefresh()

const popoverRef = ref<InstanceType<typeof ElPopover> | null>(null)
const customStyle = {
    width: "200px"
}

let iputKey = ref('')
let inputValue = ref('')


const onClick = () => {
    if (iputKey.value === '' || inputValue.value === '') {
        return
    }
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (chrome.runtime.lastError) {
            return
        }

        const tab = tabs[0]
        if (!tab || !tab.id || !tab.url) {
            return
        }

        // 检查是否是特殊页面
        if (tab.url.startsWith('chrome://') ||
            tab.url.startsWith('chrome-extension://') ||
            tab.url.startsWith('edge://') ||
            tab.url.startsWith('about:')) {
            alert('无法编辑此类型页面的URL参数')
            return
        }

        // 构建新的 URL
        let url = new URL(tab.url)
        let urlParams = new URLSearchParams(url.search)
        urlParams.set(iputKey.value, inputValue.value)
        url.search = urlParams.toString()

        // 导航到一个新的 URL 或修改标签页的其他属性
        // API: https://developer.mozilla.org/zh-CN/docs/Mozilla/Add-ons/WebExtensions/API/tabs/update
        chrome.tabs.update(tab.id, { url: url.toString() }, () => {
            if (chrome.runtime.lastError) {
                alert('应用更改失败')
            } else {
                popoverRef.value?.hide()
                iputKey.value = ''
                inputValue.value = ''
                setTimeout(() => triggerRefresh(), 4000) // 4秒后触发参数列表刷新
            }
        })
    })
}

</script>

<style scoped lang="scss">
.btn-item {
    width: 50px;
    height: 30px;
}
.confirm-btn {
    margin-top: 10px;
    height: 30px;
    width: 100%;
    background-color: Orange;
    color: white;
    border: none;
    opacity: 0.9;
    &:hover {
        opacity: 0.7;
    }
}
</style>

<style lang="scss">
    .add-params-popover {
        width: 500px;
        .add-params-box {
            width: 100%;
            .title {
                margin: 5px 0px;
            }
            .input {
                width: 100%;
            }
            .input:first-child {
                margin-bottom: 20px;
            }
        }
    }
</style>