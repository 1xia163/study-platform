<script setup>
import PageHeader from '@/components/PageHeader.vue'
</script>

<template>
  <div class="page">
    <PageHeader
      eyebrow="P06 · F06"
      title="真题题库"
      desc="从笔记进入时带入课程与知识点；题目详情可查看答案及解析。"
      art="真题卡片书架"
    >
      <template #actions>
        <RouterLink class="btn btn--primary btn--sm" :to="{ name: 'paper-create' }">
          按当前条件组卷
        </RouterLink>
      </template>
    </PageHeader>

    <section class="card">
      <h2 class="section-title">本页待实现</h2>
      <ul class="todo-list">
        <li><strong>关键词</strong>（keyword）：检索题干，与其他筛选共同生效</li>
        <li><strong>课程 / 年份 / 题型</strong>（courseFilter / yearFilter / typeFilter）：题型为单选、多选、判断、主观</li>
        <li><strong>知识点</strong>（knowledgePointFilter）：属于当前课程；从笔记进入时自动带入</li>
        <li><strong>题目列表</strong>：展示年份、题型、课程、知识点、分值</li>
        <li><strong>题目详情</strong>：答案默认折叠，展开看解析；关闭后保持筛选与页码；手机用全屏详情</li>
        <li><strong>分页</strong>（page / pageSize）：默认每页 10 题，筛选变动回到第 1 页，首尾页禁用对应按钮</li>
        <li><strong>组卷入口</strong>：带入当前课程、年份和知识点，用户到 P07 再确认题数</li>
        <li>三态：题库为空提示数据维护 / 筛选无结果给清除 / 读取失败可重试</li>
      </ul>
      <p class="placeholder-note">占位页 · 路由与整体布局已就绪，按 02 设计说明填充内容。</p>
    </section>
  </div>
</template>
