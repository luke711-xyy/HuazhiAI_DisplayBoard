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
import cubeTuiguang from '@/assets/cubes/cube_company_tuiguang.png'
import cubeTuiguangHover from '@/assets/cubes/cube_company_tuiguang_hover.png'

const props = defineProps<{
  company: Company
  displayName: string
  isHovered: boolean
}>()

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
  if (status === 'promotion') {
    return props.isHovered ? cubeTuiguangHover : cubeTuiguang
  }
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
  width: 100px;

  &__cube {
    width: 76px;
    height: 76px;
    object-fit: contain;
    transition: filter var(--duration-normal) var(--ease-smooth);
  }

  &__name {
    font-size: 13px;
    color: var(--color-text-secondary);
    text-align: center;
    max-width: 100px;
    word-break: break-all;
    white-space: normal;
    line-height: 1.3;
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
