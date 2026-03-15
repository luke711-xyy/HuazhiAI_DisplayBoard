/**
 * export-to-excel.mjs
 * 将当前 data.json + zh.json + en.json 导出为一份 Excel 文件
 * 用法: node scripts/export-to-excel.mjs [输出文件名]
 * 默认输出: data-template.xlsx
 */
import { readFileSync, writeFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import XLSX from 'xlsx'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')

// 读取源文件
const data = JSON.parse(readFileSync(resolve(root, 'src/config/data.json'), 'utf-8'))
const zh = JSON.parse(readFileSync(resolve(root, 'src/locales/zh.json'), 'utf-8'))
const en = JSON.parse(readFileSync(resolve(root, 'src/locales/en.json'), 'utf-8'))

const wb = XLSX.utils.book_new()

// ========== Sheet 1: 公司 ==========
const companyRows = data.companies.map(c => {
  const detail = data.companyDetails.find(d => d.companyId === c.id) || {}
  const zhC = zh.company?.[c.id] || {}
  const enC = en.company?.[c.id] || {}
  const zhDesc = zh.companyDesc?.[c.id] || {}
  const enDesc = en.companyDesc?.[c.id] || {}

  // 场景流程：最多 5 步，扁平化
  const flow = detail.scenarioFlow || []
  const row = {
    'ID': c.id,
    '中文名': zhC.name || '',
    'English Name': enC.name || '',
    '行业(中)': zhC.industry || '',
    'Industry(EN)': enC.industry || '',
    '类型(中)': zhC.type || '',
    'Type(EN)': enC.type || '',
    '企业类型代码(MNC/SOE/Private)': c.type,
    '状态(reserve/implementation/promotion)': c.status,
    '关联技能IDs(逗号分隔)': c.relatedSkillIds.join(','),
    '左右(left/right)': c.side,
    '位置索引': c.slotIndex,
    '进度(0-100)': c.progress,
    '简介(中)': zhDesc.brief || '',
    'Brief(EN)': enDesc.brief || '',
    '进展说明(中)': zhDesc.progressNote || '',
    'Progress Note(EN)': enDesc.progressNote || '',
    '核心技能IDs(逗号分隔)': (detail.coreSkills || []).join(','),
  }

  // 场景流程扁平化（最多5步）
  for (let i = 0; i < 5; i++) {
    const step = flow[i]
    row[`场景${i + 1}标签Key`] = step?.labelKey?.replace('scenario.', '') || ''
    row[`场景${i + 1}图标`] = step?.icon || ''
    row[`场景${i + 1}进度`] = step?.progress ?? ''
  }

  return row
})

const wsCompany = XLSX.utils.json_to_sheet(companyRows)
// 设置列宽
wsCompany['!cols'] = [
  { wch: 14 }, { wch: 24 }, { wch: 30 }, { wch: 12 }, { wch: 18 },
  { wch: 10 }, { wch: 10 }, { wch: 12 }, { wch: 16 }, { wch: 30 },
  { wch: 8 }, { wch: 8 }, { wch: 8 }, { wch: 60 }, { wch: 60 },
  { wch: 60 }, { wch: 60 }, { wch: 30 },
  { wch: 12 }, { wch: 16 }, { wch: 6 },
  { wch: 12 }, { wch: 16 }, { wch: 6 },
  { wch: 12 }, { wch: 16 }, { wch: 6 },
  { wch: 12 }, { wch: 16 }, { wch: 6 },
  { wch: 12 }, { wch: 16 }, { wch: 6 },
]
XLSX.utils.book_append_sheet(wb, wsCompany, '公司')

// ========== Sheet 2: 技能 ==========
const skillRows = data.skills.map(s => {
  const zhS = zh.skill?.[s.id] || {}
  const enS = en.skill?.[s.id] || {}
  return {
    'ID': s.id,
    '所属分类ID': s.categoryId,
    '中文名': zhS.name || '',
    'English Name': enS.name || '',
    '描述(中)': zhS.desc || '',
    'Description(EN)': enS.desc || '',
    '默认图标': s.icon,
    '选中图标': s.iconSelect,
  }
})

const wsSkill = XLSX.utils.json_to_sheet(skillRows)
wsSkill['!cols'] = [
  { wch: 18 }, { wch: 14 }, { wch: 12 }, { wch: 20 },
  { wch: 60 }, { wch: 60 }, { wch: 28 }, { wch: 28 },
]
XLSX.utils.book_append_sheet(wb, wsSkill, '技能')

// ========== Sheet 3: 子技能 ==========
const subSkillRows = []
for (const s of data.skills) {
  if (!s.subSkills) continue
  for (const sub of s.subSkills) {
    const zhSub = zh.subSkill?.[sub.id] || {}
    const enSub = en.subSkill?.[sub.id] || {}
    subSkillRows.push({
      'ID': sub.id,
      '所属技能ID': s.id,
      '中文名': zhSub.name || '',
      'English Name': enSub.name || '',
      '描述(中)': zhSub.desc || '',
      'Description(EN)': enSub.desc || '',
    })
  }
}

const wsSubSkill = XLSX.utils.json_to_sheet(subSkillRows)
wsSubSkill['!cols'] = [
  { wch: 18 }, { wch: 18 }, { wch: 16 }, { wch: 28 },
  { wch: 80 }, { wch: 80 },
]
XLSX.utils.book_append_sheet(wb, wsSubSkill, '子技能')

// ========== Sheet 4: 分类 ==========
const categoryRows = data.skillCategories.map(cat => {
  const zhCat = zh.category?.[cat.id] || ''
  const enCat = en.category?.[cat.id] || ''
  return {
    'ID': cat.id,
    '中文名': typeof zhCat === 'string' ? zhCat : zhCat.name || '',
    'English Name': typeof enCat === 'string' ? enCat : enCat.name || '',
    '平台图片': cat.platformImage,
    '上层图片': cat.upperLayerImage,
    '条形图片': cat.barImage,
    '颜色': cat.color,
    '技能IDs(逗号分隔)': cat.skills.join(','),
  }
})

const wsCat = XLSX.utils.json_to_sheet(categoryRows)
wsCat['!cols'] = [
  { wch: 14 }, { wch: 12 }, { wch: 20 }, { wch: 22 },
  { wch: 22 }, { wch: 16 }, { wch: 10 }, { wch: 40 },
]
XLSX.utils.book_append_sheet(wb, wsCat, '分类')

// ========== Sheet 5: KPI指标 ==========
const kpiRows = data.kpiIndicators.map(k => ({
  'ID': k.id,
  '中文标签': zh.kpi?.[k.id] || '',
  'English Label': en.kpi?.[k.id] || '',
  '图标': k.icon,
  '数量': k.count,
  '颜色': k.color,
  '状态过滤': k.statusFilter,
}))

const wsKpi = XLSX.utils.json_to_sheet(kpiRows)
wsKpi['!cols'] = [
  { wch: 16 }, { wch: 10 }, { wch: 14 }, { wch: 16 },
  { wch: 6 }, { wch: 10 }, { wch: 16 },
]
XLSX.utils.book_append_sheet(wb, wsKpi, 'KPI指标')

// ========== Sheet 6: 场景标签 ==========
const scenarioRows = Object.keys(zh.scenario || {}).map(key => ({
  'Key': key,
  '中文': zh.scenario[key],
  'English': en.scenario?.[key] || '',
}))

const wsScenario = XLSX.utils.json_to_sheet(scenarioRows)
wsScenario['!cols'] = [{ wch: 14 }, { wch: 14 }, { wch: 18 }]
XLSX.utils.book_append_sheet(wb, wsScenario, '场景标签')

// ========== Sheet 7: UI文本 ==========
function flattenObj(obj, prefix = '') {
  const result = {}
  for (const [key, val] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${key}` : key
    if (typeof val === 'object' && val !== null && !Array.isArray(val)) {
      Object.assign(result, flattenObj(val, path))
    } else {
      result[path] = val
    }
  }
  return result
}

// 只提取 UI 相关的固定文本（排除动态数据部分）
const uiSections = ['app', 'modal', 'settings', 'bottomPanel']
const uiRows = []
for (const section of uiSections) {
  const zhFlat = flattenObj(zh[section] || {}, section)
  const enFlat = flattenObj(en[section] || {}, section)
  for (const key of Object.keys(zhFlat)) {
    uiRows.push({
      'Key': key,
      '中文': zhFlat[key] || '',
      'English': enFlat[key] || '',
    })
  }
}

const wsUI = XLSX.utils.json_to_sheet(uiRows)
wsUI['!cols'] = [{ wch: 28 }, { wch: 30 }, { wch: 30 }]
XLSX.utils.book_append_sheet(wb, wsUI, 'UI文本')

// 写入文件
const outFile = process.argv[2] || 'data-template.xlsx'
const outPath = resolve(root, outFile)
XLSX.writeFile(wb, outPath)

console.log(`[OK] 已导出到 ${outPath}`)
console.log(`     共 ${companyRows.length} 家公司, ${skillRows.length} 个技能, ${subSkillRows.length} 个子技能`)
console.log(`     包含 7 个工作表: 公司 / 技能 / 子技能 / 分类 / KPI指标 / 场景标签 / UI文本`)
