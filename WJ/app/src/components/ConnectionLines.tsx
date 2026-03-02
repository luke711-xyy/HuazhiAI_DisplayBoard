import { motion } from 'framer-motion';
import { useMemo } from 'react';
import type { Module } from '@/types';

interface ConnectionLinesProps {
  modules: Module[];
  selectedNodeId: string | null;
}

interface Line {
  id: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: string;
  isActive: boolean;
}

export function ConnectionLines({ modules, selectedNodeId }: ConnectionLinesProps) {
  // 计算所有连接线
  const lines = useMemo(() => {
    const allLines: Line[] = [];
    
    modules.forEach(module => {
      module.nodes.forEach(node => {
        if (node.connections.length > 0) {
          node.connections.forEach(targetId => {
            // 查找目标节点
            let targetNode = null;
            for (const m of modules) {
              targetNode = m.nodes.find(n => n.id === targetId);
              if (targetNode) break;
            }
            
            if (targetNode) {
              const isActive = selectedNodeId === node.id || selectedNodeId === targetId;
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
  }, [modules, selectedNodeId]);
  
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
      <defs>
        {/* 发光滤镜 */}
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        
        {/* 渐变定义 */}
        {modules.map(module => (
          <linearGradient 
            key={module.id}
            id={`gradient-${module.id}`}
            x1="0%" y1="0%" x2="100%" y2="100%"
          >
            <stop offset="0%" stopColor={module.color} stopOpacity="0.8" />
            <stop offset="100%" stopColor={module.color} stopOpacity="0.3" />
          </linearGradient>
        ))}
        
        {/* 箭头标记 */}
        <marker
          id="arrowhead"
          markerWidth="6"
          markerHeight="6"
          refX="5"
          refY="3"
          orient="auto"
        >
          <polygon points="0 0, 6 3, 0 6" fill="rgba(148, 163, 184, 0.5)" />
        </marker>
      </defs>
      
      {/* 绘制连接线 */}
      {lines.map((line, index) => (
        <g key={line.id}>
            {/* 基础线 */}
            <motion.line
              x1={`${line.x1}%`}
              y1={`${line.y1}%`}
              x2={`${line.x2}%`}
              y2={`${line.y2}%`}
              stroke={line.color}
              strokeWidth={line.isActive ? 2 : 1}
              strokeOpacity={line.isActive ? 0.6 : 0.25}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: index * 0.05, duration: 0.8 }}
              filter={line.isActive ? 'url(#glow)' : undefined}
            />
            
            {/* 数据流动画 - 仅在选中时显示 */}
            {line.isActive && (
              <>
                <motion.circle
                  r="4"
                  fill={line.color}
                  filter="url(#glow)"
                  initial={{ opacity: 0 }}
                  animate={{ 
                    opacity: [0, 1, 0],
                    cx: [`${line.x1}%`, `${line.x2}%`],
                    cy: [`${line.y1}%`, `${line.y2}%`]
                  }}
                  transition={{ 
                    duration: 1.5, 
                    repeat: Infinity, 
                    ease: 'linear',
                    times: [0, 0.5, 1]
                  }}
                />
                <motion.circle
                  r="3"
                  fill="white"
                  initial={{ opacity: 0 }}
                  animate={{ 
                    opacity: [0, 0.8, 0],
                    cx: [`${line.x1}%`, `${line.x2}%`],
                    cy: [`${line.y1}%`, `${line.y2}%`]
                  }}
                  transition={{ 
                    duration: 1.5, 
                    repeat: Infinity, 
                    ease: 'linear',
                    delay: 0.3,
                    times: [0, 0.5, 1]
                  }}
                />
              </>
            )}
            
            {/* 节点连接点 */}
            <circle
              cx={`${line.x1}%`}
              cy={`${line.y1}%`}
              r="3"
              fill={line.color}
              opacity={line.isActive ? 0.8 : 0.4}
            />
            <circle
              cx={`${line.x2}%`}
              cy={`${line.y2}%`}
              r="3"
              fill={line.color}
              opacity={line.isActive ? 0.8 : 0.4}
            />
          </g>
      ))}
      
      
      {/* 模块间连接线 */}
      <motion.path
        d="M 32% 50% Q 41% 55% 50% 60%"
        stroke="url(#gradient-assembly)"
        strokeWidth="1.5"
        fill="none"
        strokeOpacity="0.3"
        strokeDasharray="4 4"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, delay: 0.5 }}
      />
      <motion.path
        d="M 50% 60% Q 59% 55% 68% 50%"
        stroke="url(#gradient-palletizing)"
        strokeWidth="1.5"
        fill="none"
        strokeOpacity="0.3"
        strokeDasharray="4 4"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, delay: 0.7 }}
      />
    </svg>
  );
}
