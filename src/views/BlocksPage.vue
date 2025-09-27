<template>
  <div class="container">
    <div v-if="loading" class="loading-message">Loading Blocks...</div>
    <BlocksList v-else :blocks="blocks" @navigate="forwardNavigation" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import BlocksList from '../components/BlocksList.vue';
import { apiState } from '../store.js'; // Import apiState pour l'URL

const loading = ref(true);
const blocks = ref([]);

const emit = defineEmits(['navigate']);

// NOUVELLE FONCTION POUR RELAYER CORRECTEMENT L'ÉVÉNEMENT
const forwardNavigation = (pageName, props) => {
  emit('navigate', pageName, props);
};

onMounted(async () => {
  loading.value = true;
  apiState.isConnecting = true;
  try {
    const response = await fetch(`${apiState.baseUrl}/api/blocks`);
    if(response.ok) {
        blocks.value = await response.json();
        apiState.isConnected = true;
    } else {
        apiState.isConnected = false;
    }
  } catch (error) {
    console.error("Failed to fetch blocks:", error);
    apiState.isConnected = false;
  } finally {
    loading.value = false;
    apiState.isConnecting = false;
  }
});
</script>

<style scoped>
.container {
  padding: 2rem 2.5rem;
}

.loading-message {
  text-align: center;
  padding: 4rem;
  font-size: 1.25rem;
  color: var(--color-text-secondary);
}
</style>