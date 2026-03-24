<script setup lang="ts">
/**
 * SkillNode.vue - 单个技能图标节点
 *
 * 显示在 3D 等距平台上层，支持默认/选中态图标切换。
 * hover 时：
 *   1. 切换到选中态图标
 *   2. 展开二级子技能菜单 (SkillSubMenu)
 * 包含毛玻璃文字标签，位置可通过 labelOffset 单独调整。
 */
import type { Skill } from '@/types'
import { ref, computed, inject, onMounted, watch } from 'vue'
import { useI18n } from '@/composables/useI18n'
import { useSettings } from '@/composables/useSettings'
import SkillSubMenu from './SkillSubMenu.vue'

const { t, locale } = useI18n()
const { deviceMode } = useSettings()

const props = defineProps<{
  skill: Skill
  isHighlighted: boolean
  /** 外部高亮的三级技能 ID 列表（来自企业 hover） */
  highlightedSubSkillIds: string[]
  categoryColor: string
  /** 标签相对于节点左上角的偏移及变形 */
  labelOffset: { top: string; left: string; rotate?: string; skewX?: string; skewY?: string; scale?: number }
  /** 子菜单展开方向 */
  submenuDirection?: 'up' | 'down'
  /** 子菜单额外顶部偏移 (px)，用于避免与标签重叠 */
  submenuTopOffset?: number
  /** 公司 hover 时，非关联节点降暗 */
  isDimmedByOverlay?: boolean
  /** 父组件当前激活的 hover 技能 ID（用于移动端外部复位） */
  activeHoveredId?: string | null
}>()

const emit = defineEmits<{
  (e: 'hover', skillId: string | null): void
}>()

const isHovered = ref(false)

// 移动端：父组件清除 hover 时，级联复位本地 isHovered
watch(() => props.activeHoveredId, (newId) => {
  if (deviceMode.value === 'mobile') {
    isHovered.value = (newId === props.skill.id)
  }
})

/** 移动端点击切换 hover 状态 */
function handleMobileClick() {
  if (isHovered.value) {
    isHovered.value = false
    emit('hover', null)
  } else {
    isHovered.value = true
    emit('hover', props.skill.id)
  }
}

/**
 * 动态加载技能图标
 * 根据 hover/highlight 状态切换默认和选中图标
 */
const skillIcons = import.meta.glob('@/assets/skills/*.png', { eager: true, import: 'default' }) as Record<string, string>

function findIcon(name: string): string {
  // 优先使用 @2x 高清图，找不到再回退到 1x
  for (const [path, url] of Object.entries(skillIcons)) {
    if (path.includes(`/${name}@2x.png`)) return url
  }
  for (const [path, url] of Object.entries(skillIcons)) {
    if (path.includes(`/${name}.png`) && !path.includes('@2x')) return url
  }
  return ''
}

/** 默认态图标 URL */
const iconDefault = computed(() => findIcon(props.skill.icon))
/** 选中态图标 URL（缺失时回退到默认） */
const iconSelect = computed(() => findIcon(props.skill.iconSelect) || findIcon(props.skill.icon))

/** 该技能下被外部高亮的子技能 ID 列表 */
const matchingSubSkillIds = computed(() => {
  if (!props.skill.subSkills || props.highlightedSubSkillIds.length === 0) return []
  const mySubIds = new Set(props.skill.subSkills.map(s => s.id))
  return props.highlightedSubSkillIds.filter(id => mySubIds.has(id))
})

/** 是否展示二级子菜单（本地 hover、外部高亮且有匹配子技能、或遮罩保持期间该节点仍被高亮） */
const showSubMenu = computed(() => {
  if (!props.skill.subSkills || props.skill.subSkills.length === 0) return false
  // 直接 hover 或遮罩保持期间的高亮
  if (isHovered.value || props.isHighlighted) return true
  // 企业 hover 时，仅当父级技能也被关联时才因 subskill 匹配展开
  // 避免未关联的父级技能因子技能匹配而意外亮起
  return false
})

/** 暴露根元素供连线坐标计算 */
const nodeRef = ref<HTMLElement>()
defineExpose({ el: nodeRef, skillId: props.skill.id })

// 注入元素注册函数（由 App.vue provide）
const registerSkillElement = inject<(id: string, el: HTMLElement) => void>('registerSkillElement')

onMounted(() => {
  if (nodeRef.value && registerSkillElement) {
    registerSkillElement(props.skill.id, nodeRef.value)
  }
})
</script>

