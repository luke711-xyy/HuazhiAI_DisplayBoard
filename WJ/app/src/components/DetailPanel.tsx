import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { 
  Boxes, Grab, Target, Layers, ArrowUpDown, GitBranch, Repeat,
  AlignCenter, Crosshair, Link, Route, Map, Package, Box,
  Split, Truck, Warehouse, Database, Brain, Search, Eye,
  Gauge, Activity, Scan, ScanLine, Zap, Sparkles
} from 'lucide-react';
import type { SceneNode } from '@/types';

const iconMap: Record<string, LucideIcon> = {
  Boxes, Grab, Target, Layers, ArrowUpDown, GitBranch, Repeat,
  AlignCenter, Crosshair, Link, Route, Map, Package, Box,
  Split, Truck, Warehouse, Database, Brain, Search, Eye,
  Gauge, Activity, Scan, ScanLine, Zap, Sparkles
};

interface DetailPanelProps {
  node: SceneNode | null;
  moduleColor: string;
  moduleName: string;
  onClose: () => void;
  position: 'left' | 'right';
}

export function DetailPanel({ 
  node, 
  moduleColor, 
  moduleName, 
  onClose, 
  position 
}: DetailPanelProps) {
  if (!node) return null;
  
  const Icon = iconMap[node.icon] || Boxes;
  const isLeft = position === 'left';
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: isLeft ? -100 : 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: isLeft ? -100 : 100 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className={`absolute top-1/2 ${isLeft ? 'left-4' : 'right-4'} -translate-y-1/2 z-30`}
      >
        {/* 引线 */}
        <svg 
          className={`absolute top-1/2 ${isLeft ? 'left-full' : 'right-full'} -translate-y-1/2 w-16 h-px pointer-events-none`}
          style={{ overflow: 'visible' }}
        >
          <motion.line
            x1={isLeft ? 0 : 64}
            y1={0}
            x2={isLeft ? 64 : 0}
            y2={0}
            stroke={moduleColor}
            strokeWidth="2"
            strokeDasharray="4 2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5 }}
          />
          <motion.circle
            cx={isLeft ? 64 : 0}
            cy={0}
            r="4"
            fill={moduleColor}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3 }}
          />
        </svg>
        
        {/* 面板主体 */}
        <div 
          className="glass-panel rounded-xl p-5 w-80 relative overflow-hidden"
          style={{ 
            borderColor: `${moduleColor}40`,
            boxShadow: `0 0 30px ${moduleColor}20, inset 0 1px 0 rgba(255,255,255,0.1)`
          }}
        >
          {/* 顶部渐变条 */}
          <div 
            className="absolute top-0 left-0 right-0 h-1"
            style={{ background: `linear-gradient(90deg, transparent, ${moduleColor}, transparent)` }}
          />
          
          {/* 关闭按钮 */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-slate-400" />
          </button>
          
          {/* 模块标签 */}
          <div className="flex items-center gap-2 mb-4">
            <div 
              className="px-2 py-0.5 rounded text-xs font-medium"
              style={{ backgroundColor: `${moduleColor}30`, color: moduleColor }}
            >
              {moduleName}
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500" />
            <span className="text-xs text-slate-400">{node.level === 3 ? '三级场景' : '二级场景'}</span>
          </div>
          
          {/* 图标和标题 */}
          <div className="flex items-start gap-4 mb-4">
            <div 
              className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ 
                background: `linear-gradient(135deg, ${moduleColor}40, ${moduleColor}20)`,
                boxShadow: `0 0 20px ${moduleColor}30`
              }}
            >
              <Icon className="w-7 h-7" style={{ color: moduleColor }} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-1">{node.name}</h3>
              <div className="flex items-center gap-2">
                <div 
                  className="w-2 h-2 rounded-full animate-pulse"
                  style={{ backgroundColor: moduleColor, boxShadow: `0 0 8px ${moduleColor}` }}
                />
                <span className="text-xs text-slate-400">运行中</span>
              </div>
            </div>
          </div>
          
          {/* 描述 */}
          <div className="mb-4">
            <h4 className="text-xs text-slate-500 uppercase tracking-wider mb-2">功能描述</h4>
            <p className="text-sm text-slate-300 leading-relaxed">
              {node.description}
            </p>
          </div>
          
          {/* 技术指标 */}
          <div>
            <h4 className="text-xs text-slate-500 uppercase tracking-wider mb-2">技术指标</h4>
            <div className="grid grid-cols-2 gap-2">
              <div className="glass-card p-2 rounded-lg">
                <div className="text-xs text-slate-500 mb-1">准确率</div>
                <div className="text-lg font-bold" style={{ color: moduleColor }}>99.8%</div>
              </div>
              <div className="glass-card p-2 rounded-lg">
                <div className="text-xs text-slate-500 mb-1">响应时间</div>
                <div className="text-lg font-bold" style={{ color: moduleColor }}>&lt;50ms</div>
              </div>
              <div className="glass-card p-2 rounded-lg">
                <div className="text-xs text-slate-500 mb-1">处理能力</div>
                <div className="text-lg font-bold" style={{ color: moduleColor }}>1200/h</div>
              </div>
              <div className="glass-card p-2 rounded-lg">
                <div className="text-xs text-slate-500 mb-1">覆盖率</div>
                <div className="text-lg font-bold" style={{ color: moduleColor }}>100%</div>
              </div>
            </div>
          </div>
          
          {/* 底部装饰 */}
          <div 
            className="absolute bottom-0 left-0 right-0 h-px"
            style={{ background: `linear-gradient(90deg, transparent, ${moduleColor}60, transparent)` }}
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
