<script setup>
/**
 * 空状态 / 无结果 / 加载失败 —— 02 设计明确要求区分这三种情况：
 *   empty     真的没有数据（如"还没有任务"）→ 给创建入口
 *   no-result 有数据但筛选后为空       → 给"清除筛选"
 *   error     读取失败                 → 给"重新加载"
 * 三者文案和操作按钮都不一样，不要合并成一个。
 */
defineProps({
  title: { type: String, required: true },
  desc: { type: String, default: '' },
  variant: {
    type: String,
    default: 'empty',
    validator: (v) => ['empty', 'no-result', 'error'].includes(v),
  },
  compact: { type: Boolean, default: false },
})
</script>

<template>
  <div class="empty-state" :class="[`empty-state--${variant}`, { 'empty-state--compact': compact }]">
    <div class="empty-state__mark" aria-hidden="true">
      {{ variant === 'error' ? '!' : variant === 'no-result' ? '?' : '+' }}
    </div>
    <h2 class="empty-state__title">{{ title }}</h2>
    <p v-if="desc" class="empty-state__desc">{{ desc }}</p>
    <div v-if="$slots.default" class="empty-state__actions">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--sp-1);
  padding: var(--sp-4) var(--sp-3);
  border: 1px dashed var(--c-border-strong);
  border-radius: var(--r-card);
  background: rgba(255, 255, 255, 0.55);
  text-align: center;
}

.empty-state--compact {
  padding: var(--sp-3);
}

.empty-state__mark {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  margin-bottom: var(--sp-1);
  border-radius: 50%;
  background: var(--c-green-soft);
  color: var(--c-green);
  font-size: var(--fs-section);
  line-height: 1;
}

.empty-state--error .empty-state__mark {
  background: #f7ded9;
  color: var(--c-danger);
}

.empty-state__title {
  font-size: var(--fs-body);
  font-weight: 500;
}

.empty-state__desc {
  max-width: 46ch;
  color: var(--c-text-muted);
  font-size: var(--fs-sub);
}

.empty-state__actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--sp-2);
  margin-top: var(--sp-2);
}
</style>
