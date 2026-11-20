<script setup>
import PageHeader from '@/components/PageHeader.vue'
</script>

<template>
  <div class="page">
    <PageHeader
      eyebrow="P03 · F03"
      title="课程笔记"
      desc="按课程和知识点找笔记，再决定继续编辑、复习或用真题检验理解。"
      art="书籍与课程笔记"
    >
      <template #actions>
        <RouterLink class="btn btn--primary btn--sm" :to="{ name: 'note-new' }">新建笔记</RouterLink>
      </template>
    </PageHeader>

    <section class="card">
      <h2 class="section-title">本页待实现</h2>
      <ul class="todo-list">
        <li><strong>检索</strong>（keyword）：按标题关键词筛选，空值表示不限</li>
        <li><strong>课程与标签筛选</strong>（courseFilter / tagFilter）：切换课程时清除失效标签</li>
        <li><strong>排序</strong>（sortOrder）：按更新时间升/降序，默认降序，箭头与文字同时表示方向</li>
        <li><strong>笔记卡片</strong>：标题、课程、知识点、掌握程度标签、更新时间、照片数量（如「照片 2 张」）</li>
        <li><strong>来源条件条</strong>（sourceTaskId / knowledgePoint）：来自任务时显示，可清除条件或返回 P02</li>
        <li><strong>复习与删除</strong>：复习 → P02 预填；删除需确认，删除后同步移除任务关联</li>
        <li>跳转：卡片 → /note/:id，新建 → /note/new；从任务选择笔记时支持多选</li>
      </ul>
      <p class="placeholder-note">占位页 · 路由与整体布局已就绪，按 02 设计说明填充内容。</p>
    </section>
  </div>
</template>
