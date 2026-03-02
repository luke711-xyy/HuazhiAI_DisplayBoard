// 场景节点类型
export interface SceneNode {
  id: string;
  name: string;
  icon: string;
  description: string;
  parentId?: string;
  level: 1 | 2 | 3;
  position: { x: number; y: number };
  connections: string[];
}

// 模块类型
export interface Module {
  id: string;
  name: string;
  color: string;
  position: { x: number; y: number };
  nodes: SceneNode[];
}

// KPI指标类型
export interface KPIData {
  label: string;
  value: number;
  icon: string;
  color: string;
}

// 企业数据类型
export interface CompanyData {
  name: string;
  industry: string;
  progress: number;
  status: 'reserved' | 'implementing' | 'promoting';
}

// 看板数据类型
export interface DashboardData {
  reserved: CompanyData[];
  implementing: CompanyData[];
  promoting: CompanyData[];
}

// 选中状态类型
export interface SelectionState {
  moduleId: string | null;
  nodeId: string | null;
}
