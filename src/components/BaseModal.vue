<script setup>
/**
 * 通用弹窗 —— 用于任务/笔记表单、删除确认、交卷确认
 * 02 设计约定：字段错误靠近输入，危险操作有确认与取消；手机表单改为全屏面板。
 */
import { onBeforeUnmount, watch } from 'vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  title: { type: String, required: true },
  desc: { type: String, default: '' },
  size: {
    type: String,
    default: 'md',
    validator: (v) => ['sm', 'md', 'lg'].includes(v),
  },
  closeOnOverlay: { type: Boolean, default: true },
})

const emit = defineEmits(['update:modelValue'])

function close() {
  emit('update:modelValue', false)
}

function onKeydown(event) {
  if (event.key === 'Escape') close()
}

watch(
  () => props.modelValue,
  (open) => {
    document.body.style.overflow = open ? 'hidden' : ''
    if (open) {
      window.addEventListener('keydown', onKeydown)
    } else {
      window.removeEventListener('keydown', onKeydown)
    }
  },
)

onBeforeUnmount(() => {
  document.body.style.overflow = ''
  window.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="modelValue" class="modal" role="dialog" aria-modal="true">
        <div class="modal__overlay" @click="closeOnOverlay && close()" />

        <div class="modal__panel" :class="`modal__panel--${size}`">
          <header class="modal__head">
            <div>
              <h2 class="modal__title">{{ title }}</h2>
              <p v-if="desc" class="modal__desc">{{ desc }}</p>
            </div>
            <button class="modal__close" type="button" aria-label="关闭" @click="close">
              <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                <path
                  d="M6 6l12 12M18 6L6 18"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.8"
                  stroke-linecap="round"
                />
              </svg>
            </button>
          </header>

          <div class="modal__body">
            <slot />
          </div>

          <footer v-if="$slots.footer" class="modal__foot">
            <slot name="footer" />
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--sp-3);
}

.modal__overlay {
  position: absolute;
  inset: 0;
  background: rgba(23, 25, 23, 0.42);
}

.modal__panel {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-height: calc(100vh - 64px);
  border-radius: var(--r-card);
  background: var(--c-surface);
  box-shadow: var(--shadow-modal);
  overflow: hidden;
}

.modal__panel--sm {
  max-width: 420px;
}

.modal__panel--md {
  max-width: 560px;
}

.modal__panel--lg {
  max-width: 760px;
}

.modal__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--sp-2);
  padding: var(--sp-3) var(--sp-3) var(--sp-2);
  border-bottom: 1px solid var(--c-border);
}

.modal__title {
  font-size: var(--fs-section);
  font-weight: 500;
}

.modal__desc {
  margin-top: 4px;
  color: var(--c-text-muted);
  font-size: var(--fs-sub);
}

.modal__close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 50%;
  background: transparent;
  color: var(--c-text-muted);
}

.modal__close:hover {
  background: var(--c-green-soft);
  color: var(--c-text);
}

.modal__body {
  padding: var(--sp-3);
  overflow-y: auto;
}

.modal__foot {
  display: flex;
  justify-content: flex-end;
  gap: var(--sp-2);
  padding: var(--sp-2) var(--sp-3) var(--sp-3);
  border-top: 1px solid var(--c-border);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.16s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 767px) {
  .modal {
    padding: 0;
  }

  .modal__panel {
    max-width: none;
    height: 100%;
    max-height: none;
    border-radius: 0;
  }
}
</style>
