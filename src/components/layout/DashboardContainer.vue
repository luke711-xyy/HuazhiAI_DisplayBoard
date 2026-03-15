<script setup lang="ts">
/**
 * DashboardContainer.vue - 固定视口缩放容器
 *
 * 以 1920x1080 为设计基准，通过 transform: scale() 自动适配任意屏幕尺寸。
 * 始终以窗口宽度为基准计算缩放比例（scale = windowWidth / 1920），
 * 高度按比例自动调整，保持 16:9 内容不变形。
 */
import { ref, onMounted, onUnmounted } from 'vue'

const scale = ref(1)
const containerTransform = ref('scale(1)')
const containerRef = ref<HTMLElement>()
const wrapperHeight = ref('100vh')

/**
 * 根据窗口宽度计算缩放比例，高度自适应
 */
function updateScale() {
  const w = window.innerWidth
  const s = w / 1920
  scale.value = s
  containerTransform.value = `scale(${s})`
  // 容器实际占用高度 = 设计高度 × 缩放比例
  wrapperHeight.value = `${1080 * s}px`
}

onMounted(() => {
  updateScale()
  window.addEventListener('resize', updateScale)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateScale)
})

/** 暴露容器元素和缩放值，供连线坐标计算使用 */
defineExpose({ containerRef, scale })
</script>

<template>
  <div class="dashboard-wrapper" :style="{ height: wrapperHeight }">
    <div
      ref="containerRef"
      class="dashboard-container"
      :style="{ transform: containerTransform }"
    >
      <!-- 全屏地图背景 -->
      <div class="background-layer">
        <img
          src="@/assets/backgrounds/map_background.png"
          alt="map background"
        />
      </div>

      <!-- 网格叠加层（增加科技感） -->
      <div class="grid-overlay" />

      <!-- 内容插槽 -->
      <slot />
    </div>
  </div>
</template>

<style scoped lang="scss">
.dashboard-wrapper {
  width: 100%;
  overflow: hidden;
  position: relative;
}
</style>
