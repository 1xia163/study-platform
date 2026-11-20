<script setup>
import PageHeader from '@/components/PageHeader.vue'
</script>

<template>
  <div class="page">
    <PageHeader
      eyebrow="P02 · F02"
      title="学习计划与待办"
      desc="同一份任务通过搜索、状态筛选和日期排序展示，新建与编辑使用同一表单。"
      art="任务日历与清单"
    />

    <section class="card">
      <h2 class="section-title">本页待实现</h2>
      <ul class="todo-list">
        <li><strong>任务表单</strong>（新建与编辑共用）：标题 / 课程 / 截止日期 / 优先级 / 知识点 / 说明</li>
        <li><strong>校验</strong>：标题去首尾空格后非空；截止日期不早于今天（已有逾期值可保留）；优先级默认「中」</li>
        <li><strong>检索与筛选</strong>：keyword + 状态（全部 / 未完成 / 已完成 / 逾期）+ 日期升降序，三者取交集</li>
        <li><strong>任务卡片</strong>：完成 / 恢复、编辑、延期、关联笔记、删除（删除弹窗写明任务标题）</li>
        <li><strong>关联笔记</strong>（linkedNoteIds）：只能选现有笔记，保存后返回原任务</li>
        <li><strong>来源入口</strong>：首页「新建任务」带 query.action=new 时自动打开表单；错题页带预填字段</li>
        <li>三态：首次无任务给新建 / 筛选无结果给清除筛选 / 保存中禁用按钮</li>
      </ul>
      <p class="placeholder-note">占位页 · 路由与整体布局已就绪，按 02 设计说明填充内容。</p>
    </section>
  </div>
</template>
