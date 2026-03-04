<script setup lang="ts">
/**
 * SkillPlatform.vue - 中心 3D 等距技能平台
 *
 * 通过绝对定位堆叠三层图片创建 3D 视觉效果：
 * - 底层：大网格平台 (block_layer_buttom.png)
 * - 中层：三个分类底座 (block_layer_mid_*.png)
 * - 上层：技能承载平台 (block_layer_upper_*.png) + 技能图标节点
 *
 * 文字标签系统（独立于图标/平台，便于手动微调位置）：
 * - 父级分类标签：大号胶囊背景，白色文字
 * - 子级技能标签：小号胶囊背景，白色文字
 */
import type { SkillCategory, Skill } from '@/types'
import SkillNode from './SkillNode.vue'
import { ref, computed } from 'vue'
import { useI18n } from '@/composables/useI18n'

const { t, locale } = useI18n()

// 图片资源导入
import bottomLayer from '@/assets/platforms/block_layer_buttom.png'
import midDark from '@/assets/platforms/block_layer_mid_dark.png'
import midLight from '@/assets/platforms/block_layer_mid_light.png'
import upperL from '@/assets/platforms/block_layer_upper_r.png'
import upperM from '@/assets/platforms/block_layer_upper_m.png'
import upperR from '@/assets/platforms/block_layer_upper_r.png'
import connectLeft from '@/assets/connectors/block_connect_left@2x.png'
import connectRight from '@/assets/connectors/block_connect_right@2x.png'

const props = defineProps<{
  categories: SkillCategory[]
  skills: Skill[]
  highlightedSkillIds: string[]
  highlightedSubSkillIds: string[]
  hoveredSkillId: string | null
}>()

const upperImages: Record<string, string> = {
  block_layer_upper_l: upperL,
  block_layer_upper_m: upperM,
  block_layer_upper_r: upperR,
}

/**
 * 每个分类在等距平台中的定位参数
 */
const categoryPositions: Record<string, { midTop: string; midLeft: string; upperTop: string; upperLeft: string }> = {
  assembly: {
    midTop: '90px',
    midLeft: '110px',
    upperTop: '35px',
    upperLeft: '110px',
  },
  inspection: {
    midTop: '90px',
    midLeft: '640px',
    upperTop: '35px',
    upperLeft: '640px',
  },
  palletizing: {
    midTop: '250px',
    midLeft: '376px',
    upperTop: '195px',
    upperLeft: '376px',
  },
}

/**
 * 父级分类标签的绝对位置（独立于平台图片，便于手动微调）
 * 中英文文字宽度不同，需要按语言分别调整坐标
 */
const categoryLabelPositionsMap: Record<string, Record<string, { top: string; left: string; rotate: string; skewX: string; skewY: string }>> = {
  zh: {
    assembly:    { top: '350px', left: '130px', rotate: '30deg',  skewX: '-30deg', skewY: '0deg' },
    inspection:  { top: '350px', left: '952px', rotate: '-30deg', skewX: '30deg',  skewY: '0deg' },
    palletizing: { top: '506px', left: '400px', rotate: '30deg',  skewX: '-30deg', skewY: '0deg' },
  },
  en: {
    assembly:    { top: '350px', left: '90px', rotate: '30deg',  skewX: '-30deg', skewY: '0deg' },
    inspection:  { top: '348px', left: '872px', rotate: '-30deg', skewX: '30deg',  skewY: '0deg' },
    palletizing: { top: '506px', left: '340px', rotate: '30deg',  skewX: '-30deg', skewY: '0deg' },
  },
}
const categoryLabelPositions = computed(() => categoryLabelPositionsMap[locale.value] || categoryLabelPositionsMap.zh)

/**
 * 每个技能在其上层平台中的相对位置 (百分比)
 */
const skillPositions: Record<string, { top: string; left: string; scale?: number }> = {
  // 柔性装配 (upper_l - 4 个圆位)
  shangxiawuliao: { top: '11%', left: '11.5%' },
  dingweiduiqi: { top: '2%', left: '38%', scale: 0.95 },
  lianjieguding: { top: '16%', left: '66%', scale: 0.95 },
  liuzhuanfuwei: { top: '26%', left: '38%', scale: 0.93 },
  // 柔性质检 (upper_r - 4 个位)
  quexianjiance: { top: '2%', left: '38%' },
  rouxingshineng: { top: '28%', left: '37%' },
  wusunjiance: { top: '13%', left: '64%' },
  xingneng: { top: '15%', left: '12%' },
  // 柔性码垛 (upper_m - 5 个圆位)
  zhinengmaduo: { top: '31%', left: '37.5%', scale: 0.93 },
  cankuduijie: { top: '17%', left: '64%' },
  chengpingbaoz: { top: '16%', left: '15%' },
  lujinguihua: { top: '2%', left: '37.5%' },
  fenjianpeisong: { top: '14.5%', left: '40%', scale: 0.88 },
}

