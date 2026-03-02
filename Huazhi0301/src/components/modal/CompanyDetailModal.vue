<script setup lang="ts">
/**
 * CompanyDetailModal.vue - 企业详情弹窗
 *
 * 对照设计图 "显示企业详情.png"，弹窗分三块：
 * 1. 顶部：公司简要信息 (名称、行业、类型)
 * 2. 中间：核心业务场景 (流程步骤 + 进度条)
 * 3. 底部：核心技能列表 (技能图标)
 */
import type { CompanyDetail, Skill } from '@/types'
import { computed } from 'vue'
import { useI18n } from '@/composables/useI18n'
import btnCloseUrl from '@/assets/buttons/btn_close.png'

const { t } = useI18n()

const props = defineProps<{
  detail: CompanyDetail
  skills: Skill[]
}>()

defineEmits<{
  (e: 'close'): void
}>()

/** 获取核心技能的完整数据 */
const coreSkillsData = computed(() => {
  return props.detail.coreSkills
    .map(skillId => props.skills.find(s => s.id === skillId))
    .filter((s): s is Skill => s !== undefined)
})

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
    <div class="modal-overlay" @click="$emit('close')">
      <div class="modal-content" @click.stop>
        <!-- 关闭按钮 -->
        <button class="modal-content__close" @click="$emit('close')">
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

        <!-- 2. 核心业务场景 -->
        <div class="modal-content__section">
          <h3 class="modal-content__section-title">{{ t('modal.coreScenario') }}</h3>
          <div class="modal-content__scenario-flow">
            <div
              v-for="(step, index) in detail.scenarioFlow"
              :key="index"
              class="scenario-step"
            >
              <div class="scenario-step__icon">
                <img
                  v-if="getSkillIconUrl(`ic_skill_${step.icon}`)"
                  :src="getSkillIconUrl(`ic_skill_${step.icon}`)"
                  alt=""
                />
              </div>
              <span class="scenario-step__label">{{ t(step.labelKey) }}</span>
              <!-- 步骤间连接线 -->
              <div v-if="index < detail.scenarioFlow.length - 1" class="scenario-step__connector" />
            </div>
          </div>
          <!-- 进度条 -->
          <div class="modal-content__progress">
            <div
              class="modal-content__progress-bar"
              :style="{ width: `${(detail.scenarioFlow.filter(s => s.progress && s.progress >= 100).length / detail.scenarioFlow.length) * 100}%` }"
            />
          </div>
        </div>

        <!-- 3. 核心技能列表 -->
        <div class="modal-content__section">
          <h3 class="modal-content__section-title">{{ t('modal.coreSkills') }}</h3>
          <div class="modal-content__skills">
            <div
              v-for="skill in coreSkillsData"
              :key="skill.id"
              class="skill-badge"
            >
              <img :src="getSkillIconUrl(skill.icon)" alt="" class="skill-badge__icon" />
              <span class="skill-badge__name">{{ t(skill.nameKey) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped lang="scss">
.modal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: var(--z-modal);
}

.modal-content {
  width: 580px;
  max-height: 520px;
  border-radius: 16px;
  padding: 32px;
  position: relative;
  overflow-y: auto;

  // 毛玻璃效果
  background: rgba(10, 15, 30, 0.92);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(100, 150, 255, 0.15);
  box-shadow:
    0 16px 64px rgba(0, 0, 0, 0.5),
    0 0 24px rgba(59, 130, 246, 0.1);

  &__close {
    position: absolute;
    top: 16px;
    right: 16px;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all var(--duration-fast) var(--ease-smooth);

    img {
      width: 20px;
      height: 20px;
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
    font-size: 22px;
    font-weight: 700;
    color: var(--color-text-primary);
    margin-bottom: 8px;
  }

  &__meta {
    font-size: 13px;
    color: var(--color-text-secondary);
    display: flex;
    align-items: center;
    gap: 8px;
  }

  &__divider {
    color: var(--color-text-muted);
  }

  &__section {
    margin-bottom: 20px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  &__section-title {
    font-size: 14px;
    font-weight: 600;
    color: var(--color-text-primary);
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 8px;

    &::before {
      content: '';
      display: block;
      width: 3px;
      height: 14px;
      border-radius: 2px;
      background: var(--color-accent-blue);
    }
  }

  &__scenario-flow {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0;
    margin-bottom: 12px;
  }

  &__progress {
    width: 100%;
    height: 6px;
    border-radius: 3px;
    background: rgba(255, 255, 255, 0.08);
    overflow: hidden;
  }

  &__progress-bar {
    height: 100%;
    border-radius: 3px;
    background: linear-gradient(90deg, var(--color-accent-blue), var(--color-accent-cyan));
    transition: width var(--duration-slow) var(--ease-smooth);
  }

  &__skills {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
  }
}

.scenario-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
  position: relative;

  &__icon {
    width: 40px;
    height: 40px;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.06);
    display: flex;
    align-items: center;
    justify-content: center;

    img {
      width: 32px;
      height: 32px;
      object-fit: contain;
    }
  }

  &__label {
    font-size: 11px;
    color: var(--color-text-secondary);
    white-space: nowrap;
  }

  &__connector {
    position: absolute;
    top: 20px;
    left: calc(100%);
    width: 24px;
    height: 2px;
    background: rgba(59, 130, 246, 0.3);

    &::after {
      content: '';
      position: absolute;
      right: -3px;
      top: -2px;
      border: 3px solid transparent;
      border-left-color: rgba(59, 130, 246, 0.3);
    }
  }
}

.skill-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);

  &__icon {
    width: 24px;
    height: 24px;
    object-fit: contain;
  }

  &__name {
    font-size: 12px;
    color: var(--color-text-secondary);
  }
}
</style>
