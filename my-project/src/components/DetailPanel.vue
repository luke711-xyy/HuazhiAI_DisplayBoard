<script setup lang="ts">
import { computed } from 'vue';
import { X, ChevronRight } from 'lucide-vue-next';
import { 
  Boxes, Grab, Target, Layers, ArrowUpDown, GitBranch, Repeat,
  AlignCenter, Crosshair, Link, Route, Map, Package, Box,
  Split, Truck, Warehouse, Database, Brain, Search, Eye,
  Gauge, Activity, Scan, ScanLine, Zap, Sparkles
} from 'lucide-vue-next';
import type { SceneNode } from '../types';

const props = defineProps<{
  node: SceneNode | null;
  moduleColor: string;
  moduleName: string;
  position: 'left' | 'right';
}>();

const emit = defineEmits<{
  (e: 'close'): void
}>();

const iconMap: Record<string, any> = {
  Boxes, Grab, Target, Layers, ArrowUpDown, GitBranch, Repeat,
  AlignCenter, Crosshair, Link, Route, Map, Package, Box,
  Split, Truck, Warehouse, Database, Brain, Search, Eye,
  Gauge, Activity, Scan, ScanLine, Zap, Sparkles
};

const IconComponent = computed(() => {
  if (!props.node) return Boxes;
  return iconMap[props.node.icon] || Boxes;
});

const isLeft = computed(() => props.position === 'left');
</script>

<template>
  <Transition :name="isLeft ? 'slide-panel-left' : 'slide-panel-right'">
    <div
      v-if="node"
      class="absolute top-1/2 -translate-y-1/2 z-30"
      :class="isLeft ? 'left-4' : 'right-4'"
    >
      <!-- 引线 -->
      <svg 
        class="absolute top-1/2 -translate-y-1/2 w-16 h-px pointer-events-none"
        :class="isLeft ? 'left-full' : 'right-full'"
        style="overflow: visible;"
      >
        <line
          :x1="isLeft ? 0 : 64" y1="0"
          :x2="isLeft ? 64 : 0" y2="0"
          :stroke="moduleColor"
          stroke-width="2"
          stroke-dasharray="4 2"
          class="draw-line"
          style="animation-duration: 0.5s;"
        />
        <circle
          :cx="isLeft ? 64 : 0" cy="0" r="4"
          :fill="moduleColor"
          class="zoom-in"
          style="animation-delay: 0.3s; transform-origin: center;"
        />
      </svg>
      
      <!-- 面板主体 -->
      <div 
        class="glass-panel rounded-xl p-5 w-80 relative overflow-hidden"
        :style="{ 
          borderColor: `${moduleColor}40`,
          boxShadow: `0 0 30px ${moduleColor}20, inset 0 1px 0 rgba(255,255,255,0.1)`
        }"
      >
        <!-- 顶部渐变条 -->
        <div 
          class="absolute top-0 left-0 right-0 h-1"
          :style="{ background: `linear-gradient(90deg, transparent, ${moduleColor}, transparent)` }"
        />
        
        <!-- 关闭按钮 -->
        <button
          @click="emit('close')"
          class="absolute top-3 right-3 w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
        >
          <X class="w-4 h-4 text-slate-400" />
        </button>
        
        <!-- 模块标签 -->
        <div class="flex items-center gap-2 mb-4">
          <div 
            class="px-2 py-0.5 rounded text-xs font-medium"
            :style="{ backgroundColor: `${moduleColor}30`, color: moduleColor }"
          >
            {{ moduleName }}
          </div>
          <ChevronRight class="w-4 h-4 text-slate-500" />
          <span class="text-xs text-slate-400">{{ node.level === 3 ? '三级场景' : '二级场景' }}</span>
        </div>
        
        <!-- 图标和标题 -->
        <div class="flex items-start gap-4 mb-4">
          <div 
            class="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
            :style="{ 
              background: `linear-gradient(135deg, ${moduleColor}40, ${moduleColor}20)`,
              boxShadow: `0 0 20px ${moduleColor}30`
            }"
          >
            <component :is="IconComponent" class="w-7 h-7" :style="{ color: moduleColor }" />
          </div>
          <div>
            <h3 class="text-lg font-bold text-white mb-1">{{ node.name }}</h3>
            <div class="flex items-center gap-2">
              <div 
                class="w-2 h-2 rounded-full animate-pulse"
                :style="{ backgroundColor: moduleColor, boxShadow: `0 0 8px ${moduleColor}` }"
              />
              <span class="text-xs text-slate-400">运行中</span>
            </div>
          </div>
        </div>
        
        <!-- 描述 -->
        <div class="mb-4">
          <h4 class="text-xs text-slate-500 uppercase tracking-wider mb-2">功能描述</h4>
          <p class="text-sm text-slate-300 leading-relaxed">
            {{ node.description }}
          </p>
        </div>
        
        <!-- 技术指标 -->
        <div>
          <h4 class="text-xs text-slate-500 uppercase tracking-wider mb-2">技术指标</h4>
          <div class="grid grid-cols-2 gap-2">
            <div class="glass-card p-2 rounded-lg">
              <div class="text-xs text-slate-500 mb-1">准确率</div>
              <div class="text-lg font-bold digital-number" :style="{ color: moduleColor }">99.8%</div>
            </div>
            <div class="glass-card p-2 rounded-lg">
              <div class="text-xs text-slate-500 mb-1">响应时间</div>
              <div class="text-lg font-bold digital-number" :style="{ color: moduleColor }">&lt;50ms</div>
            </div>
            <div class="glass-card p-2 rounded-lg">
              <div class="text-xs text-slate-500 mb-1">处理能力</div>
              <div class="text-lg font-bold digital-number" :style="{ color: moduleColor }">1200/h</div>
            </div>
            <div class="glass-card p-2 rounded-lg">
              <div class="text-xs text-slate-500 mb-1">覆盖率</div>
              <div class="text-lg font-bold digital-number" :style="{ color: moduleColor }">100%</div>
            </div>
          </div>
        </div>
        
        <!-- 底部装饰 -->
        <div 
          class="absolute bottom-0 left-0 right-0 h-px"
          :style="{ background: `linear-gradient(90deg, transparent, ${moduleColor}60, transparent)` }"
        />
      </div>
    </div>
  </Transition>
</template>