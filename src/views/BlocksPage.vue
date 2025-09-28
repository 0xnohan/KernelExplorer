<template>
  <div class="container">
    <div v-if="loading" class="loading-message">Loading Blocks...</div>
    <div v-else>
      <BlocksList :blocks="paginatedBlocks" @navigate="forwardNavigation" />
      <div v-if="totalPages > 1" class="pagination-controls">
        <button @click="prevPage" :disabled="currentPage === 1" class="page-button">
          &lt; Previous
        </button>
        <span class="page-info">Page {{ currentPage }} of {{ totalPages }}</span>
        <button @click="nextPage" :disabled="currentPage === totalPages" class="page-button">
          Next &gt;
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import BlocksList from '../components/BlocksList.vue';
import { apiState } from '../store.js'; 

const loading = ref(true);
const allBlocks = ref([]);
const currentPage = ref(1);
const itemsPerPage = 10;

const emit = defineEmits(['navigate']);
const forwardNavigation = (pageName, props) => {
  emit('navigate', pageName, props);
};

const totalPages = computed(() => Math.ceil(allBlocks.value.length / itemsPerPage));

const paginatedBlocks = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return allBlocks.value.slice(start, end);
});

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

onMounted(async () => {
  loading.value = true;
  apiState.isConnecting = true;
  try {
    const response = await fetch(`${apiState.baseUrl}/api/blocks`);
    if(response.ok) {
        allBlocks.value = await response.json();
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

.pagination-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
  padding-bottom: 2rem;
}

.page-button {
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: var(--color-text-primary);
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.page-button:hover:not(:disabled) {
  background-color: rgba(255, 255, 255, 0.2);
}

.page-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  color: var(--color-text-secondary);
  font-weight: 500;
}
</style>