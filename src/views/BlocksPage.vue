<template>
  <div class="container">
    <div v-if="loading" class="loading-message">Loading Blocks...</div>
    <BlocksList v-else :blocks="blocks" @navigate="$emit('navigate', 'BlockDetailsPage', $event)" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import BlocksList from '../components/BlocksList.vue';

const loading = ref(true);
const blocks = ref([]);

defineEmits(['navigate']);

onMounted(async () => {
  try {
    const response = await fetch('http://127.0.0.1:8001/api/blocks');
    blocks.value = await response.json();
  } catch (error) {
    console.error("Failed to fetch blocks:", error);
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.container {
  padding: 2rem;
}
.loading-message {
  text-align: center;
  padding: 4rem;
  font-size: 1.25rem;
  color: #6b7280;
}
</style>