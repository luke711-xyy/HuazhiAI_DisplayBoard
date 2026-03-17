<script setup lang="ts">
/**
 * CompanyDetailModal.vue - 企业详情弹窗
 *
 * 弹窗分五块：
 * 1. 顶部：公司简要信息 (名称、行业、类型)
 * 2. 公司简介：来自 JSON 配置的公司背景介绍
 * 3. 核心业务场景：流程步骤图标
 * 4. 核心技能列表：技能徽章
 * 5. 合作推进进度：进度条 + 进展说明文字
 *
 * 根据企业状态 (reserve/implementation/promotion) 使用对应的配色主题
 */
import type { CompanyDetail, CompanyStatus, Skill } from '@/types'
import { computed, ref, reactive } from 'vue'
import { useI18n } from '@/composables/useI18n'
import { useSettings } from '@/composables/useSettings'
import btnCloseUrl from '@/assets/buttons/btn_close.png'

const { t, locale } = useI18n()
const { deviceMode } = useSettings()

const props = defineProps<{
  detail: CompanyDetail
  skills: Skill[]
  status: CompanyStatus
  /** 合作推进进度 (0-100)，来自 Company.progress */
  progress: number
}>()

defineEmits<{
  (e: 'close'): void
}>()

/** 状态 → 配色映射 */
const statusColorMap: Record<CompanyStatus, { from: string; to: string }> = {
  reserve:        { from: '#3b82f6', to: '#60a5fa' },   // 蓝
  implementation: { from: '#f59e0b', to: '#fbbf24' },   // 橙
  promotion:      { from: '#ef4444', to: '#f87171' },   // 红
}

const accentColors = computed(() => statusColorMap[props.status])

/** 场景分类 → 颜色映射（与主页面 skillCategories.color 保持一致） */
const categoryColorMap: Record<string, string> = {
  assembly:    '#3B82F6',
  inspection:  '#22D3EE',
  palletizing: '#8B5CF6',
}

/** 解析后的三级技能徽章数据 */
interface ResolvedSubSkill {
  id: string
  nameKey: string
  descriptionKey: string
  categoryId: string
  parentIcon: string
}

/** 构建 subSkillId → { subSkill + 父级分类/图标 } 的查找表 */
const subSkillLookup = computed(() => {
  const map = new Map<string, ResolvedSubSkill>()
  for (const skill of props.skills) {
    if (!skill.subSkills) continue
    for (const sub of skill.subSkills) {
      map.set(sub.id, {
        id: sub.id,
        nameKey: sub.nameKey,
        descriptionKey: sub.descriptionKey,
        categoryId: skill.categoryId,
        parentIcon: skill.icon,
      })
    }
  }
  return map
})

/** 获取核心三级技能的完整数据 */
const coreSubSkillsData = computed(() => {
  return props.detail.coreSkills
    .map(id => subSkillLookup.value.get(id))
    .filter((s): s is ResolvedSubSkill => s !== undefined)
})

function getBadgeColor(sub: ResolvedSubSkill): string {
  return categoryColorMap[sub.categoryId] ?? '#3B82F6'
}

/** 当前悬停的技能徽章 ID + 浮层定位 */
const hoveredBadgeId = ref<string | null>(null)
const tooltipPos = reactive({ top: 0, left: 0 })

/** 悬停的三级技能数据（用于 Teleport 浮层） */
const hoveredSubSkill = computed(() => {
  if (!hoveredBadgeId.value) return null
  return subSkillLookup.value.get(hoveredBadgeId.value) ?? null
})

/** 悬停技能的分类颜色 */
const hoveredBadgeColor = computed(() => {
  if (!hoveredSubSkill.value) return '#3B82F6'
  return getBadgeColor(hoveredSubSkill.value)
})

function onBadgeEnter(sub: ResolvedSubSkill, event: MouseEvent) {
  hoveredBadgeId.value = sub.id
  const el = (event.currentTarget as HTMLElement)
  const rect = el.getBoundingClientRect()
  tooltipPos.top = rect.bottom + 10
  tooltipPos.left = rect.left + rect.width / 2
}

/** 移动端：触摸徽章切换浮层（使用 touchend 绕过合成 click 链路） */
function onBadgeTouch(sub: ResolvedSubSkill, event: Event) {
  const el = event.currentTarget as HTMLElement
  if (hoveredBadgeId.value === sub.id) {
    hoveredBadgeId.value = null
  } else {
    hoveredBadgeId.value = sub.id
    if (el) {
      const rect = el.getBoundingClientRect()
      tooltipPos.top = rect.bottom + 10
      tooltipPos.left = rect.left + rect.width / 2
    }
  }
}

