<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  label: string
  selected?: boolean
  hasChildren?: boolean
}>()

defineEmits<{
  click: []
  expand: []
}>()

const showDetail = ref(false)

const handleClick = () => {
  emit('click')
  showDetail.value = true
}

const toggleDetail = (e: Event) => {
  e.stopPropagation()
  showDetail.value = !showDetail.value
  emit('expand', showDetail.value)
}
</script>

<template>
  <div class="skill-node" :class="{ 'skill-node--selected': selected }" @click="handleClick">
    <span class="skill-node__label">{{ label }}</span>
    <button
      v-if="hasChildren"
      class="skill-node__expand"
      @click="toggleDetail"
    >
      {{ showDetail ? '−' : '+' }}
    </button>

    <!-- 详情浮层 -->
    <Transition name="detail">
      <div v-if="showDetail" class="skill-node__detail" @click.stop>
        <slot name="detail">
          <p class="detail-text">此处显示技能详细描述信息</p>
        </slot>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.skill-node {
  position: relative;
  padding: var(--space-sm) var(--space-md);
  border: 1px solid var(--border-1);
  border-radius: var(--radius-sm);
  background: rgba(255, 255, 255, 0.02);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: var(--space-sm);
  transition: all var(--transition-fast);
}

.skill-node--selected {
  background: var(--neon-blue);
  border-color: var(--neon-blue);
  box-shadow: var(--glow-blue);
}

.skill-node__label {
  font-size: 13px;
  color: var(--text-0);
  font-weight: 500;
}

.skill-node--selected .skill-node__label {
  color: #000;
}

.skill-node__expand {
  width: 24px;
  height: 24px;
  border: none;
  border-radius: var(--radius-sm);
  background: rgba(255, 255, 255, 0.1);
  color: var(--text-0);
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
}

.skill-node__expand:hover {
  background: rgba(255, 255, 255, 0.2);
}

.skill-node--selected .skill-node__expand {
  background: rgba(0, 0, 0, 0.2);
  color: #fff;
}

/* 详情浮层 */
.skill-node__detail {
  position: absolute;
  left: calc(100% + var(--space-sm));
  top: 50%;
  transform: translateY(-50%);
  min-width: 200px;
  padding: var(--space-md);
  background: var(--bg-2);
  border: 1px solid var(--border-neon);
  border-radius: var(--radius-md);
  box-shadow: var(--glow-blue);
  z-index: 100;
}

.detail-text {
  margin: 0;
  font-size: 12px;
  color: var(--text-1);
  line-height: 1.6;
}

/* 过渡动画 */
.detail-enter-active,
.detail-leave-active {
  transition: all var(--transition-normal);
}

.detail-enter-from,
.detail-leave-to {
  opacity: 0;
  transform: translateY(-50%) translateX(-10px);
}
</style>
