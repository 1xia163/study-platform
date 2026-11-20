<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import PageHeader from '@/components/PageHeader.vue'

const route = useRoute()
const noteId = computed(() => route.params.id)
const isEdit = computed(() => Boolean(noteId.value))
</script>

<template>
  <div class="page page--narrow">
    <PageHeader
      :eyebrow="isEdit ? 'P04 · F03 / F05 · 编辑' : 'P04 · F03 / F05 · 新建'"
      :title="isEdit ? '编辑笔记' : '新建笔记'"
      desc="课程、知识点和掌握程度串联任务、笔记与自测；保存后才更新列表和首页。"
      art="相片与图文笔记"
    />

    <section class="card">
      <h2 class="section-title">本页待实现</h2>
      <ul class="todo-list">
        <li><strong>一个组件两种模式</strong>：/note/new 为新建，/note/:id 为编辑，用 route.params.id 判断，不要拆成两个组件</li>
        <li><strong>标题与课程</strong>（必填）：标题去空格后非空；课程从列表选</li>
        <li><strong>知识点与标签</strong>（knowledgePoint / tags）：去空值与重复项，可为空</li>
        <li><strong>正文</strong>（content）：正文与照片至少提供一项，都为空时在内容区提示</li>
        <li><strong>照片</strong>（photos）：最多 6 张，JPEG / PNG / WebP，单张源文件 ≤5MB；支持多选、预览、前移后移、移除、替换</li>
        <li><strong>掌握程度</strong>（mastery）：未掌握 / 熟悉 / 熟练，新笔记默认未掌握，文字与颜色同时标示</li>
        <li><strong>关联任务</strong>（linkedTaskIds）：从已有任务中选择，可解除</li>
        <li><strong>去向</strong>：去自测（带课程与知识点 → /bank）、复习任务（→ /plan 预填）</li>
        <li><strong>离开保护</strong>（isDirty）：有未保存修改时提示「保存后离开 / 放弃修改 / 继续编辑」；无效 id 返回列表</li>
      </ul>
      <p class="placeholder-note">占位页 · 路由与整体布局已就绪，按 02 设计说明填充内容。</p>
    </section>
  </div>
</template>
