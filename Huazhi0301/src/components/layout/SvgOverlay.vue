<script setup lang="ts">
/**
 * SvgOverlay.vue - 全屏 SVG 发光连线覆盖层
 *
 * 覆盖在整个 DashboardContainer 之上（z-index 最高层之一）
 * 根据 useConnectionLines 计算的连线数据，渲染带发光效果的动态路径
 *
 * 发光效果实现：
 * - SVG <filter> 使用 feGaussianBlur 创建模糊光晕
 * - feColorMatrix 为模糊层着色
 * - feMerge 将光晕和原始线条合并
 * - stroke-dasharray + @keyframes dash-flow 创建流光效果
 */
import type { ConnectionLine } from '@/utils/bezier'

defineProps<{
  lines: ConnectionLine[]
}>()
</script>

<template>
  <svg
    class="svg-overlay"
    xmlns="http://www.w3.org/2000/svg"
    :viewBox="`0 0 1920 1080`"
    preserveAspectRatio="none"
  >
    <defs>
      <!--
        发光滤镜：蓝色
        原理：先模糊原始图形，再着色，最后与原始图形叠加
      -->
      <filter id="glow-blue" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
        <feColorMatrix
          in="blur"
          type="matrix"
          values="0 0 0 0 0.23
                  0 0 0 0 0.51
                  0 0 0 0 0.96
                  0 0 0 1.2 0"
          result="colored"
        />
        <feMerge>
          <feMergeNode in="colored" />
          <feMergeNode in="colored" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>

      <!-- 发光滤镜：橙色 -->
      <filter id="glow-orange" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
        <feColorMatrix
          in="blur"
          type="matrix"
          values="0 0 0 0 0.96
                  0 0 0 0 0.62
                  0 0 0 0 0.04
                  0 0 0 1.2 0"
          result="colored"
        />
        <feMerge>
          <feMergeNode in="colored" />
          <feMergeNode in="colored" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>

      <!-- 发光滤镜：红色 -->
      <filter id="glow-red" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
        <feColorMatrix
          in="blur"
          type="matrix"
          values="0 0 0 0 0.94
                  0 0 0 0 0.27
                  0 0 0 0 0.27
                  0 0 0 1.2 0"
          result="colored"
        />
        <feMerge>
          <feMergeNode in="colored" />
          <feMergeNode in="colored" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>

    <!-- 渲染每条连线 -->
    <path
      v-for="line in lines"
      :key="line.id"
      :d="line.path"
      fill="none"
      :stroke="line.color"
      stroke-width="2"
      stroke-linecap="round"
      stroke-dasharray="12 6"
      :filter="getFilterId(line.color)"
      class="connection-path"
    />

    <!-- 连线端点发光圆点 -->
    <template v-for="line in lines" :key="`dot-${line.id}`">
      <circle
        v-if="getEndpoints(line)"
        :cx="getEndpoints(line)!.toX"
        :cy="getEndpoints(line)!.toY"
        r="4"
        :fill="line.color"
        :filter="getFilterId(line.color)"
        class="endpoint-dot"
      />
    </template>
  </svg>
</template>

<script lang="ts">
/**
 * 根据线条颜色返回对应的 SVG filter ID
 */
function getFilterId(color: string): string {
  if (color.includes('F59E0B') || color.includes('f59e0b')) return 'url(#glow-orange)'
  if (color.includes('EF4444') || color.includes('ef4444')) return 'url(#glow-red)'
  return 'url(#glow-blue)'
}

/**
 * 从 path d 属性中提取终点坐标（用于绘制端点圆点）
 * 解析 "M x1 y1 C cx1 cy1, cx2 cy2, x2 y2" 格式
 */
function getEndpoints(line: { path: string }): { toX: number; toY: number } | null {
  const parts = line.path.split(/[MC,]\s*/).map(s => s.trim()).filter(Boolean)
  if (parts.length < 4) return null
  const lastPart = parts[parts.length - 1]
  const coords = lastPart.split(/\s+/).map(Number)
  if (coords.length >= 2) {
    return { toX: coords[0], toY: coords[1] }
  }
  return null
}
</script>

<style scoped>
.svg-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 1920px;
  height: 1080px;
  z-index: var(--z-svg-overlay);
  pointer-events: none;
}

/* 流光动画：stroke-dashoffset 循环移动 */
.connection-path {
  animation: dash-flow 1.2s linear infinite;
  opacity: 0.9;
}

@keyframes dash-flow {
  to {
    stroke-dashoffset: -36;
  }
}

/* 端点脉冲动画 */
.endpoint-dot {
  animation: pulse-dot 1.5s ease-in-out infinite;
}

@keyframes pulse-dot {
  0%, 100% { r: 4; opacity: 0.8; }
  50% { r: 6; opacity: 1; }
}
</style>
