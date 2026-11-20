<script setup>
import PageHeader from '@/components/PageHeader.vue'
</script>

<template>
  <div class="page">
    <PageHeader
      eyebrow="P09 · F09"
      title="练习记录与错题"
      desc="练习记录与错题通过页内标签切换，复习时可以回到笔记或新建任务。"
      art="放大镜与复盘"
    />

    <section class="card">
      <h2 class="section-title">本页待实现</h2>
      <ul class="todo-list">
        <li><strong>页内标签</strong>（activeTab）：练习记录 / 错题，默认「练习记录」，切换只替换列表</li>
        <li><strong>筛选</strong>（courseFilter / knowledgePointFilter）：按课程与知识点取交集，课程变化重置失效知识点</li>
        <li><strong>练习记录</strong>：提交时间、课程、客观题得分 / 满分，倒序；回看作答 → P08 已提交状态</li>
        <li><strong>错题记录</strong>：按题目归档，同题重复出错更新最近答案与时间；展开解析原地显示</li>
        <li><strong>解析区域</strong>：显示最近错误答案与参考答案，可打开相关笔记</li>
        <li><strong>创建复习任务</strong>：预填课程、知识点和标题 → P02 新建表单，确认保存后才生成</li>
        <li>三态：无记录给自测入口 / 无错题给去学习入口 / 读取失败可重试且不丢筛选</li>
      </ul>
      <p class="placeholder-note">占位页 · 路由与整体布局已就绪，按 02 设计说明填充内容。</p>
    </section>
  </div>
</template>
