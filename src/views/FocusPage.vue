<script setup>
import PageHeader from '@/components/PageHeader.vue'
</script>

<template>
  <div class="page page--narrow">
    <PageHeader
      eyebrow="P05 · F04"
      title="专注学习"
      desc="支持从任务开始或独立专注；切换页面后保留计时，专注记录用于首页复盘。"
      art="书桌与专注时钟"
    />

    <section class="card">
      <h2 class="section-title">本页待实现</h2>
      <ul class="todo-list">
        <li><strong>关联任务</strong>（taskId）：可选未完成任务或独立专注，从任务进入时自动选中并带入课程</li>
        <li><strong>时长设置</strong>：学习 1–180 分钟、休息 1–60 分钟、轮数 1–12（默认 4），计时中只读</li>
        <li><strong>计时状态</strong>（timerState）：待开始 / 学习 / 休息 / 暂停 / 完成；暂停保留剩余时间</li>
        <li><strong>剩余时间</strong>（remainingSeconds）：按实际经过时间计算，不小于 0；切页后仍能恢复</li>
        <li><strong>完成记录</strong>（sessionId / course / durationMinutes）：每个完整学习时段记一次，休息不计入</li>
        <li><strong>提前结束</strong>：需确认，未完成部分不计入完成时长</li>
        <li><strong>最后一轮结束后</strong>：再来一轮 / 记录笔记 / 返回任务</li>
        <li>三态：无任务也能独立专注 / 恢复计时前显示正在恢复 / 时长轮数非法在字段下报错</li>
      </ul>
      <p class="placeholder-note">占位页 · 路由与整体布局已就绪，按 02 设计说明填充内容。</p>
    </section>
  </div>
</template>