/** 动态加载技能图标 */
const skillIcons = import.meta.glob('@/assets/skills/*.png', { eager: true, import: 'default' }) as Record<string, string>

function getSkillIconUrl(iconName: string): string {
  for (const [path, url] of Object.entries(skillIcons)) {
    if (path.includes(`/${iconName}.png`) && !path.includes('@2x') && !path.includes('_select')) return url
  }
  return ''
}
</script>

<template>
  <!-- 遮罩层 -->
  <Transition name="modal">
    <div class="modal-overlay" @click="$emit('close')" @touchend.prevent.self="$emit('close')">
      <div
        class="modal-content"
        :class="{ 'modal-content--en': locale === 'en' }"
        :style="{
          '--accent-from': accentColors.from,
          '--accent-to': accentColors.to,
        }"
        @click.stop="hoveredBadgeId = null"
        @touchend="hoveredBadgeId = null"
      >
        <!-- 关闭按钮 -->
        <button class="modal-content__close" @click="$emit('close')" @touchend.prevent.stop="$emit('close')">
          <img :src="btnCloseUrl" alt="close" />
        </button>

        <!-- 1. 公司简要信息 -->
        <div class="modal-content__header">
          <h2 class="modal-content__name">{{ t(detail.briefInfoKeys.name) }}</h2>
          <div class="modal-content__meta">
            <span>{{ t('modal.industry') }}: {{ t(detail.briefInfoKeys.industry) }}</span>
            <span class="modal-content__divider">|</span>
            <span>{{ t('modal.type') }}: {{ t(detail.briefInfoKeys.type) }}</span>
          </div>
        </div>

        <!-- 2. 公司简介 -->
        <div class="modal-content__section">
          <h3 class="modal-content__section-title">{{ t('modal.briefDesc') }}</h3>
          <p class="modal-content__brief-text">{{ t(detail.briefDescKey) }}</p>
        </div>

        <!-- 3. 核心业务场景 -->
        <div class="modal-content__section">
          <h3 class="modal-content__section-title">{{ t('modal.coreScenario') }}</h3>
          <div class="modal-content__scenario-flow">
            <template v-for="(step, index) in detail.scenarioFlow" :key="index">
              <div class="scenario-step">
                <div class="scenario-step__icon">
                  <img
                    v-if="getSkillIconUrl(`ic_skill_${step.icon}`)"
                    :src="getSkillIconUrl(`ic_skill_${step.icon}`)"
                    alt=""
                  />
                </div>
                <span class="scenario-step__label">{{ t(step.labelKey) }}</span>
              </div>
              <div v-if="index < detail.scenarioFlow.length - 1" class="scenario-connector" />
            </template>
          </div>
        </div>

        <!-- 4. 核心技能列表 -->
        <div class="modal-content__section">
          <h3 class="modal-content__section-title">{{ t('modal.coreSkills') }}</h3>
          <div class="modal-content__skills">
            <div
              v-for="sub in coreSubSkillsData"
              :key="sub.id"
              class="skill-badge"
              :style="{ '--badge-color': getBadgeColor(sub) }"
              @mouseenter="deviceMode === 'pc' ? onBadgeEnter(sub, $event) : undefined"
              @mouseleave="deviceMode === 'pc' ? (hoveredBadgeId = null) : undefined"
              @touchend.prevent.stop="onBadgeTouch(sub, $event)"
              @click.stop
            >
              <img :src="getSkillIconUrl(sub.parentIcon)" alt="" class="skill-badge__icon" />
              <span class="skill-badge__name">{{ t(sub.nameKey) }}</span>
            </div>
          </div>
        </div>

        <!-- 5. 合作推进进度 -->
        <div class="modal-content__section">
          <h3 class="modal-content__section-title">{{ t('modal.progressTitle') }}</h3>
          <div class="modal-content__progress-section">
            <div class="modal-content__progress">
              <div
                class="modal-content__progress-bar"
                :style="{ width: `${progress}%` }"
              />
            </div>
            <span class="modal-content__progress-value">{{ progress }}%</span>
          </div>
          <p class="modal-content__progress-note">{{ t(detail.progressNoteKey) }}</p>
        </div>
      </div>
    </div>
  </Transition>

  <!-- 技能详情浮层 — Teleport 到 body，独立于弹窗层级 -->
  <Teleport to="body">
    <Transition name="badge-tip">
      <div
        v-if="hoveredSubSkill"
        class="skill-badge-floating-tip"
        :style="{
          top: tooltipPos.top + 'px',
          left: tooltipPos.left + 'px',
          '--badge-color': hoveredBadgeColor,
        }"
      >
        <h4 class="skill-badge-floating-tip__title">{{ t(hoveredSubSkill.nameKey) }}</h4>
        <p class="skill-badge-floating-tip__desc">{{ t(hoveredSubSkill.descriptionKey) }}</p>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped lang="scss">
