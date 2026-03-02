/**
 * throttle.ts - 节流工具函数
 *
 * 限制函数执行频率，用于高频事件（如 resize、mousemove）
 * 确保连线坐标计算不会因过于频繁而影响性能
 */

/**
 * 创建节流函数
 *
 * @param fn    - 要节流的目标函数
 * @param delay - 最小执行间隔（毫秒），默认 16ms ≈ 60fps
 * @returns 节流后的函数
 */
export function throttle<T extends (...args: unknown[]) => void>(
  fn: T,
  delay: number = 16
): T {
  let lastTime = 0
  let timer: ReturnType<typeof setTimeout> | null = null

  return ((...args: unknown[]) => {
    const now = Date.now()
    const remaining = delay - (now - lastTime)

    if (remaining <= 0) {
      // 已超过间隔，立即执行
      if (timer) {
        clearTimeout(timer)
        timer = null
      }
      lastTime = now
      fn(...args)
    } else if (!timer) {
      // 未到间隔，设置延时执行
      timer = setTimeout(() => {
        lastTime = Date.now()
        timer = null
        fn(...args)
      }, remaining)
    }
  }) as T
}
