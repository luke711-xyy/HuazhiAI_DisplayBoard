/**
 * useI18n.ts - 轻量级国际化 composable
 *
 * 无外部依赖，基于 Vue 响应式系统实现：
 * - 维护当前语言 locale (zh/en)
 * - 加载对应的 JSON 语料文件
 * - 提供 t(key) 函数，通过 dot-notation 解析嵌套键
 *   例: t('skill.shangxiawuliao.name') -> "上下物料"
 *
 * 当 locale 切换时，所有使用 t() 的地方自动响应式更新
 */
import { ref, reactive, watch } from 'vue'
import zhMessages from '@/locales/zh.json'
import enMessages from '@/locales/en.json'

export type Locale = 'zh' | 'en'

/** 当前语言 */
const locale = ref<Locale>('zh')

/** 当前语料数据（响应式对象） */
const messages = reactive<Record<string, unknown>>({})

/** 语料字典映射 */
const messageSources: Record<Locale, Record<string, unknown>> = {
  zh: zhMessages as Record<string, unknown>,
  en: enMessages as Record<string, unknown>,
}

/**
 * 加载指定语言的语料到 messages 响应式对象
 * 先清空再赋值，确保 watch 触发视图更新
 */
function loadMessages(lang: Locale) {
  // 清空现有数据
  for (const key of Object.keys(messages)) {
    delete messages[key]
  }
  // 加载新语料
  Object.assign(messages, messageSources[lang])
}

/**
 * 翻译函数：通过 dot-notation 键查找语料值
 *
 * @param key - 以 '.' 分隔的嵌套键，如 'kpi.reserve'
 * @returns 对应的翻译文本；找不到时返回 key 本身作为降级
 *
 * 注意：此函数读取 reactive(messages)，因此在模板中使用时
 * 切换语言会自动触发重新渲染
 */
function t(key: string): string {
  const parts = key.split('.')
  let current: unknown = messages

  for (const part of parts) {
    if (current && typeof current === 'object' && part in (current as Record<string, unknown>)) {
      current = (current as Record<string, unknown>)[part]
    } else {
      // 键路径不存在，返回 key 作为降级显示
      return key
    }
  }

  return typeof current === 'string' ? current : key
}

/**
 * 切换语言
 */
function setLocale(lang: Locale) {
  locale.value = lang
}

// 初始化加载默认语言
loadMessages(locale.value)

// 监听 locale 变化自动重新加载语料
watch(locale, (newLocale) => {
  loadMessages(newLocale)
})

/**
 * useI18n composable
 * 在组件的 setup 中调用，获取翻译函数和语言控制能力
 */
export function useI18n() {
  return {
    /** 翻译函数 */
    t,
    /** 当前语言（响应式） */
    locale,
    /** 设置语言 */
    setLocale,
  }
}
