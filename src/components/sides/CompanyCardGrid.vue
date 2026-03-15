<script setup lang="ts">
/**
 * CompanyCardGrid.vue - 侧边企业卡片网格
 * 在页面左侧或右侧展示属于某 KPI 状态的企业卡片
 * 每张卡片独立以侧向滑入/滑出动画进出
 */
import { computed } from 'vue'
import type { Company } from '@/types'
import CompanyCard from './CompanyCard.vue'

const props = defineProps<{
  companies: Company[]
  side: 'left' | 'right'
  hoveredCompanyId: string | null
  companyNames: Record<string, string>
}>()

defineEmits<{
  (e: 'hoverCompany', companyId: string | null): void
  (e: 'clickCompany', companyId: string): void
}>()

/** 根据 side 决定 TransitionGroup 动画方向 */
const transitionName = computed(() =>
  props.side === 'left' ? 'slide-card-left' : 'slide-card-right'
)

/**
 * 离场前捕获卡片在 grid 中的位置和尺寸，固定到 inline style
 * 这样 position:absolute 后卡片仍停留在原位播放侧滑动画
 */
function onBeforeLeave(el: Element) {
  const htmlEl = el as HTMLElement
  const rect = htmlEl.getBoundingClientRect()
  const parent = htmlEl.parentElement
  if (!parent) return
  const parentRect = parent.getBoundingClientRect()
  htmlEl.style.left = `${rect.left - parentRect.left}px`
  htmlEl.style.top = `${rect.top - parentRect.top}px`
  htmlEl.style.width = `${rect.width}px`
}
</script>

<template>
  <!-- TransitionGroup 直接作为 grid 容器，避免 fragment 模式下 parentElement 不稳定 -->
  <TransitionGroup
    tag="div"
    :name="transitionName"
    class="company-grid"
    :class="`company-grid--${side}`"
    @before-leave="onBeforeLeave"
  >
    <CompanyCard
      v-for="company in companies"
      :key="company.id"
      :company="company"
      :display-name="companyNames[company.id] || company.nameKey"
      :is-hovered="hoveredCompanyId === company.id"
      @hover="$emit('hoverCompany', $event)"
      @click="$emit('clickCompany', $event)"
    />
  </TransitionGroup>
</template>

<style scoped lang="scss">
.company-grid {
  position: absolute;
  top: 140px;
  display: grid;
  grid-template-columns: repeat(3, 90px);
  gap: 4px;
  z-index: var(--z-company-cards);
  align-content: flex-start;

  &--left {
    left: 40px;
  }

  &--right {
    right: 40px;
  }
}

// 左侧卡片：从左侧滑入/滑出
.slide-card-left-enter-active,
.slide-card-left-leave-active {
  transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94),
              opacity 0.4s ease;
}
.slide-card-left-enter-from,
.slide-card-left-leave-to {
  transform: translateX(-60px);
  opacity: 0;
}

// 右侧卡片：从右侧滑入/滑出
.slide-card-right-enter-active,
.slide-card-right-leave-active {
  transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94),
              opacity 0.4s ease;
}
.slide-card-right-enter-from,
.slide-card-right-leave-to {
  transform: translateX(60px);
  opacity: 0;
}

// 剩余卡片平滑重排
.slide-card-left-move,
.slide-card-right-move {
  transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

// 离场时脱离文档流（配合 onBeforeLeave 固定原始位置）
.slide-card-left-leave-active,
.slide-card-right-leave-active {
  position: absolute;
}
</style>
