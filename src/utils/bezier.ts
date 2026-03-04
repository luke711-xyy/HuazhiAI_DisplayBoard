/**
 * bezier.ts - 贝塞尔曲线路径生成工具
 *
 * 用于生成企业卡片到技能节点之间的发光连线路径。
 * 使用三次贝塞尔曲线 (Cubic Bezier)，控制点偏移量
 * 根据起止点距离动态计算，确保曲线弧度自然美观。
 */

/**
 * 生成从起点到终点的 SVG 三次贝塞尔曲线路径字符串
 *
 * @param fromX - 起点 X 坐标 (企业卡片中心)
 * @param fromY - 起点 Y 坐标
 * @param toX   - 终点 X 坐标 (技能节点中心)
 * @param toY   - 终点 Y 坐标
 * @returns SVG path d 属性值，如 "M 100 200 C 150 100, 250 100, 300 200"
 *
 * 控制点策略：
 * - CP1 在起点上方偏移，向终点方向倾斜 25%
 * - CP2 在终点上方偏移，向起点方向倾斜 25%
 * - 偏移量 = min(水平距离, 垂直距离) * 0.4
 * 这样生成的曲线会有一个自然的"拱形"弧度
 */
export function generateConnectionPath(
  fromX: number,
  fromY: number,
  toX: number,
  toY: number
): string {
  const dx = Math.abs(toX - fromX)
  const dy = Math.abs(toY - fromY)

  // 控制点的垂直偏移量：与距离成正比，但有上限
  const cpOffset = Math.min(dx, dy) * 0.4 + 40

  // 第一个控制点：从起点向终点方向移动 25%，并向上偏移
  const cp1x = fromX + (toX - fromX) * 0.25
  const cp1y = fromY - cpOffset

  // 第二个控制点：从起点向终点方向移动 75%，并向上偏移
  const cp2x = fromX + (toX - fromX) * 0.75
  const cp2y = toY - cpOffset

  return `M ${fromX} ${fromY} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${toX} ${toY}`
}

/**
 * 连线数据结构
 */
export interface ConnectionLine {
  /** 唯一标识 (companyId-skillId) */
  id: string
  /** SVG path d 属性值 */
  path: string
  /** 线条颜色 */
  color: string
}
