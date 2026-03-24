<script setup lang="ts">
/**
 * KpiIndicatorRow.vue - KPI 指标行容器
 * 水平居中排列三个 KPI 指标徽标
 * 支持多选（同时展开多个 KPI 分类）
 */
import type { KpiIndicator as KpiType } from '@/types'
import KpiIndicator from './KpiIndicator.vue'

defineProps<{
  indicators: KpiType[]
  activeKpiIds: Set<string>
  hideCount: boolean
  dimmed?: boolean
}>()

defineEmits<{
  (e: 'selectKpi', id: string): void
}>()
</script>

<template>
  <div class="kpi-row" :class="{ 'kpi-row--dimmed': dimmed }">
    <KpiIndicator
      v-for="indicator in indicators"
      :key="indicator.id"
      :indicator="indicator"
      :is-active="activeKpiIds.has(indicator.id)"
      :hide-count="hideCount"
      @select="$emit('selectKpi', $event)"
    />
  </div>
</template>

<style scoped lang="scss">
.kpi-row {
  position: absolute;
  top: 120px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: flex-start;
  gap: 40px;
  z-index: var(--z-kpi-row);
  transition: opacity 0.3s ease;

  &--dimmed {
    opacity: 0.3;
    filter: blur(3px);
    pointer-events: none;
  }
}
</style>