/**
 * 指定需要向下展开 SkillSubMenu 的技能 ID
 */
const skillSubmenuDirection: Record<string, 'up' | 'down'> = {
  liuzhuanfuwei: 'down',
  chengpingbaoz: 'down',
  zhinengmaduo: 'down',
  cankuduijie: 'down',
}

/**
 * 子级技能标签相对于各自 SkillNode 的偏移量
 * top / left 是相对于节点左上角的 CSS 值
 * 标签水平方向默认以 translateX(-50%) 居中，left 基于节点宽度百分比
 * 可对每个技能单独微调
 */
const skillLabelOffsets: Record<string, { top: string; left: string; rotate: string; skewX: string; skewY: string }> = {
  // 柔性装配
  shangxiawuliao: { top: '78px', left: '20%', rotate: '30deg',  skewX: '-30deg', skewY: '0deg' },
  dingweiduiqi:   { top: '60px', left: '10%', rotate: '30deg',  skewX: '-30deg', skewY: '0deg' },
  lianjieguding:  { top: '73px', left: '15%', rotate: '30deg',  skewX: '-30deg', skewY: '0deg' },
  liuzhuanfuwei:  { top: '78px', left: '10%', rotate: '30deg',  skewX: '-30deg', skewY: '0deg' },
  // 柔性质检
  quexianjiance:  { top: '68px', left: '70%', rotate: '-30deg',  skewX: '30deg', skewY: '0deg' },
  rouxingshineng: { top: '72px', left: '92%', rotate: '-30deg',  skewX: '30deg', skewY: '0deg' },
  wusunjiance:    { top: '78px', left: '80%', rotate: '-30deg',  skewX: '30deg', skewY: '0deg' },
  xingneng:       { top: '70px', left: '80%', rotate: '-30deg',  skewX: '30deg', skewY: '0deg' },
  // 柔性码垛
  zhinengmaduo:   { top: '75px', left: '23%', rotate: '30deg',  skewX: '-30deg', skewY: '0deg' },
  cankuduijie:    { top: '70px', left: '22%', rotate: '30deg',  skewX: '-30deg', skewY: '0deg' },
  chengpingbaoz:  { top: '70px', left: '8%', rotate: '30deg',  skewX: '-30deg', skewY: '0deg' },
  lujinguihua:    { top: '65px', left: '10%', rotate: '30deg',  skewX: '-30deg', skewY: '0deg' },
  fenjianpeisong: { top: '70px', left: '5%', rotate: '30deg',  skewX: '-30deg', skewY: '0deg' },
}

/**
 * 技能标签颜色映射 (按所属分类着色)
 */
const categoryColorMap: Record<string, string> = {
  assembly: '#3B82F6',
  inspection: '#22D3EE',
  palletizing: '#8B5CF6',
}

/** 获取分类下的技能列表 */
function getCategorySkills(category: SkillCategory): Skill[] {
  return category.skills
    .map(skillId => props.skills.find(s => s.id === skillId))
    .filter((s): s is Skill => s !== undefined)
}

/**
 * 当前处于"激活"状态的分类 ID 集合
 * 激活条件：该分类下有技能正被 hover 或被连线高亮
 */
const activeCategoryIds = computed(() => {
  const active = new Set<string>()
  const hovered = localHoveredSkillId.value
  for (const category of props.categories) {
    const hasActive = category.skills.some(
      skillId => skillId === hovered || props.highlightedSkillIds.includes(skillId)
    )
    if (hasActive) active.add(category.id)
  }
  return active
})

/** 是否有子菜单正在展开（用于临时提升平台 z-index） */
const isSubmenuOpen = ref(false)

/** 外部高亮导致子菜单展开时也要提升 z-index */
const hasExternalSubmenu = computed(() => props.highlightedSubSkillIds.length > 0)
const effectiveSubmenuOpen = computed(() => isSubmenuOpen.value || hasExternalSubmenu.value)

/** 当前有子菜单展开的分类 ID 集合（用于提升对应 __upper 的 z-index，防止被其他平台遮挡） */
const categoriesWithSubmenu = computed(() => {
  const ids = new Set<string>()
  // 直接 hover 触发
  if (localHoveredSkillId.value) {
    const skill = props.skills.find(s => s.id === localHoveredSkillId.value)
    if (skill?.subSkills?.length) ids.add(skill.categoryId)
  }
  // 外部企业 hover 触发
  if (props.highlightedSubSkillIds.length > 0) {
    for (const skill of props.skills) {
      if (skill.subSkills?.some(sub => props.highlightedSubSkillIds.includes(sub.id))) {
        ids.add(skill.categoryId)
      }
    }
  }
  return ids
})

