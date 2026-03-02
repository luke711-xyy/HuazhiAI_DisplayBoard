<script setup lang="ts">
import { computed } from 'vue'

defineProps<{
  value: number
  max?: number
  showLabel?: boolean
  variant?: 'blue' | 'orange' | 'purple'
  height?: string
}>()

const progress = computed(() => {
  const maxValue = props.max || 100
  return Math.min(Math.max(props.value, 0), maxValue) / maxValue * 100
})
</script>

<template>
  <div class="progress-indicator" :style="{ height }">
    <div
      class="progress-indicator__bar"
      :class="`progress-indicator__bar--${variant}`"
      :style="{ width: `${progress}%` }"
    >
      <span v-if="showLabel" class="progress-label">{{ Math.round(progress) }}%</span>
    </div>
  </div>
</template>

<style scoped>
.progress-indicator {
  width: 100%;
  background: var(--border-0);
  border-radius: 3px;
  overflow: hidden;
}

.progress-indicator__bar {
  height: 100%;
  border-radius: 3px;
  transition: width var(--transition-normal);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: var(--space-sm);
}

/* 蓝色进度条 */
.progress-indicator__bar--blue {
  background: var(--gradient-blue);
  box-shadow: var(--glow-blue);
}

.progress-indicator__bar--orange {
  background: var(--gradient-orange);
  box-shadow: var(--glow-orange);
}

.progress-indicator__bar--purple {
  background: linear-gradient(135deg, var(--neon-purple), var(--neon-purple-light));
  box-shadow: var(--glow-purple);
}

.progress-label {
  font-size: 11px;
  font-weight: 600;
  color: #000;
  text-shadow: 0 0 4px rgba(255, 255, 255, 0.5);
}
</style>
