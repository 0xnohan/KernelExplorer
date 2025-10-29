<template>
  <div class="container">
    <div class="page-header">
      <h1 class="page-title">Mempool</h1>
      <p class="page-subtitle">Live stream of unconfirmed transactions</p>
    </div>

    <div class="stats-grid">
      <StatCard
        title="Pending Transactions"
        :value="pendingTxCount"
        change=""
        changeType=""
        :icon="Hourglass"
        color="orange"
      />
      <StatCard
        title="Total Value in Mempool"
        :value="`${totalMempoolValue} KOR`"
        change=""
        changeType=""
        :icon="Coins"
        color="blue"
      />
    </div>

    <div class="card tx-card">
      <div class="card-header">
        <div class="title-container">
          <Activity class="title-icon" />
          <h3>Pending Transactions</h3>
          <span v-if="!loading" class="live-dot-container">
            <span class="live-dot"></span>
            Live
          </span>
        </div>
      </div>

      <div v-if="loading" class="loading-message-inner">Loading Mempool...</div>
      <div v-else-if="mempoolTxs.length === 0" class="no-data-message">
        Mempool is currently empty
      </div>
      <div v-else class="list-container">
        <div class="list-header">
          <span>Txn Hash</span>
          <span>Time Received</span>
          <span class="text-right">Amount</span>
        </div>

        <div class="list-body">
          <transition-group name="list-fade" tag="div">
            <div v-for="tx in mempoolTxs" :key="tx.hash" class="list-row">
              <div class="txn-hash-cell">
                <a 
                  href="#" 
                  @click.prevent="$emit('navigate', 'TransactionDetailsPage', { txHash: tx.hash })" 
                  class="font-mono hash-link" 
                  :title="tx.hash"
                >
                  {{ truncateHash(tx.hash) }}
                </a>
                <Copy size="14" class="copy-icon-inline" @click="copyToClipboard(tx.hash)" title="Copy hash" />
              </div>

              <div class="cell-content">
                <Clock class="cell-icon" />
                <span>{{ formatTimestampAgo(tx.received_time * 1000) }}</span>
              </div>

              <div class="text-right">
                <span class="value-badge">
                  {{ tx.value.toFixed(8) }} KOR
                </span>
              </div>
            </div>
          </transition-group>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { apiState } from '../store.js';
import StatCard from '../components/StatCard.vue';
import { Hourglass, Coins, Activity, Clock, Copy } from 'lucide-vue-next';

defineEmits(['navigate']);

const loading = ref(true);
const mempoolTxs = ref([]);
let intervalId = null;

const pendingTxCount = computed(() => mempoolTxs.value.length.toLocaleString());

const totalMempoolValue = computed(() => {
  const total = mempoolTxs.value.reduce((sum, tx) => sum + (tx.value || 0), 0);
  return total.toFixed(8); 
});

const fetchMempoolData = async () => {
  try {
    const response = await fetch(`${apiState.baseUrl}/api/mempool`);
    if (response.ok) {
      let txs = await response.json();
      txs.sort((a, b) => b.received_time - a.received_time);
      mempoolTxs.value = txs;
    }
  } catch (error) {
    console.error("Error fetching mempool data:", error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchMempoolData();
  intervalId = setInterval(fetchMempoolData, 5000); 
});

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId);
  }
});

const truncateHash = (hash, len = 10) => {
  if (!hash || hash.length <= (len * 2)) return hash;
  return `${hash.substring(0, len)}...${hash.substring(hash.length - len)}`;
};

const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
  } catch (err) {
    console.error('Failed to copy: ', err);
  }
};

const formatTimestampAgo = (timestamp) => {
  if (!timestamp) return 'N/A';
  const now = new Date();
  const past = new Date(timestamp);
  const seconds = Math.floor((now - past) / 1000);

  if (seconds < 2) return `just now`;
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  return `${minutes}m ${seconds % 60}s ago`;
};
</script>

<style scoped>
.container { 
  padding: 2rem 2.5rem; 
}
.page-header { 
  margin-bottom: 2rem; 
}
.page-title { 
  font-size: 2.5rem; 
  font-weight: 800; 
}
.page-subtitle { 
  font-size: 1.125rem; 
  color: var(--color-text-secondary); 
  margin-top: 0.5rem; 
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}
@media (min-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr); 
  }
}

.card {
  overflow: hidden;
}
.card-header {
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}
.title-container {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.25rem;
  font-weight: 600;
}
.title-icon {
  color: #a5b4fc;
}

.live-dot-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #6ee7b7;
  margin-left: 1rem;
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

.list-container {
  padding: 0 1.5rem 1.5rem;
}
.list-header, .list-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 1.5rem;
  align-items: center;
}
.list-header {
  padding: 1rem 0;
  font-size: 0.75rem;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  font-weight: 500;
  border-bottom: 1px solid rgba(255, 250, 255, 0.1);
}
.list-body {
  display: flex;
  flex-direction: column;
}
.list-row {
  padding: 1rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 0.875rem;
}
.list-row:last-child {
  border-bottom: none;
}
.cell-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--color-text-secondary);
}
.cell-icon {
  width: 16px;
  height: 16px;
  color: #a5b4fc;
  flex-shrink: 0;
}
.font-mono {
  font-family: monospace;
}
a.hash-link {
  color: var(--color-blue);
  cursor: pointer;
  text-decoration: none;
  transition: text-decoration 0.2s;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
a.hash-link:hover {
  text-decoration: underline;
}
.txn-hash-cell {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 0;
}
.copy-icon-inline {
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: color 0.2s;
  flex-shrink: 0;
}
.copy-icon-inline:hover {
  color: var(--color-text-primary);
}
.value-badge {
  background-color: rgba(255, 255, 255, 0.1);
  padding: 0.35rem 0.75rem;
  border-radius: 6px;
  font-weight: 500;
  font-family: monospace;
}
.text-right {
  text-align: right;
}

.loading-message-inner, .no-data-message {
  padding: 3rem 1.5rem;
  text-align: center;
  color: var(--color-text-secondary);
  font-size: 1.1rem;
}

.list-fade-enter-active,
.list-fade-leave-active {
  transition: all 0.5s ease;
}
.list-fade-enter-from,
.list-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
.list-fade-leave-active {
  position: absolute;
}
</style>