<script setup lang="ts">
/**
 * App.vue - 根组件
 *
 * 职责：
 * 1. 通过 useDashboardData 加载 data.json 配置数据
 * 2. 通过 useI18n 提供国际化翻译能力
 * 3. 管理全局响应式状态 (activeKpiIds, hoveredCompanyId, selectedCompanyId)
 * 4. 将所有区域组件编排到 DashboardContainer 中
 * 5. 管理弹窗和设置面板的显隐
 */
import { ref, computed, provide, reactive } from 'vue'
import { useDashboardData } from '@/composables/useDashboardData'
import { useI18n } from '@/composables/useI18n'
import { useSettings } from '@/composables/useSettings'
import { useConnectionLines } from '@/composables/useConnectionLines'

// 布局组件
import DashboardContainer from '@/components/layout/DashboardContainer.vue'
import HeaderBar from '@/components/layout/HeaderBar.vue'
import SvgOverlay from '@/components/layout/SvgOverlay.vue'

// 区域组件
import KpiIndicatorRow from '@/components/top/KpiIndicatorRow.vue'
import SkillPlatform from '@/components/center/SkillPlatform.vue'
import BottomPanelRow from '@/components/bottom/BottomPanelRow.vue'
import CompanyCardGrid from '@/components/sides/CompanyCardGrid.vue'

// 弹窗组件
import CompanyDetailModal from '@/components/modal/CompanyDetailModal.vue'
import SettingsModal from '@/components/modal/SettingsModal.vue'

// ==================== Composables ====================
const { config, getCompanyDetailById } = useDashboardData()
const { t } = useI18n()
const { isSettingsOpen, toggleSettings, closeSettings, hideBottomPanels } = useSettings()

// ==================== DOM 元素引用（用于连线坐标计算）====================

/** DashboardContainer 组件引用 */
const dashboardRef = ref<InstanceType<typeof DashboardContainer>>()

/** 企业卡片 DOM 元素注册表 (companyId -> HTMLElement) */
const companyElements = ref<Record<string, HTMLElement>>({})

/** 技能节点 DOM 元素注册表 (skillId -> HTMLElement) */
const skillElements = ref<Record<string, HTMLElement>>({})

/** 容器根元素 */
const containerElement = computed(() => dashboardRef.value?.containerRef)

/** 容器缩放值 */
const containerScale = computed(() => dashboardRef.value?.scale ?? 1)

// ==================== 响应式状态 ====================

/** 当前选中的 KPI ID 集合（支持多选，同时展开多个分类） */
const activeKpiIds = reactive(new Set<string>())

/** 当前悬停的企业 ID (触发发光连线) */
const hoveredCompanyId = ref<string | null>(null)

/** 当前选中的企业 ID (打开详情弹窗) */
const selectedCompanyId = ref<string | null>(null)

/** 当前悬停的技能 ID (显示 tooltip) */
const hoveredSkillId = ref<string | null>(null)

// ==================== 派生数据 ====================

/** 根据选中的 KPI 集合过滤左侧企业 */
const leftCompanies = computed(() => {
  if (activeKpiIds.size === 0) return []
  const activeStatuses = new Set(
    config.kpiIndicators
      .filter(k => activeKpiIds.has(k.id))
      .map(k => k.statusFilter)
  )
  return config.companies.filter(c => activeStatuses.has(c.status) && c.side === 'left')
})

/** 根据选中的 KPI 集合过滤右侧企业 */
const rightCompanies = computed(() => {
  if (activeKpiIds.size === 0) return []
  const activeStatuses = new Set(
    config.kpiIndicators
      .filter(k => activeKpiIds.has(k.id))
      .map(k => k.statusFilter)
  )
  return config.companies.filter(c => activeStatuses.has(c.status) && c.side === 'right')
})

/** 当悬停企业或技能节点时，计算高亮的技能 ID 列表 */
const highlightedSkillIds = computed(() => {
  if (hoveredCompanyId.value) {
    const company = config.companies.find(c => c.id === hoveredCompanyId.value)
    return company?.relatedSkillIds || []
  }
  if (hoveredSkillId.value) {
    return [hoveredSkillId.value]
  }
  return []
})

/** 当悬停企业时，计算该企业关联的三级技能（subSkill）ID 列表 */
const highlightedSubSkillIds = computed(() => {
  if (!hoveredCompanyId.value) return []
  const detail = getCompanyDetailById(hoveredCompanyId.value)
  return detail?.coreSkills || []
})

/** 选中企业的详情数据 (用于弹窗) */
const selectedCompanyDetail = computed(() => {
  if (!selectedCompanyId.value) return null
  return getCompanyDetailById(selectedCompanyId.value) || null
})

/** 选中企业的状态 (用于弹窗配色) */
const selectedCompanyStatus = computed(() => {
  if (!selectedCompanyId.value) return 'reserve' as const
  const company = config.companies.find(c => c.id === selectedCompanyId.value)
  return company?.status ?? 'reserve'
})

/** 选中企业的合作推进进度 */
const selectedCompanyProgress = computed(() => {
  if (!selectedCompanyId.value) return 0
  const company = config.companies.find(c => c.id === selectedCompanyId.value)
  return company?.progress ?? 0
})

/** 企业名称映射 (使用 i18n 翻译) */
const companyNames = computed(() => {
  const map: Record<string, string> = {}
  for (const company of config.companies) {
    map[company.id] = t(company.nameKey)
  }
  return map
})

