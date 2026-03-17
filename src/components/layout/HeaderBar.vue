<script setup lang="ts">
/**
 * HeaderBar.vue - 顶部导航栏
 * 左侧: HUAZHI AI Logo
 * 中间: 标题 "联创 · 联拓 · 联营"
 * 右侧: 设置齿轮按钮
 */
import logoUrl from '@/assets/logo/huazhi_logo.png'
import settingUrl from '@/assets/icons/ic-setting.png'
import { useI18n } from '@/composables/useI18n'

const { t, locale } = useI18n()

defineEmits<{
  (e: 'toggleSettings'): void
}>()

defineProps<{
  title: string
}>()
</script>

<template>
  <header class="header-bar">
    <!-- 左侧 Logo + 机构名称 -->
    <div class="header-bar__logo">
      <img :src="logoUrl" alt="HUAZHI AI" class="header-bar__logo-img" />
      <span class="header-bar__logo-divider" />
      <span class="header-bar__logo-text" :class="{ 'header-bar__logo-text--en': locale === 'en' }">{{ t('app.logoText') }}</span>
    </div>

    <!-- 中间标题 -->
    <h1 class="header-bar__title" :class="{ 'header-bar__title--en': locale === 'en' }">{{ title }}</h1>

    <!-- 右侧设置按钮 -->
    <button class="header-bar__settings hover-lift" @click="$emit('toggleSettings')">
      <img :src="settingUrl" alt="settings" />
    </button>
  </header>
</template>

<style scoped lang="scss">
.header-bar {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 40px;
  z-index: var(--z-header);
  pointer-events: none;

  > * {
    pointer-events: auto;
  }

  &__logo {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-top: 30px;
  }

  &__logo-img {
    height: 64px;
    width: auto;
  }

  &__logo-divider {
    width: 2px;
    height: 28px;
    background: rgba(255, 255, 255, 0.6);
    flex-shrink: 0;
    margin-top: -5px;
  }

  &__logo-text {
    font-size: 20px;
    font-weight: 500;
    color: #fff;
    white-space: nowrap;
    letter-spacing: 2px;
    padding-bottom: 10px;
    padding-left: 10px;

    &--en {
      white-space: pre-line;
      text-align: center;
      font-size: 16px;
      font-weight: 400;
      letter-spacing: 1px;
      line-height: 1.4;
    }
  }

  &__title {
    position: absolute;
    top: 30px;
    left: 50%;
    transform: translateX(calc(-50% + 6px));
    font-size: 40px;
    font-weight: 600;
    letter-spacing: 14px;
    color: var(--color-text-primary);
    white-space: nowrap;

    &--en {
      letter-spacing: 4px;
      font-size: 28px;
      font-weight: 650;
    }
  }

  &__settings {
    width: 52px;
    height: 52px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2px;
    margin-top: 20px;
    margin-right: 15px;

    img {
      width: 48px;
      height: 48px;
    }
  }
}
</style>
