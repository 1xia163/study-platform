<script setup>
/**
 * 页面标题区 —— 对应 02 设计：业务页标题 32px，桌面插画置右 210×130，
 * 手机改为标题下方的紧凑插画横幅 108×80（这里用整宽横幅）。
 *
 * 插画先以占位块呈现（art 传入资源标识，如 planCalendar），
 * 后续由设计资源替换为真实图片，不影响布局。
 */
defineProps({
  title: { type: String, required: true },
  desc: { type: String, default: '' },
  eyebrow: { type: String, default: '' },
  art: { type: String, default: '' },
})
</script>

<template>
  <header class="page-header">
    <div class="page-header__text">
      <p v-if="eyebrow" class="page-header__eyebrow">{{ eyebrow }}</p>
      <h1 class="page-header__title">{{ title }}</h1>
      <p v-if="desc" class="page-header__desc">{{ desc }}</p>
      <div v-if="$slots.actions" class="page-header__actions">
        <slot name="actions" />
      </div>
    </div>

    <div v-if="art || $slots.art" class="page-header__art" aria-hidden="true">
      <slot name="art">
        <span class="page-header__art-mark">{{ art }}</span>
      </slot>
    </div>
  </header>
</template>

<style scoped>
.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--sp-4);
  margin-bottom: var(--sp-4);
}

.page-header__text {
  display: flex;
  flex-direction: column;
  gap: var(--sp-1);
  min-width: 0;
}

.page-header__eyebrow {
  font-size: var(--fs-sub);
  color: var(--c-green);
}

.page-header__title {
  font-size: var(--fs-title);
  font-weight: 500;
  line-height: 1.25;
  letter-spacing: -0.01em;
}

.page-header__desc {
  max-width: 62ch;
  color: var(--c-text-muted);
}

.page-header__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--sp-2);
  margin-top: var(--sp-1);
}

.page-header__art {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 210px;
  height: 130px;
  border-radius: var(--r-card);
  background: var(--c-green-soft);
}

.page-header__art-mark {
  padding: 0 var(--sp-2);
  font-size: var(--fs-sub);
  color: var(--c-green);
  text-align: center;
}

@media (max-width: 767px) {
  .page-header {
    flex-direction: column;
    gap: var(--sp-2);
    margin-bottom: var(--sp-3);
  }

  .page-header__art {
    width: 100%;
    height: 80px;
    order: 2;
  }
}
</style>
