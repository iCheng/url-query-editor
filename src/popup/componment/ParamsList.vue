<template>
    <div v-if="loading" class="loading">加载中...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else class="content">
        <!-- 参数列表容器 -->
        <div class="params-section">
            <!-- 头部 -->
            <div class="params-header">
                <span class="params-title">参数列表 Parameters</span>
                <span class="params-count">{{ params.length }} 个参数</span>
            </div>
            <div v-if="params.length === 0" class="empty-state">
                暂无查询参数
            </div>
            <!-- 参数列表 -->
            <div id="params-list" v-else class="params-list">
                <div v-for="(param, index) in params" :key="index" class="param-item">
                    <!-- 参数输入框 -->
                    <input
                        :id="`${param.key}-${index}`"
                        class="param-input key"
                        v-model="param.key"
                        @keyup.enter="applyChanges"
                        placeholder="key">
                    <span class="equal-sign">=</span> 
                    <input 
                        class="param-input"
                        v-model="param.value"
                        @keyup.enter="applyChanges"
                        placeholder="参数值">
                    <!-- 参数操作按钮 -->
                    <div class="param-item-actions">
                        <img v-if="param.key" class="copy-icon" :src="Copy" @click="copyValue(param.value)">
                        <img v-if="param.key" class="delete-icon" :src="Delete" @click="deleteParam(index)">
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import Copy from '@/assets/imgs/copy.png'
import Delete from '@/assets/imgs/delete.svg'
import { ref, onMounted, watch } from 'vue'
import { useParamsRefresh } from '../composables/useParamsRefresh'

const { refreshTrigger } = useParamsRefresh()

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

        // 解析常规查询参数 (?key=value)
        urlObj.searchParams.forEach((value, key) => {
            paramsArray.push({ key, value })
        })

        // 解析 hash 中的查询参数 (#/path?key=value)
        // if (urlObj.hash.includes('?')) {
        //     const hashPart = urlObj.hash.split('?')[1]
        //     if (hashPart) {
        //         const hashParams = new URLSearchParams(hashPart)
        //         hashParams.forEach((value, key) => {
        //             paramsArray.push({ key, value })
        //         })
        //     }
        // }

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


/**
 * @description 删除参数并刷新导航
 * @param index 参数索引
 */
function deleteParam(index: number) {
    params.value = params.value.filter((_, i) => i !== index)
    applyChanges()
}

/**
 * @description 复制参数值
 * @param value 参数值
 */
function copyValue(value: string) {
    navigator.clipboard.writeText(value)
    .then(() => {
    })
    .catch((err) => {
        console.log('========> 复制失败 err: ', err);
    })
}


onMounted(() => {
    loadCurrentTab()
})

// 监听参数刷新,用于在添加参数后触发参数列表刷新
watch(refreshTrigger, () => {
    loadCurrentTab()
})
</script>

<style scoped lang="scss">
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

    .params-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 20px 0px;
        margin-top: 4px;
        
        .params-title {
            font-size: 13px;
            font-weight: 500;
            color: Orange;
        }
    
        .params-count {
            font-size: 12px;
            color: Orange;
            opacity: 0.6;
        }
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
        // font-weight: 800;
        // color: Orange;
        word-break: break-all;
    }

    .equal-sign {
        color: Orange;
    }

    .param-input {
        padding: 6px 8px;
        border: 1px solid #ddd;
        border-radius: 8px;
        font-size: 13px;
        color: #333;
        background-color: #fff;
        transition: border-color 0.2s;
        &.key {
            width: 110px;
        }
    }

    .param-input:focus {
        outline: none;
        border-color: Orange;
    }

    .param-input::placeholder {
        color: #999;
    }

    .param-item-actions {
        display: flex;
        align-items: center;
        .copy-icon,
        .delete-icon {
            width: 20px;
            cursor: pointer;
            &:hover {
                opacity: 0.8;
            }
        }
    }

    .highlight-flash {
    animation: flash-highlight 1s ease-in-out 3;
    }

    @keyframes flash-highlight {
    0%   { background-color: rgba(255, 215, 0, 0); }
    50%  { background-color: rgba(255, 215, 0, 0.8); }
    100% { background-color: rgba(255, 215, 0, 0); }
    }
</style>