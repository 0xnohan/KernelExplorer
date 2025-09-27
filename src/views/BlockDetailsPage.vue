<template>
  <div class="container">
    <div v-if="loading" class="loading-message">Loading Block Details...</div>
    <div v-else-if="block">
      <div class="page-header">
        <button class="back-button" @click="$emit('navigate', 'BlocksPage')">
          <ArrowLeft />
        </button>
        <h1 class="page-title">Block {{ block.block_number }}</h1>
      </div>

      <div class="card info-card">
        <h2 class="card-title">Block Information</h2>
        <div class="info-grid">
          <div class="detail-row">
            <span class="label"><Hash class="icon" />Block Hash</span>
            <span class="value font-mono hash-link">{{ block.hash }}</span>
          </div>
          <div class="detail-row">
            <span class="label"><ArrowLeft class="icon" />Previous Hash</span>
            <span class="value font-mono hash-link">{{ block.previous_hash }}</span>
          </div>
          <div class="detail-row">
            <span class="label"><FileBox class="icon" />Merkle Root</span>
            <span class="value">{{ block.merkle_root }}</span>
          </div>
          <div class="detail-row">
            <span class="label"><FileBox class="icon" />Nonce</span>
            <span class="value">{{ block.nonce }}</span>
          </div>
          <div class="detail-row">
            <span class="label"><Zap class="icon" />Block Size / Block Limit</span>
            <span class="value">{{ block.size }} bytes / 1 000 000 bytes ({{ ((block.size / 1000000) * 100).toFixed(2) }}%)</span>
          </div>
          <div class="detail-row">
            <span class="label"><Clock class="icon" />Timestamp</span>
            <span class="value">{{ new Date(block.timestamp).toLocaleString() }}</span>
          </div>
          <div class="detail-row">
            <span class="label"><ArrowLeftRight class="icon" />Transactions</span>
            <span class="value">
              <span class="tx-badge">{{ block.transaction_count }} transactions</span>
            </span>
          </div>
          <div class="detail-row">
            <span class="label"><Gift class="icon" />Block Reward</span>
            <span class="value">
              <span class="reward-badge">{{ block.reward }} KNL</span>
            </span>
          </div>
          <div class="detail-row">
            <span class="label"><User class="icon" />Miner</span>
            <span class="value font-mono">{{ block.miner }}</span>
          </div>
        </div>
      </div>

      <div class="card tx-card">
        <h2 class="card-title">{{ block.transactions.length }} transaction(s) in Block {{ block.block_number }} </h2>
        <div class="list-container">
           <div class="list-header">
            <span>Txn Hash</span>
            <span>From</span>
            <span>To</span>
            <span class="text-right">Value</span>
          </div>
          <div class="list-body">
            <div v-for="tx in block.transactions" :key="tx.hash" class="list-row">
              <div class="txn-hash-cell">
                <CheckCircle2 size="18" class="status-icon-success" />
                <span class="font-mono hash-link">{{ tx.hash.substring(0, 15) }}...</span>
              </div>
              <span class="font-mono">{{ tx.inputs[0].address.includes('Coinbase') ? 'Coinbase' : tx.inputs[0].address.substring(0, 15) + '...' }}</span>
              <span class="font-mono">{{ tx.outputs[0].address.substring(0, 15) }}...</span>
              <span class="text-right">{{ tx.outputs[0].amount }} KNL</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="loading-message">Block not found.</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { apiState } from '../store.js';
import { ArrowLeft, Clock, ArrowLeftRight, User, Zap, Gift, FileBox, Hash, CheckCircle2 } from 'lucide-vue-next';

const props = defineProps({
  blockHash: { type: String, required: true }
});

defineEmits(['navigate']);

const loading = ref(true);
const block = ref(null);

onMounted(async () => {
  if (!props.blockHash) return;
  apiState.isConnecting = true;
  try {
    const response = await fetch(`${apiState.baseUrl}/api/block/${props.blockHash}`); 
    if (response.ok) {
      block.value = await response.json();
      apiState.isConnected = true;
    } else {
      apiState.isConnected = false;
    }
  } catch (error) {
    console.error(`Impossible to fetch block details for ${props.blockHash}:`, error);
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

.page-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}
.back-button {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s;
}
.back-button:hover {
  background: rgba(255, 255, 255, 0.2);
}
.page-title {
  font-size: 2.5rem;
  font-weight: 800;
  color: var(--color-text-primary);
}

.card {
  margin-bottom: 2rem;
  overflow: hidden;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 600;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.info-grid {
  display: flex;
  flex-direction: column;
}

.detail-row {
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 1.5rem;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 0.875rem;
}
.detail-row:last-child {
  border-bottom: none;
}

.label {
  color: var(--color-text-secondary);
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: 500;
}
.label .icon {
  width: 16px;
  height: 16px;
  color: #a5b4fc;
}
.value {
  color: var(--color-text-primary);
}
.font-mono {
  font-family: monospace;
}
.hash-link {
  color: var(--color-blue);
  cursor: pointer;
}

.tx-badge {
  background-color: rgba(129, 140, 248, 0.2);
  color: #a5b4fc;
  padding: 0.35rem 0.75rem;
  border-radius: 6px;
}
.reward-badge {
  background-color: rgba(52, 211, 153, 0.2);
  color: #6ee7b7;
  padding: 0.35rem 0.75rem;
  border-radius: 6px;
}

.list-container {
  padding: 0 1.5rem 1.5rem;
}
.list-header, .list-row {
  display: grid;
  grid-template-columns: 1.5fr 1.2fr 1.2fr 1fr;
  gap: 1rem;
  align-items: center;
}
.list-header {
  padding: 1rem 0;
  font-size: 0.75rem;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  font-weight: 500;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
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
.text-right {
  text-align: right;
}
.txn-hash-cell {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
.status-icon-success {
  color: #6ee7b7;
}
</style>