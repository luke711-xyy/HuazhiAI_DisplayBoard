/**
 * useSettings.ts - 设置面板状态管理
 *
 * 管理设置菜单的可见性和各项配置：
 * - 语言切换 (与 useI18n 联动)
 * - 声音大小 (架空 UI)
 * - 电脑/移动端模式 (移动端模式下公司卡片需双击打开弹窗)
 */
import { ref } from 'vue'

/** 设置面板是否可见 */
const isSettingsOpen = ref(false)

/** 声音大小 (0-100, 架空 UI) */
const soundVolume = ref(50)

/** 设备模式：pc = 单击打开弹窗, mobile = 双击打开弹窗 */
const deviceMode = ref<'pc' | 'mobile'>('mobile')

/** 常闭底部列表：开启后底部三个滚动列表永远不显示，KPI 数字也隐藏 */
const hideBottomPanels = ref(false)

export function useSettings() {
  /** 切换设置面板显隐 */
  function toggleSettings() {
    isSettingsOpen.value = !isSettingsOpen.value
  }

  /** 关闭设置面板 */
  function closeSettings() {
    isSettingsOpen.value = false
  }

  return {
    isSettingsOpen,
    soundVolume,
    deviceMode,
    hideBottomPanels,
    toggleSettings,
    closeSettings,
  }
}
