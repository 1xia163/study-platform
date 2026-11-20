<script setup>
import PageHeader from '@/components/PageHeader.vue'
</script>

<template>
  <div class="page">
    <PageHeader
      eyebrow="P01 · F01 / F05"
      title="学习首页"
      desc="承接今日行动与学习复盘，主要入口始终是计划、笔记和专注。"
      art="首页场景插画"
    />

    <section class="card">
      <h2 class="section-title">本页待实现</h2>
      <ul class="todo-list">
        <li><strong>今日及逾期任务</strong>（todayTasks / overdueTasks）：只读，按本地日期计算；无任务时给建任务入口</li>
        <li><strong>任务进度</strong>（completedCount / taskCount）：显示「已完成 / 总数」与百分比，0 项时显示 0/0 及 0%</li>
        <li><strong>本周专注时长</strong>（weeklyFocusMinutes）：本周一至今，按完成时段累加</li>
        <li><strong>最近笔记</strong>（recentNotes）：按更新时间倒序取 3 篇，标题去 P04、查看全部去 P03</li>
        <li><strong>复盘知识点</strong>（reviewNotes）：取掌握程度为「未掌握」的笔记，可一键加入复习任务</li>
        <li><strong>最近专注</strong>（recentSessions）：已完成时段及课程、时间</li>
        <li>三态：空统计与创建入口 / 各区骨架占位 / 读取失败区内重试</li>
      </ul>
      <p class="placeholder-note">占位页 · 路由与整体布局已就绪，按 02 设计说明填充内容。</p>
    </section>
  </div>
</template>
