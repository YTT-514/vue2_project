<script setup>
import { ref, computed } from 'vue'
import BaseCard from './BaseCard.vue'
import BaseButton from './BaseButton.vue'
import { useAuthStore } from '../stores/auth.js'

// defineModel('education')：与父组件 v-model:education 双向绑定
const education = defineModel('education', { required: true })

const authStore = useAuthStore()

// 内容修改入口仅登录（管理员）可见，访客浏览为纯只读
const canEdit = computed(() => authStore.isLoggedIn)

const editing = ref(false)
// 新建条目草稿
const draft = ref({ period: '', school: '', major: '', degree: '', detail: '' })

function toggleEdit() {
  editing.value = !editing.value
  // 重置草稿
  draft.value = { period: '', school: '', major: '', degree: '', detail: '' }
}

// 新增一条学习经历
function addItem() {
  if (!draft.value.school) return
  education.value.push({ ...draft.value })
  draft.value = { period: '', school: '', major: '', degree: '', detail: '' }
}

// 删除一条
function removeItem(index) {
  education.value.splice(index, 1)
}
</script>

<template>
  <BaseCard id="education" title="学习经历">
    <template #header-extra>
      <BaseButton v-if="canEdit" @click="toggleEdit">{{ editing ? '完成' : '编辑' }}</BaseButton>
    </template>

    <!-- 编辑模式：新增表单 -->
    <div class="edit-form" v-if="editing">
      <div class="form-grid">
        <div><label>时间</label><input v-model="draft.period" type="text" placeholder="如 2022.09 - 至今" /></div>
        <div><label>学校</label><input v-model="draft.school" type="text" /></div>
        <div><label>专业</label><input v-model="draft.major" type="text" /></div>
        <div><label>学历</label><input v-model="draft.degree" type="text" /></div>
      </div>
      <div><label>描述</label><input v-model="draft.detail" type="text" /></div>
      <div class="form-actions">
        <BaseButton @click="addItem">添加</BaseButton>
      </div>
    </div>

    <div class="timeline">
      <div class="timeline-item" v-for="(item, i) in education" :key="i">
        <div class="dot"></div>
        <div class="content">
          <!-- 编辑模式：可直接修改每条 -->
          <template v-if="editing">
            <input v-model="item.period" class="editable period" />
            <input v-model="item.school" class="editable title" />
            <input v-model="item.major" class="editable desc" />
            <input v-model="item.degree" class="editable desc" />
            <input v-model="item.detail" class="editable detail" />
            <button class="del-btn" @click="removeItem(i)">删除</button>
          </template>
          <template v-else>
            <div class="period">{{ item.period }}</div>
            <h3 class="title">{{ item.school }}</h3>
            <p class="desc">{{ item.major }} · {{ item.degree }}</p>
            <p class="detail" v-if="item.detail">{{ item.detail }}</p>
          </template>
        </div>
      </div>
    </div>
  </BaseCard>
</template>

<style scoped>
.timeline {
  position: relative;
  padding-left: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.timeline::before {
  content: '';
  position: absolute;
  left: 7px;
  top: 6px;
  bottom: 6px;
  width: 2px;
  background: var(--border);
}
.timeline-item { position: relative; }
.timeline-item .dot {
  position: absolute;
  left: -24px;
  top: 6px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--accent);
  border: 2px solid var(--card);
  box-shadow: 0 0 0 2px var(--accent);
}
.period { font-size: 13px; color: var(--sub); margin-bottom: 4px; }
.title { margin: 0 0 4px; font-size: 16px; color: var(--text); }
.desc { margin: 0 0 4px; font-size: 14px; color: var(--sub); }
.detail { margin: 0; font-size: 14px; color: var(--text); line-height: 1.6; }

/* 编辑模式 */
.edit-form {
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 12px;
}
.edit-form label { font-size: 13px; color: var(--sub); display: block; margin-bottom: 4px; }
.edit-form input {
  width: 100%;
  padding: 8px 10px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--card);
  color: var(--text);
  font-size: 14px;
}
.form-actions { display: flex; gap: 10px; }

.editable {
  width: 100%;
  padding: 6px 8px;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: var(--bg);
  color: var(--text);
  font-size: 14px;
  margin-bottom: 6px;
}
.del-btn {
  margin-top: 8px;
  background: #ef4444;
  color: #fff;
  border: none;
  padding: 4px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
}
</style>
