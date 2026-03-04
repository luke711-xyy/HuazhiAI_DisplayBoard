<script setup lang="ts">
/**
 * DashboardContainer.vue - 固定视口缩放容器
 *
 * 以 1920x1080 为设计基准，通过 transform: scale() 自动适配任意屏幕尺寸。
 * 计算方式：取 scaleX(窗口宽/1920) 和 scaleY(窗口高/1080) 的较小值，
 * 确保内容完整显示且不超出屏幕。
 */
import { ref, onMounted, onUnmounted } from 'vue'

const scale = ref(1)
const containerTransform = ref('scale(1)')
const containerRef = ref<HTMLElement>()

/**
 * 根据窗口大小计算缩放比例
 */
function updateScale() {
  const w = window.innerWidth
  const h = window.innerHeight
  const s = Math.min(w / 1920, h / 1080)
  scale.value = s
  containerTransform.value = `scale(${s})`
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
</template>

<style scoped lang="scss">
/* 使用 _layout.scss 中定义的全局类，此处仅做补充 */
</style>
