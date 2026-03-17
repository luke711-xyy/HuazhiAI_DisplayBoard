<script setup lang="ts">
/**
 * BottomPanel.vue - 底部信息面板
 * 对应一种企业状态（储备中/实施中/推广中），展示该状态下的企业列表
 * 内部列表可滚动 (Scrollable)，企业可点击打开详情弹窗
 */
import type { Company, KpiIndicator } from '@/types'
import GlassPanel from '@/components/common/GlassPanel.vue'
import { useI18n } from '@/composables/useI18n'

const { t } = useI18n()

const props = defineProps<{
  kpi: KpiIndicator
  companies: Company[]
}>()

defineEmits<{
  (e: 'clickCompany', companyId: string): void
}>()
</script>

<template>
  <GlassPanel class="bottom-panel" variant="dark" padding="0" :style="{ '--panel-color': kpi.color }">
    <!-- 标题栏 -->
    <div class="bottom-panel__header" :style="{ borderColor: props.kpi.color }">
      <span class="bottom-panel__dot-lg" :style="{ background: props.kpi.color }" />
      <span class="bottom-panel__title">{{ t(kpi.labelKey) }}</span>
      <span class="bottom-panel__count">{{ companies.length }}</span>
    </div>

    <!-- 可滚动企业列表 -->
    <div class="bottom-panel__list scrollable">
      <div
        v-for="company in companies"
        :key="company.id"
        class="bottom-panel__item"
        @click="$emit('clickCompany', company.id)"
      >
        <span class="bottom-panel__dot" :style="{ background: kpi.color }" />
        <span class="bottom-panel__company-name">{{ t(company.nameKey) }}</span>
        <span class="bottom-panel__progress" :style="{ '--progress': company.progress / 100 }">
          <span class="bottom-panel__progress-fill" :style="{ '--bar-color': kpi.color }" />
        </span>
        <span class="bottom-panel__company-type">{{ company.type }}</span>
      </div>

      <!-- 空状态 -->
      <div v-if="companies.length === 0" class="bottom-panel__empty">
        暂无数据
      </div>
    </div>
  </GlassPanel>
</template>

<style scoped lang="scss">
.bottom-panel {
  width: 400px;
  height: 160px;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  // 主题色边框 + 外光晕
  border: 1.5px solid color-mix(in srgb, var(--panel-color) 55%, transparent) !important;
  box-shadow:
    0 0 18px color-mix(in srgb, var(--panel-color) 35%, transparent),
    0 0 40px color-mix(in srgb, var(--panel-color) 20%, transparent),
    0 0 70px color-mix(in srgb, var(--panel-color) 10%, transparent),
    0 4px 24px rgba(0, 0, 0, 0.4) !important;

  &__header {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 20px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    flex-shrink: 0;
    position: relative;
  }

  &__dot-lg {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  &__title {
    font-size: 17px;
    font-weight: 600;
    color: var(--color-text-primary);
    flex: 1;
  }

  &__count {
    font-size: 15px;
    color: var(--color-text-muted);
    flex-shrink: 0;
  }

  &__list {
    flex: 1;
    padding: 10px 20px;
    overflow-y: auto;
  }

  &__item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.04);
    cursor: pointer;
    transition: background 0.15s var(--ease-smooth);

    &:hover {
      background: rgba(255, 255, 255, 0.06);
    }

    &:last-child {
      border-bottom: none;
    }
  }

  &__dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  &__company-name {
    flex: 1;
    font-size: 16px;
    font-weight: 500;
    color: #b8c5d6;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__progress {
    width: 56px;
    height: 5px;
    border-radius: 2px;
    background: rgba(255, 255, 255, 0.08);
    flex-shrink: 0;
    overflow: hidden;
  }

  &__progress-fill {
    display: block;
    width: calc(var(--progress) * 100%);
    height: 100%;
    border-radius: 2px;
    background: var(--bar-color);
    transition: width 0.6s var(--ease-smooth);
  }

  &__company-type {
    width: 50px;
    font-size: 13px;
    color: var(--color-text-muted);
    flex-shrink: 0;
    text-align: right;
  }

  &__empty {
    text-align: center;
    padding: 24px;
    font-size: 13px;
    color: var(--color-text-muted);
  }
}
</style>
