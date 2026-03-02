import { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { KPICard } from './components/KPICard';
import { CentralScene } from './components/CentralScene';
import { DetailPanel } from './components/DetailPanel';
import { DashboardPanel } from './components/DashboardPanel';
import { kpiData, modules, dashboardData } from './data/dashboardData';
import type { SceneNode } from './types';

function App() {
  const [selectedNode, setSelectedNode] = useState<SceneNode | null>(null);
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [panelPosition, setPanelPosition] = useState<'left' | 'right'>('right');

  // 处理节点点击
  const handleNodeClick = useCallback((node: SceneNode, moduleId: string) => {
    if (selectedNodeId === node.id) {
      // 取消选择
      setSelectedNode(null);
      setSelectedNodeId(null);
      setSelectedModuleId(null);
    } else {
      // 选择新节点
      setSelectedNode(node);
      setSelectedNodeId(node.id);
      setSelectedModuleId(moduleId);
      
      // 根据节点位置决定面板显示位置
      const module = modules.find(m => m.id === moduleId);
      if (module) {
        // 如果节点在左侧，面板显示在右侧，反之亦然
        setPanelPosition(node.position.x < 50 ? 'right' : 'left');
      }
    }
  }, [selectedNodeId]);

  // 关闭详情面板
  const handleClosePanel = useCallback(() => {
    setSelectedNode(null);
    setSelectedNodeId(null);
    setSelectedModuleId(null);
  }, []);

  // 获取选中节点所属模块的颜色和名称
  const getSelectedModuleInfo = useCallback(() => {
    if (!selectedModuleId) return { color: '#0ea5e9', name: '' };
    const module = modules.find(m => m.id === selectedModuleId);
    return {
      color: module?.color || '#0ea5e9',
      name: module?.name || ''
    };
  }, [selectedModuleId]);

  const moduleInfo = getSelectedModuleInfo();

  return (
    <div className="relative w-screen h-screen bg-slate-900 overflow-hidden">
      {/* 背景效果 */}
      <div className="absolute inset-0">
        {/* 深色渐变背景 */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
        
        {/* 网格背景 */}
        <div className="absolute inset-0 grid-bg opacity-30" />
        
        {/* 径向渐变 */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-900/10 via-transparent to-transparent" />
        
        {/* 角落装饰 */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-cyan-500/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-blue-500/5 to-transparent rounded-full blur-3xl" />
      </div>

      {/* 头部 */}
      <Header />

      {/* KPI指标区 */}
      <div className="absolute top-24 left-1/2 -translate-x-1/2 flex gap-8 z-30">
        {kpiData.map((kpi, index) => (
          <KPICard key={kpi.label} data={kpi} index={index} />
        ))}
      </div>

      {/* 中央3D场景 - 使用用户提供的背景图 */}
      <div className="absolute inset-0 pt-28 pb-36">
        {/* 背景图 */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: 'url(/background.png)',
            backgroundSize: 'contain'
          }}
        />
        
        {/* 场景内容层 */}
        <div className="relative w-full h-full">
          <CentralScene
            modules={modules}
            selectedNodeId={selectedNodeId}
            selectedModuleId={selectedModuleId}
            onNodeClick={handleNodeClick}
          />
        </div>
      </div>

      {/* 详情面板 */}
      {selectedNode && (
        <DetailPanel
          node={selectedNode}
          moduleColor={moduleInfo.color}
          moduleName={moduleInfo.name}
          onClose={handleClosePanel}
          position={panelPosition}
        />
      )}

      {/* 底部数据看板 */}
      <DashboardPanel data={dashboardData} />

      {/* 底部装饰线 */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
    </div>
  );
}

export default App;
