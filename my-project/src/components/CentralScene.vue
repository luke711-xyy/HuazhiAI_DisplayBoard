<script setup lang="ts">
import type { Module, SceneNode as SceneNodeType } from '../types';
import SceneNode from './SceneNode.vue';
import ConnectionLines from './ConnectionLines.vue';

const props = defineProps<{
  modules: Module[];
  selectedNodeId: string | null;
  selectedModuleId: string | null;
}>();

const emit = defineEmits<{
  (e: 'node-click', node: SceneNodeType, moduleId: string): void
}>();

const isNodeDimmed = (node: SceneNodeType, moduleId: string): boolean => {
  if (!props.selectedNodeId && !props.selectedModuleId) return false;
  
  if (props.selectedNodeId) {
    const selectedNode = props.modules
      .flatMap(m => m.nodes)
      .find(n => n.id === props.selectedNodeId);
      
    if (selectedNode) {
      return node.id !== props.selectedNodeId && 
             !selectedNode.connections.includes(node.id) &&
             !node.connections.includes(props.selectedNodeId);
    }
  }
  
  if (props.selectedModuleId) {
    return moduleId !== props.selectedModuleId;
  }
  
  return false;
};
</script>

<template>
  <div class="absolute inset-0 flex items-center justify-center">
    <div class="relative w-full h-full">
      <!-- 连接线 -->
      <ConnectionLines :modules="modules" :selected-node-id="selectedNodeId" />
      
      <!-- 模块标签和节点 -->
      <div v-for="(module, moduleIndex) in modules" :key="module.id">
        <!-- 模块主标签 -->
        <div
          class="absolute transform -translate-x-1/2 -translate-y-1/2 z-10 zoom-in"
          :style="{ 
            left: `${module.position.x}%`, 
            top: `${module.position.y}%`,
            animationDelay: `${moduleIndex * 0.2}s`
          }"
        >
          <div 
            class="glass-panel px-6 py-3 rounded-xl cursor-pointer transition-all duration-300"
            :class="[selectedModuleId === module.id ? 'ring-2 ring-offset-2 ring-offset-slate-900' : '']"
            :style="{ 
              borderColor: `${module.color}50`,
              boxShadow: selectedModuleId === module.id 
                ? `0 0 30px ${module.color}40, 0 0 60px ${module.color}20` 
                : `0 0 20px ${module.color}20`
            }"
          >
            <!-- 发光背景 -->
            <div 
              class="absolute inset-0 rounded-xl opacity-20"
              :style="{ background: `radial-gradient(circle, ${module.color} 0%, transparent 70%)` }"
            />
            
            <div class="relative flex items-center gap-3">
              <!-- 呼吸灯 -->
              <div 
                class="w-3 h-3 rounded-full breathing-light"
                :style="{ backgroundColor: module.color, boxShadow: `0 0 10px ${module.color}` }"
              />
              <!-- 模块名称 -->
              <span class="text-lg font-bold tracking-wide" :style="{ color: module.color }">
                {{ module.name }}
              </span>
            </div>
            
            <!-- 底部流光 -->
            <div 
              class="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-px"
              :style="{ background: `linear-gradient(90deg, transparent, ${module.color}, transparent)` }"
            />
          </div>
        </div>
        
        <!-- 场景节点 -->
        <SceneNode
          v-for="node in module.nodes"
          :key="node.id"
          :node="node"
          :module-color="module.color"
          :is-selected="selectedNodeId === node.id"
          :is-dimmed="isNodeDimmed(node, module.id)"
          @click="emit('node-click', node, module.id)"
        />
      </div>
      
      <!-- 装饰性连接线 -->
      <svg class="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-30">
        <!-- 中心连接线 -->
        <line
          x1="25%" y1="45%" x2="50%" y2="65%"
          stroke="url(#center-gradient)"
          stroke-width="1"
          stroke-dasharray="4 4"
          class="draw-line"
          style="animation-delay: 1s; animation-duration: 2s;"
        />
        <line
          x1="50%" y1="65%" x2="75%" y2="45%"
          stroke="url(#center-gradient)"
          stroke-width="1"
          stroke-dasharray="4 4"
          class="draw-line"
          style="animation-delay: 1.2s; animation-duration: 2s;"
        />
        
        <defs>
          <linearGradient id="center-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#0ea5e9" stop-opacity="0.5" />
            <stop offset="50%" stop-color="#8b5cf6" stop-opacity="0.5" />
            <stop offset="100%" stop-color="#f97316" stop-opacity="0.5" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  </div>
</template>