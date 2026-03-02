# HUAZHI AI 可视化大屏

基于 Vue 3 + TypeScript + Vite 构建的数据驱动可视化大屏工程。

## 技术栈

- **框架**: Vue 3 (Composition API, `<script setup>`)
- **语言**: TypeScript
- **构建工具**: Vite
- **样式**: SCSS (毛玻璃效果、CSS 自定义属性)
- **国际化**: 自定义轻量 i18n (zh/en)

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

## 目录结构

```
src/
├── main.ts                          # 应用入口
├── App.vue                          # 根组件（状态管理 + 组件编排）
│
├── assets/                          # 静态图片素材
│   ├── backgrounds/                 # 地图背景
│   ├── platforms/                   # 3D 等距平台层
│   ├── connectors/                  # 平台连接装饰
│   ├── cubes/                       # 企业方块卡片
│   ├── icons/                       # KPI 和设置图标
│   ├── skills/                      # 11 个技能图标 (默认/选中态)
│   ├── bars/                        # 底部面板标题栏
│   ├── buttons/                     # 关闭/展开/折叠按钮
│   └── logo/                        # HUAZHI AI Logo
│
├── components/
│   ├── layout/
│   │   ├── DashboardContainer.vue   # 1920x1080 缩放容器
│   │   ├── HeaderBar.vue            # 顶部导航栏
│   │   └── SvgOverlay.vue           # SVG 发光连线覆盖层
│   ├── top/
│   │   ├── KpiIndicator.vue         # 单个 KPI 指标徽标
│   │   └── KpiIndicatorRow.vue      # KPI 指标行
│   ├── center/
│   │   ├── SkillPlatform.vue        # 3D 等距技能平台
│   │   ├── SkillNode.vue            # 技能图标节点
│   │   └── SkillTooltip.vue         # 技能悬浮提示
│   ├── sides/
│   │   ├── CompanyCard.vue          # 企业方块卡片
│   │   └── CompanyCardGrid.vue      # 侧边卡片网格
│   ├── bottom/
│   │   ├── BottomPanel.vue          # 底部可滚动面板
│   │   └── BottomPanelRow.vue       # 底部三面板容器
│   ├── modal/
│   │   ├── CompanyDetailModal.vue   # 企业详情弹窗
│   │   └── SettingsModal.vue        # 设置下拉菜单
│   └── common/
│       └── GlassPanel.vue           # 可复用毛玻璃容器
│
├── composables/
│   ├── useI18n.ts                   # 国际化翻译
│   ├── useDashboardData.ts          # 数据访问器
│   ├── useSettings.ts               # 设置状态管理
│   └── useConnectionLines.ts        # 连线坐标计算
│
├── config/
│   └── data.json                    # 全站数据配置（单一数据源）
│
├── locales/
│   ├── zh.json                      # 中文语料
│   └── en.json                      # 英文语料
│
├── styles/
│   ├── main.scss                    # 样式入口
│   ├── _variables.scss              # CSS 自定义属性
│   ├── _reset.scss                  # 基础重置
│   ├── _typography.scss             # 排版规范
│   ├── _glassmorphism.scss          # 毛玻璃 mixin
│   ├── _animations.scss             # 动画与过渡
│   └── _layout.scss                 # 固定视口布局
│
├── types/                           # TypeScript 类型定义
│   ├── skill.ts                     # Skill, SkillCategory
│   ├── company.ts                   # Company, CompanyDetail
│   ├── kpi.ts                       # KpiIndicator
│   ├── config.ts                    # DashboardConfig
│   └── index.ts                     # 统一导出
│
└── utils/
    ├── bezier.ts                    # 贝塞尔曲线路径生成
    └── throttle.ts                  # 节流工具
```

## 数据配置

所有页面数据通过 `src/config/data.json` 驱动，遵循 `DashboardConfig` 接口：

```typescript
interface DashboardConfig {
  kpiIndicators: KpiIndicator[]      // 顶部 3 个 KPI 指标
  skillCategories: SkillCategory[]   // 3 个技能分类
  skills: Skill[]                    // 11 个细分技能
  companies: Company[]               // 30 家企业
  companyDetails: CompanyDetail[]    // 企业详情（弹窗用）
}
```

### 修改数据

1. 编辑 `src/config/data.json` 修改企业/技能/KPI 数据
2. 编辑 `src/locales/zh.json` 和 `en.json` 修改对应的文本内容
3. 企业的 `relatedSkillIds` 字段控制 hover 时的发光连线关系

## 核心功能

| 功能 | 说明 |
|------|------|
| KPI 切换 | 点击储备中/实施中/推广中，左右两侧展示对应企业卡片 |
| 企业详情 | 点击企业卡片弹出详情弹窗（公司信息、业务流程、核心技能）|
| 发光连线 | 悬停企业卡片时，SVG 贝塞尔曲线连接到关联技能节点 |
| 技能提示 | 悬停技能图标显示详细描述 |
| 国际化 | 设置面板切换中文/英文，全站响应式更新 |
| 底部面板 | 三个分类面板，内部企业列表可滚动 |

## 视觉效果

- **毛玻璃**: `backdrop-filter: blur()` + 半透明背景 + 发光 box-shadow
- **微动效**: hover 放大 `scale(1.05)` + 亮度提升，统一 `cubic-bezier(0.4, 0, 0.2, 1)` 曲线
- **SVG 发光**: `feGaussianBlur` 滤镜 + `stroke-dasharray` 流光动画
- **3D 等距**: 三层切图叠加（底层网格 + 中层底座 + 上层技能平台）

## 设计基准

- 视口尺寸: 1920 x 1080（通过 `transform: scale` 自动适配）
- 设计参考: `design_reference/` 文件夹中的 6 张高保真设计图
