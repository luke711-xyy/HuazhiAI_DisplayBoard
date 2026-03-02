import type { Module, KPIData, DashboardData } from '@/types';

// KPI指标数据
export const kpiData: KPIData[] = [
  {
    label: '储备中数量',
    value: 6,
    icon: 'Package',
    color: 'from-blue-500 to-cyan-400'
  },
  {
    label: '实施中数量',
    value: 14,
    icon: 'Settings',
    color: 'from-amber-500 to-orange-400'
  },
  {
    label: '推广中数量',
    value: 10,
    icon: 'TrendingUp',
    color: 'from-emerald-500 to-green-400'
  }
];

// 三大模块数据
export const modules: Module[] = [
  {
    id: 'assembly',
    name: '柔性装配',
    color: '#0ea5e9',
    position: { x: 25, y: 45 },
    nodes: [
      {
        id: 'assembly-1',
        name: '物料准备',
        icon: 'Boxes',
        description: '智能物料配送与准备系统，实现自动化物料识别、分拣与配送',
        level: 2,
        position: { x: 18, y: 35 },
        connections: ['assembly-1-1', 'assembly-1-2', 'assembly-1-3']
      },
      {
        id: 'assembly-1-1',
        name: '无序来料抓取',
        icon: 'Grab',
        description: '针对杂乱堆放的零部件，通过3D视觉识别和抓取规划，实现抗遮挡抓取，并将抓取的零件放置到临时排序缓冲区或供料装置中，为后续有序上料做准备。',
        parentId: 'assembly-1',
        level: 3,
        position: { x: 12, y: 28 },
        connections: []
      },
      {
        id: 'assembly-1-2',
        name: '有序来料定位',
        icon: 'Target',
        description: '精准定位有序排列的物料，为后续装配作业提供准确的位置信息',
        parentId: 'assembly-1',
        level: 3,
        position: { x: 18, y: 25 },
        connections: []
      },
      {
        id: 'assembly-1-3',
        name: '多物料协同',
        icon: 'Layers',
        description: '多类型物料的智能协同管理系统，优化物料流转效率',
        parentId: 'assembly-1',
        level: 3,
        position: { x: 24, y: 28 },
        connections: []
      },
      {
        id: 'assembly-2',
        name: '上下料',
        icon: 'ArrowUpDown',
        description: '自动化上下料系统，实现工件的自动装载与卸载',
        level: 2,
        position: { x: 18, y: 55 },
        connections: ['assembly-2-1', 'assembly-2-2']
      },
      {
        id: 'assembly-2-1',
        name: '下料分道',
        icon: 'GitBranch',
        description: '智能分道系统，根据工件类型自动分配至对应通道',
        parentId: 'assembly-2',
        level: 3,
        position: { x: 12, y: 62 },
        connections: []
      },
      {
        id: 'assembly-2-2',
        name: '上下料',
        icon: 'Repeat',
        description: '循环上下料作业，支持多工位协同作业',
        parentId: 'assembly-2',
        level: 3,
        position: { x: 24, y: 62 },
        connections: []
      },
      {
        id: 'assembly-3',
        name: '定位与对齐',
        icon: 'AlignCenter',
        description: '高精度定位与对齐系统，确保装配精度',
        level: 2,
        position: { x: 32, y: 40 },
        connections: ['assembly-3-1', 'assembly-3-2']
      },
      {
        id: 'assembly-3-1',
        name: '定位与对齐',
        icon: 'Crosshair',
        description: '亚毫米级精确定位技术，确保零部件准确对接',
        parentId: 'assembly-3',
        level: 3,
        position: { x: 35, y: 32 },
        connections: []
      },
      {
        id: 'assembly-3-2',
        name: '连接与固定',
        icon: 'Link',
        description: '智能连接与固定系统，支持多种连接方式',
        parentId: 'assembly-3',
        level: 3,
        position: { x: 38, y: 48 },
        connections: []
      }
    ]
  },
  {
    id: 'palletizing',
    name: '柔性码垛',
    color: '#8b5cf6',
    position: { x: 50, y: 65 },
    nodes: [
      {
        id: 'palletizing-1',
        name: '路径规划',
        icon: 'Route',
        description: '智能路径规划系统，优化码垛作业路径',
        level: 2,
        position: { x: 45, y: 55 },
        connections: ['palletizing-1-1']
      },
      {
        id: 'palletizing-1-1',
        name: '路径规划',
        icon: 'Map',
        description: '基于AI的路径优化算法，实时计算最优作业路径',
        parentId: 'palletizing-1',
        level: 3,
        position: { x: 42, y: 48 },
        connections: []
      },
      {
        id: 'palletizing-2',
        name: '成品包装',
        icon: 'Package',
        description: '自动化成品包装系统，支持多种包装规格',
        level: 2,
        position: { x: 42, y: 72 },
        connections: ['palletizing-2-1']
      },
      {
        id: 'palletizing-2-1',
        name: '成品包装',
        icon: 'Box',
        description: '智能包装系统，自动识别产品规格并选择合适包装',
        parentId: 'palletizing-2',
        level: 3,
        position: { x: 38, y: 78 },
        connections: []
      },
      {
        id: 'palletizing-3',
        name: '分拣配送',
        icon: 'Split',
        description: '智能分拣配送系统，高效处理订单分拣',
        level: 2,
        position: { x: 52, y: 58 },
        connections: ['palletizing-3-1']
      },
      {
        id: 'palletizing-3-1',
        name: '分拣配送',
        icon: 'Truck',
        description: '基于订单需求的智能分拣与配送调度系统',
        parentId: 'palletizing-3',
        level: 3,
        position: { x: 55, y: 52 },
        connections: []
      },
      {
        id: 'palletizing-4',
        name: '仓库对接',
        icon: 'Warehouse',
        description: '与WMS系统无缝对接，实现仓储智能化',
        level: 2,
        position: { x: 58, y: 70 },
        connections: ['palletizing-4-1']
      },
      {
        id: 'palletizing-4-1',
        name: '仓库对接',
        icon: 'Database',
        description: '实时同步库存数据，支持智能仓储管理',
        parentId: 'palletizing-4',
        level: 3,
        position: { x: 62, y: 75 },
        connections: []
      },
      {
        id: 'palletizing-5',
        name: '智能码垛',
        icon: 'Layers',
        description: 'AI驱动的智能码垛系统，优化空间利用率',
        level: 2,
        position: { x: 50, y: 80 },
        connections: ['palletizing-5-1']
      },
      {
        id: 'palletizing-5-1',
        name: '智能码垛',
        icon: 'Brain',
        description: '深度学习算法优化码垛策略，最大化托盘利用率',
        parentId: 'palletizing-5',
        level: 3,
        position: { x: 50, y: 88 },
        connections: []
      }
    ]
  },
  {
    id: 'inspection',
    name: '柔性质检',
    color: '#f97316',
    position: { x: 75, y: 45 },
    nodes: [
      {
        id: 'inspection-1',
        name: '缺陷检测',
        icon: 'Search',
        description: 'AI视觉缺陷检测系统，精准识别产品缺陷',
        level: 2,
        position: { x: 68, y: 35 },
        connections: ['inspection-1-1']
      },
      {
        id: 'inspection-1-1',
        name: '缺陷检测',
        icon: 'Eye',
        description: '基于深度学习的视觉检测，可识别微米级缺陷',
        parentId: 'inspection-1',
        level: 3,
        position: { x: 65, y: 28 },
        connections: []
      },
      {
        id: 'inspection-2',
        name: '性能测试',
        icon: 'Gauge',
        description: '全面性能测试系统，确保产品质量',
        level: 2,
        position: { x: 72, y: 48 },
        connections: ['inspection-2-1']
      },
      {
        id: 'inspection-2-1',
        name: '性能测试',
        icon: 'Activity',
        description: '多维度性能测试，覆盖功能、性能、可靠性等指标',
        parentId: 'inspection-2',
        level: 3,
        position: { x: 70, y: 55 },
        connections: []
      },
      {
        id: 'inspection-3',
        name: '无损检测',
        icon: 'Scan',
        description: '非破坏性检测技术，保护产品完整性',
        level: 2,
        position: { x: 82, y: 38 },
        connections: ['inspection-3-1']
      },
      {
        id: 'inspection-3-1',
        name: '无损检测',
        icon: 'ScanLine',
        description: 'X射线、超声波等多模态无损检测方案',
        parentId: 'inspection-3',
        level: 3,
        position: { x: 85, y: 32 },
        connections: []
      },
      {
        id: 'inspection-4',
        name: '柔性使能',
        icon: 'Zap',
        description: '柔性化质检能力，快速适配新产品',
        level: 2,
        position: { x: 80, y: 55 },
        connections: ['inspection-4-1']
      },
      {
        id: 'inspection-4-1',
        name: '柔性使能',
        icon: 'Sparkles',
        description: '模块化检测方案，支持快速换型与参数调整',
        parentId: 'inspection-4',
        level: 3,
        position: { x: 85, y: 62 },
        connections: []
      }
    ]
  }
];

