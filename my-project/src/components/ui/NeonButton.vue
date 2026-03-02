<script setup lang="ts">
defineProps<{
  variant?: 'blue' | 'orange' | 'purple'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  glow?: boolean
}>()

defineEmits<{
  click: []
}>()

const handleClick = () => {
  emit('click')
}
</script>

<template>
  <button
    class="neon-btn"
    :class="`neon-btn--${variant} neon-btn--${size} ${glow ? 'neon-btn--glow' : ''}`"
    :disabled="disabled"
    @click="handleClick"
  >
    <slot />
  </button>
</template>

<style scoped>
.neon-btn {
  border: none;
  border-radius: var(--radius-md);
  color: #000;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
}

.neon-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 蓝色变体 */
.neon-btn--blue {
  background: var(--gradient-blue);
}

.neon-btn--blue.neon-btn--glow:hover {
  box-shadow: 0 0 30px rgba(24, 120, 255, 0.8);
}

/* 橙色变体 */
.neon-btn--orange {
  background: var(--gradient-orange);
}

.neon-btn--orange.neon-btn--glow:hover {
  box-shadow: 0 0 30px rgba(255, 184, 77, 0.8);
}

/* 紫色变体 */
.neon-btn--purple {
  background: linear-gradient(135deg, var(--neon-purple), var(--neon-purple-light));
}

.neon-btn--purple.neon-btn--glow:hover {
  box-shadow: 0 0 30px rgba(168, 85, 247, 0.8);
}

/* 尺寸变体 */
.neon-btn--sm {
  padding: var(--space-xs) var(--space-sm);
  font-size: 12px;
}

.neon-btn--md {
  padding: var(--space-sm) var(--space-md);
  font-size: 14px;
}

.neon-btn--lg {
  padding: var(--space-md) var(--space-lg);
  font-size: 16px;
}

/* 发光效果 */
.neon-btn--glow {
  box-shadow: var(--glow-blue);
}

.neon-btn--orange.neon-btn--glow {
  box-shadow: var(--glow-orange);
}

.neon-btn--purple.neon-btn--glow {
  box-shadow: var(--glow-purple);
}

/* 悬停效果 */
.neon-btn:hover:not(:disabled) {
  transform: scale(1.05);
}
</style>
