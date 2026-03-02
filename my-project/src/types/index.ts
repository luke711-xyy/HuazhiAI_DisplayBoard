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

export interface Module {
  id: string;
  name: string;
  color: string;
  position: { x: number; y: number };
  nodes: SceneNode[];
}

export interface KPIData {
  label: string;
  value: number;
  icon: string;
  color: string;
}

export interface CompanyData {
  name: string;
  industry: string;
  progress: number;
  status: 'reserved' | 'implementing' | 'promoting';
}

export interface DashboardData {
  reserved: CompanyData[];
  implementing: CompanyData[];
  promoting: CompanyData[];
}

export interface SelectionState {
  moduleId: string | null;
  nodeId: string | null;
}
