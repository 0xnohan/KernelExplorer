<template>
  <div class="container">
    <div class="page-header">
      <div class="header-left">
        <h1 class="page-title">Kore Explorer</h1>
        <div v-if="apiState.isConnected" class="live-dot-container">
          <span class="live-dot"></span>
          Live
        </div>
      </div>
      <div class="header-right">
        <SearchBar @search="handleSearch" />
      </div>
    </div>

    <div class="main-content-area">
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

const emit = defineEmits(['navigate']);

const handleSearch = async (query) => {
  try {
    const response = await fetch(`${apiState.baseUrl}/api/search/${query}`);
    if (response.ok) {
      const result = await response.json();
      if (result.found) {
        switch (result.type) {
          case 'block':
            emit('navigate', 'BlockDetailsPage', { blockHash: result.identifier });
            break;
          case 'transaction':
            emit('navigate', 'TransactionDetailsPage', { txHash: result.identifier });
            break;
          case 'address':
            emit('navigate', 'AddressDetailsPage', { addressHash: result.identifier });
            break;
        }
      } else {
        alert("No results found for your search.");
      }
    } else {
      alert("Error during search.");
    }
  } catch (error) {
    console.error("Search error:", error);
    alert("An error occurred during the search.");
  }
};

const stats = computed(() => [
  { title: "Current Block", value: allBlocks.value.length > 0 ? allBlocks.value[0].height.toLocaleString() : '0', change: "", changeType: "", color: "blue" },
  { title: "Total Transactions", value: networkStats.value.total_transactions.toLocaleString(), change: "", changeType: "", color: "purple" },
  { title: "Network Hashrate", value: networkStats.value.network_hashrate, change: "", changeType: "", color: "green" },
  { title: "Active Addresses", value: networkStats.value.active_addresses.toLocaleString(), change: "", changeType: "", color: "orange" }
]);

const latestBlocks = computed(() => allBlocks.value.slice(0, 4));
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
    console.error("Connection error:", error);
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
.page-header {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1.5rem;
  margin-bottom: 2rem;
}
@media (min-width: 768px) {
  .page-header {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}
.header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.page-title {
  font-size: 2.5rem;
  font-weight: 800;
  color: var(--color-text-primary);
}
.header-right {
  width: 100%;
  max-width: 600px;
}
.live-dot-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #6ee7b7;
  padding: 0.35rem 0.75rem;
  background-color: rgba(52, 211, 153, 0.1);
  border: 1px solid rgba(52, 211, 153, 0.2);
  border-radius: 9999px;
}
.live-dot {
  width: 10px;
  height: 10px;
  background-color: #6ee7b7;
  border-radius: 50%;
  animation: pulse 1.5s infinite;
}
@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(110, 231, 183, 0.7); }
  70% { box-shadow: 0 0 0 10px rgba(110, 231, 183, 0); }
  100% { box-shadow: 0 0 0 0 rgba(110, 231, 183, 0); }
}

.main-content-area {
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
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}
@media (min-width: 1024px) {
  .stats-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
.lists-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  align-items: start;
}
@media (min-width: 1024px) {
  .lists-grid {
    grid-template-columns: 1fr 1fr;
  }
}
</style>