<script setup lang="ts">
defineProps<{
  text: string
  icon?: string
  minHeight?: string
}>()
</script>

<template>
  <div class="data-placeholder" :style="{ minHeight }">
    <!-- TODO: 替换为切图图标或3D模型 -->
    <div class="data-placeholder__icon">
      <span v-if="icon" class="placeholder-icon">{{ icon }}</span>
      <svg v-else width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 0 1 .707.293l6.414 6.414a1 1 0 0 0 1 .293.707L5.414 9.586a1 1 0 0 0 1-.293.707l-6.414-6.414a1 1 0 0 0 1-.707-.293l-6.414-6.414a1 1 0 0 0 1-.293.707L5.414 9.586a1 1 0 0 0 1-.293.707l-6.414-6.414a1 1 0 0 0 1-.707-.293l-6.414-6.414a1 1 0 0 0 1-.293.707z"/>
      </svg>
    </div>
    <p class="data-placeholder__text">{{ text }}</p>
  </div>
</template>

<style scoped>
.data-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 1px dashed var(--border-neon);
  border-radius: var(--radius-lg);
  background: rgba(24, 120, 255, 0.02);
  gap: var(--space-md);
  min-height: 200px;
}

.data-placeholder__icon {
  font-size: 48px;
  opacity: 0.5;
}

.placeholder-icon {
  animation: pulse 2s ease-in-out infinite;
}

.data-placeholder__text {
  margin: 0;
  color: var(--text-2);
  font-size: 14px;
  opacity: 0.7;
}

@keyframes pulse {
  0%, 100% {
    opacity: 0.5;
  }
  50% {
    opacity: 0.8;
  }
}
</style>
