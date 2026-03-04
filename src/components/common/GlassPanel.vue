<script setup lang="ts">
/**
 * GlassPanel.vue - 可复用毛玻璃容器
 * 支持深色/浅色两种风格，自定义圆角和内边距
 *
 * 模糊层通过 ::before 伪元素实现，与内容分离，
 * 避免 backdrop-filter 导致文字亚像素模糊。
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
  position: relative;
  isolation: isolate; // 创建层叠上下文，确保 ::before z-index:-1 不穿透到父级之下

  // 毛玻璃背景层（伪元素，位于内容之下）
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    z-index: -1;
    border-radius: inherit;
    pointer-events: none;
  }

  &--dark {
    border: 1px solid rgba(100, 150, 255, 0.1);
    box-shadow:
      0 4px 24px rgba(0, 0, 0, 0.4),
      inset 0 1px 0 rgba(100, 150, 255, 0.05);

    &::before {
      background: rgba(10, 15, 30, 0.45);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
    }
  }

  &--light {
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow:
      0 8px 32px rgba(0, 0, 0, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.08);

    &::before {
      background: rgba(255, 255, 255, 0.04);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
    }
  }
}
</style>
