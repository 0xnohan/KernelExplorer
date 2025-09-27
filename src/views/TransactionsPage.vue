<template>
  <div class="container">
    <div v-if="loading" class="loading-message">Loading latest transactions...</div>
    <TransactionsList v-else :transactions="transactions" @navigate="handleNavigation" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { apiState } from '../store.js';
import TransactionsList from '../components/TransactionsList.vue';

const emit = defineEmits(['navigate']);

const loading = ref(true);
const transactions = ref([]);

onMounted(async () => {
  apiState.isConnecting = true;
  try {
    const response = await fetch(`${apiState.baseUrl}/api/transactions`);
    if (response.ok) {
      transactions.value = await response.json();
      apiState.isConnected = true;
    } else {
      apiState.isConnected = false;
      console.error("Failed to fetch transactions");
    }
  } catch (error) {
    apiState.isConnected = false;
    console.error("Error fetching transactions:", error);
  } finally {
    loading.value = false;
    apiState.isConnecting = false;
  }
});

// Fonction pour propager l'événement de navigation au parent (App.vue)
const handleNavigation = (page, params) => {
  emit('navigate', page, params);
};
</script>

<style scoped>
.container {
  padding: 2rem;
}
.loading-message {
  text-align: center;
  padding: 4rem;
  font-size: 1.25rem;
  color: var(--color-text-secondary);
}
</style>