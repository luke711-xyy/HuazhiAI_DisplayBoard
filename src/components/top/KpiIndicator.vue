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
  hideCount: boolean
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
    :class="{
      'kpi-indicator--active': isActive,
      'kpi-indicator--compact': hideCount,
    }"
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
      <Transition name="count-fade">
        <span v-if="!hideCount" class="kpi-indicator__count">{{ indicator.count }}</span>
      </Transition>
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
  position: relative;
  isolation: isolate;

  // 边框辉光
  border: 1px solid color-mix(in srgb, var(--kpi-color) 25%, transparent);
  box-shadow:
    0 0 12px color-mix(in srgb, var(--kpi-color) 15%, transparent),
    0 0 28px color-mix(in srgb, var(--kpi-color) 8%, transparent),
    0 2px 12px rgba(0, 0, 0, 0.25);

  // 毛玻璃背景层（伪元素，不影响文字清晰度）
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    z-index: -1;
    border-radius: inherit;
    pointer-events: none;
    background: rgba(10, 15, 30, 0.4);
    backdrop-filter: blur(14px) saturate(1.3);
    -webkit-backdrop-filter: blur(14px) saturate(1.3);
  }

  &:hover {
    transform: scale(1.08);
    filter: brightness(1.15);
  }

  &--active {
    // 选中时加强边框发光
    border-color: color-mix(in srgb, var(--kpi-color) 50%, transparent);
    box-shadow:
      0 0 16px color-mix(in srgb, var(--kpi-color) 35%, transparent),
      0 0 40px color-mix(in srgb, var(--kpi-color) 18%, transparent),
      0 2px 12px rgba(0, 0, 0, 0.3);

    // 底部标识线：宽度与背景底边融合
    &::after {
      content: '';
      position: absolute;
      bottom: -1px;
      left: 10%;
      right: 10%;
      height: 2px;
      border-radius: 0 0 2px 2px;
      background: var(--kpi-color);
      box-shadow: 0 0 10px var(--kpi-color), 0 0 20px color-mix(in srgb, var(--kpi-color) 40%, transparent);
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
    font-size: 16px;
    font-weight: 600;
    color: var(--color-text-secondary);
    white-space: nowrap;
  }

  &__count {
    font-size: 28px;
    font-weight: 700;
    font-variant-numeric: tabular-nums;
    color: var(--color-text-primary);
  }

  // 常闭模式：隐藏数字，图标+文字横向居中
  &--compact {
    justify-content: center;

    .kpi-indicator__info {
      align-items: center;
    }

    .kpi-indicator__label {
      font-size: 18px;
    }
  }
}

// 数字淡入淡出
.count-fade-enter-active,
.count-fade-leave-active {
  transition: opacity 0.3s ease, max-height 0.3s ease;
}
.count-fade-enter-from,
.count-fade-leave-to {
  opacity: 0;
  max-height: 0;
}
</style>