/** 公司 hover 是否激活（用于平台内部降暗） */
const isCompanyHoverActive = computed(() => props.highlightedSubSkillIds.length > 0)

const emit = defineEmits<{
  (e: 'hoverSkill', skillId: string | null): void
}>()

/** 本地记录当前 hover 的技能 ID，同时向父组件冒泡 */
const localHoveredSkillId = ref<string | null>(null)

function onSkillHover(skillId: string | null) {
  localHoveredSkillId.value = skillId
  emit('hoverSkill', skillId)

  // 判断当前 hover 的技能是否拥有子技能
  if (skillId) {
    const skill = props.skills.find(s => s.id === skillId)
    isSubmenuOpen.value = !!(skill?.subSkills && skill.subSkills.length > 0)
  } else {
    isSubmenuOpen.value = false
  }
}

/** 暴露技能节点引用供连线使用 */
const skillNodeRefs = ref<Record<string, HTMLElement>>({})
defineExpose({ skillNodeRefs })
</script>

<template>
  <div class="skill-platform" :class="{ 'skill-platform--submenu-active': effectiveSubmenuOpen }">
    <!-- 底层网格大平台 -->
    <img :src="bottomLayer" alt="" class="skill-platform__bottom" :class="{ 'skill-platform__bottom--dimmed': isCompanyHoverActive }" />

    <!-- 连接装饰线 (左右各一条) -->
    <img :src="connectLeft" alt="" class="skill-platform__connector skill-platform__connector--left" :class="{ 'skill-platform__connector--dimmed': isCompanyHoverActive }" />
    <img :src="connectRight" alt="" class="skill-platform__connector skill-platform__connector--right" :class="{ 'skill-platform__connector--dimmed': isCompanyHoverActive }" />

    <!-- 遍历三个分类，渲染中层底座 + 上层平台 + 技能节点 -->
    <template v-for="category in categories" :key="category.id">
      <!-- 中层底座 (不含文字标签，hover/高亮时切换 dark→light) -->
      <div
        class="skill-platform__mid"
        :class="{ 'skill-platform__mid--dimmed': isCompanyHoverActive && !activeCategoryIds.has(category.id) }"
        :style="{
          top: categoryPositions[category.id]?.midTop,
          left: categoryPositions[category.id]?.midLeft,
        }"
      >
        <!-- dark 底图（始终渲染，激活时淡出） -->
        <img
          :src="midDark"
          alt=""
          class="skill-platform__mid-img"
          :class="{ 'skill-platform__mid-img--hidden': activeCategoryIds.has(category.id) }"
        />
        <!-- light 切图（叠在 dark 之上，激活时淡入） -->
        <img
          :src="midLight"
          alt=""
          class="skill-platform__mid-img skill-platform__mid-img--light"
          :class="{ 'skill-platform__mid-img--visible': activeCategoryIds.has(category.id) }"
        />
      </div>

      <!-- 上层技能承载平台 + 技能图标 -->
      <div
        class="skill-platform__upper"
        :class="{ 'skill-platform__upper--elevated': categoriesWithSubmenu.has(category.id) }"
        :style="{
          top: categoryPositions[category.id]?.upperTop,
          left: categoryPositions[category.id]?.upperLeft,
        }"
      >
        <img :src="upperImages[category.upperLayerImage]" alt="" class="skill-platform__upper-img" :class="{ 'skill-platform__upper-img--dimmed': isCompanyHoverActive && !activeCategoryIds.has(category.id) }" />

        <!-- 技能图标节点 (不含文字) -->
        <SkillNode
          v-for="skill in getCategorySkills(category)"
          :key="skill.id"
          :skill="skill"
          :is-highlighted="highlightedSkillIds.includes(skill.id)"
          :highlighted-sub-skill-ids="highlightedSubSkillIds"
          :category-color="categoryColorMap[category.id] || '#3B82F6'"
          :label-offset="skillLabelOffsets[skill.id] || { top: '108px', left: '50%' }"
          :submenu-direction="skillSubmenuDirection[skill.id] || 'up'"
          :is-dimmed-by-overlay="isCompanyHoverActive && !highlightedSkillIds.includes(skill.id)"
          :style="{
            position: 'absolute',
            top: skillPositions[skill.id]?.top || '50%',
            left: skillPositions[skill.id]?.left || '50%',
            '--node-scale': skillPositions[skill.id]?.scale ?? 1,
          }"
          @hover="onSkillHover"
        />
      </div>
    </template>

    <!-- ========== 独立文字标签层 ========== -->

    <!-- 父级分类标签（大号胶囊 · 毛玻璃 + 光效） -->
    <div
      v-for="category in categories"
      :key="`label-${category.id}`"
      class="category-label"
      :class="{ 'category-label--dimmed': isCompanyHoverActive && !activeCategoryIds.has(category.id) }"
      :style="{
        top: categoryLabelPositions[category.id]?.top,
        left: categoryLabelPositions[category.id]?.left,
        transform: `rotate(${categoryLabelPositions[category.id]?.rotate || '0deg'}) skewX(${categoryLabelPositions[category.id]?.skewX || '0deg'}) skewY(${categoryLabelPositions[category.id]?.skewY || '0deg'})`,
        '--label-color': category.color,
      }"
    >
      {{ t(category.nameKey) }}
    </div>

  </div>
