/**
 * 单个原子技能节点（如"上下物料"、"定位对齐"）
 * 对应中心区域 3D 等距平台上的各个技能图标
 */
export interface SubSkill {
  /** 子技能唯一标识 */
  id: string
  /** i18n 键名，如 "subSkill.wuxulailiao.name" */
  nameKey: string
  /** i18n 键名，详细描述 */
  descriptionKey: string
}

export interface Skill {
  /** 唯一标识符，如 "shangxiawuliao" */
  id: string
  /** i18n 键名，如 "skill.shangxiawuliao.name" */
  nameKey: string
  /** i18n 键名，悬浮提示的详细描述 */
  descriptionKey: string
  /** 默认状态图标文件名（不含扩展名），如 "ic_skill_shangxiawuliao" */
  icon: string
  /** 选中/高亮状态图标文件名 */
  iconSelect: string
  /** 所属分类 ID: "assembly" | "palletizing" | "inspection" */
  categoryId: string
  /** 二级子技能列表 */
  subSkills?: SubSkill[]
}

/**
 * 技能分类（3D 底座），对应三大核心场景
 * 柔性装配 / 柔性质检 / 柔性码垛
 */
export interface SkillCategory {
  /** 分类唯一标识: "assembly" | "palletizing" | "inspection" */
  id: string
  /** i18n 键名，如 "category.assembly" */
  nameKey: string
  /** 中层底座图片: "block_layer_mid_dark" | "block_layer_mid_light" */
  platformImage: string
  /** 上层技能承载平台图片: "block_layer_upper_l" | "block_layer_upper_m" | "block_layer_upper_r" */
  upperLayerImage: string
  /** 底部面板标题栏图片: "bar_zhuangpei" | "bar_zhijian" | "bar_maduo" */
  barImage: string
  /** 分类主题色（十六进制） */
  color: string
  /** 该分类下所有技能的 ID 数组 */
  skills: string[]
}
