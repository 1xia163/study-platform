<script setup>
import PageHeader from '@/components/PageHeader.vue'
</script>

<template>
  <div class="page page--narrow">
    <PageHeader
      eyebrow="P07 · F07"
      title="规则组卷"
      desc="先确认筛选条件与各题型数量，生成后计算本次试卷的实际总分。"
      art="整理试卷"
    />

    <section class="card">
      <h2 class="section-title">本页待实现</h2>
      <ul class="todo-list">
        <li><strong>课程</strong>（course，必填）：从题库课程中选，选择后统计各题型可用题量</li>
        <li><strong>年份范围</strong>（yearStart / yearEnd）：选填，填写须成对且起始 ≤ 终止，留空表示不限</li>
        <li><strong>知识点</strong>（knowledgePoints）：多选，按任一匹配；变更课程时清除失效知识点</li>
        <li><strong>题型数量</strong>（typeCounts）：单选 / 多选 / 判断 / 主观，非负整数，合计至少 1</li>
        <li><strong>题量与分值摘要</strong>（totalCount / totalScore）：总分在生成后按实际题目分值计算</li>
        <li><strong>题量不足提示</strong>：按题型显示「需要几题、题库现有几题」</li>
        <li><strong>生成</strong>：去重抽题后直接进入 P08；<strong>重置</strong>清空条件与数量</li>
        <li><strong>查看题库</strong>：沿用当前条件跳到 P06 并带入筛选</li>
      </ul>
      <p class="placeholder-note">占位页 · 路由与整体布局已就绪，按 02 设计说明填充内容。</p>
    </section>
  </div>
</template>
