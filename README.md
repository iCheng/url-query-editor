# URL Query Editor

简洁实用的 Chrome 浏览器扩展，用于快速查看和编辑当前页面的 URL 查询参数。

## ✨ 功能特性

- 📋 **自动解析 URL 参数**：打开扩展后自动获取当前页面的所有查询参数
- ✏️ **实时编辑参数值**：直接在输入框中修改参数值
- ⚡ **快速应用更改**：按 `Enter` 键即可应用更改并刷新页面

## 🚀 安装到 Chrome 浏览器

### 方法一：开发者模式加载（推荐）

1. **打包项目**
   ```bash
   pnpm install
   pnpm run build
   ```
   打包后的文件会在 `dist` 目录中。

2. **打开 Chrome 扩展管理页面**
   - 在地址栏输入 `chrome://extensions/` 并回车
   - 或者点击浏览器右上角三点菜单 → 更多工具 → 扩展程序

3. **启用开发者模式**
   - 在页面右上角打开 **"开发者模式"** 开关

4. **加载扩展**
   - 点击 **"加载已解压的扩展程序"** 按钮
   - 选择项目的 `dist` 文件夹
   - 扩展安装完成！

## 🛠️ 开发

### 环境要求

- Node.js 20.19+ 或 22.12+
- pnpm（推荐）或 npm

### 安装依赖

```bash
pnpm install
```

### 开发模式

```bash
pnpm run dev
```

### 打包

```bash
pnpm run build
```

打包后的文件在 `dist` 目录中。

### 更新扩展

如果修改了代码：

1. 重新打包：`pnpm run build`
2. 在 `chrome://extensions/` 页面找到你的扩展
3. 点击扩展卡片上的 **刷新按钮** 🔄（不需要重新加载整个扩展）

## 🛠️ 技术栈

- **Vue 3**
- **TypeScript**
- **Vite**
- **Chrome Extension API**

