<script setup>
import { storeToRefs } from 'pinia'
import BaseCard from '../components/BaseCard.vue'
import EducationCard from '../components/EducationCard.vue'
import { useEducationStore } from '../stores/education.js'

const educationStore = useEducationStore()
// 解构 state（education）与 getter（educationCount），均保持响应式
const { education, educationCount } = storeToRefs(educationStore)
</script>

<template>
  <BaseCard id="education" :title="`学习经历（共 ${educationCount} 段）`">
    <EducationCard v-model:education="education" />
  </BaseCard>
</template>
