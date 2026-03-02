<script setup lang="ts">
/**
 * BottomPanelRow.vue - 底部三面板容器
 * 水平排列三个 BottomPanel，对应三种企业状态：储备中/实施中/推广中
 */
import type { KpiIndicator, Company } from '@/types'
import BottomPanel from './BottomPanel.vue'

const props = defineProps<{
  kpiIndicators: KpiIndicator[]
  companies: Company[]
}>()

/** 获取某状态下的所有企业 */
function getCompaniesForStatus(statusFilter: string): Company[] {
  return props.companies.filter(c => c.status === statusFilter)
}
</script>

<template>
  <div class="bottom-panel-row">
    <BottomPanel
      v-for="kpi in kpiIndicators"
      :key="kpi.id"
      :kpi="kpi"
      :companies="getCompaniesForStatus(kpi.statusFilter)"
    />
  </div>
</template>

<style scoped lang="scss">
.bottom-panel-row {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 24px;
  z-index: var(--z-bottom-panels);
}
</style>
