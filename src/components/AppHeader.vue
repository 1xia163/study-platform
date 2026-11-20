<script setup>
/**
 * 桌面顶部导航 —— 依据 02 设计：
 * 白色圆角胶囊固定顶部，含「首页 / 学习计划 / 课程笔记 / 专注学习 / 学习自测▾」，
 * 当前项用深绿强调，右侧橙红按钮为新建任务入口。
 * 手机端隐藏，由 AppTabBar 接管。
 */
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { mainNav, selfTestNav } from '@/constants/nav'

const route = useRoute()
const router = useRouter()

const selfOpen = ref(false)
const selfRef = ref(null)

const activeGroup = computed(() => route.meta?.group ?? '')
const selfActive = computed(() => activeGroup.value === 'selftest')

function goSelfTest(name) {
  selfOpen.value = false
  router.push({ name })
}

function createTask() {
  selfOpen.value = false
  router.push({ name: 'plan', query: { action: 'new' } })
}

function onDocumentClick(event) {
  if (selfOpen.value && selfRef.value && !selfRef.value.contains(event.target)) {
    selfOpen.value = false
  }
}

function onKeydown(event) {
  if (event.key === 'Escape') selfOpen.value = false
}

onMounted(() => {
  document.addEventListener('click', onDocumentClick)
  document.addEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', onDocumentClick)
  document.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <header class="app-header">
    <RouterLink class="app-header__brand" :to="{ name: 'home' }">
      <span class="app-header__dot" aria-hidden="true" />
      <span class="app-header__name">个人学习平台</span>
    </RouterLink>

    <nav class="app-header__nav" aria-label="主导航">
      <RouterLink
        v-for="item in mainNav"
        :key="item.name"
        class="app-header__link"
        :class="{ 'is-active': activeGroup === item.group }"
        :to="{ name: item.name }"
        :aria-current="activeGroup === item.group ? 'page' : undefined"
      >
        {{ item.label }}
      </RouterLink>

      <div ref="selfRef" class="app-header__self">
        <button
          class="app-header__link app-header__trigger"
          :class="{ 'is-active': selfActive }"
          type="button"
          :aria-expanded="selfOpen"
          aria-haspopup="true"
          @click="selfOpen = !selfOpen"
        >
          学习自测
          <svg
            class="app-header__caret"
            :class="{ 'is-open': selfOpen }"
            viewBox="0 0 24 24"
            width="16"
            height="16"
            aria-hidden="true"
          >
            <path
              d="M7 10l5 5 5-5"
              fill="none"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>

        <ul v-if="selfOpen" class="app-header__menu">
          <li v-for="item in selfTestNav" :key="item.name">
            <button
              class="app-header__menu-item"
              :class="{ 'is-active': route.name === item.name }"
              type="button"
              @click="goSelfTest(item.name)"
            >
              {{ item.label }}
            </button>
          </li>
        </ul>
      </div>
    </nav>

    <button class="btn btn--primary btn--sm app-header__cta" type="button" @click="createTask">
      <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
        <path
          d="M12 5v14M5 12h14"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
        />
      </svg>
      新建任务
    </button>
  </header>
</template>

<style scoped>
.app-header {
  position: fixed;
  top: var(--sp-2);
  left: 50%;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--sp-3);
  width: calc(100% - 64px);
  max-width: calc(var(--page-max) - 64px);
  height: var(--nav-h);
  padding: 0 var(--sp-3);
  border-radius: var(--r-nav);
  background: var(--c-surface);
  box-shadow: var(--shadow-nav);
  transform: translateX(-50%);
}

.app-header__brand {
  display: flex;
  align-items: center;
  gap: var(--sp-1);
  flex: 0 0 auto;
}

.app-header__dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--c-accent);
}

.app-header__name {
  font-size: var(--fs-body);
  font-weight: 500;
  white-space: nowrap;
}

.app-header__nav {
  display: flex;
  align-items: center;
  gap: 4px;
}

.app-header__link {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  height: 40px;
  padding: 0 var(--sp-2);
  border: none;
  border-radius: var(--r-tag);
  background: transparent;
  color: var(--c-text-muted);
  font-size: var(--fs-sub);
  white-space: nowrap;
  transition:
    background-color 0.15s ease,
    color 0.15s ease;
}

.app-header__link:hover {
  background: var(--c-green-soft);
  color: var(--c-text);
}

.app-header__link.is-active {
  background: var(--c-green-soft);
  color: var(--c-green);
  font-weight: 500;
}

.app-header__self {
  position: relative;
}

.app-header__trigger {
  cursor: pointer;
}

.app-header__caret {
  transition: transform 0.16s ease;
}

.app-header__caret.is-open {
  transform: rotate(180deg);
}

.app-header__menu {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  min-width: 168px;
  padding: var(--sp-1);
  border: 1px solid var(--c-border);
  border-radius: var(--r-card);
  background: var(--c-surface);
  box-shadow: var(--shadow-nav);
}

.app-header__menu-item {
  display: block;
  width: 100%;
  padding: 10px var(--sp-2);
  border: none;
  border-radius: var(--r-field);
  background: transparent;
  color: var(--c-text);
  font-size: var(--fs-sub);
  text-align: left;
}

.app-header__menu-item:hover,
.app-header__menu-item.is-active {
  background: var(--c-green-soft);
  color: var(--c-green);
}

.app-header__cta {
  flex: 0 0 auto;
}

@media (max-width: 767px) {
  .app-header {
    display: none;
  }
}
</style>
