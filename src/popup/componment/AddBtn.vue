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
                <el-button color="Orange" size="small" >Add 参数</el-button>
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
    flex-shrink: 0;
    height: 28px;
    display: flex;
    align-items: center;

    :deep(.el-button) {
        border-radius: 7px;
        height: 28px;
        font-size: 12px;
        font-weight: 600;
        padding: 0 14px;
        letter-spacing: 0.03em;
    }
}
.confirm-btn {
    margin-top: 14px;
    height: 32px;
    width: 100%;
    background: linear-gradient(135deg, #ff8c00, #ffaa40);
    color: white;
    border: none;
    border-radius: 7px;
    font-weight: 600;
    font-size: 13px;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
        background: linear-gradient(135deg, #e67e00, #ff8c00);
        box-shadow: 0 3px 10px rgba(255, 140, 0, 0.3);
    }

    &:active {
        transform: scale(0.98);
    }
}
</style>

<style lang="scss">
    .add-params-popover {
        border-radius: 12px !important;
        padding: 16px !important;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1), 0 2px 8px rgba(0, 0, 0, 0.06) !important;
        border: 1px solid #f0f1f5 !important;

        .add-params-box {
            width: 100%;

            .title {
                font-size: 11px;
                font-weight: 600;
                color: #9ca3af;
                text-transform: uppercase;
                letter-spacing: 0.06em;
                margin: 12px 0 6px;

                &:first-child {
                    margin-top: 0;
                }
            }

            .input {
                width: 100%;
            }
        }
    }
</style>