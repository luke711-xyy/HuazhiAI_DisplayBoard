<script setup lang="ts">
/**
 * SkillSubMenu.vue - 技能二级子菜单（上拉展开）
 *
 * 当技能图标被悬停时，子技能以独立毛玻璃胶囊的形式
 * 从图标上方向上依次展开。
 * 每个胶囊被悬停时，在右侧弹出详细描述浮窗。
 */
import type { SubSkill } from '@/types'
import { ref, watch } from 'vue'
import { useI18n } from '@/composables/useI18n'
import { useSettings } from '@/composables/useSettings'

const { t, locale } = useI18n()
const { deviceMode } = useSettings()

const props = defineProps<{
  subSkills: SubSkill[]
  /** 父技能名称 (i18n key) */
  parentNameKey: string
  categoryColor: string
  /** 外部高亮的子技能 ID（来自企业 hover），空数组表示无外部控制 */
  externalActiveIds?: string[]
  /** 展开方向：向上(默认) 或 向下 */
  direction?: 'up' | 'down'
}>()

/** 当前悬停的子技能 ID，用于控制描述浮窗显示 */
const hoveredSubSkillId = ref<string | null>(null)

// 外部高亮状态变化时（如点击不同公司），关闭已展开的详情浮窗
watch(() => props.externalActiveIds, () => {
  hoveredSubSkillId.value = null
})

/** 该子技能是否应被高亮（本地 hover 或外部指定） */
function isPillActive(subId: string): boolean {
  if (hoveredSubSkillId.value === subId) return true
  return props.externalActiveIds?.includes(subId) ?? false
}

/** 该子技能是否应变暗（外部有指定高亮列表，但此项不在列表中） */
function isDimmed(subId: string): boolean {
  if (!props.externalActiveIds || props.externalActiveIds.length === 0) return false
  return !props.externalActiveIds.includes(subId)
}

/** 本地 hover 的子技能数据（仅鼠标直接 hover 时显示详情弹窗） */
function getHoveredSubSkill(): SubSkill | undefined {
  if (!hoveredSubSkillId.value) return undefined
  return props.subSkills.find(s => s.id === hoveredSubSkillId.value)
}
</script>

<template>
  <div class="skill-submenu" :class="{ 'skill-submenu--down': direction === 'down', 'skill-submenu--en': locale === 'en' }" @mouseenter.stop @mouseleave.stop @click.stop>
    <!-- 垂直连接线 -->
    <div class="skill-submenu__stem" :style="{ '--stem-color': categoryColor }" />

    <!-- 子技能胶囊列表 (从下往上排列，最近的在最下方) -->
    <div
      v-for="(sub, index) in (direction === 'down' ? subSkills : [...subSkills].reverse())"
      :key="sub.id"
      class="skill-submenu__pill"
      :class="{
        'skill-submenu__pill--active': isPillActive(sub.id),
        'skill-submenu__pill--dimmed': isDimmed(sub.id),
      }"
      :style="{
        '--pill-color': categoryColor,
        'animation-delay': `${index * 60}ms`,
      }"
      @mouseenter="deviceMode === 'pc' ? (hoveredSubSkillId = sub.id) : undefined"
      @mouseleave="deviceMode === 'pc' ? (hoveredSubSkillId = null) : undefined"
      @click="deviceMode === 'mobile' ? (hoveredSubSkillId = hoveredSubSkillId === sub.id ? null : sub.id) : undefined"
    >
      <span class="skill-submenu__pill-dot" />
      <span class="skill-submenu__pill-text">{{ t(sub.nameKey) }}</span>
    </div>

    <!-- 详情描述浮窗（仅鼠标直接 hover 时展示） -->
    <Transition name="desc-fade">
      <div
        v-if="hoveredSubSkillId && getHoveredSubSkill()"
        :key="hoveredSubSkillId"
        class="skill-submenu__detail"
        :style="{ '--pill-color': categoryColor }"
      >
        <h4 class="skill-submenu__detail-title">
          {{ t(getHoveredSubSkill()!.nameKey) }}
        </h4>
        <p class="skill-submenu__detail-desc">
          {{ t(getHoveredSubSkill()!.descriptionKey) }}
        </p>
      </div>
    </Transition>
  </div>
