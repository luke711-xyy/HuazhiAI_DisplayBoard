<script setup lang="ts">
/**
 * SettingsModal.vue - 设置下拉菜单
 *
 * 包含三项设置：
 * 1. 语言切换 (zh/en) - 真实功能
 * 2. 声音大小 - 架空 UI (滑块)
 * 3. 电脑/移动端模式 (开关) - 移动端模式下公司卡片需双击打开弹窗
 */
import { useI18n } from '@/composables/useI18n'
import { useSettings } from '@/composables/useSettings'

const { t, locale, setLocale } = useI18n()
const { soundVolume, deviceMode, hideBottomPanels, idleDemoEnabled } = useSettings()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'toggleIdleDemo'): void
}>()
</script>

<template>
  <div class="settings-modal" @click.stop>
    <h3 class="settings-modal__title">{{ t('settings.title') }}</h3>

    <!-- 语言切换 -->
    <div class="settings-modal__item">
      <span class="settings-modal__label">{{ t('settings.language') }}</span>
      <div class="settings-modal__lang-btns">
        <button
          :class="{ active: locale === 'zh' }"
          @click="setLocale('zh')"
        >
          {{ t('settings.chinese') }}
        </button>
        <button
          :class="{ active: locale === 'en' }"
          @click="setLocale('en')"
        >
          {{ t('settings.english') }}
        </button>
      </div>
    </div>

    <!-- 声音大小 (架空 UI) -->
    <div class="settings-modal__item">
      <span class="settings-modal__label">{{ t('settings.sound') }}</span>
      <input
        v-model="soundVolume"
        type="range"
        min="0"
        max="100"
        class="settings-modal__slider"
      />
    </div>

    <!-- 电脑/移动端模式 -->
    <div class="settings-modal__item">
      <span class="settings-modal__label">{{ t('settings.theme') }}</span>
      <button
        class="settings-modal__toggle"
        :class="{ 'settings-modal__toggle--light': deviceMode === 'mobile' }"
        @click="deviceMode = deviceMode === 'pc' ? 'mobile' : 'pc'"
      >
        <span class="settings-modal__toggle-knob" />
      </button>
    </div>

    <!-- 常闭底部列表 -->
    <div class="settings-modal__item">
      <span class="settings-modal__label">{{ t('settings.hideBottomPanels') }}</span>
      <button
        class="settings-modal__toggle"
        :class="{ 'settings-modal__toggle--light': hideBottomPanels }"
        @click="hideBottomPanels = !hideBottomPanels"
      >
        <span class="settings-modal__toggle-knob" />
      </button>
    </div>

    <!-- 待机演示 -->
    <div class="settings-modal__item">
      <span class="settings-modal__label">{{ t('settings.idleDemo') }}</span>
      <button
        class="settings-modal__toggle"
        :class="{ 'settings-modal__toggle--light': idleDemoEnabled }"
        @click="emit('toggleIdleDemo')"
      >
        <span class="settings-modal__toggle-knob" />
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.settings-modal {
  position: absolute;
  top: 60px;
  right: 40px;
  width: 260px;
  padding: 20px;
  border-radius: 12px;
  z-index: var(--z-settings);

  // 毛玻璃效果
  background: rgba(10, 15, 30, 0.9);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(100, 150, 255, 0.15);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.5);

  animation: fade-in-scale var(--duration-normal) var(--ease-smooth) both;

  &__title {
    font-size: 16px;
    font-weight: 600;
    color: var(--color-text-primary);
    margin-bottom: 20px;
    padding-bottom: 10px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  }

  &__item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  &__label {
    font-size: 13px;
    color: var(--color-text-secondary);
  }

  &__lang-btns {
    display: flex;
    gap: 4px;

    button {
      padding: 4px 12px;
      border-radius: 6px;
      font-size: 12px;
      color: var(--color-text-muted);
      background: rgba(255, 255, 255, 0.05);
      transition: all var(--duration-fast) var(--ease-smooth);

      &.active {
        color: var(--color-text-primary);
        background: var(--color-accent-blue);
      }

      &:hover:not(.active) {
        background: rgba(255, 255, 255, 0.1);
      }
    }
  }

  &__slider {
    width: 100px;
    accent-color: var(--color-accent-blue);
  }

  &__toggle {
    width: 44px;
    height: 24px;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.15);
    position: relative;
    transition: background var(--duration-normal) var(--ease-smooth);

    &--light {
      background: var(--color-accent-blue);
    }
  }

  &__toggle-knob {
    position: absolute;
    top: 3px;
    left: 3px;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: white;
    transition: transform var(--duration-normal) var(--ease-smooth);

    .settings-modal__toggle--light & {
      transform: translateX(20px);
    }
  }
}
</style>
