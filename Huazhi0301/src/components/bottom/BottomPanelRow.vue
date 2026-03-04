<script setup lang="ts">
/**
 * BottomPanelRow.vue - 底部三面板容器
 * 水平排列三个 BottomPanel，对应三种企业状态：储备中/实施中/推广中
 * 每个面板由对应的 KPI indicator 独立控制显隐，以抽屉动效滑入/滑出
 */
import type { KpiIndicator, Company } from '@/types'
import BottomPanel from './BottomPanel.vue'

const props = defineProps<{
  kpiIndicators: KpiIndicator[]
  companies: Company[]
  activeKpiIds: Set<string>
}>()

defineEmits<{
  (e: 'clickCompany', companyId: string): void
}>()

/** 获取某状态下的所有企业 */
function getCompaniesForStatus(statusFilter: string): Company[] {
  return props.companies.filter(c => c.status === statusFilter)
}
</script>

<template>
  <div class="bottom-panel-row">
    <Transition v-for="kpi in kpiIndicators" :key="kpi.id" name="panel-drawer">
      <BottomPanel
        v-if="activeKpiIds.has(kpi.id)"
        :kpi="kpi"
        :companies="getCompaniesForStatus(kpi.statusFilter)"
        @click-company="$emit('clickCompany', $event)"
      />
    </Transition>
  </div>
</template>

<style scoped lang="scss">
.bottom-panel-row {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 24px;
  z-index: var(--z-bottom-panels);
}

// 每个面板独立的抽屉动画
.panel-drawer-enter-active,
.panel-drawer-leave-active {
  transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94),
              opacity 0.4s ease;
}
.panel-drawer-enter-from,
.panel-drawer-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
.panel-drawer-enter-to,
.panel-drawer-leave-from {
  transform: translateY(0);
  opacity: 1;
}
</style>
