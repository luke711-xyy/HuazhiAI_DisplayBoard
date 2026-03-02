<script setup lang="ts">
defineProps<{
  label: string
  value: number
  icon?: string
  active?: boolean
}>()

defineEmits<{
  click: []
}>()
</script>

<template>
  <div class="stats-card" :class="{ 'stats-card--active': active }" @click="emit('click')">
    <!-- TODO: 替换为切图图标 -->
    <div class="stats-card__icon">{{ icon || '📊' }}</div>
    <div class="stats-card__value glow-text">{{ value }}</div>
    <div class="stats-card__label">{{ label }}</div>
  </div>
</template>

<style scoped>
.stats-card {
  background: var(--gradient-card);
  border: 1px solid var(--border-1);
  border-radius: var(--radius-md);
  padding: var(--space-md);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-sm);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.stats-card:hover {
  border-color: var(--neon-blue);
  background: rgba(24, 120, 255, 0.08);
}

.stats-card--active {
  border-color: var(--neon-blue);
  box-shadow: var(--glow-blue);
}

.stats-card__icon {
  font-size: 28px;
}

.stats-card__value {
  font-size: 36px;
  font-weight: 700;
  color: var(--text-0);
}

.stats-card--active .stats-card__value {
  color: var(--neon-blue);
}

.stats-card__label {
  font-size: 14px;
  color: var(--text-1);
}

/* 发光文本效果 */
.glow-text {
  text-shadow: var(--text-glow);
}
</style>
