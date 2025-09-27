<template>
  <div>
    <section class="hero-section">
      <div class="container">
        <h1 class="hero-title">Kernel Explorer</h1>
        <p class="hero-subtitle">Explore blocks, transactions, and addresses on the Kernel blockchain</p>
        <div class="search-bar-wrapper">
          <SearchBar />
        </div>
      </div>
    </section>

    <div class="main-content-area container">
      <div v-if="loading" class="loading-message">Loading Blockchain Data...</div>
      <div v-else>
        <div class="stats-grid">
          <StatCard 
            v-for="stat in stats" 
            :key="stat.title"
            :title="stat.title"
            :value="stat.value"
            :change="stat.change"
            :changeType="stat.changeType"
            :icon="getIconForStat(stat.title)"
            :color="stat.color"
          />
        </div>
        <div class="lists-grid">
          <LatestBlocks :blocks="latestBlocks" @navigate="(blockHash) => $emit('navigate', 'BlockDetailsPage', { blockHash })" />
          <LatestTransactions :transactions="latestTransactions" @navigate="(page, props) => $emit('navigate', page, props)" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { apiState } from '../store.js';
import StatCard from '../components/StatCard.vue';
import LatestBlocks from '../components/LatestBlocks.vue';
import LatestTransactions from '../components/LatestTransactions.vue';
import SearchBar from '../components/SearchBar.vue';
import { Monitor, Zap, ArrowLeftRight, Users } from 'lucide-vue-next';

const loading = ref(true);
const allBlocks = ref([]);
const allTransactions = ref([]);

defineEmits(['navigate']);

const stats = computed(() => [
  { title: "Latest Block", value: allBlocks.value.length > 0 ? allBlocks.value[0].height.toLocaleString() : '0', change: "+1 block/15s", changeType: "increase", color: "blue" },
  { title: "Total Transactions", value: allTransactions.value.length.toLocaleString(), change: "+150 TPS", changeType: "increase", color: "purple" },
  { title: "Network Hashrate", value: "N/A", change: "+2.3% today", changeType: "increase", color: "green" },
  { title: "Active Addresses", value: "N/A", change: "+5.7% week", changeType: "increase", color: "orange" }
]);

const latestBlocks = computed(() => allBlocks.value.slice(0, 5));
const latestTransactions = computed(() => allTransactions.value.slice(0, 5));

const getIconForStat = (title) => {
  const map = {
    "Latest Block": Monitor, "Total Transactions": ArrowLeftRight,
    "Network Hashrate": Zap, "Active Addresses": Users
  };
  return map[title] || Monitor;
};


onMounted(async () => {
  loading.value = true;
  apiState.isConnecting = true;
  try {
    const [blocksRes, txsRes] = await Promise.all([
      fetch(`${apiState.baseUrl}/api/blocks`), 
    ]);
    
    if (blocksRes.ok) {
      allBlocks.value = await blocksRes.json();
      apiState.isConnected = true; 
    } else {
      apiState.isConnected = false;
    }
  } catch (error) {
    console.error("Erreur de connexion:", error);
    apiState.isConnected = false;
  } finally {
    loading.value = false;
    apiState.isConnecting = false;
  }
});
</script>

<style scoped>
.hero-section {
  padding: 4rem 0 6rem 0;
  background: linear-gradient(100deg, #4f46e5, #8b5cf6);
  color: white;
  text-align: center;
}
.hero-title {
  font-size: 3rem;
  font-weight: 800;
}
.hero-subtitle {
  font-size: 1.125rem;
  color: #e0e7ff;
  margin-top: 0.5rem;
  margin-bottom: 2rem;
}
.search-bar-wrapper {
  max-width: 600px;
  margin: 0 auto;
}
.search-bar-wrapper :deep(.search-input) {
  background-color: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
  color: white;
}
.search-bar-wrapper :deep(.search-input::placeholder) {
  color: #c7d2fe;
}
.search-bar-wrapper :deep(.search-button) {
  background-color: white;
  color: #4f46e5;
}
.main-content-area {
  margin-top: -4rem; 
}
.loading-message {
  text-align: center;
  padding: 4rem;
  font-size: 1.25rem;
  color: #6b7280;
}
</style>