.modal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(1px) saturate(0.8);
  -webkit-backdrop-filter: blur(8px) saturate(0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: var(--z-modal);
}

.modal-content {
  width: 820px;
  max-height: 880px;
  border-radius: 20px;
  padding: 44px;
  position: relative;
  overflow-y: auto;
  isolation: isolate;

  // 边框使用主题色发光
  border: 1.5px solid color-mix(in srgb, var(--accent-from) 70%, transparent);
  box-shadow:
    0 16px 64px rgba(0, 0, 0, 0.5),
    0 0 40px color-mix(in srgb, var(--accent-from) 50%, transparent),
    0 0 80px color-mix(in srgb, var(--accent-from) 30%, transparent),
    0 0 120px color-mix(in srgb, var(--accent-from) 15%, transparent),
    inset 0 0 40px color-mix(in srgb, var(--accent-from) 12%, transparent);

  // 毛玻璃背景层（伪元素，位于内容之下，不影响文字渲染）
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    z-index: -1;
    border-radius: inherit;
    pointer-events: none;
    background: rgba(10, 15, 30, 0.55);
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
  }

  &__close {
    position: absolute;
    top: 12px;
    right: 12px;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all var(--duration-fast) var(--ease-smooth);

    img {
      width: 34px;
      height: 34px;
    }

    &:hover {
      background: rgba(255, 255, 255, 0.1);
      transform: scale(1.1);
    }
  }

  &__header {
    margin-bottom: 24px;
    padding-bottom: 16px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  }

  &__name {
    font-size: 30px;
    font-weight: 700;
    color: var(--color-text-primary);
    margin-bottom: 8px;
  }

  &__meta {
    font-size: 17px;
    font-weight: 500;
    color: #b8c5d6;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  &__divider {
    color: var(--color-text-muted);
  }

  &__section {
    margin-bottom: 26px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  // 小节标题左侧竖条使用主题色
  &__section-title {
    font-size: 20px;
    font-weight: 600;
    color: var(--color-text-primary);
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 10px;

    &::before {
      content: '';
      display: block;
      width: 4px;
      height: 18px;
      border-radius: 2px;
      background: var(--accent-from);
    }
  }

  &__brief-text {
    font-size: 16px;
    font-weight: 500;
    line-height: 1.8;
    color: #b8c5d6;
    margin: 0;
  }

  &__scenario-flow {
    display: flex;
    align-items: flex-start;
    justify-content: center;
    gap: 16px;
  }

  &__progress-section {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 8px;
  }

  &__progress {
    flex: 1;
    height: 8px;
    border-radius: 4px;
    background: rgba(255, 255, 255, 0.08);
    overflow: hidden;
  }

  &__progress-bar {
    height: 100%;
    border-radius: 3px;
    background: linear-gradient(90deg, var(--accent-from), var(--accent-to));
    transition: width 1s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    position: relative;
    overflow: hidden;

    &::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(
        90deg,
        transparent 0%,
        rgba(255, 255, 255, 0.35) 45%,
        rgba(255, 255, 255, 0.5) 50%,
        rgba(255, 255, 255, 0.35) 55%,
        transparent 100%
      );
      animation: progress-flow 2.5s ease-in-out infinite;
    }
  }

  &__progress-value {
    font-size: 17px;
    font-weight: 600;
    color: var(--accent-from);
    flex-shrink: 0;
    min-width: 36px;
    text-align: right;
  }

  &__progress-note {
    font-size: 15px;
    font-weight: 500;
    line-height: 1.7;
    color: #8a9bb5;
    margin: 0;
  }

  &__skills {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
  }

  // 英文版：弹窗更大，字号稍小
  &--en {
    width: 880px;
    max-height: 900px;

    .modal-content__name { font-size: 26px; }
    .modal-content__meta { font-size: 14px; }
    .modal-content__section-title { font-size: 17px; }
    .modal-content__brief-text { font-size: 14px; }
    .modal-content__progress-value { font-size: 15px; }
    .modal-content__progress-note { font-size: 13px; }
    .scenario-step__label { font-size: 13px; }
    .skill-badge__name { font-size: 13px; }
  }
}

