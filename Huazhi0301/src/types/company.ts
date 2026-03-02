/**
 * 企业在管线中的状态阶段
 * reserve: 储备中 | implementation: 实施中 | promotion: 推广中
 */
export type CompanyStatus = 'reserve' | 'implementation' | 'promotion'

/**
 * 企业卡片数据，展示在页面左右两侧
 * 每个企业关联若干技能，用于驱动 hover 时的发光连线
 */
export interface Company {
  /** 唯一标识符 */
  id: string
  /** i18n 键名：企业名称 */
  nameKey: string
  /** i18n 键名：所属行业 */
  industryKey: string
  /** 企业类型标签，如 "MNC"、"SOE"、"Private" */
  type: string
  /** 当前状态阶段 */
  status: CompanyStatus
  /** 关联的技能 ID 数组（驱动发光连线） */
  relatedSkillIds: string[]
  /** 展示侧: "left" | "right" */
  side: 'left' | 'right'
  /** 在对应侧的排列位置索引 */
  slotIndex: number
}

/**
 * 企业详情弹窗中展示的业务流程步骤
 */
export interface ScenarioStep {
  /** i18n 键名：步骤名称 */
  labelKey: string
  /** 步骤图标标识 */
  icon: string
  /** 进度值 0-100（可选） */
  progress?: number
}

/**
 * 企业详情完整数据，用于详情弹窗
 */
export interface CompanyDetail {
  /** 对应 Company.id */
  companyId: string
  /** 简要信息的 i18n 键名集合 */
  briefInfoKeys: {
    name: string
    industry: string
    type: string
  }
  /** 核心业务场景流程步骤 */
  scenarioFlow: ScenarioStep[]
  /** 核心技能 ID 数组 */
  coreSkills: string[]
}
