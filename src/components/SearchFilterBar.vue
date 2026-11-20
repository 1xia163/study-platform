<script setup>
/**
 * 搜索与筛选栏 —— 出现在计划、笔记、题库、记录四个列表页
 * 依据 02 设计：显示当前筛选条件，无结果时提供清除筛选；手机筛选进入面板。
 * 用法：搜索框固定，筛选项通过默认插槽传入（select / 标签按钮都行）。
 */
defineProps({
  keyword: { type: String, default: '' },
  placeholder: { type: String, default: '搜索' },
  showReset: { type: Boolean, default: true },
})

const emit = defineEmits(['update:keyword', 'reset'])
</script>

<template>
  <div class="filter-bar">
    <div class="filter-bar__search">
      <svg class="filter-bar__icon" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
        <circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" stroke-width="1.6" />
        <path d="M16 16l4 4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
      </svg>
      <input
        class="input filter-bar__input"
        type="search"
        :value="keyword"
        :placeholder="placeholder"
        :aria-label="placeholder"
        @input="emit('update:keyword', $event.target.value)"
      />
    </div>

    <div class="filter-bar__controls">
      <slot />
      <button v-if="showReset" class="btn btn--ghost btn--sm" type="button" @click="emit('reset')">
        清除筛选
      </button>
    </div>
  </div>
</template>

<style scoped>
.filter-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--sp-2);
  margin-bottom: var(--sp-3);
}

.filter-bar__search {
  position: relative;
  flex: 1 1 260px;
  min-width: 0;
}

.filter-bar__icon {
  position: absolute;
  top: 50%;
  left: 14px;
  transform: translateY(-50%);
  color: var(--c-text-muted);
  pointer-events: none;
}

.filter-bar__input {
  padding-left: 40px;
}

.filter-bar__controls {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--sp-1);
}

@media (max-width: 767px) {
  .filter-bar__search {
    flex: 1 1 100%;
  }

  .filter-bar__controls {
    width: 100%;
    overflow-x: auto;
    flex-wrap: nowrap;
    padding-bottom: 2px;
  }
}
</style>
