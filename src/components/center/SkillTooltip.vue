<script setup lang="ts">
/**
 * SkillTooltip.vue - 技能详情悬浮提示框
 * 悬停在技能节点上时显示，包含技能名称和描述
 * 使用毛玻璃效果，通过 i18n 翻译显示文字
 */
import { useI18n } from '@/composables/useI18n'

const { t } = useI18n()

defineProps<{
  name: string
  description: string
}>()
</script>

<template>
  <div class="skill-tooltip">
    <h4 class="skill-tooltip__name">{{ t(name) }}</h4>
    <p class="skill-tooltip__desc">{{ t(description) }}</p>
  </div>
</template>

<style scoped lang="scss">
.skill-tooltip {
  position: absolute;
  bottom: calc(100% + 12px);
  left: 50%;
  transform: translateX(-50%);
  width: 260px;
  padding: 14px 18px;
  border-radius: 10px;
  z-index: var(--z-skill-tooltip);
  pointer-events: none;

  // 毛玻璃效果
  background: rgba(10, 15, 30, 0.85);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(100, 150, 255, 0.2);
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.4),
    0 0 12px rgba(59, 130, 246, 0.15);

  // 入场动画
  animation: fade-in-up var(--duration-fast) var(--ease-smooth) both;

  // 底部箭头
  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 6px solid transparent;
    border-top-color: rgba(10, 15, 30, 0.85);
  }

  &__name {
    font-size: 15px;
    font-weight: 600;
    color: var(--color-text-primary);
    margin-bottom: 6px;
  }

  &__desc {
    font-size: 12px;
    line-height: 1.6;
    color: var(--color-text-secondary);
  }
}
</style>
