import { ref } from 'vue'

const refreshTrigger = ref(0)

// 定义参数刷新插件列表
export function useParamsRefresh() {
    /**
     * @description 触发参数刷新,用于在添加参数后触发参数列表刷新
     */
    const triggerRefresh = () => {
        refreshTrigger.value++
    }

    return {
        refreshTrigger,
        triggerRefresh,
    }
}
