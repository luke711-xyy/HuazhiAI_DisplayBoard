<script setup lang="ts">
/**
 * GlassPanel.vue - 可复用毛玻璃容器
 * 支持深色/浅色两种风格，自定义圆角和内边距
 */
withDefaults(defineProps<{
  variant?: 'dark' | 'light'
  borderRadius?: string
  padding?: string
}>(), {
  variant: 'dark',
  borderRadius: '12px',
  padding: '16px',
})
</script>

<template>
  <div
    class="glass-panel"
    :class="`glass-panel--${variant}`"
    :style="{ borderRadius, padding }"
  >
    <slot />
  </div>
</template>

<style scoped lang="scss">
.glass-panel {
  &--dark {
    background: rgba(10, 15, 30, 0.7);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid rgba(100, 150, 255, 0.1);
    box-shadow:
      0 4px 24px rgba(0, 0, 0, 0.4),
      inset 0 1px 0 rgba(100, 150, 255, 0.05);
  }

  &--light {
    background: rgba(255, 255, 255, 0.06);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow:
      0 8px 32px rgba(0, 0, 0, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.08);
  }
}
</style>
