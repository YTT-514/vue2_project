<script setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import SkillsCard from '../components/SkillsCard.vue'
import ImageModal from '../components/ImageModal.vue'
import { useSkillsStore } from '../stores/skills.js'

const skillsStore = useSkillsStore()
// 解构 state（interests）与 getters（interestCount、interestsWithImages）
// interestsWithImages 可用于判断是否显示「有图集」徽标
const { interests, interestCount, interestsWithImages } = storeToRefs(skillsStore)

// 图集弹窗状态（本视图内部管理）
const selectedSkill = ref(null)
const currentImageIndex = ref(0)

function openSkillImage(skill) {
  selectedSkill.value = skill
  currentImageIndex.value = 0
}

function closeSkillImage() {
  selectedSkill.value = null
  currentImageIndex.value = 0
}
</script>

<template>
  <SkillsCard
    id="interests"
    v-model:skills="interests"
    :title="`兴趣（共 ${interestCount} 项，${interestsWithImages.length} 项含图集）`"
    placeholder="输入兴趣关键词筛选（如 摄影、旅游）"
    @open-gallery="openSkillImage"
  />
  <ImageModal
    v-if="selectedSkill"
    :skill="selectedSkill"
    v-model:current-index="currentImageIndex"
    @close="closeSkillImage"
  />
</template>
