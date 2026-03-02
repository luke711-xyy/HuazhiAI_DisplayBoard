import { motion } from 'framer-motion';
import { Package, Settings, TrendingUp } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { KPIData } from '@/types';

const iconMap: Record<string, LucideIcon> = {
  Package,
  Settings,
  TrendingUp
};

interface KPICardProps {
  data: KPIData;
  index: number;
}

export function KPICard({ data, index }: KPICardProps) {
  const Icon = iconMap[data.icon] || Package;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.15, duration: 0.6, ease: 'easeOut' }}
      className="relative group"
    >
      {/* 发光背景托盘 */}
      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3/4 h-4 bg-gradient-to-t from-cyan-500/20 to-transparent blur-xl rounded-full" />
      
      {/* 主卡片 */}
      <div className="relative glass-card p-5 min-w-[180px] tech-border overflow-hidden">
        {/* 顶部流光 */}
        <div className="absolute top-0 left-0 right-0 h-px">
          <div className="h-full w-full bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent animate-pulse" />
        </div>
        
        {/* 背景渐变 */}
        <div className={`absolute inset-0 bg-gradient-to-br ${data.color} opacity-5 group-hover:opacity-10 transition-opacity duration-500`} />
        
        {/* 内容 */}
        <div className="relative z-10 flex flex-col items-center gap-3">
          {/* 图标 */}
          <div className="relative">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${data.color} p-0.5`}>
              <div className="w-full h-full rounded-xl bg-slate-900/80 flex items-center justify-center">
                <Icon className="w-6 h-6 text-white" />
              </div>
            </div>
            {/* 图标发光 */}
            <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${data.color} blur-lg opacity-40`} />
          </div>
          
          {/* 标签 */}
          <span className="text-sm text-slate-400 font-medium tracking-wide">
            {data.label}
          </span>
          
          {/* 数字 */}
          <motion.span
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.15 + 0.3, type: 'spring', stiffness: 200 }}
            className="digital-number text-4xl font-bold text-white glow-text"
          >
            {data.value}
          </motion.span>
        </div>
        
        {/* 底部装饰线 */}
        <div className="absolute bottom-0 left-0 right-0 h-px">
          <div className={`h-full w-1/2 mx-auto bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent`} />
        </div>
      </div>
    </motion.div>
  );
}
