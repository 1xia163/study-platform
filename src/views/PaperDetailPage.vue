<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import PageHeader from '@/components/PageHeader.vue'

const route = useRoute()
const paperId = computed(() => route.params.id)
</script>

<template>
  <div class="page page--narrow">
    <PageHeader
      eyebrow="P08 · F08"
      :title="`作答与反馈 · 试卷 ${paperId}`"
      desc="同一页面承载作答与结果两个状态，提交后保留当次题目与答案。"
      art="安静书写作答"
    />

    <section class="card">
      <h2 class="section-title">本页待实现</h2>
      <ul class="todo-list">
        <li><strong>试卷与导航</strong>（paperId / questions / currentIndex）：答题卡、上一题、下一题；当前题号不越界</li>
        <li><strong>作答</strong>（answers / subjectiveAnswers）：单选与判断存单值，多选存数组，主观题存文本；提交前可改</li>
        <li><strong>提交确认</strong>（unansweredCount）：显示共几题、已答几题、未答几题，确认后才提交</li>
        <li><strong>客观题反馈</strong>（objectiveScore / objectiveMaxScore）：多选须选项集合完全一致才得分</li>
        <li><strong>结果区</strong>：逐题呈现学生答案、参考答案与解析；「全部 / 错题」切换</li>
        <li><strong>去向</strong>：相关笔记 → P03 或 P04；复习任务 → P02；查看错题 → P09</li>
        <li><strong>离开与恢复</strong>：未交卷提示「继续作答 / 保存进度后离开」；刷新恢复本次进度；无效试卷返回 P07</li>
        <li>本页手机端已收起底部导航（路由 meta.hideTabBar），交卷栏需保持可达</li>
      </ul>
      <p class="placeholder-note">占位页 · 路由与整体布局已就绪，按 02 设计说明填充内容。</p>
    </section>
  </div>
</template>
