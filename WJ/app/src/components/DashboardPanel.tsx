import { motion } from 'framer-motion';
import { Package, Settings, TrendingUp, Building2 } from 'lucide-react';
import type { DashboardData, CompanyData } from '@/types';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface DashboardPanelProps {
  data: DashboardData;
}

// 状态颜色映射
const statusColors = {
  reserved: { bg: 'from-blue-500 to-cyan-400', color: '#0ea5e9', label: '储备中' },
  implementing: { bg: 'from-amber-500 to-orange-400', color: '#f59e0b', label: '实施中' },
  promoting: { bg: 'from-emerald-500 to-green-400', color: '#10b981', label: '推广中' }
};

// 环形图数据
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
  
  return ranges.filter(r => r.value > 0);
};

function CompanyRow({ company, index, status }: { company: CompanyData; index: number; status: keyof typeof statusColors }) {
  const config = statusColors[status];
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="flex items-center gap-2 py-1 border-b border-white/5 last:border-0"
    >
      {/* 状态指示灯 */}
      <div 
        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
        style={{ 
          backgroundColor: config.color,
          boxShadow: `0 0 6px ${config.color}`
        }}
      />
      
      {/* 公司信息 */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <Building2 className="w-3 h-3 text-slate-500 flex-shrink-0" />
          <span className="text-xs text-slate-300 truncate">{company.name}</span>
        </div>
      </div>
      
      {/* 进度条 */}
      <div className="w-14 flex-shrink-0">
        <div className="flex items-center justify-between mb-0.5">
          <span className="text-[10px] font-medium" style={{ color: config.color }}>
            {company.progress}%
          </span>
        </div>
        <div className="h-1 bg-slate-700/50 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${company.progress}%` }}
            transition={{ delay: index * 0.05 + 0.3, duration: 0.8 }}
            className="h-full rounded-full relative"
            style={{ 
              background: `linear-gradient(90deg, ${config.color}80, ${config.color})`
            }}
          >
            {/* 光效 */}
            <div 
              className="absolute inset-y-0 right-0 w-3"
              style={{ 
                background: `linear-gradient(90deg, transparent, ${config.color})`,
                filter: 'blur(1px)'
              }}
            />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

function PanelSection({ 
  title, 
  icon: Icon, 
  companies, 
  status,
  delay 
}: { 
  title: string; 
  icon: React.ElementType; 
  companies: CompanyData[]; 
  status: keyof typeof statusColors;
  delay: number;
}) {
  const config = statusColors[status];
  const pieData = getPieData(companies);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="glass-panel rounded-lg p-2.5 flex-1 min-w-0"
      style={{ borderColor: `${config.color}30` }}
    >
      {/* 标题栏 */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div 
            className="w-7 h-7 rounded-md flex items-center justify-center"
            style={{ 
              background: `linear-gradient(135deg, ${config.color}40, ${config.color}20)`,
              boxShadow: `0 0 10px ${config.color}30`
            }}
          >
            <Icon className="w-3.5 h-3.5" style={{ color: config.color }} />
          </div>
          <div>
            <h3 className="text-sm text-white font-medium">{title}</h3>
            <div className="flex items-center gap-1">
              <span className="digital-number text-base font-bold" style={{ color: config.color }}>
                {companies.length}
              </span>
              <span className="text-[10px] text-slate-500">家</span>
            </div>
          </div>
        </div>
        
        {/* 迷你环形图 */}
        <div className="w-10 h-10">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={8}
                outerRadius={14}
                paddingAngle={2}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* 企业列表 */}
      <div className="space-y-0.5 max-h-24 overflow-y-auto hide-scrollbar">
        {companies.slice(0, 4).map((company, index) => (
          <CompanyRow 
            key={company.name + index} 
            company={company} 
            index={index}
            status={status}
          />
        ))}
      </div>
      
      {/* 底部统计 */}
      <div className="mt-2 pt-1.5 border-t border-white/10 flex items-center justify-between">
        <span className="text-[10px] text-slate-500">平均进度</span>
        <div className="flex items-center gap-1.5">
          <div className="w-14 h-1.5 bg-slate-700/50 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${companies.reduce((acc, c) => acc + c.progress, 0) / companies.length}%` }}
              transition={{ delay: delay + 0.5, duration: 1 }}
              className="h-full rounded-full"
              style={{ 
                background: `linear-gradient(90deg, ${config.color}60, ${config.color})`
              }}
            />
          </div>
          <span className="digital-number text-xs font-semibold" style={{ color: config.color }}>
            {Math.round(companies.reduce((acc, c) => acc + c.progress, 0) / companies.length)}%
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export function DashboardPanel({ data }: DashboardPanelProps) {
  return (
    <div className="absolute bottom-2 left-3 right-3 flex gap-3 z-20">
      <PanelSection
        title="储备中"
        icon={Package}
        companies={data.reserved}
        status="reserved"
        delay={0.8}
      />
      <PanelSection
        title="实施中"
        icon={Settings}
        companies={data.implementing}
        status="implementing"
        delay={1}
      />
      <PanelSection
        title="推广中"
        icon={TrendingUp}
        companies={data.promoting}
        status="promoting"
        delay={1.2}
      />
    </div>
  );
}
