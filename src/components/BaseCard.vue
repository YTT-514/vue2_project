<script setup>
// 通用卡片容器：统一各分区的外观
// id 用于锚点定位（scroll-margin-top 见 common.css），title 为分区标题
// 插槽：header-extra（标题行右侧操作区）、默认（正文）、footer（底部操作区）
defineProps({
  id: { type: String, default: '' },
  // title 可选：个人信息卡片以姓名 h1 作为标题，不传则不渲染标题行
  title: { type: String, default: '' }
})
</script>

<template>
  <section :id="id" class="card">
    <h2 class="section-title" v-if="title">
      {{ title }}
      <slot name="header-extra" />
    </h2>
    <slot />
    <div class="card-footer" v-if="$slots.footer">
      <slot name="footer" />
    </div>
  </section>
</template>

<style scoped>
.card-footer {
  display: flex;
  gap: 10px;
  margin-top: 16px;
}
</style>