// ==================== 事件处理 ====================

/** KPI 点击：toggle 多选（点击已选中的则取消，未选中的则加入） */
function onSelectKpi(id: string) {
  if (activeKpiIds.has(id)) {
    activeKpiIds.delete(id)
  } else {
    activeKpiIds.add(id)
  }
  // 切换 KPI 时清除企业 hover 状态
  hoveredCompanyId.value = null
}

/** 企业悬停 */
function onHoverCompany(companyId: string | null) {
  hoveredCompanyId.value = companyId
}

/** 企业点击：打开详情弹窗 */
function onClickCompany(companyId: string) {
  selectedCompanyId.value = companyId
}

/** 关闭详情弹窗 */
function onCloseModal() {
  selectedCompanyId.value = null
}

/** 技能悬停 */
function onHoverSkill(skillId: string | null) {
  hoveredSkillId.value = skillId
}

// ==================== 连线系统 ====================

/**
 * 注册企业卡片 DOM 元素
 * 由 CompanyCard 组件在挂载时通过事件冒泡注册
 */
function registerCompanyElement(companyId: string, el: HTMLElement) {
  companyElements.value[companyId] = el
}

/** 注销企业卡片 DOM 元素 */
function unregisterCompanyElement(companyId: string) {
  delete companyElements.value[companyId]
}

/**
 * 注册技能节点 DOM 元素
 * 由 SkillNode 组件在挂载时通过事件冒泡注册
 */
function registerSkillElement(skillId: string, el: HTMLElement) {
  skillElements.value[skillId] = el
}

// 通过 provide/inject 向子组件提供元素注册函数
provide('registerCompanyElement', registerCompanyElement)
provide('unregisterCompanyElement', unregisterCompanyElement)
provide('registerSkillElement', registerSkillElement)

/** 连线计算 */
const { lines: connectionLines } = useConnectionLines(
  hoveredCompanyId,
  config.companies,
  companyElements,
  skillElements,
  containerElement,
  containerScale
)
</script>

<template>
  <DashboardContainer ref="dashboardRef">
    <!-- 顶部导航栏 -->
    <HeaderBar
      :title="t('app.title')"
      @toggle-settings="toggleSettings"
    />

    <!-- 设置下拉菜单 -->
    <SettingsModal
      v-if="isSettingsOpen"
      @close="closeSettings"
    />

    <!-- 点击遮罩：点击空白区域关闭设置 -->
    <div
      v-if="isSettingsOpen"
      class="settings-backdrop"
      @click="closeSettings"
    />

    <!-- KPI 指标行 -->
    <KpiIndicatorRow
      :indicators="config.kpiIndicators"
      :active-kpi-ids="activeKpiIds"
      :hide-count="hideBottomPanels"
      @select-kpi="onSelectKpi"
    />

    <!-- 左侧企业卡片 -->
    <CompanyCardGrid
      :companies="leftCompanies"
      side="left"
      :hovered-company-id="hoveredCompanyId"
      :company-names="companyNames"
      @hover-company="onHoverCompany"
      @click-company="onClickCompany"
    />

    <!-- 右侧企业卡片 -->
    <CompanyCardGrid
      :companies="rightCompanies"
      side="right"
      :hovered-company-id="hoveredCompanyId"
      :company-names="companyNames"
      @hover-company="onHoverCompany"
      @click-company="onClickCompany"
    />

    <!-- 公司 hover 全屏遮罩 -->
    <Transition name="overlay-fade">
      <div
        v-if="hoveredCompanyId || hoveredSkillId"
        class="company-hover-overlay"
      />
    </Transition>

    <!-- 中心 3D 等距技能平台 -->
    <SkillPlatform
      :categories="config.skillCategories"
      :skills="config.skills"
      :highlighted-skill-ids="highlightedSkillIds"
      :highlighted-sub-skill-ids="highlightedSubSkillIds"
      :hovered-skill-id="hoveredSkillId"
      @hover-skill="onHoverSkill"
    />

    <!-- 底部信息面板（各面板由对应 KPI 独立控制，抽屉式滑入/滑出） -->
    <BottomPanelRow
      v-if="!hideBottomPanels"
      :kpi-indicators="config.kpiIndicators"
      :companies="config.companies"
      :active-kpi-ids="activeKpiIds"
      @click-company="onClickCompany"
    />

    <!-- SVG 发光连线覆盖层 -->
    <SvgOverlay :lines="connectionLines" />

    <!-- 企业详情弹窗 -->
    <CompanyDetailModal
      v-if="selectedCompanyDetail"
      :detail="selectedCompanyDetail"
      :skills="config.skills"
      :status="selectedCompanyStatus"
      :progress="selectedCompanyProgress"
      @close="onCloseModal"
    />
  </DashboardContainer>
</template>

<style scoped>
.settings-backdrop {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 89;
}

.company-hover-overlay {
  position: absolute;
  inset: 0;
  z-index: var(--z-hover-overlay);
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(3px);
  -webkit-backdrop-filter: blur(3px);
  pointer-events: none;
}

.overlay-fade-enter-active,
.overlay-fade-leave-active {
  transition: opacity 0.3s ease;
}

.overlay-fade-enter-from,
.overlay-fade-leave-to {
  opacity: 0;
}
</style>
