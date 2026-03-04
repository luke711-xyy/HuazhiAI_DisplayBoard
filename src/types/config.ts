import type { Skill, SkillCategory } from './skill'
import type { Company, CompanyDetail } from './company'
import type { KpiIndicator } from './kpi'

/**
 * 全站数据配置根接口
 * 对应 src/config/data.json 的完整数据结构
 * 所有组件的渲染数据均从此结构派生，禁止硬编码
 */
export interface DashboardConfig {
  /** 顶部三个 KPI 指标 */
  kpiIndicators: KpiIndicator[]
  /** 三大技能分类（柔性装配/质检/码垛） */
  skillCategories: SkillCategory[]
  /** 全部细分技能节点 */
  skills: Skill[]
  /** 全部企业列表 */
  companies: Company[]
  /** 全部企业详情（弹窗用） */
  companyDetails: CompanyDetail[]
}
