<script setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import SkillsCard from '../components/SkillsCard.vue'
import ImageModal from '../components/ImageModal.vue'
import { useSkillsStore } from '../stores/skills.js'

const skillsStore = useSkillsStore()
// 解构 state（skills）与 getter（skillCount），均保持响应式
const { skills, skillCount } = storeToRefs(skillsStore)

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
    id="skills"
    v-model:skills="skills"
    :title="`技能（共 ${skillCount} 项）`"
    placeholder="输入技能关键词筛选（如 Vue、Python）"
    @open-gallery="openSkillImage"
  />
  <ImageModal
    v-if="selectedSkill"
    :skill="selectedSkill"
    v-model:current-index="currentImageIndex"
    @close="closeSkillImage"
  />
</template>
