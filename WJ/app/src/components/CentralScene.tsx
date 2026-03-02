import { motion } from 'framer-motion';
import type { Module, SceneNode as SceneNodeType } from '@/types';
import { SceneNodeComponent } from './SceneNode';
import { ConnectionLines } from './ConnectionLines';

interface CentralSceneProps {
  modules: Module[];
  selectedNodeId: string | null;
  selectedModuleId: string | null;
  onNodeClick: (node: SceneNodeType, moduleId: string) => void;
}

export function CentralScene({ 
  modules, 
  selectedNodeId, 
  selectedModuleId,
  onNodeClick 
}: CentralSceneProps) {
  // 判断节点是否应该被暗化
  const isNodeDimmed = (node: SceneNodeType, moduleId: string): boolean => {
    if (!selectedNodeId && !selectedModuleId) return false;
    if (selectedNodeId) {
      // 如果选中了节点，只高亮相关节点
      const selectedNode = modules
        .flatMap(m => m.nodes)
        .find(n => n.id === selectedNodeId);
      if (selectedNode) {
        return node.id !== selectedNodeId && 
               !selectedNode.connections.includes(node.id) &&
               !node.connections.includes(selectedNodeId);
      }
    }
    if (selectedModuleId) {
      return moduleId !== selectedModuleId;
    }
    return false;
  };
  
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      {/* 3D场景容器 */}
      <div className="relative w-full h-full">
        {/* 连接线 */}
        <ConnectionLines modules={modules} selectedNodeId={selectedNodeId} />
        
        {/* 模块标签和节点 */}
        {modules.map((module, moduleIndex) => (
          <div key={module.id}>
            {/* 模块主标签 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: moduleIndex * 0.2, type: 'spring', stiffness: 200 }}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
              style={{ 
                left: `${module.position.x}%`, 
                top: `${module.position.y}%` 
              }}
            >
              <div 
                className={`
                  glass-panel px-6 py-3 rounded-xl cursor-pointer
                  transition-all duration-300
                  ${selectedModuleId === module.id ? 'ring-2 ring-offset-2 ring-offset-slate-900' : ''}
                `}
                style={{ 
                  borderColor: `${module.color}50`,
                  boxShadow: selectedModuleId === module.id 
                    ? `0 0 30px ${module.color}40, 0 0 60px ${module.color}20` 
                    : `0 0 20px ${module.color}20`
                }}
              >
                {/* 发光背景 */}
                <div 
                  className="absolute inset-0 rounded-xl opacity-20"
                  style={{ background: `radial-gradient(circle, ${module.color} 0%, transparent 70%)` }}
                />
                
                <div className="relative flex items-center gap-3">
                  {/* 呼吸灯 */}
                  <div 
                    className="w-3 h-3 rounded-full breathing-light"
                    style={{ 
                      backgroundColor: module.color,
                      boxShadow: `0 0 10px ${module.color}` 
                    }}
                  />
                  
                  {/* 模块名称 */}
                  <span 
                    className="text-lg font-bold tracking-wide"
                    style={{ color: module.color }}
                  >
                    {module.name}
                  </span>
                </div>
                
                {/* 底部流光 */}
                <div 
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-px"
                  style={{ background: `linear-gradient(90deg, transparent, ${module.color}, transparent)` }}
                />
              </div>
            </motion.div>
            
            {/* 场景节点 */}
            {module.nodes.map((node) => (
              <SceneNodeComponent
                key={node.id}
                node={node}
                moduleColor={module.color}
                isSelected={selectedNodeId === node.id}
                isDimmed={isNodeDimmed(node, module.id)}
                onClick={() => onNodeClick(node, module.id)}
              />
            ))}
          </div>
        ))}
        
        {/* 装饰性连接线 */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-30">
          {/* 中心连接线 */}
          <motion.line
            x1="25%" y1="45%" x2="50%" y2="65%"
            stroke="url(#center-gradient)"
            strokeWidth="1"
            strokeDasharray="4 4"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, delay: 1 }}
          />
          <motion.line
            x1="50%" y1="65%" x2="75%" y2="45%"
            stroke="url(#center-gradient)"
            strokeWidth="1"
            strokeDasharray="4 4"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, delay: 1.2 }}
          />
          
          <defs>
            <linearGradient id="center-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.5" />
              <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#f97316" stopOpacity="0.5" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
}
