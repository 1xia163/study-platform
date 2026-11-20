<script setup>
import EmptyState from '@/components/EmptyState.vue'
import PageHeader from '@/components/PageHeader.vue'
</script>

<template>
  <div class="page page--narrow">
    <PageHeader title="页面不存在" desc="地址无效，或这条记录已被删除。" />

    <EmptyState
      variant="error"
      title="没有找到这个页面"
      desc="检查地址是否输入正确，或者回到首页重新进入。"
    >
      <RouterLink class="btn btn--primary btn--sm" :to="{ name: 'home' }">返回首页</RouterLink>
      <RouterLink class="btn btn--ghost btn--sm" :to="{ name: 'note-list' }">去笔记列表</RouterLink>
    </EmptyState>
  </div>
</template>
