<script setup lang="ts">
import { computed } from 'vue';
import { 
  Boxes, Grab, Target, Layers, ArrowUpDown, GitBranch, Repeat,
  AlignCenter, Crosshair, Link, Route, Map, Package, Box,
  Split, Truck, Warehouse, Database, Brain, Search, Eye,
  Gauge, Activity, Scan, ScanLine, Zap, Sparkles
} from 'lucide-vue-next';
import type { SceneNode as SceneNodeType } from '../types';

const props = defineProps<{
  node: SceneNodeType;
  moduleColor: string;
  isSelected: boolean;
  isDimmed: boolean;
}>();

const emit = defineEmits<{
  (e: 'click'): void
}>();

const iconMap: Record<string, any> = {
  Boxes, Grab, Target, Layers, ArrowUpDown, GitBranch, Repeat,
  AlignCenter, Crosshair, Link, Route, Map, Package, Box,
  Split, Truck, Warehouse, Database, Brain, Search, Eye,
  Gauge, Activity, Scan, ScanLine, Zap, Sparkles
};

const IconComponent = computed(() => iconMap[props.node.icon] || Boxes);
const isLevel3 = computed(() => props.node.level === 3);

// 计算随机延迟 (避免所有节点同时出现)
const randomDelay = Math.random() * 0.5 + 0.3;
</script>

<template>
  <div
    class="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer zoom-in transition-all duration-300 hover:scale-110 active:scale-95"
    :class="isDimmed ? 'spotlight-dim' : 'spotlight-active'"
    :style="{ 
      left: `${node.position.x}%`, 
      top: `${node.position.y}%`,
      animationDelay: `${randomDelay}s`
    }"
    @click="emit('click')"
  >
    <!-- 选中时的脉冲环 -->
    <template v-if="isSelected">
      <div
        class="absolute inset-0 rounded-full pulse-ring"
        :style="{ background: `radial-gradient(circle, ${moduleColor}40 0%, transparent 70%)` }"
      />
      <div 
        class="absolute -inset-3 rounded-full border-2 border-dashed animate-spin"
        :style="{ borderColor: `${moduleColor}60`, animationDuration: '3s' }"
      />
    </template>
    
    <!-- 节点主体 -->
    <div 
      class="relative flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300"
      :class="[
        isLevel3 ? 'glass-card' : 'glass-panel',
        isSelected ? 'ring-2 ring-offset-2 ring-offset-slate-900' : ''
      ]"
      :style="{ 
        '--tw-ring-color': isSelected ? moduleColor : undefined,
        boxShadow: isSelected ? `0 0 20px ${moduleColor}50, 0 0 40px ${moduleColor}30` : undefined
      }"
    >
      <!-- 呼吸灯指示器 -->
      <div 
        class="w-2 h-2 rounded-full breathing-light"
        :style="{ backgroundColor: moduleColor, boxShadow: `0 0 8px ${moduleColor}` }"
      />
      
      <!-- 图标 -->
      <div 
        class="w-6 h-6 rounded flex items-center justify-center"
        :style="{ backgroundColor: `${moduleColor}30` }"
      >
        <component :is="IconComponent" class="w-3.5 h-3.5" :style="{ color: moduleColor }" />
      </div>
      
      <!-- 名称 -->
      <span 
        class="text-sm font-medium whitespace-nowrap"
        :class="isLevel3 ? 'text-slate-300' : 'text-white'"
      >
        {{ node.name }}
      </span>
      
      <!-- 选中标记 -->
      <div
        v-if="isSelected"
        class="absolute -top-1 -right-1 w-3 h-3 rounded-full zoom-in"
        style="animation-duration: 0.2s;"
        :style="{ backgroundColor: moduleColor }"
      />
    </div>
    
    <!-- 连接线起点标记 -->
    <div 
      v-if="node.connections.length > 0"
      class="absolute top-1/2 right-0 w-2 h-2 rounded-full transform translate-x-1/2 -translate-y-1/2"
      :style="{ backgroundColor: moduleColor }"
    />
  </div>
</template>