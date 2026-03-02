<script setup lang="ts">
import { ref, computed } from 'vue';
import Header from './components/Header.vue';
import KPICard from './components/KPICard.vue';
import CentralScene from './components/CentralScene.vue';
import DetailPanel from './components/DetailPanel.vue';
import DashboardPanel from './components/DashboardPanel.vue';
import { kpiData, modules, dashboardData } from './data/dashboardData';
import type { SceneNode } from './types';

const selectedNode = ref<SceneNode | null>(null);
const selectedModuleId = ref<string | null>(null);
const selectedNodeId = ref<string | null>(null);
const panelPosition = ref<'left' | 'right'>('right');

// 处理节点点击
const handleNodeClick = (node: SceneNode, moduleId: string) => {
  if (selectedNodeId.value === node.id) {
    // 取消选择
    selectedNode.value = null;
    selectedNodeId.value = null;
    selectedModuleId.value = null;
  } else {
    // 选择新节点
    selectedNode.value = node;
    selectedNodeId.value = node.id;
    selectedModuleId.value = moduleId;
    
    // 根据节点位置决定面板显示位置
    const module = modules.find(m => m.id === moduleId);
    if (module) {
      panelPosition.value = node.position.x < 50 ? 'right' : 'left';
    }
  }
};

// 关闭详情面板
const handleClosePanel = () => {
  selectedNode.value = null;
  selectedNodeId.value = null;
  selectedModuleId.value = null;
};

// 获取选中节点所属模块的颜色和名称
const moduleInfo = computed(() => {
  if (!selectedModuleId.value) return { color: '#0ea5e9', name: '' };
  const module = modules.find(m => m.id === selectedModuleId.value);
  return {
    color: module?.color || '#0ea5e9',
    name: module?.name || ''
  };
});
</script>

<template>
  <div class="relative w-screen h-screen bg-slate-900 overflow-hidden">
    <!-- 背景效果 -->
    <div class="absolute inset-0">
      <!-- 深色渐变背景 -->
      <div class="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
      
      <!-- 网格背景 -->
      <div class="absolute inset-0 grid-bg opacity-30" />
      
      <!-- 径向渐变 -->
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-900/10 via-transparent to-transparent" />
      
      <!-- 角落装饰 -->
      <div class="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-cyan-500/5 to-transparent rounded-full blur-3xl" />
      <div class="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-blue-500/5 to-transparent rounded-full blur-3xl" />
    </div>

    <!-- 头部 -->
    <Header />

    <!-- KPI指标区 -->
    <div class="absolute top-24 left-1/2 -translate-x-1/2 flex gap-8 z-30">
      <KPICard 
        v-for="(kpi, index) in kpiData" 
        :key="kpi.label" 
        :data="kpi" 
        :index="index" 
      />
    </div>

    <!-- 中央3D场景 - 使用用户提供的背景图 -->
    <div class="absolute inset-0 pt-28 pb-36">
      <!-- 背景图 -->
      <div 
        class="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style="background-image: url('/background.png'); background-size: contain;"
      />
      
      <!-- 场景内容层 -->
      <div class="relative w-full h-full">
        <CentralScene
          :modules="modules"
          :selected-node-id="selectedNodeId"
          :selected-module-id="selectedModuleId"
          @node-click="handleNodeClick"
        />
      </div>
    </div>

    <!-- 详情面板 -->
    <DetailPanel
      :node="selectedNode"
      :module-color="moduleInfo.color"
      :module-name="moduleInfo.name"
      :position="panelPosition"
      @close="handleClosePanel"
    />

    <!-- 底部数据看板 -->
    <DashboardPanel :data="dashboardData" />

    <!-- 底部装饰线 -->
    <div class="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
  </div>
</template>