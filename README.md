# HUAZHI AI 工业智能可视化大屏

基于 **Vue 3 + TypeScript + Vite** 构建的数据驱动工业智能可视化大屏应用。以 1920×1080 为设计基准，通过自适应缩放适配任意分辨率屏幕，同时支持 PC 端与移动端触控交互。所有业务数据均由 JSON 配置文件驱动，无需修改代码即可完成企业、技能与文本内容的更新。

---

## 目录

- [1. 环境要求与依赖安装](#1-环境要求与依赖安装)
- [2. 启动与构建](#2-启动与构建)
- [3. 功能概述](#3-功能概述)
- [4. 设计思路与架构](#4-设计思路与架构)
- [5. 交互逻辑](#5-交互逻辑)
- [6. 项目结构](#6-项目结构)
- [7. 数据与文本配置指南](#7-数据与文本配置指南)
- [8. 技术栈](#8-技术栈)

---

## 1. 环境要求与依赖安装

### 运行环境

| 依赖项 | 最低版本 | 说明 |
|--------|----------|------|
| **Node.js** | >= 18.0 | 推荐使用最新 LTS 版本，下载地址：https://nodejs.org |
| **npm** | >= 9.0 | 随 Node.js 一同安装，无需单独配置 |

> 安装完成后，可在终端中执行 `node -v` 和 `npm -v` 验证版本号。

### 安装项目依赖

在项目根目录下执行：

```bash
npm install
```

该命令会根据 `package.json` 自动下载并安装所需的全部依赖包到 `node_modules/` 目录。首次安装通常需要 1-3 分钟，取决于网络环境。

### 一键启动（非开发者推荐）

项目提供了 Windows 一键启动脚本 **`start.bat`**，双击即可自动完成环境检测、依赖安装与服务器启动：

1. 双击项目根目录下的 `start.bat`
2. 脚本将自动检测 Node.js 环境，若未安装会给出提示
3. 首次运行时自动执行 `npm install` 安装依赖
4. 启动完成后自动在默认浏览器中打开大屏页面
5. 终端窗口中按 `Ctrl+C` 可停止服务器

---

## 2. 启动与构建

### 开发模式

```bash
npm run dev
```

启动 Vite 开发服务器，默认监听 `http://localhost:5173`。支持热模块替换（HMR），修改源代码后浏览器会自动更新，无需手动刷新。

### 生产构建

```bash
npm run build
```

执行 TypeScript 类型检查（`vue-tsc`）与 Vite 打包，生成优化后的静态文件到 `dist/` 目录。构建产物包含压缩后的 HTML、CSS、JavaScript 与图片资源，可直接部署至任何静态文件服务器。

### 预览生产构建

```bash
npm run preview
```

在本地启动一个轻量 HTTP 服务器，用于预览 `dist/` 目录中的生产构建产物。

### Excel 数据管理工具

项目提供了基于 Excel 的数据配置工具，非开发者可直接通过编辑 Excel 表格来管理企业、技能等全部业务数据，无需手动编辑 JSON 文件。

#### 导出当前数据到 Excel

```bash
npm run export-data
```

将 `data.json`、`zh.json`、`en.json` 三个文件的数据合并导出为一份 `data-template.xlsx`。生成的 Excel 包含 7 个工作表（公司 / 技能 / 子技能 / 分类 / KPI指标 / 场景标签 / UI文本），所有中英文文本都集中在同一行内，便于对照编辑。

#### 从 Excel 导入数据

```bash
npm run import-data
```

读取 `data-template.xlsx`，自动生成 `data.json`、`zh.json`、`en.json` 三个文件。导入时会自动校验数据（技能 ID 引用是否存在、状态值是否合法等），并输出警告信息。

#### 典型工作流

1. 运行 `npm run export-data` → 生成 `data-template.xlsx`
2. 用 Excel / WPS 编辑表格（添加企业、修改技能名称等）
3. 运行 `npm run import-data` → 自动更新三个 JSON 配置文件
4. 运行 `npm run dev` 查看效果

---

## 3. 功能概述

本项目是一个面向工业智能领域的全景式数据可视化大屏，集中展示企业合作管线、核心技能体系与业务场景之间的关联关系。

### 核心功能

| 功能模块 | 说明 |
|----------|------|
| **KPI 状态过滤** | 顶部三个 KPI 指标（储备中 / 实施中 / 推广中）支持多选切换，实时过滤并展示对应状态的企业卡片 |
| **企业卡片** | 左右两侧以等距立方体风格呈现企业列表，展示企业名称与所属行业 |
| **SVG 发光连线** | 悬停企业卡片时，自动绘制从企业到关联技能节点的贝塞尔曲线发光连线，直观展示关联关系 |
| **3D 等距技能平台** | 中心区域以三层等距切图叠加的方式呈现三大技能分类（柔性装配 / 柔性质检 / 柔性码垛），每个分类承载若干技能图标 |
| **技能子菜单** | 悬停（PC）或点击（移动端）技能图标展开二级子技能列表，继续悬停可查看详细描述 |
| **企业详情弹窗** | 点击企业卡片弹出毛玻璃风格详情弹窗，包含企业信息、核心业务场景流程图、核心技能徽章与合作推进进度条 |
| **底部信息面板** | 页面底部三个分类面板，各自展示对应技能分类下的企业滚动列表，支持展开/折叠 |
| **国际化（i18n）** | 支持中文 / 英文双语切换，全站文本响应式更新，无需刷新页面 |
| **设置面板** | 右上角齿轮按钮打开设置下拉菜单，可切换语言、移动端模式和底部面板显隐 |

### 视觉特性

- **毛玻璃效果（Glassmorphism）**：所有面板和弹窗采用 `backdrop-filter: blur()` + 半透明背景 + 发光边框，营造层次丰富的视觉效果
- **3D 等距视图**：中心技能平台通过三层预渲染切图（底座 → 中层底座 → 上层平台）叠加构成伪 3D 等距效果
- **SVG 发光连线**：使用 `feGaussianBlur` 高斯模糊滤镜与 `stroke-dasharray` 流光动画，实现动态发光连线效果
- **统一微动效**：所有可交互元素采用一致的 hover 放大（`scale(1.05)`）、亮度提升和 `cubic-bezier(0.4, 0, 0.2, 1)` 过渡曲线

### 移动端适配

- 默认启用移动端模式，可在设置面板中手动切换
- 移动端下所有 hover 交互替换为 touch/click 事件：单击企业卡片激活高光状态，再次单击打开详情弹窗
- 技能子菜单、弹窗内技能详情等均适配触控操作
- 弹窗关闭按钮采用 `@touchend.prevent.stop` 防止点击穿透

---

## 4. 设计思路与架构

### 整体架构

采用 **Vue 3 Composition API** + **单文件组件（SFC）** 架构，所有组件使用 `<script setup lang="ts">` 语法。项目不引入任何第三方 UI 库或状态管理库，全部 16 个组件均为手写实现，保持最小依赖原则。

### 数据驱动设计

所有页面展示的业务数据——企业列表、技能体系、KPI 指标、企业详情——均集中存储在 `src/config/data.json` 这一个文件中。该文件是整个应用的**单一数据源（Single Source of Truth）**，遵循 `DashboardConfig` TypeScript 接口约束。页面文本内容（企业名称、技能描述等）通过 i18n 键名引用 `src/locales/` 下的语料文件。

### 响应式缩放方案

以 **1920×1080** 为设计基准，通过 `DashboardContainer` 组件计算 `Math.min(windowWidth / 1920, windowHeight / 1080)` 缩放比例，使用 CSS `transform: scale()` 对整个内容区进行等比缩放。所有子组件内部使用绝对定位，坐标基于 1920×1080 坐标系，无需关心实际屏幕尺寸。

### 状态管理模式

全局状态集中在 `App.vue` 根组件中管理，包括：

- `activeKpiIds`（当前选中的 KPI 集合）
- `hoveredCompanyId`（当前悬停的企业 ID）
- `selectedCompanyId`（打开详情弹窗的企业 ID）
- `hoveredSkillId`（当前悬停的技能 ID）

通过 props 向下传递、events 向上冒泡实现父子通信。跨层级通信（如 DOM 元素注册）使用 Vue 的 `provide/inject` 机制。全局设置状态（语言、设备模式等）通过 `useSettings` composable 以模块级单例模式共享。

### 国际化方案

自定义轻量 i18n 方案，无需引入 `vue-i18n` 等第三方库：

- `useI18n` composable 提供 `t(key)` 翻译函数，支持点号分隔的嵌套键名访问（如 `t('skill.shangxiawuliao.name')`）
- 语料文件为纯 JSON，存放在 `src/locales/zh.json`（中文）和 `en.json`（英文）
- 切换语言时响应式更新全站文本，无需刷新页面

### 连线系统

连线系统由三部分协作完成：

1. **DOM 注册表**：`CompanyCard` 和 `SkillNode` 组件在挂载时通过 `provide/inject` 向 `App.vue` 注册自身 DOM 元素引用
2. **坐标计算**：`useConnectionLines` composable 监听 `hoveredCompanyId`，获取企业卡片与关联技能节点的 `getBoundingClientRect()`，并除以 `DashboardContainer` 的缩放值还原为设计坐标系
3. **路径渲染**：`bezier.ts` 工具生成三次贝塞尔曲线 SVG 路径，`SvgOverlay` 组件使用 `feGaussianBlur` 滤镜渲染发光效果

---

## 5. 交互逻辑

### PC 端交互流程

```
KPI 指标点击（多选切换）
  └─→ 过滤对应状态的企业 → 左右两侧展示企业卡片

企业卡片 hover
  ├─→ 卡片自身高亮（放大 + 亮度提升）
  ├─→ 关联技能节点高亮
  ├─→ SVG 发光连线出现
  └─→ 全屏遮罩变暗（聚焦效果）

企业卡片 click
  └─→ 弹出企业详情弹窗

技能节点 hover
  ├─→ 节点高亮 + 展开二级子技能菜单
  └─→ 子技能 hover → 右侧弹出详细描述浮窗
```

### 移动端交互流程

```
企业卡片 第一次点击
  └─→ 激活 hover 状态（高亮 + 连线 + 遮罩）

企业卡片 第二次点击（已高亮状态下）
  └─→ 清除 hover 状态 + 弹出详情弹窗

技能节点 点击
  └─→ 展开子技能菜单（再次点击收起）

子技能胶囊 点击
  └─→ 切换详细描述浮窗显隐

弹窗内技能徽章 touch
  └─→ 切换技能详情浮层显隐

点击空白区域
  └─→ 关闭所有 hover / 子菜单 / 浮层
```

### KPI 过滤机制

三个 KPI 指标（储备中 / 实施中 / 推广中）支持**多选**。选中某个 KPI 后，只展示该状态对应的企业卡片；取消选中则隐藏。默认初始状态三个 KPI 全部开启。

---

## 6. 项目结构

```
Huazhi0301/
│
├── index.html                              # HTML 入口（视口宽度 1920px）
├── package.json                            # 项目元数据与依赖声明
├── package-lock.json                       # 依赖版本锁定文件
├── tsconfig.json                           # TypeScript 编译配置
├── tsconfig.node.json                      # Vite 构建脚本的 TS 配置
├── vite.config.ts                          # Vite 构建配置（Vue 插件 + 路径别名）
├── README.md                               # 本文档
├── start.bat                               # Windows 一键启动脚本
├── data-template.xlsx                     # Excel 数据模板（npm run export-data 生成）
│
├── scripts/                               # ===== 数据管理脚本 =====
│   ├── export-to-excel.mjs                # JSON → Excel 导出工具
│   └── import-from-excel.mjs              # Excel → JSON 导入工具
│
├── src/                                    # ===== 源代码根目录 =====
│   ├── main.ts                             # 应用入口：创建 Vue 实例并挂载
│   ├── App.vue                             # 根组件：全局状态管理与组件编排
│   ├── env.d.ts                            # Vite 环境类型声明
│   │
│   ├── config/                             # ===== 数据配置 =====
│   │   └── data.json                       # 全站业务数据（单一数据源）
│   │                                       #   ├── kpiIndicators[]    — 3 个 KPI 指标
│   │                                       #   ├── skillCategories[]  — 3 个技能分类
│   │                                       #   ├── skills[]           — 13 个技能（含子技能）
│   │                                       #   ├── companies[]        — 30 家企业
│   │                                       #   └── companyDetails[]   — 30 条企业详情
│   │
│   ├── locales/                            # ===== 国际化语料 =====
│   │   ├── zh.json                         # 中文翻译（默认语言）
│   │   └── en.json                         # 英文翻译
│   │
│   ├── types/                              # ===== TypeScript 类型定义 =====
│   │   ├── index.ts                        # 统一导出入口
│   │   ├── config.ts                       # DashboardConfig 根接口
│   │   ├── company.ts                      # Company, CompanyDetail, CompanyStatus
│   │   ├── skill.ts                        # Skill, SubSkill, SkillCategory
│   │   └── kpi.ts                          # KpiIndicator
│   │
│   ├── composables/                        # ===== 组合式函数（业务逻辑复用）=====
│   │   ├── useDashboardData.ts             # 数据访问：加载 data.json 并提供查询方法
│   │   ├── useI18n.ts                      # 国际化：t() 翻译函数 + 语言切换
│   │   ├── useSettings.ts                  # 设置状态：设备模式、底部面板显隐等
│   │   └── useConnectionLines.ts           # 连线计算：企业→技能贝塞尔曲线坐标
│   │
│   ├── utils/                              # ===== 工具函数 =====
│   │   ├── bezier.ts                       # 三次贝塞尔曲线 SVG 路径生成
│   │   └── throttle.ts                     # 事件节流（16ms / 约 60fps）
│   │
│   ├── components/                         # ===== Vue 组件（按功能区域分组）=====
│   │   │
│   │   ├── layout/                         # 布局层
│   │   │   ├── DashboardContainer.vue      #   1920×1080 固定视口缩放容器
│   │   │   ├── HeaderBar.vue               #   顶部导航栏（标题 + 设置按钮）
│   │   │   └── SvgOverlay.vue              #   SVG 发光连线覆盖层
│   │   │
│   │   ├── top/                            # 顶部 KPI 区域
│   │   │   ├── KpiIndicatorRow.vue         #   KPI 指标行容器（3 个指标）
│   │   │   └── KpiIndicator.vue            #   单个 KPI 指标徽标
│   │   │
│   │   ├── center/                         # 中心技能平台区域
│   │   │   ├── SkillPlatform.vue           #   3D 等距技能平台（3 个分类层）
│   │   │   ├── SkillNode.vue               #   单个技能图标节点
│   │   │   ├── SkillSubMenu.vue            #   二级子技能展开菜单
│   │   │   └── SkillTooltip.vue            #   技能悬浮描述提示
│   │   │
│   │   ├── sides/                          # 左右侧企业卡片区域
│   │   │   ├── CompanyCardGrid.vue         #   企业卡片网格容器
│   │   │   └── CompanyCard.vue             #   单个企业等距方块卡片
│   │   │
│   │   ├── bottom/                         # 底部信息面板区域
│   │   │   ├── BottomPanelRow.vue          #   底部三面板容器
│   │   │   └── BottomPanel.vue             #   单个可折叠企业列表面板
│   │   │
│   │   ├── modal/                          # 弹窗组件
│   │   │   ├── CompanyDetailModal.vue      #   企业详情弹窗（全信息展示）
│   │   │   └── SettingsModal.vue           #   设置下拉菜单
│   │   │
│   │   └── common/                         # 通用复用组件
│   │       └── GlassPanel.vue              #   毛玻璃面板容器
│   │
│   ├── styles/                             # ===== 全局样式 =====
│   │   ├── main.scss                       # 样式入口（导入所有模块）
│   │   ├── _variables.scss                 # CSS 自定义属性（颜色、间距、z-index）
│   │   ├── _reset.scss                     # 浏览器样式重置
│   │   ├── _typography.scss                # 字体与排版规范
│   │   ├── _layout.scss                    # 固定视口布局与网格系统
│   │   ├── _glassmorphism.scss             # 毛玻璃效果 mixin
│   │   └── _animations.scss                # 关键帧动画与过渡定义
│   │
│   └── assets/                             # ===== 静态图片素材 =====
│       ├── backgrounds/                    # 全屏地图背景
│       │   ├── map_background.png          #   1920×1080 基础背景层
│       │   └── map_background@2x.png       #   高清 Retina 版本
│       ├── platforms/                      # 3D 等距平台切图
│       │   ├── block_layer_buttom.png      #   底层网格基座
│       │   ├── block_layer_mid_*.png       #   中层底座（dark / light 两色）
│       │   └── block_layer_upper_*.png     #   上层平台（l / m / r 三区域）
│       ├── connectors/                     # 平台连接装饰线
│       │   ├── block_connect_left.png      #   左侧连接线
│       │   └── block_connect_right.png     #   右侧连接线
│       ├── cubes/                          # 企业方块卡片背景
│       │   ├── cube_company_chubei_*.png   #   储备中状态（默认 / hover）
│       │   ├── cube_company_shishi.png     #   实施中状态
│       │   └── cube_company_tuiguang_*.png #   推广中状态（默认 / hover）
│       ├── icons/                          # KPI 与功能图标
│       │   ├── ic_storage.png              #   储备中 KPI 图标
│       │   ├── ic_shishizhong.png          #   实施中 KPI 图标
│       │   ├── ic_megaphone.png            #   推广中 KPI 图标
│       │   └── ic-setting.png              #   设置齿轮图标
│       ├── skills/                         # 技能节点图标（默认态 + 选中态）
│       │   ├── ic_skill_[技能ID].png       #   默认状态
│       │   └── ic_skill_[技能ID]_select.png#   选中/高亮状态
│       ├── bars/                           # 底部面板标题栏装饰
│       │   ├── bar_zhuangpei.png           #   柔性装配面板标题
│       │   ├── bar_zhijian.png             #   柔性质检面板标题
│       │   └── bar_maduo.png               #   柔性码垛面板标题
│       ├── buttons/                        # 按钮图标
│       │   ├── btn_close.png               #   关闭按钮
│       │   ├── btn_ic_expand.png           #   展开按钮
│       │   ├── btn_ic_collapse.png         #   折叠按钮
│       │   └── btn_ic_skillmore.png        #   技能更多按钮
│       └── logo/                           # 品牌标识
│           └── huazhi_logo.png             #   HUAZHI AI Logo
│
├── dist/                                   # 构建输出目录（npm run build 生成）
└── node_modules/                           # 依赖包目录（npm install 生成）
```

---

## 7. 数据与文本配置指南

本节面向非开发者，介绍如何在不修改代码的情况下更新页面展示内容。

> **推荐方式**：使用 Excel 数据管理工具（`npm run export-data` / `npm run import-data`）来编辑数据，无需直接修改 JSON 文件。详见 [第 2 节 — Excel 数据管理工具](#excel-数据管理工具)。以下手动编辑 JSON 的说明仅作为参考。

> **重要提示**：如需手动编辑 JSON 文件，请确保语法正确。常见错误包括：缺少逗号、多余逗号、引号不匹配。建议使用 VS Code 等带有 JSON 语法高亮的编辑器。

### 7.1 整体配置架构

页面数据由两类文件共同驱动：

| 文件 | 作用 | 编辑频率 |
|------|------|----------|
| `src/config/data.json` | 业务数据结构（企业列表、技能体系、KPI 指标、企业详情） | 企业或技能变更时 |
| `src/locales/zh.json` | 中文显示文本（企业名称、技能名称、描述文本等） | 文本内容变更时 |
| `src/locales/en.json` | 英文显示文本 | 需要英文支持时 |

**`data.json`** 定义数据之间的关系（哪个企业关联哪些技能、属于什么状态），**`zh.json` / `en.json`** 定义这些数据在页面上显示的具体文字。两者通过 **i18n 键名** 关联。

### 7.2 修改企业信息

#### 步骤一：在 `data.json` 中修改企业数据

打开 `src/config/data.json`，找到 `"companies"` 数组，每个企业对象结构如下：

```json
{
  "id": "tiancheng",                          // 唯一标识符（英文，不可重复）
  "nameKey": "company.tiancheng.name",         // 企业名称的 i18n 键名
  "industryKey": "company.tiancheng.industry", // 行业的 i18n 键名
  "type": "跨国企业",                          // 企业类型标签
  "status": "reserve",                         // 状态：reserve / implementation / promotion
  "relatedSkillIds": ["shangxiawuliao", "dingweiduiqi"],  // 关联技能 ID（控制悬停连线）
  "side": "left",                              // 显示位置：left（左侧）/ right（右侧）
  "slotIndex": 0,                              // 在对应侧的排列位置（0 起始）
  "progress": 35                               // 合作推进进度（0-100）
}
```

**字段与页面位置对照：**

| JSON 字段 | 页面上的展示位置 |
|-----------|----------------|
| `status` | 决定企业出现在哪个 KPI 分类下（储备中 / 实施中 / 推广中） |
| `side` + `slotIndex` | 决定企业卡片在页面左侧或右侧的具体位置 |
| `relatedSkillIds` | 悬停企业时，哪些技能节点会被高亮并连线 |
| `progress` | 详情弹窗中的合作推进进度条百分比 |

#### 步骤二：在语料文件中添加对应文本

打开 `src/locales/zh.json`，在 `"company"` 对象中添加对应条目：

```json
"company": {
  "tiancheng": {
    "name": "上海天成精工有限公司",
    "industry": "精密加工",
    "type": "跨国企业"
  }
}
```

同时在 `"companyDesc"` 对象中添加企业简介与进展说明：

```json
"companyDesc": {
  "tiancheng": {
    "brief": "上海天成精工有限公司成立于2008年...",
    "progressNote": "已完成产线自动化方案设计..."
  }
}
```

> 如需英文支持，请在 `src/locales/en.json` 中同步添加对应英文翻译。

#### 步骤三：添加企业详情（弹窗内容）

在 `data.json` 的 `"companyDetails"` 数组中添加一条记录：

```json
{
  "companyId": "tiancheng",
  "briefInfoKeys": {
    "name": "company.tiancheng.name",
    "industry": "company.tiancheng.industry",
    "type": "跨国企业"
  },
  "briefDescKey": "companyDesc.tiancheng.brief",
  "scenarioFlow": [
    { "labelKey": "scenario.loading", "icon": "ic_shishizhong", "progress": 80 },
    { "labelKey": "scenario.positioning", "icon": "ic_shishizhong", "progress": 60 }
  ],
  "coreSkills": ["wuliaoshaicha", "shijuedingwei"],
  "progressNoteKey": "companyDesc.tiancheng.progressNote"
}
```

| 字段 | 说明 |
|------|------|
| `scenarioFlow` | 弹窗中的核心业务场景流程图，`labelKey` 引用 `scenario.*` 翻译，`progress` 为步骤进度 |
| `coreSkills` | 弹窗中的核心技能徽章，值为子技能 ID（对应 `data.json` 中 skills 内的 subSkills.id） |

### 7.3 修改技能信息

技能分为两层：**一级技能**（页面中心平台上的图标）和**二级子技能**（展开菜单中的胶囊列表）。

#### 修改一级技能

在 `data.json` 的 `"skills"` 数组中修改：

```json
{
  "id": "shangxiawuliao",
  "nameKey": "skill.shangxiawuliao.name",
  "descriptionKey": "skill.shangxiawuliao.desc",
  "icon": "ic_skill_shangxiawuliao",              // 默认图标文件名
  "iconSelect": "ic_skill_shangxiawuliao_select",  // 选中态图标文件名
  "categoryId": "assembly",                        // 所属分类 ID
  "subSkills": [ ... ]                             // 二级子技能列表
}
```

**图标对应关系**：`icon` 和 `iconSelect` 字段的值对应 `src/assets/skills/` 目录下的 PNG 文件名（不含 `.png` 扩展名）。新增技能时需同时添加对应的默认态与选中态图标文件。

#### 修改二级子技能

在技能对象的 `"subSkills"` 数组中修改：

```json
"subSkills": [
  {
    "id": "wuliaoshaicha",
    "nameKey": "subSkill.wuliaoshaicha.name",
    "descriptionKey": "subSkill.wuliaoshaicha.desc"
  }
]
```

对应的文本在语料文件 `zh.json` 的 `"subSkill"` 对象中：

```json
"subSkill": {
  "wuliaoshaicha": {
    "name": "物料筛查",
    "desc": "通过视觉、传感器等手段，对来料的尺寸规格..."
  }
}
```

### 7.4 修改 KPI 指标

在 `data.json` 的 `"kpiIndicators"` 数组中修改。通常只需调整 `count`（数量）和 `color`（主题色）：

```json
{
  "id": "reserve",
  "labelKey": "kpi.reserve",
  "icon": "ic_storage",
  "count": 6,                    // 页面上显示的企业数量
  "color": "#3B82F6",            // 主题色（十六进制）
  "statusFilter": "reserve"      // 关联的企业状态
}
```

### 7.5 替换图片素材

所有图片位于 `src/assets/` 目录下，按功能分子目录。替换图片时：

1. 保持**文件名不变**（文件名与 `data.json` 中的引用对应）
2. 保持**图片尺寸一致**（避免布局错位）
3. 使用 **PNG 格式**（支持透明背景）
4. 如有 Retina 高清版本，同步替换 `@2x` 后缀文件

| 素材类型 | 目录 | 命名规则 |
|----------|------|----------|
| 地图背景 | `assets/backgrounds/` | `map_background.png` |
| 技能图标 | `assets/skills/` | `ic_skill_[技能ID].png` + `_select.png` |
| KPI 图标 | `assets/icons/` | `ic_storage.png` 等 |
| 企业方块 | `assets/cubes/` | `cube_company_[状态].png` + `_hover.png` |
| 品牌 Logo | `assets/logo/` | `huazhi_logo.png` |

---

## 8. 技术栈

| 类别 | 技术选型 | 说明 |
|------|----------|------|
| **前端框架** | Vue 3.5 | Composition API + `<script setup>` 语法 |
| **编程语言** | TypeScript 5.7 | 严格模式，完整类型定义 |
| **构建工具** | Vite 6.0 | 极速冷启动与热更新 |
| **样式方案** | SCSS | CSS 自定义属性 + BEM 命名 + 毛玻璃 mixin |
| **UI 库** | 无 | 全部 16 个组件手写实现 |
| **状态管理** | 无外部库 | Vue 3 ref/reactive + composables 单例模式 |
| **国际化** | 自定义 i18n | 轻量实现，支持 zh / en 双语 |
| **数据存储** | 静态 JSON | 无后端、无数据库、无 API 调用 |
| **数据管理** | xlsx (SheetJS) | Excel 导入/导出工具，devDependency |

---

<p align="center">

**作者：徐弋洋**

**日期：2026 年 3 月 5 日**

**版本：V0.0.1**

</p>
