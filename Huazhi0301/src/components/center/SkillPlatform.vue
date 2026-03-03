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
import { ref } from 'vue'
import { useI18n } from '@/composables/useI18n'

const { t } = useI18n()

// 图片资源导入
import bottomLayer from '@/assets/platforms/block_layer_buttom.png'
import midDark from '@/assets/platforms/block_layer_mid_dark.png'
import midLight from '@/assets/platforms/block_layer_mid_light.png'
import upperL from '@/assets/platforms/block_layer_upper_l.png'
import upperM from '@/assets/platforms/block_layer_upper_m.png'
import upperR from '@/assets/platforms/block_layer_upper_r.png'
import connectLeft from '@/assets/connectors/block_connect_left.png'
import connectRight from '@/assets/connectors/block_connect_right.png'

const props = defineProps<{
  categories: SkillCategory[]
  skills: Skill[]
  highlightedSkillIds: string[]
  hoveredSkillId: string | null
}>()

defineEmits<{
  (e: 'hoverSkill', skillId: string | null): void
}>()

/** 平台图片映射 */
const platformImages: Record<string, string> = {
  block_layer_mid_dark: midDark,
  block_layer_mid_light: midLight,
}

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
 */
const categoryLabelPositions: Record<string, { top: string; left: string }> = {
  assembly: { top: '440px', left: '220px' },
  inspection: { top: '440px', left: '750px' },
  palletizing: { top: '580px', left: '490px' },
}

/**
 * 每个技能在其上层平台中的相对位置 (百分比)
 */
const skillPositions: Record<string, { top: string; left: string }> = {
  // 柔性装配 (upper_l - 3 个圆位)
  shangxiawuliao: { top: '20%', left: '30%' },
  dingweiduiqi: { top: '2%', left: '38%' },
  lianjieguding: { top: '16%', left: '64%' },
  // 柔性质检 (upper_r - 4 个位)
  quexianjiance: { top: '10%', left: '15%' },
  rouxingshineng: { top: '10%', left: '55%' },
  wusunjiance: { top: '45%', left: '25%' },
  xingneng: { top: '45%', left: '65%' },
  // 柔性码垛 (upper_m - 5 个圆位)
  zhinengmaduo: { top: '30%', left: '37.5%' },
  cankuduijie: { top: '17%', left: '64%' },
  chengpingbaoz: { top: '17%', left: '13%' },
  lujinguihua: { top: '2%', left: '37.5%' },
}

/**
 * 子级技能标签相对于各自 SkillNode 的偏移量
 * top / left 是相对于节点左上角的 CSS 值
 * 标签水平方向默认以 translateX(-50%) 居中，left 基于节点宽度百分比
 * 可对每个技能单独微调
 */
const skillLabelOffsets: Record<string, { top: string; left: string }> = {
  // 柔性装配
  shangxiawuliao: { top: '108px', left: '50%' },
  dingweiduiqi:   { top: '108px', left: '50%' },
  lianjieguding:  { top: '108px', left: '50%' },
  // 柔性质检
  quexianjiance:  { top: '108px', left: '50%' },
  rouxingshineng: { top: '108px', left: '50%' },
  wusunjiance:    { top: '108px', left: '50%' },
  xingneng:       { top: '108px', left: '50%' },
  // 柔性码垛
  zhinengmaduo:   { top: '108px', left: '50%' },
  cankuduijie:    { top: '108px', left: '50%' },
  chengpingbaoz:  { top: '108px', left: '50%' },
  lujinguihua:    { top: '108px', left: '50%' },
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

function onSkillHover(_skillId: string | null) {
  // hover state is now managed within SkillNode itself
}

/** 暴露技能节点引用供连线使用 */
const skillNodeRefs = ref<Record<string, HTMLElement>>({})
defineExpose({ skillNodeRefs })
</script>

<template>
  <div class="skill-platform">
    <!-- 底层网格大平台 -->
    <img :src="bottomLayer" alt="" class="skill-platform__bottom" />

    <!-- 连接装饰线 (左右各一条) -->
    <img :src="connectLeft" alt="" class="skill-platform__connector skill-platform__connector--left" />
    <img :src="connectRight" alt="" class="skill-platform__connector skill-platform__connector--right" />

    <!-- 遍历三个分类，渲染中层底座 + 上层平台 + 技能节点 -->
    <template v-for="category in categories" :key="category.id">
      <!-- 中层底座 (不含文字标签) -->
      <div
        class="skill-platform__mid"
        :style="{
          top: categoryPositions[category.id]?.midTop,
          left: categoryPositions[category.id]?.midLeft,
        }"
      >
        <img :src="platformImages[category.platformImage]" alt="" class="skill-platform__mid-img" />
      </div>

      <!-- 上层技能承载平台 + 技能图标 -->
      <div
        class="skill-platform__upper"
        :style="{
          top: categoryPositions[category.id]?.upperTop,
          left: categoryPositions[category.id]?.upperLeft,
        }"
      >
        <img :src="upperImages[category.upperLayerImage]" alt="" class="skill-platform__upper-img" />

        <!-- 技能图标节点 (不含文字) -->
        <SkillNode
          v-for="skill in getCategorySkills(category)"
          :key="skill.id"
          :skill="skill"
          :is-highlighted="highlightedSkillIds.includes(skill.id)"
          :category-color="categoryColorMap[category.id] || '#3B82F6'"
          :label-offset="skillLabelOffsets[skill.id] || { top: '108px', left: '50%' }"
          :style="{
            position: 'absolute',
            top: skillPositions[skill.id]?.top || '50%',
            left: skillPositions[skill.id]?.left || '50%',
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
      :style="{
        top: categoryLabelPositions[category.id]?.top,
        left: categoryLabelPositions[category.id]?.left,
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

  // 底层大平台
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

  // 连接装饰线
  &__connector {
    position: absolute;
    width: 180px;
    height: auto;
    z-index: var(--z-platform-connector);
    pointer-events: none;
    opacity: 0.6;

    &--left {
      top: 380px;
      left: 340px;
    }

    &--right {
      top: 300px;
      right: 180px;
    }
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
    }
  }

  // 上层技能平台
  &__upper {
    position: absolute;
    width: 450px;
    height: 450px;
    z-index: var(--z-platform-upper);

    &-img {
      width: 100%;
      height: auto;
      pointer-events: none;
      position: absolute;
      top: 0;
      left: 0;
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
