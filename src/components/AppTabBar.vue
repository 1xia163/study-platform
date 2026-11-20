<script setup>
/**
 * 手机底部导航 —— 依据 02 设计：
 * 固定五项「首页 / 计划 / 笔记 / 专注 / 更多」，更多面板含题库、组卷、记录。
 * 答题页（meta.hideTabBar）收起底栏，避免遮挡作答操作。
 * 桌面端隐藏，由 AppHeader 接管。
 */
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { selfTestNav, tabBarNav } from '@/constants/nav'

const route = useRoute()
const router = useRouter()

const moreOpen = ref(false)
const hidden = computed(() => Boolean(route.meta?.hideTabBar))
const activeGroup = computed(() => route.meta?.group ?? '')

const iconPaths = {
  home: 'M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z',
  calendar: 'M4 6h16v14H4zM8 3v4M16 3v4M4 10h16',
  book: 'M5 5h6v15H5zM13 5h6v15h-6z',
  clock: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 7v5l3.5 2',
}

function go(name) {
  moreOpen.value = false
  router.push({ name })
}
</script>

<template>
  <nav v-if="!hidden" class="tabbar" aria-label="底部导航">
    <RouterLink
      v-for="item in tabBarNav"
      :key="item.name"
      class="tabbar__item"
      :class="{ 'is-active': activeGroup === item.group }"
      :to="{ name: item.name }"
      :aria-current="activeGroup === item.group ? 'page' : undefined"
    >
      <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
        <path
          :d="iconPaths[item.icon]"
          fill="none"
          stroke="currentColor"
          stroke-width="1.6"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
      <span>{{ item.label }}</span>
    </RouterLink>

    <button
      class="tabbar__item"
      :class="{ 'is-active': activeGroup === 'selftest' }"
      type="button"
      @click="moreOpen = true"
    >
      <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
        <path
          d="M6 12h.01M12 12h.01M18 12h.01"
          fill="none"
          stroke="currentColor"
          stroke-width="2.4"
          stroke-linecap="round"
        />
      </svg>
      <span>更多</span>
    </button>
  </nav>

  <Teleport to="body">
    <div v-if="moreOpen" class="sheet" @click.self="moreOpen = false">
      <div class="sheet__panel" role="dialog" aria-modal="true" aria-label="学习自测">
        <p class="sheet__title">学习自测</p>
        <button
          v-for="item in selfTestNav"
          :key="item.name"
          class="sheet__item"
          type="button"
          @click="go(item.name)"
        >
          {{ item.label }}
        </button>
        <button class="sheet__cancel" type="button" @click="moreOpen = false">取消</button>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.tabbar {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 40;
  display: none;
  height: calc(var(--tabbar-h) + env(safe-area-inset-bottom));
  padding-bottom: env(safe-area-inset-bottom);
  border-top: 1px solid var(--c-border);
  background: var(--c-surface);
}

.tabbar__item {
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  border: none;
  background: transparent;
  color: var(--c-text-muted);
  font-size: 12px;
}

.tabbar__item.is-active {
  color: var(--c-green);
}

.sheet {
  position: fixed;
  inset: 0;
  z-index: 90;
  display: flex;
  align-items: flex-end;
  background: rgba(23, 25, 23, 0.42);
}

.sheet__panel {
  width: 100%;
  padding: var(--sp-2);
  padding-bottom: calc(var(--sp-2) + env(safe-area-inset-bottom));
  border-radius: var(--r-card) var(--r-card) 0 0;
  background: var(--c-surface);
}

.sheet__title {
  padding: var(--sp-1) var(--sp-2);
  color: var(--c-text-muted);
  font-size: var(--fs-sub);
}

.sheet__item {
  display: block;
  width: 100%;
  min-height: 48px;
  border: none;
  border-radius: var(--r-field);
  background: transparent;
  color: var(--c-text);
  font-size: var(--fs-body);
  text-align: left;
  padding: 0 var(--sp-2);
}

.sheet__item:active {
  background: var(--c-green-soft);
}

.sheet__cancel {
  width: 100%;
  min-height: 48px;
  margin-top: var(--sp-1);
  border: none;
  border-top: 1px solid var(--c-border);
  background: transparent;
  color: var(--c-text-muted);
  font-size: var(--fs-body);
}

@media (max-width: 767px) {
  .tabbar {
    display: flex;
  }
}
</style>
