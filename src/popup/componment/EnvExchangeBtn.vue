<template>
  <div class="env-exchange-btn-container">
    <!-- 环境切换 -->
    <el-cascader
      placeholder="选择环境"
      v-model="selectEnv"
      :options="selectOptions"
      :props="props"
      popper-class="env-cascader-popper"
      :multiple="false"
      @change="handleChange"
    >
      <template #default="{ data }">
        <div class="env-item">
          <span>{{ data.label }}</span>
          <div class="delete-btn-box">
            <img :src="Delete2Icon" class="delete-btn" @click.stop="deleteEnv(data)">
          </div>
        </div>
      </template>
    </el-cascader>
    <!-- 新增环境 -->
    <el-popover
      ref="popoverRef"
      placement="bottom-start"
      popper-class="add-params-popover"
      trigger="click"
      :popper-style="customStyle"
    >
      <div class="add-params-box">
        <div class="title">环境名:</div>
        <el-input
          size="small"
          class="input"
          v-model="iputKey"
          placeholder="输入环境名"
          @keyup.enter="AddEnv"
        />
        <div v-if="iputKey && isEnvNameExists" class="error-tip">
          已存在重复的环境名
        </div>
        <div class="title">域名:</div>
        <el-input
          size="small"
          v-model="inputValue"
          placeholder="e.g. example.com"
          :style="inputValue && !isDomainValid ? { '--el-input-border-color': 'var(--el-color-danger)' } : {}"
          @keyup.enter="AddEnv"
        />
        <div v-if="inputValue && !isDomainValid" class="error-tip">
          请输入有效的域名格式
        </div>
        <el-button class="confirm-btn" size="small" @click="AddEnv"
          >Confirm</el-button
        >
      </div>
      <template #reference>
        <el-button color="Orange" size="small">Add 环境</el-button>
      </template>
    </el-popover>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from "vue";
import { onMounted } from "vue";
import { ENV_STORAGE_KEY } from "@/constants";
import type { EnvItem } from "@/type";
import Delete2Icon from "@/assets/imgs/delete2.svg";

const selectEnv = ref<string | null>(null); // 勾选的环境（单选）
let envList = reactive<EnvItem[]>([]); // 环境列表缓存

const selectOptions = computed(() => // 可选择的环境
  envList.map((env) => ({
    label: env.name,
    value: env.domain,
  })),
);

const props = {
  expandTrigger: "hover" as const,
};

const customStyle = {
  width: "200px",
};


/**
 * @description 切换环境：替换当前 URL 的域名为所选环境的域名
 * @param value 级联选择器选中的值，为 domain
 */
const handleChange = (newDomain: string) => {
  if (!newDomain) return;

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (chrome.runtime.lastError) return;

    const tab = tabs[0];
    if (!tab || !tab?.url) return;
    console.log('========> tab.url', tab.url);
    if (
      tab.url.startsWith("chrome://") ||
      tab.url.startsWith("chrome-extension://") ||
      tab.url.startsWith("edge://") ||
      tab.url.startsWith("about:")
    ) {
      console.log('========> 特殊页面');
      return;
    }

    try {
      const url = new URL(tab.url)
      url.hostname = newDomain
      chrome.tabs.update(tab.id, { url: url.toString() });
    } catch (e) {
      // URL 解析失败时忽略
      console.log('========> 解析失败', e);
    }
  });
};

/**
 * @description 删除环境
 * @param data { label: string; value: string } 该选择项标签和值
 */
const deleteEnv = async (data: { label: string; value: string }) => {
  const index = envList.findIndex((env) => env.domain === data.value); // 找到要删除的环境索引
  if (index > -1) {
    envList.splice(index, 1);
    await chrome.storage.local.set({ [ENV_STORAGE_KEY]: [...envList] });
    // 若当前选中的被删除，清空选择
    if (selectEnv.value === data.value) {
      selectEnv.value = null;
    }
  }
};

let iputKey = ref("");
let inputValue = ref("");

// 域名正则：支持普通域名、IP、带端口，不含协议和路径
const DOMAIN_REG = /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}(?::\d{1,5})?$|^(?:\d{1,3}\.){3}\d{1,3}(?::\d{1,5})?$/;
const isEnvNameExists = computed(() => envList.some((env) => env.name === iputKey.value)); // 环境名是否存在
const isDomainValid = computed(() => DOMAIN_REG.test(inputValue.value)); // 域名是否通过正则

/**
 * @description 新增环境
 */
