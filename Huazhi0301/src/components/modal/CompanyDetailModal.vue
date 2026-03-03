<script setup lang="ts">
/**
 * CompanyDetailModal.vue - 企业详情弹窗
 *
 * 对照设计图 "显示企业详情.png"，弹窗分三块：
 * 1. 顶部：公司简要信息 (名称、行业、类型)
 * 2. 中间：核心业务场景 (流程步骤 + 进度条)
 * 3. 底部：核心技能列表 (技能图标)
 *
 * 根据企业状态 (reserve/implementation/promotion) 使用对应的配色主题
 */
import type { CompanyDetail, CompanyStatus, Skill } from '@/types'
import { computed, ref, onMounted } from 'vue'
import { useI18n } from '@/composables/useI18n'
import btnCloseUrl from '@/assets/buttons/btn_close.png'

const { t } = useI18n()

const props = defineProps<{
  detail: CompanyDetail
  skills: Skill[]
  status: CompanyStatus
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

/** 进度条目标宽度百分比 */
const progressPercent = computed(() => {
  const flow = props.detail.scenarioFlow
  const completed = flow.filter(s => s.progress && s.progress >= 100).length
  return (completed / flow.length) * 100
})

/** 进度条填充动画：先 0，挂载后设置为目标值 */
const animatedWidth = ref(0)
onMounted(() => {
  // 延迟一帧让初始 width:0 渲染，然后触发 CSS transition 填充
  requestAnimationFrame(() => {
    animatedWidth.value = progressPercent.value
  })
})

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
      <div
        class="modal-content"
        :style="{
          '--accent-from': accentColors.from,
          '--accent-to': accentColors.to,
        }"
        @click.stop
      >
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
              <!-- 步骤间箭头连接线（独立 flex 子元素，不重叠） -->
              <div v-if="index < detail.scenarioFlow.length - 1" class="scenario-connector" />
            </template>
          </div>
          <!-- 进度条 -->
          <div class="modal-content__progress">
            <div
              class="modal-content__progress-bar"
              :style="{ width: `${animatedWidth}%` }"
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
  isolation: isolate;

  // 边框使用主题色发光
  border: 1px solid color-mix(in srgb, var(--accent-from) 25%, transparent);
  box-shadow:
    0 16px 64px rgba(0, 0, 0, 0.5),
    0 0 24px color-mix(in srgb, var(--accent-from) 15%, transparent);

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

  // 小节标题左侧竖条使用主题色
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
      background: var(--accent-from);
    }
  }

  &__scenario-flow {
    display: flex;
    align-items: flex-start;
    justify-content: center;
    gap: 16px;
    margin-bottom: 16px;
  }

  &__progress {
    width: 100%;
    height: 6px;
    border-radius: 3px;
    background: rgba(255, 255, 255, 0.08);
    overflow: hidden;
  }

  // 进度条：填充动画 + 流光效果，使用主题色
  &__progress-bar {
    height: 100%;
    border-radius: 3px;
    background: linear-gradient(90deg, var(--accent-from), var(--accent-to));
    // 从 0 宽度过渡到目标宽度，产生填充动画
    transition: width 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    position: relative;
    overflow: hidden;

    // 流光效果（在填充过程中同时运行）
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
  gap: 6px;

  &__icon {
    width: 40px;
    height: 40px;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.06);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

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
}

// 步骤间箭头连接线 — 使用主题色
.scenario-connector {
  width: 32px;
  height: 2px;
  flex-shrink: 0;
  margin-top: 19px; // 与图标垂直中心对齐 (40px / 2 - 1px)
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

// 技能徽章 — 边框使用主题色微光
.skill-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid color-mix(in srgb, var(--accent-from) 15%, rgba(255, 255, 255, 0.08));

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
