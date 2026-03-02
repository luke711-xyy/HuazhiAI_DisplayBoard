<script setup lang="ts">
import { computed } from 'vue';
import { Package, Settings, TrendingUp } from 'lucide-vue-next';
import type { KPIData } from '../types';

const props = defineProps<{
  data: KPIData;
  index: number;
}>();

const iconMap: Record<string, any> = {
  Package,
  Settings,
  TrendingUp
};

const IconComponent = computed(() => iconMap[props.data.icon] || Package);
</script>

<template>
  <div class="relative group fade-in-up" :style="{ animationDelay: `${index * 0.15}s` }">
    <!-- 发光背景托盘 -->
    <div class="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3/4 h-4 bg-gradient-to-t from-cyan-500/20 to-transparent blur-xl rounded-full" />
    
    <!-- 主卡片 -->
    <div class="relative glass-card p-5 min-w-[180px] tech-border overflow-hidden">
      <!-- 顶部流光 -->
      <div class="absolute top-0 left-0 right-0 h-px">
        <div class="h-full w-full bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent animate-pulse" />
      </div>
      
      <!-- 背景渐变 -->
      <div :class="`absolute inset-0 bg-gradient-to-br ${data.color} opacity-5 group-hover:opacity-10 transition-opacity duration-500`" />
      
      <!-- 内容 -->
      <div class="relative z-10 flex flex-col items-center gap-3">
        <!-- 图标 -->
        <div class="relative">
          <div :class="`w-12 h-12 rounded-xl bg-gradient-to-br ${data.color} p-0.5`">
            <div class="w-full h-full rounded-xl bg-slate-900/80 flex items-center justify-center">
              <component :is="IconComponent" class="w-6 h-6 text-white" />
            </div>
          </div>
          <!-- 图标发光 -->
          <div :class="`absolute inset-0 rounded-xl bg-gradient-to-br ${data.color} blur-lg opacity-40`" />
        </div>
        
        <!-- 标签 -->
        <span class="text-sm text-slate-400 font-medium tracking-wide">
          {{ data.label }}
        </span>
        
        <!-- 数字 -->
        <span class="digital-number text-4xl font-bold text-white glow-text zoom-in inline-block" :style="{ animationDelay: `${index * 0.15 + 0.3}s` }">
          {{ data.value }}
        </span>
      </div>
      
      <!-- 底部装饰线 -->
      <div class="absolute bottom-0 left-0 right-0 h-px">
        <div class="h-full w-1/2 mx-auto bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />
      </div>
    </div>
  </div>
</template>