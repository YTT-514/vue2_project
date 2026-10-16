<script setup>
import { ref, computed } from 'vue'
import BaseCard from './BaseCard.vue'
import BaseButton from './BaseButton.vue'
import { useAuthStore } from '../stores/auth.js'

// defineModel('honors')：与父组件 v-model:honors 双向绑定
const honors = defineModel('honors', { required: true })

const authStore = useAuthStore()

// 内容修改入口仅登录（管理员）可见，访客浏览为纯只读
const canEdit = computed(() => authStore.isLoggedIn)

const editing = ref(false)
const draft = ref({ icon: '🏆', title: '', organization: '', date: '', desc: '' })

function toggleEdit() {
  editing.value = !editing.value
  draft.value = { icon: '🏆', title: '', organization: '', date: '', desc: '' }
}

function addItem() {
  if (!draft.value.title) return
  honors.value.push({ ...draft.value })
  draft.value = { icon: '🏆', title: '', organization: '', date: '', desc: '' }
}

function removeItem(index) {
  honors.value.splice(index, 1)
}
</script>

<template>
  <BaseCard id="honors" title="荣誉成就">
    <template #header-extra>
      <BaseButton v-if="canEdit" @click="toggleEdit">{{ editing ? '完成' : '编辑' }}</BaseButton>
    </template>

    <!-- 编辑模式：新增表单 -->
    <div class="edit-form" v-if="editing">
      <div class="form-grid">
        <div><label>图标(emoji)</label><input v-model="draft.icon" type="text" /></div>
        <div><label>荣誉名称</label><input v-model="draft.title" type="text" /></div>
        <div><label>颁发机构</label><input v-model="draft.organization" type="text" /></div>
        <div><label>时间</label><input v-model="draft.date" type="text" /></div>
      </div>
      <div><label>描述</label><input v-model="draft.desc" type="text" /></div>
      <div class="form-actions">
        <BaseButton @click="addItem">添加</BaseButton>
      </div>
    </div>

    <div class="honor-list">
      <div class="honor-item" v-for="(item, i) in honors" :key="i">
        <span class="medal">{{ item.icon }}</span>
        <div class="info">
          <template v-if="editing">
            <input v-model="item.icon" class="editable" />
            <input v-model="item.title" class="editable" />
            <input v-model="item.organization" class="editable" />
            <input v-model="item.date" class="editable" />
            <input v-model="item.desc" class="editable" />
            <button class="del-btn" @click="removeItem(i)">删除</button>
          </template>
          <template v-else>
            <h3 class="title">{{ item.title }}</h3>
            <p class="org">{{ item.organization }} · {{ item.date }}</p>
            <p class="desc" v-if="item.desc">{{ item.desc }}</p>
          </template>
        </div>
      </div>
    </div>
  </BaseCard>
</template>

<style scoped>
.honor-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.honor-item {
  display: flex;
  gap: 14px;
  padding: 14px;
  background: var(--bg);
  border-radius: 12px;
  border: 1px solid var(--border);
}
.medal {
  font-size: 28px;
  flex-shrink: 0;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--chip);
  border-radius: 50%;
}
.info .title { margin: 0 0 4px; font-size: 15px; color: var(--text); }
.info .org { margin: 0 0 4px; font-size: 13px; color: var(--sub); }
.info .desc { margin: 0; font-size: 14px; color: var(--text); line-height: 1.6; }

/* 编辑模式 */
.edit-form {
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
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
  background: var(--card);
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