.scenario-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;

  &__icon {
    width: 52px;
    height: 52px;
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.06);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    img {
      width: 40px;
      height: 40px;
      object-fit: contain;
    }
  }

  &__label {
    font-size: 15px;
    font-weight: 500;
    color: #b8c5d6;
    white-space: nowrap;
  }
}

// 步骤间箭头连接线 — 使用主题色
.scenario-connector {
  width: 32px;
  height: 2px;
  flex-shrink: 0;
  margin-top: 25px; // 与图标垂直中心对齐 (52px / 2 - 1px)
  background: linear-gradient(
    90deg,
    color-mix(in srgb, var(--accent-from) 30%, transparent),
    color-mix(in srgb, var(--accent-from) 60%, transparent)
  );
  position: relative;

  // 箭头尖端
  &::after {
    content: '';
    position: absolute;
    right: -4px;
    top: 50%;
    transform: translateY(-50%);
    border: 4px solid transparent;
    border-left-color: color-mix(in srgb, var(--accent-from) 60%, transparent);
  }
}

// 进度条流光动画
@keyframes progress-flow {
  0% { transform: translateX(-200%); }
  100% { transform: translateX(200%); }
}

// 技能徽章 — 按所属场景分类颜色区分边框 + 辉光
.skill-badge {
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 18px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid color-mix(in srgb, var(--badge-color) 30%, transparent);
  box-shadow: 0 0 8px color-mix(in srgb, var(--badge-color) 12%, transparent);
  cursor: pointer;
  transition: all 0.25s ease;

  &:hover {
    border-color: color-mix(in srgb, var(--badge-color) 55%, transparent);
    box-shadow:
      0 0 10px color-mix(in srgb, var(--badge-color) 20%, transparent),
      0 0 24px color-mix(in srgb, var(--badge-color) 10%, transparent);
    background: color-mix(in srgb, var(--badge-color) 8%, transparent);
  }

  &__icon {
    width: 30px;
    height: 30px;
    object-fit: contain;
  }

  &__name {
    font-size: 16px;
    font-weight: 500;
    color: #b8c5d6;
  }

}
</style>

<!-- 全局样式：Teleport 到 body 的浮层不受 scoped 限制 -->
<style lang="scss">
.skill-badge-floating-tip {
  position: fixed;
  transform: translateX(-50%);
  max-width: 400px;
  min-width: 220px;
  padding: 16px 18px;
  border-radius: 12px;
  background:
    linear-gradient(
      135deg,
      rgba(5, 10, 25, 0.92),
      color-mix(in srgb, var(--badge-color) 12%, rgba(5, 10, 25, 0.88))
    );
  backdrop-filter: blur(20px) saturate(1.4);
  -webkit-backdrop-filter: blur(20px) saturate(1.4);
  border: 1px solid color-mix(in srgb, var(--badge-color) 25%, transparent);
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.4),
    0 0 12px color-mix(in srgb, var(--badge-color) 15%, transparent);
  z-index: 99999;
  pointer-events: none;

  // 顶部小三角
  &::before {
    content: '';
    position: absolute;
    top: -5px;
    left: 50%;
    transform: translateX(-50%) rotate(45deg);
    width: 10px;
    height: 10px;
    background: rgba(5, 10, 25, 0.92);
    border-top: 1px solid color-mix(in srgb, var(--badge-color) 25%, transparent);
    border-left: 1px solid color-mix(in srgb, var(--badge-color) 25%, transparent);
  }

  &__title {
    font-size: 16px;
    font-weight: 600;
    color: #fff;
    margin-bottom: 8px;
    padding-bottom: 6px;
    border-bottom: 1px solid color-mix(in srgb, var(--badge-color) 20%, transparent);
  }

  &__desc {
    font-size: 14px;
    line-height: 1.7;
    color: rgba(255, 255, 255, 0.7);
    margin: 0;
  }
}

// 徽章浮层过渡动画
.badge-tip-enter-active,
.badge-tip-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.badge-tip-enter-from,
.badge-tip-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-4px);
}
</style>
