import type { CompanyStatus } from './company'

/**
 * 顶部 KPI 指标徽标数据
 * 储备中(6) / 实施中(14) / 推广中(10)
 */
export interface KpiIndicator {
  /** 唯一标识: "reserve" | "implementation" | "promotion" */
  id: string
  /** i18n 键名：指标名称 */
  labelKey: string
  /** 图标文件名: "ic_storage" | "ic_shishizhong" | "ic_megaphone" */
  icon: string
  /** 展示数量 */
  count: number
  /** 徽标主题色（十六进制） */
  color: string
  /** 对应的企业状态过滤器 */
  statusFilter: CompanyStatus
}