<template>
  <div
    ref="nodeRef"
    class="skill-node"
    :class="{ 'skill-node--highlighted': isHighlighted, 'skill-node--hovered': isHovered, 'skill-node--overlay-dimmed': isDimmedByOverlay, 'skill-node--submenu-open': showSubMenu, 'skill-node--en': locale === 'en' }"
    :data-skill-id="skill.id"
    @mouseenter="deviceMode === 'pc' ? (isHovered = true, $emit('hover', skill.id)) : undefined"
    @mouseleave="deviceMode === 'pc' ? (isHovered = false, $emit('hover', null)) : undefined"
    @click.stop="deviceMode === 'mobile' && !(isDimmedByOverlay && highlightedSubSkillIds.length > 0) ? handleMobileClick() : undefined"
  >
    <div class="skill-node__icon-wrap">
      <img :src="iconDefault" :alt="skill.nameKey" class="skill-node__icon skill-node__icon--default" />
      <img :src="iconSelect" :alt="skill.nameKey" class="skill-node__icon skill-node__icon--select" />
    </div>

    <!-- 毛玻璃文字标签（位置通过 labelOffset 单独控制） -->
    <span
      class="skill-node__label"
      :style="{
        '--label-color': categoryColor,
        top: labelOffset.top,
        left: labelOffset.left,
        transform: `translateX(-50%) rotate(${labelOffset.rotate || '0deg'}) skewX(${labelOffset.skewX || '0deg'}) skewY(${labelOffset.skewY || '0deg'}) scale(${labelOffset.scale ?? 1})`,
      }"
    >
      {{ t(skill.nameKey) }}
    </span>

    <!-- 二级子技能菜单 -->
    <SkillSubMenu
      v-if="showSubMenu"
      :sub-skills="skill.subSkills!"
      :parent-name-key="skill.nameKey"
      :category-color="categoryColor"
      :external-active-ids="matchingSubSkillIds"
      :direction="submenuDirection || 'up'"
      :style="{
        '--submenu-scale': labelOffset.scale ?? 1,
        '--submenu-top-offset': `${submenuTopOffset ?? 0}px`,
      }"
    />

    <!-- 默认 slot (tooltip 等) -->
    <slot />
  </div>
</template>

<style scoped lang="scss">
.skill-node {
  width: 114px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  transition: all var(--duration-normal) var(--ease-smooth);
  position: relative;
  pointer-events: auto;
  z-index: calc(var(--z-skill-nodes) + var(--node-z-offset, 0));
  transform: scale(var(--node-scale, 1));

  &--submenu-open {
    z-index: calc(var(--z-skill-nodes) + var(--node-z-offset, 0) + 20);
  }

  &--hovered,
  &--highlighted {
    transform: scale(calc(var(--node-scale, 1) * 1.10));
    z-index: calc(var(--z-skill-nodes) + var(--node-z-offset, 0) + 10);

    // filter 只作用于图标，避免光栅化文字导致模糊
    .skill-node__icon-wrap {
      filter: brightness(1.5) saturate(1.8) drop-shadow(0 0 12px rgba(59, 130, 246, 0.7)) drop-shadow(0 0 24px rgba(59, 130, 246, 0.3));
    }

    .skill-node__icon--default { opacity: 0; }
    .skill-node__icon--select { opacity: 1; }

    // hover/高亮时标签提到最上层，避免被其他节点遮挡
    .skill-node__label {
      z-index: 100;
    }
  }

  // 公司 hover 遮罩降暗：非关联节点（含图标和标签）整体变暗
  &--overlay-dimmed {
    opacity: 0.8;
    transition: opacity 0.3s ease, filter 0.3s ease;

    .skill-node__icon-wrap {
      filter: brightness(0.5);
    }

    .skill-node__label {
      opacity: 0.3;
      transition: opacity 0.3s ease;
    }
  }

  &__icon-wrap {
    position: relative;
    width: 106px;
    height: 106px;
    flex-shrink: 0;
    transition: filter var(--duration-normal) var(--ease-smooth);
  }

  &__icon {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: contain;
    transition: opacity var(--duration-normal) var(--ease-smooth);

    &--select {
      opacity: 0;
    }
  }

  // 子级技能标签 — 小号胶囊 · 毛玻璃 + 光效
  &__label {
    position: absolute;
    isolation: isolate;
    // transform 由内联 style 控制（含 translateX(-50%) + rotate + skew）
    padding: 3px 10px;
    border-radius: 12px;
    font-size: 16px;
    font-weight: 500;
    color: #fff;
    white-space: nowrap;
    pointer-events: none;

    // 发光边框（白→彩色过渡）
    border: 1px solid color-mix(in srgb, var(--label-color) 65%, rgba(255, 255, 255, 0.45));

    // 外发光（内层白色高光 → 外层彩色扩散）
    box-shadow:
      0 0 2px rgba(255, 255, 255, 0.9),
      0 0 15px color-mix(in srgb, var(--label-color) 60%, transparent),
      0 0 32px color-mix(in srgb, var(--label-color) 36%, transparent),
      0 0 48px color-mix(in srgb, var(--label-color) 20%, transparent),
      0 1px 6px rgba(0, 0, 0, 0.35);

    // 毛玻璃层（与文字分离，避免模糊）
    &::after {
      content: '';
      position: absolute;
      inset: 0;
      z-index: -1;
      border-radius: inherit;
      pointer-events: none;
      background: linear-gradient(
        135deg,
        rgba(0, 0, 0, 0.4) 0%,
        color-mix(in srgb, var(--label-color) 20%, transparent) 100%
      );
      backdrop-filter: blur(10px) saturate(1.3);
      -webkit-backdrop-filter: blur(10px) saturate(1.3);
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
        color-mix(in srgb, var(--label-color) 35%, white) 50%,
        transparent
      );
      border-radius: 1px;
    }

    .skill-node--en & {
      font-size: 13px;
      font-weight: 480;
    }
  }
}
</style>
