<template>
  <div class="container">
    <div class="main-content-area">
      <div v-if="loading" class="loading-message">Loading Blockchain Data...</div>
      <div v-else>
        <div class="stats-grid">
          <StatCard
            v-for="stat in stats"
            :key="stat.title"
            :title="stat.title"
            :value="stat.value"
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

const loading = ref(true);
const allBlocks = ref([]);
const allTransactions = ref([]);
const networkStats = ref({
  total_transactions: 0,
  active_addresses: 0,
  network_hashrate: "0 H/s"
});

const emit = defineEmits(['navigate']);

const stats = computed(() => {
  const currentBlockHeight = allBlocks.value.length > 0 ? allBlocks.value[0].height : 0;

  return [
    { title: "Block Height", value: currentBlockHeight.toLocaleString() },
    { title: "Current Supply (KOR)", value: (currentBlockHeight * 50).toLocaleString() },
    { title: "Active Addresses", value: networkStats.value.active_addresses.toLocaleString() },
    { title: "Volume (Txs/24h)", value: networkStats.value.total_transactions.toLocaleString() - currentBlockHeight - 1 },
    { title: "Network (Hashrate)", value: networkStats.value.network_hashrate },
  ];
});

const latestBlocks = computed(() => allBlocks.value.slice(0, 4));
const latestTransactions = computed(() => allTransactions.value.slice(0, 5));

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
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); 
  gap: 1.5rem;
}
@media (min-width: 1280px) { 
  .stats-grid {
    grid-template-columns: repeat(5, 1fr);
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