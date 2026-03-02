<script setup lang="ts">
import { Settings2 } from 'lucide-vue-next';
</script>

<template>
  <header class="absolute top-0 left-0 right-0 z-40 flex items-center justify-between px-8 py-4 fade-in-down">
    <!-- Logo区域 -->
    <div class="flex items-center gap-4">
      <div class="relative transition-transform duration-300 hover:scale-105 cursor-pointer">
        <!-- Logo背景发光 -->
        <div class="absolute inset-0 bg-cyan-500/20 blur-xl rounded-full" />
        
        <!-- Logo图标 -->
        <div class="relative w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/30 to-blue-600/30 border border-cyan-400/30 flex items-center justify-center">
          <svg viewBox="0 0 40 40" class="w-8 h-8">
            <defs>
              <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#22d3ee" />
                <stop offset="100%" stop-color="#3b82f6" />
              </linearGradient>
            </defs>
            <path
              d="M20 5 L35 15 L35 30 L20 38 L5 30 L5 15 Z"
              fill="none"
              stroke="url(#logo-gradient)"
              stroke-width="2"
            />
            <path
              d="M20 12 L28 17 L28 26 L20 31 L12 26 L12 17 Z"
              fill="url(#logo-gradient)"
              opacity="0.8"
            />
            <circle cx="20" cy="21" r="4" fill="#fff" />
          </svg>
        </div>
      </div>
      
      <div>
        <h1 class="text-xl font-bold text-white tracking-wider">
          HUAZHI <span class="text-cyan-400">AI</span>
        </h1>
        <p class="text-xs text-slate-400 tracking-wide">
          Run Beyond, Grasp the world.
        </p>
      </div>
    </div>
    
    <!-- 中央标题 -->
    <div class="absolute left-1/2 -translate-x-1/2 text-center">
      <div class="zoom-in" style="animation-delay: 0.3s">
        <!-- 装饰线 -->
        <div class="flex items-center gap-4 mb-2">
          <div class="w-16 h-px bg-gradient-to-r from-transparent to-cyan-400/60" />
          <div class="w-2 h-2 rotate-45 border border-cyan-400/60" />
          <div class="w-16 h-px bg-gradient-to-l from-transparent to-cyan-400/60" />
        </div>
        
        <h2 class="text-2xl font-bold text-white tracking-[0.3em]">
          联创 · 联拓 · 联营
        </h2>
        <p class="text-xs text-slate-500 tracking-widest mt-1">
          Co-Creation · Co-Expansion · Co-Operation
        </p>
        
        <!-- 底部装饰线 -->
        <div class="flex items-center gap-4 mt-2">
          <div class="w-12 h-px bg-gradient-to-r from-transparent to-cyan-400/40" />
          <div class="w-1.5 h-1.5 rounded-full bg-cyan-400/40" />
          <div class="w-12 h-px bg-gradient-to-l from-transparent to-cyan-400/40" />
        </div>
      </div>
    </div>
    
    <!-- 设置按钮 -->
    <button class="w-10 h-10 rounded-full glass-card flex items-center justify-center transition-all duration-300 hover:scale-110 hover:rotate-90 active:scale-95">
      <Settings2 class="w-5 h-5 text-slate-400" />
    </button>
  </header>
</template>