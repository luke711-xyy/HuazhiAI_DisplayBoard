/**
 * import-from-excel.mjs
 * 从 Excel 文件读取数据，生成 data.json / zh.json / en.json
 * 用法: node scripts/import-from-excel.mjs [Excel文件路径]
 * 默认读取: data-template.xlsx
 */
import { readFileSync, writeFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import XLSX from 'xlsx'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')

const inputFile = process.argv[2] || 'data-template.xlsx'
const inputPath = resolve(root, inputFile)

console.log(`[..] 正在读取 ${inputPath}`)

const wb = XLSX.readFile(inputPath)

function getSheet(name) {
  const ws = wb.Sheets[name]
  if (!ws) {
    console.error(`[ERROR] 找不到工作表 "${name}"`)
    process.exit(1)
  }
  return XLSX.utils.sheet_to_json(ws, { defval: '' })
}

// 辅助：字符串转数组（逗号分隔）
function splitIds(str) {
  if (!str || typeof str !== 'string') return []
  return str.split(',').map(s => s.trim()).filter(Boolean)
}

// 校验收集器
const warnings = []
function warn(msg) {
  warnings.push(msg)
  console.warn(`  [WARN] ${msg}`)
}

// ==================== 读取各工作表 ====================

const companySheet = getSheet('公司')
const skillSheet = getSheet('技能')
const subSkillSheet = getSheet('子技能')
const categorySheet = getSheet('分类')
const kpiSheet = getSheet('KPI指标')
const scenarioSheet = getSheet('场景标签')
const uiSheet = getSheet('UI文本')

// ==================== 构建 data.json ====================

console.log('[..] 正在生成 data.json ...')

// KPI
const kpiIndicators = kpiSheet.map(row => ({
  id: String(row['ID']),
  labelKey: `kpi.${row['ID']}`,
  icon: String(row['图标']),
  count: Number(row['数量']) || 0,
  color: String(row['颜色']),
  statusFilter: String(row['状态过滤']),
}))

// 分类
const skillCategories = categorySheet.map(row => ({
  id: String(row['ID']),
  nameKey: `category.${row['ID']}`,
  platformImage: String(row['平台图片']),
  upperLayerImage: String(row['上层图片']),
  barImage: String(row['条形图片']),
  color: String(row['颜色']),
  skills: splitIds(String(row['技能IDs(逗号分隔)'])),
}))

// 子技能按父技能分组
const subSkillsByParent = {}
for (const row of subSkillSheet) {
  const parentId = String(row['所属技能ID'])
  if (!subSkillsByParent[parentId]) subSkillsByParent[parentId] = []
  subSkillsByParent[parentId].push({
    id: String(row['ID']),
    nameKey: `subSkill.${row['ID']}.name`,
    descriptionKey: `subSkill.${row['ID']}.desc`,
  })
}

// 技能
const allSkillIds = new Set()
const skills = skillSheet.map(row => {
  const id = String(row['ID'])
  allSkillIds.add(id)
  return {
    id,
    nameKey: `skill.${id}.name`,
    descriptionKey: `skill.${id}.desc`,
    icon: String(row['默认图标']),
    iconSelect: String(row['选中图标']),
    categoryId: String(row['所属分类ID']),
    subSkills: subSkillsByParent[id] || [],
  }
})

// 公司
const companies = []
const companyDetails = []

for (const row of companySheet) {
  const id = String(row['ID'])
  if (!id) continue

  const relatedSkillIds = splitIds(String(row['关联技能IDs(逗号分隔)']))
  const coreSkills = splitIds(String(row['核心技能IDs(逗号分隔)']))

  // 校验关联技能
  for (const sid of relatedSkillIds) {
    if (!allSkillIds.has(sid)) warn(`公司 "${id}" 关联了不存在的技能 "${sid}"`)
  }

  const status = String(row['状态(reserve/implementation/promotion)'])
  if (!['reserve', 'implementation', 'promotion'].includes(status)) {
    warn(`公司 "${id}" 状态 "${status}" 不合法，应为 reserve/implementation/promotion`)
  }

  const side = String(row['左右(left/right)'])
  if (!['left', 'right'].includes(side)) {
    warn(`公司 "${id}" 侧边 "${side}" 不合法，应为 left/right`)
  }

  const companyObj = {
    id,
    nameKey: `company.${id}.name`,
    industryKey: `company.${id}.industry`,
    type: String(row['企业类型代码(MNC/SOE/Private)']),
    status,
    relatedSkillIds,
    side,
    slotIndex: Number(row['位置索引']) || 0,
    progress: Number(row['进度(0-100)']) || 0,
  }

  const logo = String(row['Logo文件名'] || '').trim()
  if (logo) companyObj.logo = logo

  companies.push(companyObj)

  // 场景流程
  const scenarioFlow = []
  for (let i = 1; i <= 5; i++) {
    const labelKey = String(row[`场景${i}标签Key`] || '').trim()
    const icon = String(row[`场景${i}图标`] || '').trim()
    const progress = row[`场景${i}进度`]
    if (labelKey && icon) {
      const step = {
        labelKey: `scenario.${labelKey}`,
        icon,
      }
      if (progress !== '' && progress !== undefined) {
        step.progress = Number(progress)
      }
      scenarioFlow.push(step)
    }
  }

  companyDetails.push({
    companyId: id,
    briefInfoKeys: {
      name: `company.${id}.name`,
      industry: `company.${id}.industry`,
      type: `company.${id}.type`,
    },
    briefDescKey: `companyDesc.${id}.brief`,
    scenarioFlow,
    coreSkills,
    progressNoteKey: `companyDesc.${id}.progressNote`,
  })
}

const dataJson = { kpiIndicators, skillCategories, skills, companies, companyDetails }

// ==================== 构建 zh.json / en.json ====================

console.log('[..] 正在生成 zh.json / en.json ...')

// UI 文本（嵌套还原）
function setNested(obj, path, value) {
  const parts = path.split('.')
  let cur = obj
  for (let i = 0; i < parts.length - 1; i++) {
    if (!cur[parts[i]]) cur[parts[i]] = {}
    cur = cur[parts[i]]
  }
  cur[parts[parts.length - 1]] = value
}

const zhJson = {}
const enJson = {}

// UI 文本
for (const row of uiSheet) {
  const key = String(row['Key'])
  if (!key) continue
  setNested(zhJson, key, String(row['中文']))
  setNested(enJson, key, String(row['English']))
}

// KPI 标签
zhJson.kpi = {}
enJson.kpi = {}
for (const row of kpiSheet) {
  const id = String(row['ID'])
  zhJson.kpi[id] = String(row['中文标签'])
  enJson.kpi[id] = String(row['English Label'])
}

// 分类名称
zhJson.category = {}
enJson.category = {}
for (const row of categorySheet) {
  const id = String(row['ID'])
  zhJson.category[id] = String(row['中文名'])
  enJson.category[id] = String(row['English Name'])
}

// 技能
zhJson.skill = {}
enJson.skill = {}
for (const row of skillSheet) {
  const id = String(row['ID'])
  zhJson.skill[id] = { name: String(row['中文名']), desc: String(row['描述(中)']) }
  enJson.skill[id] = { name: String(row['English Name']), desc: String(row['Description(EN)']) }
}

// 子技能
zhJson.subSkill = {}
enJson.subSkill = {}
for (const row of subSkillSheet) {
  const id = String(row['ID'])
  zhJson.subSkill[id] = { name: String(row['中文名']), desc: String(row['描述(中)']) }
  enJson.subSkill[id] = { name: String(row['English Name']), desc: String(row['Description(EN)']) }
}

// 场景标签
zhJson.scenario = {}
enJson.scenario = {}
for (const row of scenarioSheet) {
  const key = String(row['Key'])
  zhJson.scenario[key] = String(row['中文'])
  enJson.scenario[key] = String(row['English'])
}

// 公司信息
zhJson.company = {}
enJson.company = {}
zhJson.companyDesc = {}
enJson.companyDesc = {}
for (const row of companySheet) {
  const id = String(row['ID'])
  if (!id) continue

  zhJson.company[id] = {
    name: String(row['中文名']),
    industry: String(row['行业(中)']),
    type: String(row['类型(中)']),
  }
  enJson.company[id] = {
    name: String(row['English Name']),
    industry: String(row['Industry(EN)']),
    type: String(row['Type(EN)']),
  }
  zhJson.companyDesc[id] = {
    brief: String(row['简介(中)']),
    progressNote: String(row['进展说明(中)']),
  }
  enJson.companyDesc[id] = {
    brief: String(row['Brief(EN)']),
    progressNote: String(row['Progress Note(EN)']),
  }
}

// ==================== 写入文件 ====================

const jsonOpts = { spaces: 2 }

writeFileSync(
  resolve(root, 'src/config/data.json'),
  JSON.stringify(dataJson, null, 2) + '\n',
  'utf-8'
)

writeFileSync(
  resolve(root, 'src/locales/zh.json'),
  JSON.stringify(zhJson, null, 2) + '\n',
  'utf-8'
)

writeFileSync(
  resolve(root, 'src/locales/en.json'),
  JSON.stringify(enJson, null, 2) + '\n',
  'utf-8'
)

// ==================== 汇总 ====================

console.log('')
console.log('========================================')
console.log(`[OK] 导入完成!`)
console.log(`     公司: ${companies.length} 家`)
console.log(`     技能: ${skills.length} 个`)
console.log(`     子技能: ${subSkillSheet.length} 个`)
console.log(`     分类: ${skillCategories.length} 个`)
console.log(`     KPI: ${kpiIndicators.length} 个`)
console.log(`     场景标签: ${scenarioSheet.length} 个`)
console.log(`     UI文本: ${uiSheet.length} 条`)
console.log('')
console.log('     已生成:')
console.log('       - src/config/data.json')
console.log('       - src/locales/zh.json')
console.log('       - src/locales/en.json')

if (warnings.length > 0) {
  console.log('')
  console.log(`  [!] 共 ${warnings.length} 条警告，请检查数据`)
}

console.log('========================================')
