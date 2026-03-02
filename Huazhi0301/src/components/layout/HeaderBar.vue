<script setup lang="ts">
/**
 * HeaderBar.vue - 顶部导航栏
 * 左侧: HUAZHI AI Logo
 * 中间: 标题 "联创 · 联拓 · 联营"
 * 右侧: 设置齿轮按钮
 */
import logoUrl from '@/assets/logo/huazhi_logo.png'
import settingUrl from '@/assets/icons/ic-setting.png'

defineEmits<{
  (e: 'toggleSettings'): void
}>()

defineProps<{
  title: string
}>()
</script>

<template>
  <header class="header-bar">
    <!-- 左侧 Logo -->
    <div class="header-bar__logo">
      <img :src="logoUrl" alt="HUAZHI AI" class="header-bar__logo-img" />
    </div>

    <!-- 中间标题 -->
    <h1 class="header-bar__title">{{ title }}</h1>

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
  }

  &__logo-img {
    height: 36px;
    width: auto;
  }

  &__title {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    font-size: 26px;
    font-weight: 700;
    letter-spacing: 8px;
    color: var(--color-text-primary);
    white-space: nowrap;
  }

  &__settings {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 6px;

    img {
      width: 24px;
      height: 24px;
    }
  }
}
</style>
