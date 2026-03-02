import { motion } from 'framer-motion';
import { Settings2 } from 'lucide-react';

export function Header() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="absolute top-0 left-0 right-0 z-40 flex items-center justify-between px-8 py-4"
    >
      {/* Logo区域 */}
      <div className="flex items-center gap-4">
        <motion.div 
          className="relative"
          whileHover={{ scale: 1.05 }}
        >
          {/* Logo背景发光 */}
          <div className="absolute inset-0 bg-cyan-500/20 blur-xl rounded-full" />
          
          {/* Logo图标 */}
          <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/30 to-blue-600/30 border border-cyan-400/30 flex items-center justify-center">
            <svg viewBox="0 0 40 40" className="w-8 h-8">
              <defs>
                <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#22d3ee" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
              </defs>
              <path
                d="M20 5 L35 15 L35 30 L20 38 L5 30 L5 15 Z"
                fill="none"
                stroke="url(#logo-gradient)"
                strokeWidth="2"
              />
              <path
                d="M20 12 L28 17 L28 26 L20 31 L12 26 L12 17 Z"
                fill="url(#logo-gradient)"
                opacity="0.8"
              />
              <circle cx="20" cy="21" r="4" fill="#fff" />
            </svg>
          </div>
        </motion.div>
        
        <div>
          <h1 className="text-xl font-bold text-white tracking-wider">
            HUAZHI <span className="text-cyan-400">AI</span>
          </h1>
          <p className="text-xs text-slate-400 tracking-wide">
            Run Beyond, Grasp the world.
          </p>
        </div>
      </div>
      
      {/* 中央标题 */}
      <div className="absolute left-1/2 -translate-x-1/2 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          {/* 装饰线 */}
          <div className="flex items-center gap-4 mb-2">
            <div className="w-16 h-px bg-gradient-to-r from-transparent to-cyan-400/60" />
            <div className="w-2 h-2 rotate-45 border border-cyan-400/60" />
            <div className="w-16 h-px bg-gradient-to-l from-transparent to-cyan-400/60" />
          </div>
          
          <h2 className="text-2xl font-bold text-white tracking-[0.3em]">
            联创 · 联拓 · 联营
          </h2>
          <p className="text-xs text-slate-500 tracking-widest mt-1">
            Co-Creation · Co-Expansion · Co-Operation
          </p>
          
          {/* 底部装饰线 */}
          <div className="flex items-center gap-4 mt-2">
            <div className="w-12 h-px bg-gradient-to-r from-transparent to-cyan-400/40" />
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400/40" />
            <div className="w-12 h-px bg-gradient-to-l from-transparent to-cyan-400/40" />
          </div>
        </motion.div>
      </div>
      
      {/* 设置按钮 */}
      <motion.button
        whileHover={{ scale: 1.1, rotate: 90 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.3 }}
        className="w-10 h-10 rounded-full glass-card flex items-center justify-center"
      >
        <Settings2 className="w-5 h-5 text-slate-400" />
      </motion.button>
    </motion.header>
  );
}
