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
import { ref, computed, provide, reactive, watch, onUnmounted } from 'vue'
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
const { isSettingsOpen, toggleSettings, closeSettings, hideBottomPanels, deviceMode, idleDemoEnabled } = useSettings()

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
const activeKpiIds = reactive(new Set<string>(['reserve', 'implementation', 'promotion']))

/** 当前悬停的企业 ID (触发发光连线) */
const hoveredCompanyId = ref<string | null>(null)

/** 当前选中的企业 ID (打开详情弹窗) */
const selectedCompanyId = ref<string | null>(null)

/** 当前悬停的技能 ID (显示 tooltip) */
const hoveredSkillId = ref<string | null>(null)

// ==================== 派生数据 ====================

/** KPI 指标列表，count 由实际公司数量动态计算 */
const kpiIndicatorsWithCount = computed(() =>
  config.kpiIndicators.map(k => ({
    ...k,
    count: config.companies.filter(c => c.status === k.statusFilter).length,
  }))
)

/** 状态排序权重：储备 → 实施 → 推广 */
const statusOrder: Record<string, number> = { reserve: 0, implementation: 1, promotion: 2 }

/** 根据选中的 KPI 集合过滤左侧企业，按状态排序 */
const leftCompanies = computed(() => {
  if (activeKpiIds.size === 0) return []
  const activeStatuses = new Set(
    config.kpiIndicators
      .filter(k => activeKpiIds.has(k.id))
      .map(k => k.statusFilter)
  )
  return config.companies
    .filter(c => activeStatuses.has(c.status) && c.side === 'right')
    .sort((a, b) => (statusOrder[a.status] ?? 9) - (statusOrder[b.status] ?? 9))
})

