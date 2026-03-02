<script setup lang="ts">
/**
 * CompanyCardGrid.vue - 侧边企业卡片网格
 * 在页面左侧或右侧展示属于某 KPI 状态的企业卡片
 * 网格垂直排列，带有交错入场动画
 */
import type { Company } from '@/types'
import CompanyCard from './CompanyCard.vue'

defineProps<{
  companies: Company[]
  side: 'left' | 'right'
  hoveredCompanyId: string | null
  companyNames: Record<string, string>
}>()

defineEmits<{
  (e: 'hoverCompany', companyId: string | null): void
  (e: 'clickCompany', companyId: string): void
}>()
</script>

<template>
  <div class="company-grid" :class="`company-grid--${side}`">
    <TransitionGroup name="fade-up">
      <CompanyCard
        v-for="(company, index) in companies"
        :key="company.id"
        :company="company"
        :display-name="companyNames[company.id] || company.nameKey"
        :is-hovered="hoveredCompanyId === company.id"
        :class="`stagger-${index + 1}`"
        @hover="$emit('hoverCompany', $event)"
        @click="$emit('clickCompany', $event)"
      />
    </TransitionGroup>
  </div>
</template>

<style scoped lang="scss">
.company-grid {
  position: absolute;
  top: 140px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  z-index: var(--z-company-cards);
  max-width: 280px;
  align-content: flex-start;

  &--left {
    left: 24px;
  }

  &--right {
    right: 24px;
  }
}
</style>