</template>

<style scoped lang="scss">
.skill-platform {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -48%);
  width: 1200px;
  height: 700px;
  z-index: var(--z-platform-base);
  transition: z-index 0s;

  // 子菜单展开时，临时提升整个平台的层级，突破层叠上下文限制
  &--submenu-active {
    z-index: var(--z-skill-submenu);
  }

  // 底层大平台
  &__bottom--dimmed {
    opacity: 0.2;
    transition: opacity 0.3s ease;
  }

  &__bottom {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 1200px;
    height: auto;
    z-index: var(--z-platform-base);
    pointer-events: none;
  }

  &__connector--dimmed {
    opacity: 0.1 !important;
    transition: opacity 0.3s ease;
  }

  // 连接装饰线
  &__connector {
    position: absolute;
    width: 263px;
    height: auto;
    z-index: var(--z-platform-connector);
    pointer-events: none;
    opacity: 0.6;

    &--left {
      top:260px;
      left: 596px;
    }

    &--right {
      top: 268px;
      left: 330px;
      transform: scale(0.90);
    }
  }

  &__mid--dimmed {
    opacity: 0.2;
    transition: opacity 0.3s ease;
  }

  // 中层底座
  &__mid {
    position: absolute;
    width: 450px;
    z-index: var(--z-platform-mid);

    &-img {
      width: 100%;
      height: auto;
      pointer-events: none;
      transition: opacity 0.4s ease;

      // dark 底图默认可见
      &--hidden {
        opacity: 0;
      }

      // light 切图叠在 dark 之上，默认不可见
      &--light {
        position: absolute;
        top: 0;
        left: 0;
        opacity: 0;
      }

      &--visible {
        opacity: 1;
      }
    }
  }

  // 上层技能平台
  &__upper {
    position: absolute;
    width: 450px;
    height: 450px;
    z-index: var(--z-platform-upper);

    // 有子菜单展开时提升 z-index，防止被其他平台遮挡
    &--elevated {
      z-index: var(--z-skill-submenu);
    }

    &-img {
      width: 100%;
      height: auto;
      pointer-events: none;
      position: absolute;
      top: 0;
      left: 0;
      transition: opacity 0.3s ease;

      &--dimmed {
        opacity: 0.2;
      }
    }
  }
}

// 父级分类标签 — 大号胶囊 · 毛玻璃 + 光效
.category-label {
  position: absolute;
  z-index: var(--z-platform-upper);
  padding: 6px 20px;
  border-radius: 20px;
  font-size: 16px;
  font-weight: 700;
  color: #fff;
  white-space: nowrap;
  letter-spacing: 3px;
  pointer-events: none;

  // 毛玻璃底色：半透明主题色 + 深色底
  background: linear-gradient(
    135deg,
    rgba(0, 0, 0, 0.45) 0%,
    color-mix(in srgb, var(--label-color) 25%, transparent) 100%
  );
  backdrop-filter: blur(12px) saturate(1.4);
  -webkit-backdrop-filter: blur(12px) saturate(1.4);

  // 发光边框
  border: 1px solid color-mix(in srgb, var(--label-color) 40%, transparent);

  // 科技感外发光
  box-shadow:
    0 0 8px color-mix(in srgb, var(--label-color) 35%, transparent),
    0 0 20px color-mix(in srgb, var(--label-color) 15%, transparent),
    0 2px 12px rgba(0, 0, 0, 0.4);

  &--dimmed {
    opacity: 0.2;
    transition: opacity 0.3s ease;
  }

  // 顶部高光线
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 10%;
    right: 10%;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent,
      color-mix(in srgb, var(--label-color) 60%, white) 50%,
      transparent
    );
    border-radius: 1px;
  }
}

</style>
