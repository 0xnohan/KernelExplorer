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
          <LatestBlocks :blocks="latestBlocks" @navigate="(page, params) => $emit('navigate', page, params)" />
          <LatestTransactions :transactions="latestTransactions" @navigate="(page, params) => $emit('navigate', page, params)" />
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
const networkStats = ref({
  total_transactions: 0,
  active_addresses: 0,
  network_hashrate: "N/A"
});

defineEmits(['navigate']);

const stats = computed(() => [
  { title: "Current Block", value: allBlocks.value.length > 0 ? allBlocks.value[0].height.toLocaleString() : '0', change: "", changeType: "", color: "blue" }, //increase
  { title: "Total Transactions", value: networkStats.value.total_transactions.toLocaleString(), change: "", changeType: "", color: "purple" },
  { title: "Network Hashrate", value: networkStats.value.network_hashrate, change: "", changeType: "", color: "green" },
  { title: "Active Addresses", value: networkStats.value.active_addresses.toLocaleString(), change: "", changeType: "", color: "orange" }
]);

const latestBlocks = computed(() => allBlocks.value.slice(0, 5));
const latestTransactions = computed(() => allTransactions.value.slice(0, 5));

const getIconForStat = (title) => {
  const map = {
    "Current Block": Monitor, "Total Transactions": ArrowLeftRight,
    "Network Hashrate": Zap, "Active Addresses": Users
  };
  return map[title] || Monitor;
};

onMounted(async () => {
  loading.value = true;
  apiState.isConnecting = true;
  try {
    const [blocksRes, txsRes, statsRes] = await Promise.all([
      fetch(`${apiState.baseUrl}/api/blocks`),
      fetch(`${apiState.baseUrl}/api/transactions`),
      fetch(`${apiState.baseUrl}/api/stats`) 
    ]);

    if (blocksRes.ok) allBlocks.value = await blocksRes.json();
    if (txsRes.ok) allTransactions.value = await txsRes.json();
    if (statsRes.ok) networkStats.value = await statsRes.json();

    if (blocksRes.ok && txsRes.ok && statsRes.ok) {
        apiState.isConnected = true;
    } else {
        apiState.isConnected = false;
    }

  } catch (error) {
    console.error("Connexion error:", error);
    apiState.isConnected = false;
  } finally {
    loading.value = false;
    apiState.isConnecting = false;
  }
});
</script>

<style scoped>
.hero-section {
  padding: 4rem 0;
  background: transparent;
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
.main-content-area {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}
.loading-message {
  text-align: center;
  padding: 4rem;
  font-size: 1.25rem;
  color: #e0e7ff;
}
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
}
.lists-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  align-items: start;
}
</style>