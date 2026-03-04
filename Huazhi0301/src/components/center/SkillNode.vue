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
import { ref, computed, inject, onMounted } from 'vue'
import { useI18n } from '@/composables/useI18n'
import SkillSubMenu from './SkillSubMenu.vue'

const { t } = useI18n()

const props = defineProps<{
  skill: Skill
  isHighlighted: boolean
  /** 外部高亮的三级技能 ID 列表（来自企业 hover） */
  highlightedSubSkillIds: string[]
  categoryColor: string
  /** 标签相对于节点左上角的偏移及变形 */
  labelOffset: { top: string; left: string; rotate?: string; skewX?: string; skewY?: string }
  /** 子菜单展开方向 */
  submenuDirection?: 'up' | 'down'
  /** 公司 hover 时，非关联节点降暗 */
  isDimmedByOverlay?: boolean
}>()

defineEmits<{
  (e: 'hover', skillId: string | null): void
}>()

const isHovered = ref(false)

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

const iconUrl = computed(() => {
  if (isHovered.value || props.isHighlighted) {
    // 优先使用 select 图标，缺失时回退到默认图标
    return findIcon(props.skill.iconSelect) || findIcon(props.skill.icon)
  }
  return findIcon(props.skill.icon)
})

/** 该技能下被外部高亮的子技能 ID 列表 */
const matchingSubSkillIds = computed(() => {
  if (!props.skill.subSkills || props.highlightedSubSkillIds.length === 0) return []
  const mySubIds = new Set(props.skill.subSkills.map(s => s.id))
  return props.highlightedSubSkillIds.filter(id => mySubIds.has(id))
})

/** 是否展示二级子菜单（本地 hover 或有外部匹配的子技能） */
const showSubMenu = computed(() => {
  if (!props.skill.subSkills || props.skill.subSkills.length === 0) return false
  return isHovered.value || matchingSubSkillIds.value.length > 0
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
    :class="{ 'skill-node--highlighted': isHighlighted, 'skill-node--hovered': isHovered, 'skill-node--overlay-dimmed': isDimmedByOverlay }"
    :data-skill-id="skill.id"
    @mouseenter="isHovered = true; $emit('hover', skill.id)"
    @mouseleave="isHovered = false; $emit('hover', null)"
  >
    <img :src="iconUrl" :alt="skill.nameKey" class="skill-node__icon" />

    <!-- 毛玻璃文字标签（位置通过 labelOffset 单独控制） -->
    <span
      class="skill-node__label"
      :style="{
        '--label-color': categoryColor,
        top: labelOffset.top,
        left: labelOffset.left,
        transform: `translateX(-50%) rotate(${labelOffset.rotate || '0deg'}) skewX(${labelOffset.skewX || '0deg'}) skewY(${labelOffset.skewY || '0deg'})`,
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
  z-index: var(--z-skill-nodes);
  transform: scale(var(--node-scale, 1));

  &:hover,
  &--highlighted {
    transform: scale(calc(var(--node-scale, 1) * 1.10));
    filter: brightness(1.4) saturate(1.6) drop-shadow(0 0 8px rgba(59, 130, 246, 0.6));
    z-index: calc(var(--z-skill-nodes) + 10);
  }

  // 公司 hover 遮罩降暗：非关联节点（含图标和标签）整体变暗
  &--overlay-dimmed {
    opacity: 0.8;
    filter: brightness(0.5);
    pointer-events: none;
    transition: opacity 0.3s ease, filter 0.3s ease;
  }

  &__icon {
    width: 106px;
    height: 106px;
    object-fit: contain;
  }

  // 子级技能标签 — 小号胶囊 · 毛玻璃 + 光效
  &__label {
    position: absolute;
    // transform 由内联 style 控制（含 translateX(-50%) + rotate + skew）
    padding: 3px 10px;
    border-radius: 12px;
    font-size: 11px;
    font-weight: 500;
    color: #fff;
    white-space: nowrap;
    pointer-events: none;

    // 毛玻璃底色
    background: linear-gradient(
      135deg,
      rgba(0, 0, 0, 0.4) 0%,
      color-mix(in srgb, var(--label-color) 20%, transparent) 100%
    );
    backdrop-filter: blur(10px) saturate(1.3);
    -webkit-backdrop-filter: blur(10px) saturate(1.3);

    // 发光边框
    border: 1px solid color-mix(in srgb, var(--label-color) 30%, transparent);

    // 外发光
    box-shadow:
      0 0 6px color-mix(in srgb, var(--label-color) 25%, transparent),
      0 0 14px color-mix(in srgb, var(--label-color) 10%, transparent),
      0 1px 6px rgba(0, 0, 0, 0.35);

    // 顶部高光线
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 15%;
      right: 15%;
      height: 1px;
      background: linear-gradient(
        90deg,
        transparent,
        color-mix(in srgb, var(--label-color) 50%, white) 50%,
        transparent
      );
      border-radius: 1px;
    }
  }
}
</style>
