import { motion } from 'framer-motion';
import { 
  Boxes, Grab, Target, Layers, ArrowUpDown, GitBranch, Repeat,
  AlignCenter, Crosshair, Link, Route, Map, Package, Box,
  Split, Truck, Warehouse, Database, Brain, Search, Eye,
  Gauge, Activity, Scan, ScanLine, Zap, Sparkles
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { SceneNode as SceneNodeType } from '@/types';

const iconMap: Record<string, LucideIcon> = {
  Boxes, Grab, Target, Layers, ArrowUpDown, GitBranch, Repeat,
  AlignCenter, Crosshair, Link, Route, Map, Package, Box,
  Split, Truck, Warehouse, Database, Brain, Search, Eye,
  Gauge, Activity, Scan, ScanLine, Zap, Sparkles
};

interface SceneNodeProps {
  node: SceneNodeType;
  moduleColor: string;
  isSelected: boolean;
  isDimmed: boolean;
  onClick: () => void;
}

export function SceneNodeComponent({ 
  node, 
  moduleColor, 
  isSelected, 
  isDimmed, 
  onClick 
}: SceneNodeProps) {
  const Icon = iconMap[node.icon] || Boxes;
  const isLevel3 = node.level === 3;
  
  return (
    <motion.div
      className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer ${
        isDimmed ? 'spotlight-dim' : 'spotlight-active'
      }`}
      style={{ 
        left: `${node.position.x}%`, 
        top: `${node.position.y}%`,
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: Math.random() * 0.5 + 0.3, type: 'spring', stiffness: 200 }}
      onClick={onClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* 选中时的脉冲环 */}
      {isSelected && (
        <>
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{ 
              background: `radial-gradient(circle, ${moduleColor}40 0%, transparent 70%)`,
            }}
            animate={{ scale: [1, 1.5, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
          <div 
            className="absolute -inset-3 rounded-full border-2 border-dashed animate-spin"
            style={{ borderColor: `${moduleColor}60` }}
          />
        </>
      )}
      
      {/* 节点主体 */}
      <div 
        className={`
          relative flex items-center gap-2 px-3 py-2 rounded-lg
          transition-all duration-300
          ${isLevel3 ? 'glass-card' : 'glass-panel'}
          ${isSelected ? 'ring-2 ring-offset-2 ring-offset-slate-900' : ''}
        `}
        style={{ 
          '--tw-ring-color': isSelected ? moduleColor : undefined,
          boxShadow: isSelected ? `0 0 20px ${moduleColor}50, 0 0 40px ${moduleColor}30` : undefined
        } as React.CSSProperties}
      >
        {/* 呼吸灯指示器 */}
        <div 
          className={`w-2 h-2 rounded-full breathing-light`}
          style={{ backgroundColor: moduleColor, boxShadow: `0 0 8px ${moduleColor}` }}
        />
        
        {/* 图标 */}
        <div 
          className="w-6 h-6 rounded flex items-center justify-center"
          style={{ backgroundColor: `${moduleColor}30` }}
        >
          <Icon className="w-3.5 h-3.5" style={{ color: moduleColor }} />
        </div>
        
        {/* 名称 */}
        <span className={`
          text-sm font-medium whitespace-nowrap
          ${isLevel3 ? 'text-slate-300' : 'text-white'}
        `}>
          {node.name}
        </span>
        
        {/* 选中标记 */}
        {isSelected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-3 h-3 rounded-full"
            style={{ backgroundColor: moduleColor }}
          />
        )}
      </div>
      
      {/* 连接线起点标记 */}
      {node.connections.length > 0 && (
        <div 
          className="absolute top-1/2 right-0 w-2 h-2 rounded-full transform translate-x-1/2 -translate-y-1/2"
          style={{ backgroundColor: moduleColor }}
        />
      )}
    </motion.div>
  );
}
