<script setup lang="ts">
/**
 * CompanyCard.vue - 单个企业方块卡片
 * 使用 cube 切图素材作为背景，公司名叠加在方块上
 *
 * 三种状态对应不同的 cube 图片:
 * - reserve (储备中): cube_company_chubei_hover.png (蓝色)
 * - implementation (实施中): cube_company_shishi.png (橙色)
 * - promotion (推广中): cube_company_tuiguang.png (红粉色)
 *
 * hover 时切换到 _hover 变体并触发连线
 */
import type { Company } from '@/types'
import { ref, computed, inject, onMounted, onUnmounted } from 'vue'
import { useSettings } from '@/composables/useSettings'

const { deviceMode } = useSettings()

// 预加载所有 cube 图片
import cubeChubei from '@/assets/cubes/cube_company_chubei_hover.png'
import cubeShishi from '@/assets/cubes/cube_company_shishi.png'
import cubeTuiguang from '@/assets/cubes/cube_company_tuiguang_hover.png'

const props = defineProps<{
  company: Company
  displayName: string
  isHovered: boolean
}>()

/** 动态加载公司 logo 图片 */
const companyLogos = import.meta.glob('@/assets/company-logos/*.png', { eager: true, import: 'default' }) as Record<string, string>

const logoUrl = computed(() => {
  if (!props.company.logo) return ''
  for (const [path, url] of Object.entries(companyLogos)) {
    if (path.endsWith(`/${props.company.logo}`)) return url
  }
  return ''
})

const emit = defineEmits<{
  (e: 'hover', companyId: string | null): void
  (e: 'click', companyId: string): void
}>()

// ---- 移动端状态感知单击 ----
function handleMobileClick() {
  if (props.isHovered) {
    // 已点亮 → 再次单击同一公司 → 取消高光 + 打开详情弹窗
    emit('hover', null)
    emit('click', props.company.id)
  } else {
    // 未点亮 → 首次单击 → 点亮 skill nodes
    emit('hover', props.company.id)
  }
}

/** 根据企业状态选择对应的 cube 图片 */
const cubeUrl = computed(() => {
  const status = props.company.status
  if (status === 'reserve') return cubeChubei
  if (status === 'implementation') return cubeShishi
  if (status === 'promotion') return cubeTuiguang
  return cubeShishi
})

/** 暴露根元素供连线坐标计算使用 */
const cardRef = ref<HTMLElement>()
defineExpose({ el: cardRef, companyId: props.company.id })

// 注入元素注册函数（由 App.vue provide）
const registerCompanyElement = inject<(id: string, el: HTMLElement) => void>('registerCompanyElement')
const unregisterCompanyElement = inject<(id: string) => void>('unregisterCompanyElement')

onMounted(() => {
  if (cardRef.value && registerCompanyElement) {
    registerCompanyElement(props.company.id, cardRef.value)
  }
})

onUnmounted(() => {
  if (unregisterCompanyElement) {
    unregisterCompanyElement(props.company.id)
  }
})
</script>

<template>
  <div
    ref="cardRef"
    class="company-card hover-lift"
    :class="`company-card--${company.status}`"
    :data-company-id="company.id"
    @mouseenter="deviceMode === 'pc' ? $emit('hover', company.id) : undefined"
    @mouseleave="deviceMode === 'pc' ? $emit('hover', null) : undefined"
    @click="deviceMode === 'pc' ? $emit('click', company.id) : handleMobileClick()"
  >
    <!-- 公司 Logo（底座上方） -->
    <div class="company-card__logo" :class="{ 'company-card__logo--empty': !logoUrl }">
      <img v-if="logoUrl" :src="logoUrl" alt="" class="company-card__logo-img" />
    </div>

    <!-- 方块立体图 -->
    <img :src="cubeUrl" alt="" class="company-card__cube" />

    <!-- 公司名称 -->
    <span class="company-card__name">{{ displayName }}</span>
  </div>
</template>

<style scoped lang="scss">
.company-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  cursor: pointer;
  width: 90px;

  &__logo {
    width: 36px;
    height: 36px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;

    &--empty {
      width: 0;
      height: 0;
    }
  }

  &__logo-img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    border-radius: 4px;
  }

  &__cube {
    width: 80px;
    height: 80px;
    object-fit: contain;
    transition: filter var(--duration-normal) var(--ease-smooth);
  }

  &__name {
    font-size: 16px;
    font-weight: 500;
    color: #b8c5d6;
    text-align: center;
    max-width: 86px;
    word-break: break-all;
    white-space: normal;
    line-height: 1.3;
    display: -webkit-box;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  // 状态色彩发光
  &--reserve:hover .company-card__cube {
    filter: drop-shadow(0 0 8px rgba(59, 130, 246, 0.6));
  }
  &--implementation:hover .company-card__cube {
    filter: drop-shadow(0 0 8px rgba(245, 158, 11, 0.6));
  }
  &--promotion:hover .company-card__cube {
    filter: drop-shadow(0 0 8px rgba(239, 68, 68, 0.6));
  }
}
</style>