/** 根据选中的 KPI 集合过滤右侧企业，按状态排序 */
const rightCompanies = computed(() => {
  if (activeKpiIds.size === 0) return []
  const activeStatuses = new Set(
    config.kpiIndicators
      .filter(k => activeKpiIds.has(k.id))
      .map(k => k.statusFilter)
  )
  return config.companies
    .filter(c => activeStatuses.has(c.status) && c.side === 'left')
    .sort((a, b) => (statusOrder[a.status] ?? 9) - (statusOrder[b.status] ?? 9))
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

/** 企业悬停（离开时延迟清除，避免公司间流转时闪烁） */
let hoverCompanyTimer: ReturnType<typeof setTimeout> | null = null

function onHoverCompany(companyId: string | null) {
  if (hoverCompanyTimer) {
    clearTimeout(hoverCompanyTimer)
    hoverCompanyTimer = null
  }
  if (companyId) {
    // 清除此前的技能 hover 状态（submenu、z-index 等恢复默认）
    hoveredSkillId.value = null
    hoveredCompanyId.value = companyId
  } else {
    hoverCompanyTimer = setTimeout(() => {
      hoveredCompanyId.value = null
      hoverCompanyTimer = null
    }, 150)
  }
}

/** 企业点击：打开详情弹窗，同时清除所有 hover 高光 */
function onClickCompany(companyId: string) {
  selectedCompanyId.value = companyId
  hoveredCompanyId.value = null
  hoveredSkillId.value = null
}

/** 关闭详情弹窗 */
function onCloseModal() {
  selectedCompanyId.value = null
}

/** 技能悬停 */
function onHoverSkill(skillId: string | null) {
  hoveredSkillId.value = skillId
}

/** 移动端点击遮罩取消 hover */
function onOverlayClick() {
  if (deviceMode.value === 'mobile') {
    hoveredCompanyId.value = null
    hoveredSkillId.value = null
  }
}

/** 移动端点击平台空白区域，清除所有 hover 状态 */
function onClearHover() {
  hoveredCompanyId.value = null
  hoveredSkillId.value = null
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

// ==================== 待机演示 ====================

const isIdleDemoActive = ref(false)
const idleDemoMessage = ref<string | null>(null)

/** sleep 工具函数，返回可被取消的 Promise */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

let idleTimer: ReturnType<typeof setTimeout> | null = null
let demoMessageTimer: ReturnType<typeof setTimeout> | null = null

function showToast(msgKey: string) {
  idleDemoMessage.value = t(msgKey)
  if (demoMessageTimer) clearTimeout(demoMessageTimer)
  demoMessageTimer = setTimeout(() => {
    idleDemoMessage.value = null
    demoMessageTimer = null
  }, 2000)
}

async function enterIdleDemo() {
  if (isIdleDemoActive.value) return
  isIdleDemoActive.value = true
  showToast('idleDemo.enter')

  while (isIdleDemoActive.value) {
    // 随机选一个公司
    const companies = config.companies
    const randomCompany = companies[Math.floor(Math.random() * companies.length)]
    hoveredCompanyId.value = randomCompany.id

    await sleep(4000)
    if (!isIdleDemoActive.value) break

    // 清除 hover，显示默认状态
    hoveredCompanyId.value = null
    await sleep(3000)
  }
}

function exitIdleDemo() {
  if (!isIdleDemoActive.value) return
  isIdleDemoActive.value = false
  hoveredCompanyId.value = null
  hoveredSkillId.value = null
  showToast('idleDemo.exit')
}

function resetIdleTimer() {
  if (!idleDemoEnabled.value) return
  // 如果正在演示中，鼠标活动则退出
  if (isIdleDemoActive.value) {
    exitIdleDemo()
    return
  }
  // 重置 5 秒闲置计时器
  if (idleTimer) clearTimeout(idleTimer)
  idleTimer = setTimeout(() => {
    enterIdleDemo()
  }, 5000)
}

function onMouseActivity() {
  resetIdleTimer()
}

watch(idleDemoEnabled, (enabled) => {
  if (enabled) {
    document.addEventListener('mousemove', onMouseActivity)
    resetIdleTimer()
  } else {
    document.removeEventListener('mousemove', onMouseActivity)
    if (idleTimer) { clearTimeout(idleTimer); idleTimer = null }
    if (isIdleDemoActive.value) exitIdleDemo()
  }
})

onUnmounted(() => {
  document.removeEventListener('mousemove', onMouseActivity)
  if (idleTimer) clearTimeout(idleTimer)
  if (demoMessageTimer) clearTimeout(demoMessageTimer)
  isIdleDemoActive.value = false
})
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
      @toggle-idle-demo="idleDemoEnabled = !idleDemoEnabled"
    />

    <!-- 点击遮罩：点击空白区域关闭设置 -->
    <div
      v-if="isSettingsOpen"
      class="settings-backdrop"
      @click="closeSettings"
    />

    <!-- KPI 指标行 -->
    <KpiIndicatorRow
      :indicators="kpiIndicatorsWithCount"
      :active-kpi-ids="activeKpiIds"
      :hide-count="hideBottomPanels"
      :dimmed="!!hoveredSkillId || !!hoveredCompanyId || !!selectedCompanyId"
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
        v-if="hoveredCompanyId || hoveredSkillId || selectedCompanyId"
        class="company-hover-overlay"
        :class="{ 'company-hover-overlay--interactive': deviceMode === 'mobile' }"
        @click="onOverlayClick"
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
      @clear-hover="onClearHover"
    />

    <!-- 底部信息面板（各面板由对应 KPI 独立控制，抽屉式滑入/滑出） -->
    <BottomPanelRow
      v-if="!hideBottomPanels"
      :kpi-indicators="kpiIndicatorsWithCount"
      :companies="config.companies"
      :active-kpi-ids="activeKpiIds"
      :dimmed="!!hoveredSkillId || !!hoveredCompanyId || !!selectedCompanyId"
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
    <!-- 待机演示 Toast 提示 -->
    <Transition name="toast-fade">
      <div v-if="idleDemoMessage" class="idle-demo-toast">
        {{ idleDemoMessage }}
      </div>
    </Transition>
  </DashboardContainer>
</template>

<style scoped>
.settings-backdrop {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 205;
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

.company-hover-overlay--interactive {
  pointer-events: auto;
  cursor: pointer;
}

.overlay-fade-enter-active,
.overlay-fade-leave-active {
  transition: opacity 0.3s ease;
}

.overlay-fade-enter-from,
.overlay-fade-leave-to {
  opacity: 0;
}

/* 待机演示 Toast */
.idle-demo-toast {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 16px 32px;
  border-radius: 12px;
  font-size: 18px;
  font-weight: 500;
  color: var(--color-text-primary);
  background: rgba(10, 15, 30, 0.85);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(100, 150, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  z-index: 300;
  pointer-events: none;
}

.toast-fade-enter-active,
.toast-fade-leave-active {
  transition: opacity 0.3s ease;
}

.toast-fade-enter-from,
.toast-fade-leave-to {
  opacity: 0;
}
</style>
