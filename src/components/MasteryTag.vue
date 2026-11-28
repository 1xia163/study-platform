<script setup>
/**
 * 掌握程度标签 —— 颜色与文字必须同时出现，不能只靠颜色区分。
 */
import { computed } from 'vue'

import { masteryLabel, masteryTagClass } from '@/constants/mastery'

const props = defineProps({
  value: { type: String, default: 'none' },
})

const label = computed(() => masteryLabel(props.value))
const tagClass = computed(() => masteryTagClass(props.value))
</script>

<template>
  <span class="tag" :class="tagClass">{{ label }}</span>
</template>
