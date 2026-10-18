<script setup>
import { ref, computed, watch } from 'vue'
import BaseCard from './BaseCard.vue'
import BaseButton from './BaseButton.vue'
import { useAuthStore } from '../stores/auth.js'

// defineModel('skills')：与父组件 v-model:skills 双向绑定，
// 对 skills.value 的增删改会自动同步回父组件
const skills = defineModel('skills', { required: true })

defineProps({
  id: { type: String, default: '' },
  title: { type: String, default: '技能 / 兴趣' },
  placeholder: { type: String, default: '输入关键词筛选' }
})
const emit = defineEmits(['open-gallery'])

const authStore = useAuthStore()

// 内容修改入口仅登录（管理员）可见，访客浏览为纯只读
const canEdit = computed(() => authStore.isLoggedIn)

const keyword = ref('')
const editing = ref(false)
// 新增项的输入值
const newName = ref('')

const filteredSkills = computed(() => {
  const kw = keyword.value.trim().toLowerCase()
  if (!kw) return skills.value
  return skills.value.filter(s => s.name.toLowerCase().includes(kw))
})

watch(keyword, (newVal, oldVal) => {
  console.log(`[watch] 关键词变化："${oldVal}" -> "${newVal}"，筛选结果 ${filteredSkills.value.length} 项`)
})

// 新增一项
function addItem() {
  const name = newName.value.trim()
  if (!name) return
  const nextId = skills.value.length
    ? Math.max(...skills.value.map(s => s.id)) + 1
    : 1
  skills.value.push({ id: nextId, name })
  newName.value = ''
}

// 删除一项
function removeItem(id) {
  const idx = skills.value.findIndex(s => s.id === id)
  if (idx > -1) skills.value.splice(idx, 1)
}

function toggleEdit() {
  editing.value = !editing.value
}
</script>

<template>
  <BaseCard :id="id" :title="title">
    <template #header-extra>
      <BaseButton v-if="canEdit" @click="toggleEdit">{{ editing ? '完成' : '编辑' }}</BaseButton>
    </template>

    <input
      class="search-box"
      v-model="keyword"
      type="text"
      :placeholder="placeholder"
    />

    <!-- 编辑模式：新增输入框 -->
    <div class="add-row" v-if="editing">
      <input v-model="newName" type="text" placeholder="输入名称后添加" @keyup.enter="addItem" />
      <BaseButton @click="addItem">添加</BaseButton>
    </div>

    <div class="chips" v-if="filteredSkills.length">
      <template v-for="skill in filteredSkills" :key="skill.id">
        <slot
          name="chip"
          :skill="skill"
          :open-gallery="() => emit('open-gallery', skill)"
        >
          <span
            class="chip"
            :class="{ clickable: skill.images }"
            @click="!editing && skill.images && skill.images.length && emit('open-gallery', skill)"
          >
            {{ skill.name }}{{ skill.images ? ' 📷' : '' }}
            <!-- 编辑模式下显示删除按钮 -->
            <button v-if="editing" class="chip-del" @click.stop="removeItem(skill.id)">×</button>
          </span>
        </slot>
      </template>
    </div>
    <p v-else class="empty">没有匹配 "{{ keyword }}" 的项，试试别的关键词。</p>
  </BaseCard>
</template>

<style scoped>
.search-box {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid var(--border);
  border-radius: 10px;
  background: var(--bg);
  color: var(--text);
  font-size: 14px;
  margin-bottom: 14px;
}
.add-row {
  display: flex;
  gap: 10px;
  margin-bottom: 14px;
}
.add-row input {
  flex: 1;
  padding: 8px 10px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--bg);
  color: var(--text);
  font-size: 14px;
}
.chips { display: flex; flex-wrap: wrap; gap: 10px; }
.chip {
  background: var(--chip);
  color: var(--chip-text);
  padding: 6px 14px;
  border-radius: 999px;
  font-size: 14px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.empty { color: var(--sub); font-size: 14px; }

.chip.clickable {
  cursor: pointer;
  transition: transform .15s, background .2s;
}
.chip.clickable:hover {
  transform: translateY(-2px);
  background: var(--accent);
  color: #fff;
}
.chip-del {
  background: transparent;
  border: none;
  color: inherit;
  font-size: 16px;
  line-height: 1;
  cursor: pointer;
  padding: 0 2px;
  opacity: .7;
}
.chip-del:hover { opacity: 1; }
</style>
