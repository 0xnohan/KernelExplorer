<template>
  <div class="card stat-card">
    <div class="text-content">
      <p class="title">{{ title }}</p>
      <p class="value">{{ value }}</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  value: String
});
</script>

<style scoped>
.stat-card {
  padding: 1rem; 
}
.title {
  font-size: 0.75rem;
  color: var(--color-text-secondary); 
  margin: 0 0 0.25rem 0; 
}
.value {
  font-size: 1.25rem;
  font-weight: 700;
  color: #ffffff; 
  margin: 0;
}
</style>