</template>

<style scoped lang="scss">
.skill-submenu {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%) scale(var(--submenu-scale, 1));
  transform-origin: bottom center;
  z-index: var(--z-skill-submenu);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding-bottom: 6px; // 与图标之间的视觉间距，同时保持 hover 连续性

  // 垂直连接线（贯穿所有胶囊）
  &__stem {
    position: absolute;
    bottom: 0;
    left: 50%;
    width: 1px;
    height: 100%;
    transform: translateX(-50%);
    background: linear-gradient(
      to top,
      color-mix(in srgb, var(--stem-color) 40%, transparent),
      color-mix(in srgb, var(--stem-color) 15%, transparent)
    );
    pointer-events: none;
    z-index: -1;
  }

  // 子技能胶囊
  &__pill {
    position: relative;
    isolation: isolate;
    min-width: 120px;
    width: max-content;
    padding: 4px 14px;
    border-radius: 14px;
    white-space: nowrap;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;

    // 发光边框（白→彩色过渡）
    border: 1px solid color-mix(in srgb, var(--pill-color) 55%, rgba(255, 255, 255, 0.45));

    // 外发光（内层白色高光 → 外层彩色扩散）
    box-shadow:
      0 0 5px rgba(255, 255, 255, 0.2),
      0 0 12px color-mix(in srgb, var(--pill-color) 45%, transparent),
      0 0 26px color-mix(in srgb, var(--pill-color) 24%, transparent),
      0 0 48px color-mix(in srgb, var(--pill-color) 12%, transparent),
      0 2px 8px rgba(0, 0, 0, 0.3);

    // 入场动画
    animation: pill-rise 0.3s var(--ease-smooth) backwards;

    transition: all 0.2s var(--ease-smooth);

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
        rgba(0, 0, 0, 0.7) 0%,
        color-mix(in srgb, var(--pill-color) 28%, transparent) 80%
      );
      backdrop-filter: blur(12px) saturate(1.3);
      -webkit-backdrop-filter: blur(12px) saturate(1.3);
      transition: background 0.2s var(--ease-smooth);
    }

    // hover / active 增强发光 + 中心放大
    &:hover,
    &--active {
      transform: scale(1.12);
      border-color: color-mix(in srgb, var(--pill-color) 65%, rgba(255, 255, 255, 0.55));
      box-shadow:
        0 0 7px rgba(255, 255, 255, 0.3),
        0 0 16px color-mix(in srgb, var(--pill-color) 55%, transparent),
        0 0 36px color-mix(in srgb, var(--pill-color) 30%, transparent),
        0 0 60px color-mix(in srgb, var(--pill-color) 16%, transparent),
        0 2px 12px rgba(0, 0, 0, 0.35);
    }

    &:hover::after,
    &--active::after {
      background: linear-gradient(
        135deg,
        rgba(0, 0, 0, 0.55) 0%,
        color-mix(in srgb, var(--pill-color) 40%, transparent) 100%
      );
    }

    // 外部高亮时，非关联技能变暗
    &--dimmed {
      opacity: 0.55;
      box-shadow: none;

      // hover 时恢复正常亮度
      &:hover {
        opacity: 1;
      }
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
        color-mix(in srgb, var(--pill-color) 35%, white) 50%,
        transparent
      );
      border-radius: 1px;
      pointer-events: none;
    }
  }

  &__pill-dot {
    position: relative;
    z-index: 1;
    width: 5px;
    height: 5px;
    border-radius: 50%;
    flex-shrink: 0;
    background: var(--pill-color);
    opacity: 0.6;
    transition: all 0.2s var(--ease-smooth);

    .skill-submenu__pill--active &,
    .skill-submenu__pill:hover & {
      opacity: 1;
      box-shadow: 0 0 6px var(--pill-color);
    }
  }

  &__pill-text {
    position: relative;
    z-index: 1;
    font-size: 13px;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.85);
    transition: color 0.2s var(--ease-smooth), font-weight 0.2s var(--ease-smooth);

    .skill-submenu__pill--active &,
    .skill-submenu__pill:hover & {
      font-weight: 650;
      color: #fff;
    }

    .skill-submenu--en & {
      font-size: 10px;
      font-weight: 430;
    }

    .skill-submenu--en .skill-submenu__pill--active &,
    .skill-submenu--en .skill-submenu__pill:hover & {
      font-weight: 580;
    }
  }

  // 详情描述浮窗
  &__detail {
    position: absolute;
    isolation: isolate;
    left: calc(100% + 14px);
    top: 50%;
    transform: translateY(-50%);
    width: 260px;
    padding: 12px 14px;
    border-radius: 10px;

    border: 1px solid color-mix(in srgb, var(--pill-color) 60%, transparent);
    box-shadow:
      0 0 16px color-mix(in srgb, var(--pill-color) 40%, transparent),
      0 0 34px color-mix(in srgb, var(--pill-color) 22%, transparent),
      0 0 56px color-mix(in srgb, var(--pill-color) 10%, transparent),
      0 0 6px rgba(255, 255, 255, 0.06),
      0 8px 32px rgba(0, 0, 0, 0.5);

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
        rgba(5, 10, 25, 0.92) 0%,
        color-mix(in srgb, var(--pill-color) 12%, rgba(5, 10, 25, 0.92)) 100%
      );
      backdrop-filter: blur(20px) saturate(1.4);
      -webkit-backdrop-filter: blur(20px) saturate(1.4);
    }

    // 左侧高光线
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 10%;
      bottom: 10%;
      width: 1px;
      background: linear-gradient(
        180deg,
        transparent,
        color-mix(in srgb, var(--pill-color) 35%, white) 50%,
        transparent
      );
      border-radius: 1px;
    }

    &-title {
      position: relative;
      z-index: 1;
      font-size: 14px;
      font-weight: 500;
      color: #fff;
      margin-bottom: 6px;
      padding-bottom: 5px;
      border-bottom: 1px solid color-mix(in srgb, var(--pill-color) 20%, transparent);

      .skill-submenu--en & {
        font-size: 11px;
        font-weight: 430;
      }
    }

    &-desc {
      position: relative;
      z-index: 1;
      font-size: 12px;
      line-height: 1.7;
      color: rgba(255, 255, 255, 0.7);

      .skill-submenu--en & {
        font-size: 10px;
        font-weight: 400;
      }
    }
  }
}

// 向下展开变体
.skill-submenu--down {
  bottom: auto;
  top: calc(100% + var(--submenu-top-offset, 0px));
  padding-bottom: 0;
  padding-top: 6px;
  transform-origin: top center;

  .skill-submenu__stem {
    background: linear-gradient(
      to bottom,
      color-mix(in srgb, var(--stem-color) 40%, transparent),
      color-mix(in srgb, var(--stem-color) 15%, transparent)
    );
    bottom: auto;
    top: 0;
  }

  .skill-submenu__pill {
    animation-name: pill-drop;
  }

  // 详情浮窗保持在右侧（无需改变）
}

// 胶囊入场动画：从上方淡入下落
@keyframes pill-drop {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// 胶囊入场动画：从下方淡入上升
@keyframes pill-rise {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// 详情浮窗 transition
.desc-fade-enter-active,
.desc-fade-leave-active {
  transition: opacity 0.2s var(--ease-smooth),
              transform 0.2s var(--ease-smooth);
}

.desc-fade-enter-from,
.desc-fade-leave-to {
  opacity: 0;
  transform: translateY(-50%) translateX(-6px);
}
</style>
