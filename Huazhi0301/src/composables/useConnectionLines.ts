/**
 * useConnectionLines.ts - 连线坐标计算管理器
 *
 * 核心高级功能：当鼠标悬停在企业卡片上时，
 * 计算该企业与其关联技能节点之间的 SVG 发光连线。
 *
 * 实现原理：
 * 1. 接收企业卡片和技能节点的 DOM 元素引用 Map
 * 2. 监听 hoveredCompanyId 变化
 * 3. 通过 getBoundingClientRect() 获取源/目标元素的屏幕坐标
 * 4. 将屏幕坐标转换为 DashboardContainer 内的相对坐标
 *    （需要考虑容器的 transform: scale 缩放变换）
 * 5. 生成贝塞尔曲线路径
 */
import { computed, type Ref } from 'vue'
import type { Company } from '@/types'
import { generateConnectionPath, type ConnectionLine } from '@/utils/bezier'

/**
 * @param hoveredCompanyId   - 当前悬停的企业 ID
 * @param companies          - 全部企业数据（用于查找关联技能）
 * @param companyElements    - 企业卡片 DOM 元素注册表
 * @param skillElements      - 技能节点 DOM 元素注册表
 * @param containerElement   - DashboardContainer 根元素（用于坐标转换）
 * @param scale              - 当前缩放比例（DashboardContainer 的 scale 值）
 */
export function useConnectionLines(
  hoveredCompanyId: Ref<string | null>,
  companies: Company[],
  companyElements: Ref<Record<string, HTMLElement>>,
  skillElements: Ref<Record<string, HTMLElement>>,
  containerElement: Ref<HTMLElement | undefined>,
  scale: Ref<number>
) {
  /**
   * 计算当前需要绘制的连线列表
   *
   * 计算流程：
   * 1. 找到悬停的企业及其关联技能
   * 2. 遍历每个关联技能，获取企业卡片和技能节点的 DOM rect
   * 3. 将屏幕坐标转换为容器相对坐标（除以 scale）
   * 4. 取元素中心点作为连线锚点
   * 5. 生成贝塞尔曲线路径
   */
  const lines = computed<ConnectionLine[]>(() => {
    const companyId = hoveredCompanyId.value
    if (!companyId) return []

    const company = companies.find(c => c.id === companyId)
    if (!company) return []

    const container = containerElement.value
    if (!container) return []

    const companyEl = companyElements.value[companyId]
    if (!companyEl) return []

    // 获取容器在屏幕上的位置（用于坐标转换的基准点）
    const containerRect = container.getBoundingClientRect()
    const currentScale = scale.value

    // 计算企业卡片中心点的容器相对坐标
    const companyRect = companyEl.getBoundingClientRect()
    const fromX = (companyRect.left + companyRect.width / 2 - containerRect.left) / currentScale
    const fromY = (companyRect.top + companyRect.height / 2 - containerRect.top) / currentScale

    const result: ConnectionLine[] = []

    // 遍历关联技能，为每个生成一条连线
    for (const skillId of company.relatedSkillIds) {
      const skillEl = skillElements.value[skillId]
      if (!skillEl) continue

      const skillRect = skillEl.getBoundingClientRect()
      const toX = (skillRect.left + skillRect.width / 2 - containerRect.left) / currentScale
      const toY = (skillRect.top + skillRect.height / 2 - containerRect.top) / currentScale

      result.push({
        id: `${companyId}-${skillId}`,
        path: generateConnectionPath(fromX, fromY, toX, toY),
        color: getLineColor(company.status),
      })
    }

    return result
  })

  return { lines }
}

/**
 * 根据企业状态返回连线颜色
 */
function getLineColor(status: string): string {
  switch (status) {
    case 'reserve': return '#3B82F6'      // 蓝色
    case 'implementation': return '#F59E0B' // 橙色
    case 'promotion': return '#EF4444'      // 红色
    default: return '#3B82F6'
  }
}
