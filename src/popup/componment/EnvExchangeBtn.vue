<template>
    <div class="env-exchange-btn-container">
        <!-- 环境切换 -->
        <el-cascader
        placeholder="Select Environment"
        v-model="value"
        :options="options"
        :props="props"
        @change="handleChange"
        />
        <!-- 新增环境 -->
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

const value = ref([])

const props = {
  expandTrigger: 'hover' as const,
}

const options = ref([
  {
    label: 'sim环境',
    value: 'dsim260-page.intra.xiaojukeji.com'
  },
  {
    label: 'pre环境',
    value: 'option1'
  },
  {
    label: 'online环境',
    value: 'option1'
  }
])

const handleChange = (value: any) => {
  console.log(value)
}


const customStyle = {
    width: "200px"
}

let iputKey = ref('')
let inputValue = ref('')

const onClick = () => {}

</script>

<style scoped lang="scss">
.env-exchange-btn-container {
    display: block;
}
</style>