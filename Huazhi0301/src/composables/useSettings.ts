/**
 * useSettings.ts - 设置面板状态管理
 *
 * 管理设置菜单的可见性和各项配置：
 * - 语言切换 (与 useI18n 联动)
 * - 声音大小 (架空 UI)
 * - 夜间/日间模式 (架空 UI)
 */
import { ref } from 'vue'

/** 设置面板是否可见 */
const isSettingsOpen = ref(false)

/** 声音大小 (0-100, 架空 UI) */
const soundVolume = ref(50)

/** 主题模式 (架空 UI) */
const themeMode = ref<'dark' | 'light'>('dark')

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
    themeMode,
    toggleSettings,
    closeSettings,
  }
}
