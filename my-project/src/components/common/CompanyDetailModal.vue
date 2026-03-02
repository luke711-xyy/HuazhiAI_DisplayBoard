<script setup lang="ts">
import { ref } from 'vue'

interface CompanyInfo {
  name: string
  industry: string
  scale: string
}

interface Skill {
  category: string
  tags: string[]
}

defineProps<{
  visible: boolean
  company: CompanyInfo
  scenario: string
  skills: Skill[]
}>()

defineEmits<{
  close: []
}>()

const activeTab = ref('basic')
</script>

<template>
  <Transition name="modal">
    <div v-if="visible" class="modal-overlay" @click.self="emit('close')">
      <div class="modal-content">
        <!-- 关闭按钮 -->
        <button class="modal-close" @click="emit('close')">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>

        <!-- 企业基本信息 -->
        <div class="modal-section company-info">
          <div class="company-logo">
            <!-- TODO: 替换为切图素材 [company-logo-placeholder.png] -->
            <div class="logo-placeholder">Logo</div>
          </div>
          <div class="company-details">
            <h2 class="company-name">{{ company.name }}</h2>
            <p class="company-meta">
              <span class="meta-label">所属行业</span>
              <span class="meta-value">{{ company.industry }}</span>
            </p>
            <p class="company-meta">
              <span class="meta-label">企业规模</span>
              <span class="meta-value">{{ company.scale }}</span>
            </p>
          </div>
        </div>

        <!-- 核心场景 -->
        <div class="modal-section scenario-section">
          <h3 class="section-title">核心场景: {{ scenario }}</h3>
          <div class="scenario-flow">
            <!-- TODO: 替换为切图素材 [flow-icons.png] -->
            <div class="flow-placeholder">
              <span class="flow-icon">上料</span>
              <span class="flow-arrow">→</span>
              <span class="flow-icon">拼接</span>
              <span class="flow-arrow">→</span>
              <span class="flow-icon">喷涂</span>
              <span class="flow-arrow">→</span>
              <span class="flow-icon">打磨</span>
              <span class="flow-arrow">→</span>
              <span class="flow-icon">检测</span>
            </div>
          </div>
        </div>

        <!-- 核心技能 -->
        <div class="modal-section skills-section">
          <h3 class="section-title">核心技能</h3>
          <div class="skills-container">
            <div v-for="(skill, index) in skills" :key="skill.category" class="skill-category">
              <h4 class="skill-category-title">{{ skill.category }}</h4>
              <div class="skill-tags">
                <span
                  v-for="(tag, tagIndex) in skill.tags"
                  :key="tag"
                  class="skill-tag"
                >
                  {{ tag }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
/* 模态框动画 */
.modal-enter-active,
.modal-leave-active {
  transition: all var(--transition-normal);
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-content,
.modal-leave-to .modal-content {
  transform: translate(-50%, -50%) scale(0.9);
}

/* 遮罩层 */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

/* 弹窗内容 */
.modal-content {
  position: relative;
  width: 600px;
  max-width: 90vw;
  max-height: 80vh;
  background: var(--bg-0);
  border: 1px solid var(--border-1);
  border-radius: var(--radius-xl);
  padding: var(--space-xl);
  overflow-y: auto;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
}

.modal-close {
  position: absolute;
  top: var(--space-md);
  right: var(--space-md);
  width: 36px;
  height: 36px;
  border: 1px solid var(--border-1);
  border-radius: 50%;
  background: transparent;
  color: var(--text-1);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
}

.modal-close:hover {
  background: rgba(255, 255, 255, 0.1);
  color: var(--text-0);
}

/* 模态框区域 */
.modal-section {
  margin-bottom: var(--space-lg);
}

.modal-section:last-child {
  margin-bottom: 0;
}

.section-title {
  margin: 0 0 var(--space-md) 0;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-0);
}

/* 企业信息 */
.company-info {
  display: flex;
  gap: var(--space-md);
  padding-bottom: var(--space-lg);
  border-bottom: 1px solid var(--border-0);
}

.company-logo {
  width: 100px;
  height: 100px;
  flex-shrink: 0;
  border: 1px solid var(--border-1);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-placeholder {
  color: var(--text-2);
  font-size: 14px;
}

.company-details {
  flex: 1;
}

.company-name {
  margin: 0 0 var(--space-md) 0;
  font-size: 20px;
  font-weight: 700;
  color: var(--text-0);
  text-shadow: var(--text-glow);
}

.company-meta {
  margin: 0 0 var(--space-xs) 0;
  font-size: 13px;
  color: var(--text-1);
}

.meta-label {
  margin-right: var(--space-xs);
  color: var(--text-2);
}

.meta-value {
  color: var(--text-0);
  font-weight: 500;
}

/* 核心场景 */
.scenario-flow {
  padding: var(--space-md);
  background: var(--bg-glass);
  border: 1px solid var(--border-0);
  border-radius: var(--radius-md);
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-sm);
  align-items: center;
}

.flow-placeholder {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  flex-wrap: wrap;
}

.flow-icon {
  padding: var(--space-xs) var(--space-sm);
  background: var(--gradient-blue);
  border-radius: var(--radius-sm);
  font-size: 12px;
  color: #000;
  font-weight: 500;
}

.flow-arrow {
  color: var(--neon-blue);
  font-size: 16px;
}

/* 核心技能 */
.skills-container {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.skill-category {
  padding: var(--space-md);
  background: rgba(255, 255, 255, 0.02);
  border-radius: var(--radius-md);
}

.skill-category-title {
  margin: 0 0 var(--space-sm) 0;
  font-size: 13px;
  font-weight: 600;
  color: var(--neon-blue);
}

.skill-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-sm);
}

.skill-tag {
  padding: var(--space-xs) var(--space-sm);
  background: var(--bg-glass);
  border: 1px solid var(--border-1);
  border-radius: var(--radius-sm);
  font-size: 12px;
  color: var(--text-1);
  transition: all var(--transition-fast);
}

.skill-tag:hover {
  border-color: var(--neon-blue);
  background: rgba(24, 120, 255, 0.1);
  color: var(--text-0);
}
</style>
