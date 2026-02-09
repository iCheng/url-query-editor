<template>
    <div class="popup-container">
        <!-- <Btns /> -->
        <div v-if="loading" class="loading">加载中...</div>
        <div v-else-if="error" class="error">{{ error }}</div>
        <div v-else class="content">
            <div class="params-section">
                <div v-if="params.length === 0" class="empty-state">
                    暂无查询参数
                </div>
                <div v-else class="params-list">
                    <div v-for="(param, index) in params" :key="index" class="param-item">
                        <span class="param-key">{{ param.key }}</span>
                        <!-- <span class="equals">: </span> -->
                        <input class="param-value" v-model="param.value" @keyup.enter="applyChanges" placeholder="参数值">
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
// import Btns from './componment/btns.vue'

interface QueryParam {
    key: string
    value: string
}

const loading = ref(true)
const error = ref('')
const currentUrl = ref('') // 当前页面url
const params = ref<QueryParam[]>([]) // 参数

function parseUrlParams(url: string): QueryParam[] {
    try {
        const urlObj = new URL(url)
        const paramsArray: QueryParam[] = []

        urlObj.searchParams.forEach((value, key) => {
            paramsArray.push({ key, value })
        })

        return paramsArray
    } catch (e) {
        return []
    }
}

function buildUrlWithParams(baseUrl: string, params: QueryParam[]): string {
    try {
        const urlObj = new URL(baseUrl)
        urlObj.search = '' // 清空现有参数

        // 使用新的参数构建 URL
        params.forEach(param => {
            if (param.key.trim()) {
                urlObj.searchParams.set(param.key.trim(), param.value.trim())
            }
        })

        return urlObj.toString()
    } catch (e) {
        return baseUrl
    }
}

function applyChanges() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (chrome.runtime.lastError) {
            error.value = chrome.runtime.lastError.message || '应用更改失败'
            return
        }

        const tab = tabs[0]
        if (!tab || !tab.id || !tab.url) {
            error.value = '无法获取当前页面信息'
            return
        }

        // 检查是否是特殊页面
        if (tab.url.startsWith('chrome://') ||
            tab.url.startsWith('chrome-extension://') ||
            tab.url.startsWith('edge://') ||
            tab.url.startsWith('about:')) {
            error.value = '无法编辑此类型页面的URL参数'
            return
        }

        // 构建新的 URL
        const newUrl = buildUrlWithParams(tab.url, params.value)

        // 导航到一个新的 URL 或修改标签页的其他属性
        // API: https://developer.mozilla.org/zh-CN/docs/Mozilla/Add-ons/WebExtensions/API/tabs/update
        chrome.tabs.update(tab.id, { url: newUrl }, () => {
            if (chrome.runtime.lastError) {
                error.value = chrome.runtime.lastError.message || '应用更改失败'
            } else {
                // 更新当前 URL
                currentUrl.value = newUrl
            }
        })
    })
}

function loadCurrentTab() {
    loading.value = true
    error.value = ''

    // 查询当前活动的标签页
    // API: https://developer.mozilla.org/zh-CN/docs/Mozilla/Add-ons/WebExtensions/API/tabs/query
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        // 检查是否有错误
        if (chrome.runtime.lastError) {
            error.value = chrome.runtime.lastError.message || '未知错误'
            loading.value = false
            return
        }

        // 因为 chrome.tabs.query() 返回一个数组，【即使只匹配到一个标签页】
        // 所以获取第一个标签页对象
        const tab = tabs[0]
        if (!tab || !tab.url) {
            error.value = '无法获取当前页面URL'
            loading.value = false
            return
        }

        // 保存URL并解析参数
        currentUrl.value = tab.url
        const parsedParams = parseUrlParams(tab.url)
        params.value = parsedParams
        loading.value = false
    })
}

onMounted(() => {
    loadCurrentTab()
})
</script>

<style scoped lang="scss">
.popup-container {
    margin-top: 20px;
    margin-bottom: 20px;
    /* padding: 16px; */
    width: 400px;
    max-height: 500px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    // padding: 30px;

    // .content-container {
    //     border: 1px solid #ddd;
    //     border-radius: 5px;
    //     padding: 10px;
    // }
    .loading,
    .error {
        padding: 12px;
        text-align: center;
        color: #666;
    }

    .error {
        color: #d32f2f;
        /* background-color: #ffebee; */
        border-radius: 4px;
    }

    .content {
        display: flex;
        flex-direction: column;
        gap: 16px;
    }


    .params-section {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    .empty-state {
        padding: 24px;
        text-align: center;
        color: #999;
        font-size: 13px;
    }

    .params-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
        max-height: 300px;
        overflow-y: auto;
    }

    .param-item {
        display: flex;
        align-items: center;
        gap: 8px;
        margin: 4px 0px;
        border-radius: 4px;
        margin: 0px 20px;
    }

    .param-key {
        font-weight: 800;
        color: Orange;
        word-break: break-all;
    }

    .equals {
        font-weight: 800;
        color: Orange;
        flex-shrink: 0;
    }

    .param-value {
        flex: 1;
        padding: 6px 8px;
        border: 1px solid #ddd;
        border-radius: 8px;
        font-size: 13px;
        color: #333;
        background-color: #fff;
        transition: border-color 0.2s;
    }

    .param-value:focus {
        outline: none;
        border-color: Orange;
    }

    .param-value::placeholder {
        color: #999;
    }
}
</style>