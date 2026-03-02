<script setup lang="ts">
import { useSlots } from 'vue'

const slots = useSlots()

defineProps<{
  variant?: 'default' | 'orange' | 'purple'
  glow?: boolean
  noPadding?: boolean
}>()
</script>

<template>
  <div class="panel-box" :class="`panel-box--${variant} ${glow ? 'panel-box--glow' : ''}`">
    <div class="panel-box__inner" :class="{ 'panel-box__inner--no-padding': noPadding }">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.panel-box {
  position: relative;
  border: 1px solid var(--border-neon);
  border-radius: var(--radius-md);
  background: var(--bg-glass);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.panel-box--orange {
  border-color: rgba(255, 184, 77, 0.4);
}

.panel-box--purple {
  border-color: rgba(168, 85, 247, 0.4);
}

.panel-box--glow {
  box-shadow: var(--glow-blue);
}

.panel-box--orange.panel-box--glow {
  box-shadow: var(--glow-orange);
}

.panel-box--purple.panel-box--glow {
  box-shadow: var(--glow-purple);
}

/* 四角装饰 */
.panel-box::before,
.panel-box::after {
  content: '';
  position: absolute;
  width: 16px;
  height: 16px;
  pointer-events: none;
}

.panel-box::before {
  top: -1px;
  left: -1px;
  border-top: 2px solid var(--neon-blue);
  border-left: 2px solid var(--neon-blue);
  border-radius: var(--radius-sm) 0 0 0;
}

.panel-box::after {
  bottom: -1px;
  right: -1px;
  border-bottom: 2px solid var(--neon-blue);
  border-right: 2px solid var(--neon-blue);
  border-radius: 0 0 0 var(--radius-sm);
}

.panel-box--orange::before,
.panel-box--orange::after {
  border-color: var(--neon-orange);
}

.panel-box--purple::before,
.panel-box--purple::after {
  border-color: var(--neon-purple);
}

.panel-box__inner {
  padding: var(--space-md);
}

.panel-box__inner--no-padding {
  padding: 0;
}
</style>
