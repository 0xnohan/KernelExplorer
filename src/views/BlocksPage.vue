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
    // Note: L'URL de l'API a été mise à jour pour correspondre à la discussion précédente
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
  padding: 2rem 2.5rem; /* Padding augmenté pour plus d'espace */
}

.loading-message {
  text-align: center;
  padding: 4rem;
  font-size: 1.25rem;
  color: var(--color-text-secondary); /* Couleur claire pour la lisibilité */
}
</style>