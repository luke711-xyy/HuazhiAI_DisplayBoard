<script setup lang="ts">
defineProps<{
  name: string
  attribute?: string
  progress?: number
  showProgress?: boolean
}>()

defineEmits<{
  click: []
}>()
</script>

<template>
  <div class="company-item" @click="emit('click')">
    <span class="company-item__name">{{ name }}</span>
    <div class="company-item__info">
      <span v-if="attribute" class="company-item__attr">{{ attribute }}</span>
      <ProgressIndicator
        v-if="showProgress && progress !== undefined"
        :value="progress"
        :show-label="true"
        height="4px"
        variant="blue"
      />
    </div>
  </div>
</template>

<style scoped>
.company-item {
  padding: var(--space-sm) var(--space-md);
  border-bottom: 1px solid var(--border-0);
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.company-item:hover {
  background: rgba(255, 255, 255, 0.03);
}

.company-item__name {
  flex: 1;
  color: var(--text-0);
  font-size: 14px;
}

.company-item__info {
  display: flex;
  align-items: center;
  gap: var(--space-md);
}

.company-item__attr {
  padding: 2px var(--space-sm);
  background: rgba(168, 85, 247, 0.1);
  border-radius: var(--radius-sm);
  font-size: 12px;
  color: var(--neon-purple-light);
}
</style>
