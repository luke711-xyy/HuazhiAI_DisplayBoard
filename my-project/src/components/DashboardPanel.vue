<script setup lang="ts">
import { computed } from 'vue';
import { Building2, Package, Settings, TrendingUp } from 'lucide-vue-next';
import type { DashboardData, CompanyData } from '../types';

const props = defineProps<{
  data: DashboardData;
}>();

// 状态颜色映射
const statusColors: Record<string, any> = {
  reserved: { color: '#0ea5e9', label: '储备中', icon: Package },
  implementing: { color: '#f59e0b', label: '实施中', icon: Settings },
  promoting: { color: '#10b981', label: '推广中', icon: TrendingUp }
};

// 环形图数据计算
const getPieData = (companies: CompanyData[]) => {
  const ranges = [
    { name: '0-30%', value: 0, color: '#3b82f6' },
    { name: '30-60%', value: 0, color: '#8b5cf6' },
    { name: '60-90%', value: 0, color: '#f59e0b' },
    { name: '90-100%', value: 0, color: '#10b981' }
  ];
  
  companies.forEach(c => {
    if (c.progress <= 30) ranges[0].value++;
    else if (c.progress <= 60) ranges[1].value++;
    else if (c.progress <= 90) ranges[2].value++;
    else ranges[3].value++;
  });
  
  const filtered = ranges.filter(r => r.value > 0);
  const total = filtered.reduce((acc, curr) => acc + curr.value, 0);
  
  // 计算 SVG 的 stroke-dasharray
  let accumulatedPercent = 0;
  return filtered.map(item => {
    const percent = (item.value / total) * 100;
    const dash = percent;
    const offset = accumulatedPercent;
    accumulatedPercent += percent;
    return { ...item, dash, offset };
  });
};

const calcAverageProgress = (companies: CompanyData[]) => {
  if (companies.length === 0) return 0;
  return Math.round(companies.reduce((acc, c) => acc + c.progress, 0) / companies.length);
};
</script>

<template>
  <div class="absolute bottom-2 left-3 right-3 flex gap-3 z-20">
    <!-- 动态渲染三大板块 -->
    <div 
      v-for="(status, key, index) in { reserved: data.reserved, implementing: data.implementing, promoting: data.promoting }" 
      :key="key"
      class="glass-panel rounded-lg p-2.5 flex-1 min-w-0 fade-in-up"
      :style="{ borderColor: `${statusColors[key].color}30`, animationDelay: `${0.8 + index * 0.2}s` }"
    >
      <!-- 标题栏 -->
      <div class="flex items-center justify-between mb-2">
        <div class="flex items-center gap-2">
          <div 
            class="w-7 h-7 rounded-md flex items-center justify-center"
            :style="{ 
              background: `linear-gradient(135deg, ${statusColors[key].color}40, ${statusColors[key].color}20)`,
              boxShadow: `0 0 10px ${statusColors[key].color}30`
            }"
          >
            <component :is="statusColors[key].icon" class="w-3.5 h-3.5" :style="{ color: statusColors[key].color }" />
          </div>
          <div>
            <h3 class="text-sm text-white font-medium">{{ statusColors[key].label }}</h3>
            <div class="flex items-center gap-1">
              <span class="digital-number text-base font-bold" :style="{ color: statusColors[key].color }">
                {{ status.length }}
              </span>
              <span class="text-[10px] text-slate-500">家</span>
            </div>
          </div>
        </div>
        
        <!-- 迷你自绘环形图 (替代 Recharts) -->
        <div class="w-10 h-10 relative">
          <svg viewBox="0 0 32 32" class="w-full h-full transform -rotate-90">
            <circle 
              v-for="(slice, i) in getPieData(status)" 
              :key="i"
              cx="16" cy="16" r="10"
              fill="none"
              :stroke="slice.color"
              stroke-width="5"
              pathLength="100"
              :stroke-dasharray="`${slice.dash} 100`"
              :stroke-dashoffset="`-${slice.offset}`"
              class="draw-line"
            />
          </svg>
        </div>
      </div>
      
      <!-- 企业列表 -->
      <div class="space-y-0.5 max-h-24 overflow-y-auto hide-scrollbar">
        <div 
          v-for="(company, cIndex) in status.slice(0, 4)" 
          :key="company.name + cIndex"
          class="flex items-center gap-2 py-1 border-b border-white/5 last:border-0 fade-in-up"
          :style="{ animationDelay: `${cIndex * 0.05}s` }"
        >
          <div 
            class="w-1.5 h-1.5 rounded-full flex-shrink-0"
            :style="{ backgroundColor: statusColors[key].color, boxShadow: `0 0 6px ${statusColors[key].color}` }"
          />
          
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-1.5">
              <Building2 class="w-3 h-3 text-slate-500 flex-shrink-0" />
              <span class="text-xs text-slate-300 truncate">{{ company.name }}</span>
            </div>
          </div>
          
          <div class="w-14 flex-shrink-0">
            <div class="flex items-center justify-between mb-0.5">
              <span class="text-[10px] font-medium" :style="{ color: statusColors[key].color }">
                {{ company.progress }}%
              </span>
            </div>
            <div class="h-1 bg-slate-700/50 rounded-full overflow-hidden">
              <div
                class="h-full rounded-full relative transition-all duration-1000 ease-out"
                :style="{ 
                  width: `${company.progress}%`,
                  background: `linear-gradient(90deg, ${statusColors[key].color}80, ${statusColors[key].color})`
                }"
              >
                <div 
                  class="absolute inset-y-0 right-0 w-3"
                  :style="{ background: `linear-gradient(90deg, transparent, ${statusColors[key].color})`, filter: 'blur(1px)' }"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 底部统计 -->
      <div class="mt-2 pt-1.5 border-t border-white/10 flex items-center justify-between">
        <span class="text-[10px] text-slate-500">平均进度</span>
        <div class="flex items-center gap-1.5">
          <div class="w-14 h-1.5 bg-slate-700/50 rounded-full overflow-hidden">
            <div
              class="h-full rounded-full transition-all duration-1000 ease-out"
              :style="{ 
                width: `${calcAverageProgress(status)}%`,
                background: `linear-gradient(90deg, ${statusColors[key].color}60, ${statusColors[key].color})`
              }"
            />
          </div>
          <span class="digital-number text-xs font-semibold" :style="{ color: statusColors[key].color }">
            {{ calcAverageProgress(status) }}%
          </span>
        </div>
      </div>
    </div>
  </div>
</template>