// 底部看板数据
export const dashboardData: DashboardData = {
  reserved: [
    { name: '上海天工精密制造有限公司', industry: '精密加工', progress: 25, status: 'reserved' },
    { name: '江苏精工集团', industry: '机械制造', progress: 40, status: 'reserved' },
    { name: '苏州特隆有限公司', industry: '精密加工', progress: 15, status: 'reserved' },
    { name: '浙江皮革制造有限公司', industry: '轻工业', progress: 30, status: 'reserved' },
    { name: '上海机械制造有限公司', industry: '机械制造', progress: 20, status: 'reserved' },
    { name: '上海智能化', industry: '机械制造', progress: 35, status: 'reserved' }
  ],
  implementing: [
    { name: '上海天工精密制造有限公司', industry: '精密加工', progress: 65, status: 'implementing' },
    { name: '江苏精工集团', industry: '机械制造', progress: 78, status: 'implementing' },
    { name: '苏州特隆有限公司', industry: '精密加工', progress: 52, status: 'implementing' },
    { name: '浙江皮革制造有限公司', industry: '轻工业', progress: 45, status: 'implementing' },
    { name: '上海机械制造有限公司', industry: '机械制造', progress: 82, status: 'implementing' },
    { name: '上海智能化', industry: '机械制造', progress: 70, status: 'implementing' },
    { name: '天津机电设备及机械制造有限公司', industry: '精密加工', progress: 58, status: 'implementing' }
  ],
  promoting: [
    { name: '上海天工精密制造有限公司', industry: '精密加工', progress: 92, status: 'promoting' },
    { name: '江苏精工集团', industry: '机械制造', progress: 88, status: 'promoting' },
    { name: '苏州特隆有限公司', industry: '精密加工', progress: 95, status: 'promoting' },
    { name: '浙江皮革制造有限公司', industry: '轻工业', progress: 85, status: 'promoting' },
    { name: '上海机械制造有限公司', industry: '机械制造', progress: 90, status: 'promoting' }
  ]
};
