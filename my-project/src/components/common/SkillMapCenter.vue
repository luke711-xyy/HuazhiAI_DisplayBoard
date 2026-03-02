<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  modules: Array<{ id: string; label: string; color: string }>
}>()

defineEmits<{
  moduleClick: [id: string]
}>()

const activeModule = ref('assembly')
</script>

<template>
  <div class="skill-map-center">
    <!-- 网格背景 -->
    <div class="skill-map__bg grid-bg"></div>

    <!-- 蓝紫流体发光 -->
    <div class="skill-map__glow"></div>

    <!-- 核心模块标签 -->
    <div class="core-modules">
      <div
        v-for="module in modules"
        :key="module.id"
        class="core-module"
        :class="`core-module--${module.color} ${activeModule === module.id ? 'core-module--active' : ''}`"
        @click="emit('moduleClick', module.id)"
      >
        {{ module.label }}
      </div>
    </div>

    <!-- 子技能节点区域（占位） -->
    <div class="skill-nodes-area">
      <!-- TODO: 实现子技能节点和连接线 -->
      <DataPlaceholder text="此处为地图区域 - 子技能节点" icon="🗺️" />
    </div>
  </div>
</template>

<style scoped>
.skill-map-center {
  position: relative;
  width: 100%;
  height: 100%;
  background: var(--bg-0);
  border: 1px solid var(--border-neon);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.skill-map__bg {
  position: absolute;
  inset: 0;
  z-index: 1;
}

/* 蓝紫流体发光效果 */
.skill-map__glow {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(800px 600px at 30% 40%, rgba(24, 120, 255, 0.15), transparent 60%),
    radial-gradient(600px 500px at 70% 60%, rgba(168, 85, 247, 0.12), transparent 60%);
  z-index: 2;
}

/* 核心模块 */
.core-modules {
  position: absolute;
  bottom: 60px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: var(--space-lg);
  z-index: 10;
}

.core-module {
  padding: var(--space-sm) var(--space-lg);
  border-radius: var(--radius-lg);
  font-size: 16px;
  font-weight: 600;
  color: var(--text-0);
  text-shadow: var(--text-glow);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.core-module--blue {
  background: linear-gradient(135deg, #1878ff, #4db3ff);
  box-shadow: var(--glow-blue);
}

.core-module--orange {
  background: linear-gradient(135deg, #ffb84d, #ffd485);
  box-shadow: var(--glow-orange);
}

.core-module:hover,
.core-module--active {
  transform: scale(1.1);
}

.core-module--active.core-module--blue {
  background: linear-gradient(135deg, #4db3ff, #1878ff);
  box-shadow: 0 0 30px rgba(24, 120, 255, 0.8);
}

.core-module--active.core-module--orange {
  background: linear-gradient(135deg, #ffd485, #ffb84d);
  box-shadow: 0 0 30px rgba(255, 184, 77, 0.8);
}

/* 子技能节点区域 */
.skill-nodes-area {
  position: absolute;
  inset: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 5;
}
</style>
