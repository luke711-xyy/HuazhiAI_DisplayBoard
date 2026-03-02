<script setup lang="ts">
/**
 * SkillNode.vue - 单个技能图标节点
 *
 * 显示在 3D 等距平台上层，支持默认/选中态图标切换。
 * hover 时：
 *   1. 切换到选中态图标
 *   2. 展开二级子技能菜单 (SkillSubMenu)
 * 图标下方显示技能名称文字标签。
 */
import type { Skill } from '@/types'
import { ref, computed, inject, onMounted } from 'vue'
import SkillSubMenu from './SkillSubMenu.vue'

const props = defineProps<{
  skill: Skill
  isHighlighted: boolean
  categoryColor: string
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

const iconUrl = computed(() => {
  const iconName = (isHovered.value || props.isHighlighted) ? props.skill.iconSelect : props.skill.icon
  for (const [path, url] of Object.entries(skillIcons)) {
    if (path.includes(`/${iconName}.png`) && !path.includes('@2x')) return url
  }
  return ''
})

/** 是否展示二级子菜单 */
const showSubMenu = computed(() => {
  return isHovered.value && props.skill.subSkills && props.skill.subSkills.length > 0
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
    :class="{ 'skill-node--highlighted': isHighlighted, 'skill-node--hovered': isHovered }"
    :data-skill-id="skill.id"
    @mouseenter="isHovered = true; $emit('hover', skill.id)"
    @mouseleave="isHovered = false; $emit('hover', null)"
  >
    <img :src="iconUrl" :alt="skill.nameKey" class="skill-node__icon" />

    <!-- 二级子技能菜单 -->
    <SkillSubMenu
      v-if="showSubMenu"
      :sub-skills="skill.subSkills!"
      :parent-name-key="skill.nameKey"
      :category-color="categoryColor"
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

  &:hover,
  &--highlighted {
    transform: scale(1.15);
    filter: brightness(1.3) drop-shadow(0 0 8px rgba(59, 130, 246, 0.6));
    z-index: calc(var(--z-skill-nodes) + 10);
  }

  &__icon {
    width: 106px;
    height: 106px;
    object-fit: contain;
  }

}
</style>
