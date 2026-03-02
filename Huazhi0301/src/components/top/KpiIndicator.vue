<script setup lang="ts">
/**
 * KpiIndicator.vue - 单个 KPI 指标徽标
 * 布局：图标在左，右侧上方文字标签下方数字
 * 三种颜色：蓝(储备) / 橙(实施) / 红(推广)
 */
import type { KpiIndicator } from '@/types'
import { useI18n } from '@/composables/useI18n'

const { t } = useI18n()

const props = defineProps<{
  indicator: KpiIndicator
  isActive: boolean
}>()

defineEmits<{
  (e: 'select', id: string): void
}>()

/**
 * 根据图标名动态加载对应的 KPI 图标图片
 */
function getIconUrl(icon: string): string {
  const icons: Record<string, string> = import.meta.glob('@/assets/icons/*.png', { eager: true, import: 'default' }) as Record<string, string>
  for (const [path, url] of Object.entries(icons)) {
    if (path.includes(`/${icon}.png`)) return url
  }
  return ''
}
</script>

<template>
  <button
    class="kpi-indicator"
    :class="{ 'kpi-indicator--active': isActive }"
    :style="{ '--kpi-color': props.indicator.color }"
    @click="$emit('select', indicator.id)"
  >
    <!-- 左侧图标 -->
    <div class="kpi-indicator__icon">
      <img :src="getIconUrl(indicator.icon)" :alt="indicator.labelKey" />
    </div>

    <!-- 右侧：文字标签 + 数字 -->
    <div class="kpi-indicator__info">
      <span class="kpi-indicator__label">{{ t(indicator.labelKey) }}</span>
      <span class="kpi-indicator__count">{{ indicator.count }}</span>
    </div>
  </button>
</template>

<style scoped lang="scss">
.kpi-indicator {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 12px;
  padding: 8px 24px;
  border-radius: 12px;
  transition: all var(--duration-normal) var(--ease-smooth);
  cursor: pointer;

  &:hover {
    transform: scale(1.08);
    filter: brightness(1.15);
  }

  &--active {
    // 选中时底部加一条颜色标识线
    position: relative;
    &::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 50%;
      transform: translateX(-50%);
      width: 40px;
      height: 3px;
      border-radius: 2px;
      background: var(--kpi-color);
      box-shadow: 0 0 8px var(--kpi-color);
    }
  }

  &__icon {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    flex-shrink: 0;

    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }

  &__info {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 2px;
  }

  &__label {
    font-size: 13px;
    font-weight: 500;
    color: var(--color-text-secondary);
    white-space: nowrap;
  }

  &__count {
    font-size: 28px;
    font-weight: 700;
    font-variant-numeric: tabular-nums;
    color: var(--color-text-primary);
  }
}
</style>
