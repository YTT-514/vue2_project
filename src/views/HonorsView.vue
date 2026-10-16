<script setup>
import { storeToRefs } from 'pinia'
import BaseCard from '../components/BaseCard.vue'
import HonorsCard from '../components/HonorsCard.vue'
import { useEducationStore } from '../stores/education.js'

const educationStore = useEducationStore()
// 解构 state（honors）与 getter（honorsCount），均保持响应式
const { honors, honorsCount } = storeToRefs(educationStore)
</script>

<template>
  <BaseCard id="honors" :title="`荣誉成就（共 ${honorsCount} 项）`">
    <HonorsCard v-model:honors="honors" />
  </BaseCard>
</template>
