<script setup lang="ts">
import { computed } from 'vue';
import type { Module } from '../types';

const props = defineProps<{
  modules: Module[];
  selectedNodeId: string | null;
}>();

interface Line {
  id: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: string;
  isActive: boolean;
}

const lines = computed<Line[]>(() => {
  const allLines: Line[] = [];
  
  props.modules.forEach(module => {
    module.nodes.forEach(node => {
      if (node.connections.length > 0) {
        node.connections.forEach(targetId => {
          let targetNode = null;
          for (const m of props.modules) {
            targetNode = m.nodes.find(n => n.id === targetId);
            if (targetNode) break;
          }
          
          if (targetNode) {
            const isActive = props.selectedNodeId === node.id || props.selectedNodeId === targetId;
            allLines.push({
              id: `${node.id}-${targetId}`,
              x1: node.position.x,
              y1: node.position.y,
              x2: targetNode.position.x,
              y2: targetNode.position.y,
              color: module.color,
              isActive
            });
          }
        });
      }
    });
  });
  
  return allLines;
});
</script>

<template>
  <svg class="absolute inset-0 w-full h-full pointer-events-none z-0">
    <defs>
      <!-- 发光滤镜 -->
      <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="2" result="coloredBlur" />
        <feMerge>
          <feMergeNode in="coloredBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      
      <!-- 渐变定义 -->
      <linearGradient 
        v-for="module in modules" 
        :key="module.id"
        :id="`gradient-${module.id}`"
        x1="0%" y1="0%" x2="100%" y2="100%"
      >
        <stop offset="0%" :stop-color="module.color" stop-opacity="0.8" />
        <stop offset="100%" :stop-color="module.color" stop-opacity="0.3" />
      </linearGradient>
    </defs>
    
    <!-- 绘制连接线 -->
    <g v-for="(line, index) in lines" :key="line.id">
      <!-- 基础线 -->
      <line
        :x1="`${line.x1}%`"
        :y1="`${line.y1}%`"
        :x2="`${line.x2}%`"
        :y2="`${line.y2}%`"
        :stroke="line.color"
        :stroke-width="line.isActive ? 2 : 1"
        :stroke-opacity="line.isActive ? 0.6 : 0.25"
        :filter="line.isActive ? 'url(#glow)' : undefined"
        class="draw-line"
        :style="{ animationDelay: `${index * 0.05}s` }"
      />
      
      <!-- 数据流动画 - 仅在选中时显示 -->
      <template v-if="line.isActive">
        <circle r="4" :fill="line.color" filter="url(#glow)">
          <animateMotion 
            :path="`M ${line.x1} ${line.y1} L ${line.x2} ${line.y2}`" 
            keyPoints="0;1" 
            keyTimes="0;1" 
            dur="1.5s" 
            repeatCount="indefinite" 
            calcMode="linear"
          />
          <animate attributeName="opacity" values="0;1;0" dur="1.5s" repeatCount="indefinite" />
        </circle>
        <circle r="3" fill="white">
          <animateMotion 
            :path="`M ${line.x1} ${line.y1} L ${line.x2} ${line.y2}`" 
            keyPoints="0;1" 
            keyTimes="0;1" 
            dur="1.5s" 
            begin="0.3s"
            repeatCount="indefinite" 
            calcMode="linear"
          />
          <animate attributeName="opacity" values="0;0.8;0" dur="1.5s" begin="0.3s" repeatCount="indefinite" />
        </circle>
      </template>
      
      <!-- 节点连接点 -->
      <circle :cx="`${line.x1}%`" :cy="`${line.y1}%`" r="3" :fill="line.color" :opacity="line.isActive ? 0.8 : 0.4" />
      <circle :cx="`${line.x2}%`" :cy="`${line.y2}%`" r="3" :fill="line.color" :opacity="line.isActive ? 0.8 : 0.4" />
    </g>
    
    <!-- 模块间连接线 -->
    <path
      d="M 32% 50% Q 41% 55% 50% 60%"
      stroke="url(#gradient-assembly)"
      stroke-width="1.5"
      fill="none"
      stroke-opacity="0.3"
      stroke-dasharray="4 4"
      class="draw-line"
      style="animation-delay: 0.5s; animation-duration: 1.5s;"
    />
    <path
      d="M 50% 60% Q 59% 55% 68% 50%"
      stroke="url(#gradient-palletizing)"
      stroke-width="1.5"
      fill="none"
      stroke-opacity="0.3"
      stroke-dasharray="4 4"
      class="draw-line"
      style="animation-delay: 0.7s; animation-duration: 1.5s;"
    />
  </svg>
</template>

<style scoped>
/* 为了让百分比的 M L 工作在 animateMotion 中，使用绝对百分比坐标较为复杂。
 * 为了简化，实际项目中通常推荐直接使用 x/y 动画或 CSS offset-path。
 * 上面的 animateMotion 会将数值当做像素处理，这在自适应时可能有偏差。
 * 为此这里改用基于 stroke-dashoffset 的流光效果更稳健。
 */
.draw-line {
  stroke-dasharray: 1000;
  stroke-dashoffset: 1000;
  animation: dash 1.5s ease-out forwards;
}

@keyframes dash {
  to {
    stroke-dashoffset: 0;
  }
}
</style>