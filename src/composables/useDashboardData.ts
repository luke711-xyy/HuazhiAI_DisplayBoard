/**
 * useDashboardData.ts - 仪表盘数据管理 composable
 *
 * 加载 data.json 并提供类型化的访问器方法
 * 所有组件通过此 composable 获取数据，确保单一数据源
 */
import type { DashboardConfig, Company, Skill, CompanyDetail } from '@/types'
import dashboardData from '@/config/data.json'

const config = dashboardData as unknown as DashboardConfig

export function useDashboardData() {
  /** 根据 ID 查找企业 */
  function getCompanyById(id: string): Company | undefined {
    return config.companies.find(c => c.id === id)
  }

  /** 根据 ID 查找技能 */
  function getSkillById(id: string): Skill | undefined {
    return config.skills.find(s => s.id === id)
  }

  /** 根据企业 ID 查找详情 */
  function getCompanyDetailById(companyId: string): CompanyDetail | undefined {
    return config.companyDetails.find(d => d.companyId === companyId)
  }

  /** 按状态过滤企业 */
  function getCompaniesByStatus(status: string): Company[] {
    return config.companies.filter(c => c.status === status)
  }

  return {
    config,
    getCompanyById,
    getSkillById,
    getCompanyDetailById,
    getCompaniesByStatus,
  }
}