const AddEnv = async () => {
  if (iputKey.value === "" || inputValue.value === "") {
    return;
  }

  // 校验是否通过
  if (!isDomainValid.value || isEnvNameExists.value) {
    return;
  }

  const existingEnv = envList.find((env) => env.name === iputKey.value);
  if (existingEnv) {
    console.log("========> 已存在");
    return;
  }

  const newEnv: EnvItem = { name: iputKey.value, domain: inputValue.value };
  envList.push(newEnv);

  await chrome.storage.local.set({ [ENV_STORAGE_KEY]: [...envList] });

  iputKey.value = "";
  inputValue.value = "";
};

onMounted(async () => {
  // 获取环境列表
  const res = await chrome.storage.local.get(ENV_STORAGE_KEY);
  const list = (res[ENV_STORAGE_KEY] as EnvItem[]) || [];
  envList.splice(0, envList.length, ...list);
  console.log('========> envList', envList);
});
</script>

<style scoped lang="scss">
.env-exchange-btn-container {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;

  // 级联选择器宽度撑满剩余空间
  :deep(.el-cascader) {
    flex: 1;
    min-width: 0;

    .el-input__wrapper {
      border-radius: 7px;
      box-shadow: 0 0 0 1px #e5e7eb inset;
      background: #f9fafb;
      padding: 0 8px 0 10px;
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

    .el-input__inner {
      font-size: 12px;
      color: #374151;
      height: 28px;

      &::placeholder {
        font-size: 12px;
        color: #9ca3af;
      }
    }

    // 下拉箭头图标颜色
    .el-input__suffix .el-icon {
      color: #9ca3af;
      transition: color 0.2s;
    }

    &:hover .el-input__suffix .el-icon {
      color: #ff8c00;
    }
  }

  // Add 按钮与 AddBtn.vue 保持一致
  :deep(.el-button) {
    flex-shrink: 0;
    border-radius: 7px;
    height: 28px;
    font-size: 12px;
    font-weight: 600;
    padding: 0 14px;
    letter-spacing: 0.03em;
  }
}

.error-tip {
  font-size: 11px;
  color: var(--el-color-danger);
  margin-top: 3px;
  line-height: 1.4;
}
</style>

<style lang="scss">
// 级联选择器下拉面板
.env-cascader-popper {
  border-radius: 10px !important;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1), 0 2px 8px rgba(0, 0, 0, 0.06) !important;
  border: 1px solid #f0f1f5 !important;
  overflow: hidden;

  .el-cascader-menu {
    min-width: 160px;
    height: auto !important;
    max-height: 150px;
    overflow-y: auto;
    border-right: 1px solid #f0f1f5;

    &:last-child {
      border-right: none;
    }

    // 滚动条样式
    &::-webkit-scrollbar {
      width: 4px;
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 4px;
      background: #e5e7eb;
      &:hover {
        background: #ffd199;
      }
    }
    &::-webkit-scrollbar-track {
      background: transparent;
    }

    .el-cascader-menu__wrap {
      height: auto !important;
    }
  }

  .el-cascader-node {
    padding: 0 12px;
    height: 34px;
    font-size: 12px;
    color: #374151;
    border-radius: 0;
    transition: background 0.15s;
    display: flex;
    align-items: center;
    justify-content: space-between;

    &:hover {
      background: #fff8f0;
    }

    &.is-active,
    &[aria-expanded="true"] {
      background: #fff3e0;
      color: #ff8c00;
      font-weight: 600;
    }

    // 隐藏原生 radio/checkbox
    .el-radio,
    .el-checkbox {
      display: none;
    }

    // 节点 label
    .el-cascader-node__label {
      flex: 1;
      padding: 0;
      font-size: 12px;
    }
  }

  // 每个选项行内的删除按钮区域
  .env-item {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .delete-btn-box {
      display: flex;
      align-items: center;
      margin-left: 6px;
  
      .delete-btn {
        width: 13px;
        height: 13px;
        padding: 4px;
        border-radius: 5px;
        box-sizing: content-box;
        opacity: 0.35;
        cursor: pointer;
        transition: opacity 0.15s, background 0.15s;
  
        &:hover {
          opacity: 1;
          background: rgba(220, 38, 38, 0.08);
        }
      }
    }
  }
}

// 新增环境 popover（复用 add-params-popover 样式，无需重复，仅做扩展覆盖）
.add-params-popover {
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

  // el-input 统一风格
  .el-input__wrapper {
    border-radius: 7px;
    box-shadow: 0 0 0 1px #e5e7eb inset;
    background: #f9fafb;
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

  .el-input__inner {
    font-size: 12px;
    color: #374151;

    &::placeholder {
      font-size: 12px;
      color: #9ca3af;
    }
  }
}
</style>
