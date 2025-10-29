<template>
  <div class="container">
    <div v-if="loading" class="loading-message">Loading Block Details...</div>
    <div v-else-if="block">
      <div class="page-header">
        <div class="header-left">
          <button class="back-button" @click="$emit('navigate', 'BlocksPage')">
            <ArrowLeft />
          </button>
          <h1 class="page-title">Block <span class="page-title-number">{{ block.block_number }}</span></h1>
        </div>
        </div>

      <div class="card summary-card">
        <h2 class="card-title address-title">
          <span class="font-mono">{{ block.hash }}</span>
          <Copy size="18" class="copy-icon" @click="copyToClipboard(block.hash)" title="Copy hash" />
        </h2>

        <div class="hash-section top-hash-section">
          <div class="detail-row-full">
            <span class="label">Previous Block Hash</span>
            <div class="value-with-copy">
              <a href="#" @click.prevent="$emit('navigate', 'BlockDetailsPage', { blockHash: block.previous_hash })" class="value font-mono hash-link">{{ block.previous_hash }}</a>
              <Copy size="14" class="copy-icon" @click="copyToClipboard(block.previous_hash)" title="Copy hash" />
            </div>
          </div>
        </div>

        <div class="summary-grid">
          <div class="summary-column">
            <div class="detail-row">
              <span class="label"><Clock class="icon" />Timestamp</span>
              <span class="value">
                {{ formatTimestampAgo(block.timestamp) }}
                <span class="timestamp-full">({{ formatFullTimestamp(block.timestamp) }})</span>
              </span>
            </div>
            <div class="detail-row">
              <span class="label"><ShieldCheck class="icon" />Confirmations</span>
              <span class="value font-mono">{{ block.confirmations }}</span>
            </div>
            <div class="detail-row">
              <span class="label"><ArrowLeftRight class="icon" />Transactions</span>
              <span class="value">
                <span class="tx-badge">{{ block.transaction_count }} transactions</span> in this block
              </span>
            </div>
            <div class="detail-row">
              <span class="label"><Gift class="icon" />Block Reward</span>
              <span class="value">
                <span class="reward-badge">{{ block.reward }} KOR</span>
              </span>
            </div>
            <div class="detail-row">
              <span class="label"><User class="icon" />Miner Address</span>
              <div class="value-with-copy">
                <a href="#" @click.prevent="$emit('navigate', 'AddressDetailsPage', { addressHash: block.miner })" class="value font-mono hash-link">{{ block.miner }}</a>
                <Copy size="14" class="copy-icon" @click="copyToClipboard(block.miner)" title="Copy address" />
              </div>
            </div>
          </div>
          
          <div class="summary-column">
            <div class="detail-row">
              <span class="label"><Settings2 class="icon" />Version</span>
              <span class="value font-mono">{{ block.version }}</span>
            </div>
            <div class="detail-row">
              <span class="label"><Zap class="icon" />Size</span>
              <span class="value">{{ block.size.toLocaleString() }} bytes ({{ ((block.size / 1000000) * 100).toFixed(2) }}%)</span>
            </div>
            <div class="detail-row">
              <span class="label"><Target class="icon" />Bits</span>
              <span class="value font-mono">{{ block.bits }}</span>
            </div>
            <div class="detail-row">
              <span class="label"><Puzzle class="icon" />Nonce</span>
              <span class="value font-mono">{{ block.nonce }}</span>
            </div>
            <div class="detail-row">
              <span class="label"><FileBox class="icon" />Merkle Root</span>
              <div class="value-with-copy">
                <span class="value font-mono">{{ block.merkle_root }}</span>
                <Copy size="14" class="copy-icon" @click="copyToClipboard(block.merkle_root)" title="Copy hash" />
              </div>
            </div>
          </div>
        </div>
        
        </div>

      <div class="card tx-card">
        <h2 class="card-title">{{ block.transactions.length }} transaction(s) in Block {{ block.block_number }}</h2>
        <div class="list-container">
           <div class="list-header">
            <span>Txn Hash</span>
            <span>From</span>
            <span>To</span>
            <span class="text-right">Amount</span>
          </div>
          <div class="list-body">
            <div v-for="tx in paginatedTransactions" :key="tx.hash" class="list-row">
              <div class="txn-hash-cell">
                <CheckCircle2 size="18" class="status-icon-success" />
                <a href="#" @click.prevent="$emit('navigate', 'TransactionDetailsPage', { txHash: tx.hash })" class="font-mono hash-link" :title="tx.hash">
                  {{ truncateHash(tx.hash, 10) }}
                </a>
                <Copy size="14" class="copy-icon-inline" @click="copyToClipboard(tx.hash)" title="Copy hash" />
              </div>
              
              <div class="address-cell">
                <span v-if="tx.inputs[0].address === 'Coinbase'" class="font-mono coinbase-text">Coinbase</span>
                <a v-else href="#" @click.prevent="$emit('navigate', 'AddressDetailsPage', { addressHash: tx.inputs[0].address })" class="font-mono hash-link" :title="tx.inputs[0].address">
                  {{ truncateHash(tx.inputs[0].address) }}
                </a>
                <Copy v-if="tx.inputs[0].address !== 'Coinbase'" size="14" class="copy-icon-inline" @click="copyToClipboard(tx.inputs[0].address)" title="Copy address" />
              </div>
            
              <div class="address-cell to-cell">
                <ArrowRight size="14" class="arrow-icon" />
                <a href="#" @click.prevent="$emit('navigate', 'AddressDetailsPage', { addressHash: tx.outputs[0].address })" class="font-mono hash-link" :title="tx.outputs[0].address">
                  {{ truncateHash(tx.outputs[0].address) }}
                </a>
                <Copy size="14" class="copy-icon-inline" @click="copyToClipboard(tx.outputs[0].address)" title="Copy address" />
                <span v-if="tx.outputs.length > 1" class="more-outputs-badge" :title="`${tx.outputs.length} total outputs`">
                  +{{ tx.outputs.length - 1 }}
                </span>
              </div>
              
              <span class="text-right amount-cell">{{ totalTxOutput(tx) }} KOR</span>
            </div>
          </div>
        </div>
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
    <div v-else class="loading-message">Block not found</div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import { apiState } from '../store.js';
import { 
  ArrowLeft, Clock, ArrowLeftRight, User, Zap, Gift, FileBox, Hash, 
  CheckCircle2, ArrowRight, Package, Copy, ChevronLeft, ShieldCheck, 
  Settings2, Target, Puzzle
} from 'lucide-vue-next';

const props = defineProps({
  blockHash: { type: String, required: true }
});
defineEmits(['navigate']);

const loading = ref(true);
const block = ref(null);
const currentPage = ref(1);
const itemsPerPage = 10;

const totalPages = computed(() => {
  if (!block.value) return 0;
  return Math.ceil(block.value.transactions.length / itemsPerPage);
});

const paginatedTransactions = computed(() => {
  if (!block.value) return [];
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return block.value.transactions.slice(start, end);
});

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++;
};

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};

const fetchBlockData = async (hash) => {
  if (!hash) return;
  loading.value = true;
  block.value = null;
  currentPage.value = 1;
  try {
    const response = await fetch(`${apiState.baseUrl}/api/block/${hash}`);
    if (response.ok) {
      block.value = await response.json();
      if (block.value && !block.value.nonce) {
        block.value.nonce = block.value.nonce; 
      }
    }
  } catch (error) {
    console.error(`Impossible to fetch block details for ${hash}:`, error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchBlockData(props.blockHash);
});

watch(() => props.blockHash, (newHash) => {
  if (newHash) {
    fetchBlockData(newHash);
  }
});

const truncateHash = (hash, len = 5) => {
  if (!hash || hash.length <= (len * 2)) return hash;
  return `${hash.substring(0, len)}-${hash.substring(hash.length - len)}`;
};

const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
  } catch (err) {
    console.error('Failed to copy: ', err);
  }
};

const formatTimestampAgo = (isoString) => {
  if (!isoString) return 'N/A';
  const now = new Date();
  const past = new Date(isoString);
  const seconds = Math.floor((now - past) / 1000);

  if (seconds < 2) return `just now`;
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

const formatFullTimestamp = (isoString) => {
  if (!isoString) return 'N/A';
  return new Date(isoString).toLocaleString();
};

const totalTxOutput = (tx) => {
  if (!tx || !tx.outputs) return '0.00';
  const total = tx.outputs.reduce((sum, out) => sum + (out.amount || 0), 0);
  return total.toFixed(8);
};

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
.card {
  margin-bottom: 2rem;
  overflow: hidden;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 2rem;
}
.header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
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
  white-space: nowrap;
}
.page-title-number {
  color: #a5b4fc;
  font-family: monospace;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 600;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}
.address-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-family: monospace;
  font-size: 1.15rem; 
  word-break: break-all;
}
.address-title .copy-icon {
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: color 0.2s;
  flex-shrink: 0;
}
.address-title .copy-icon:hover {
  color: var(--color-text-primary);
}
.summary-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  padding: 1.5rem;
}
@media (min-width: 768px) {
  .summary-grid {
    grid-template-columns: 1fr 1fr;
  }
}
.summary-column {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}
.detail-row {
  display: grid;
  grid-template-columns: 160px 1fr;
  gap: 1rem;
  font-size: 0.875rem;
  align-items: start;
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
  word-break: break-all;
}
.font-mono {
  font-family: monospace;
}
a.hash-link {
  color: var(--color-blue);
  cursor: pointer;
  text-decoration: none;
}
a.hash-link:hover {
  text-decoration: underline;
}
.value-with-copy {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.copy-icon {
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: color 0.2s;
}
.copy-icon:hover {
  color: var(--color-text-primary);
}
.timestamp-full {
  color: var(--color-text-secondary);
  font-size: 0.8rem;
  margin-left: 0.5rem;
}

.top-hash-section {
  padding: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}
.detail-row-full {
  display: grid;
  grid-template-columns: 160px 1fr;
  gap: 1rem;
  font-size: 0.875rem;
  align-items: start;
}

.tx-badge {
  background-color: rgba(129, 140, 248, 0.2);
  color: #a5b4fc;
  padding: 0.35rem 0.75rem;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
}
.reward-badge {
  background-color: rgba(52, 211, 153, 0.2);
  color: #6ee7b7;
  padding: 0.35rem 0.75rem;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
}
.more-outputs-badge {
  background-color: rgba(255, 255, 255, 0.15);
  color: #e0e7ff;
  padding: 0.15rem 0.4rem;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 600;
  margin-left: 0.25rem;
}

.list-container {
  padding: 0 1.5rem 1.5rem;
}
.list-header, .list-row {
  display: grid;
  grid-template-columns: 1.2fr 1.2fr 1.4fr 0.8fr;
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
.txn-hash-cell, .address-cell {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 0;
}
.address-cell .hash-link, .txn-hash-cell .hash-link {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.to-cell {
  color: var(--color-text-secondary);
}
.to-cell .arrow-icon {
  flex-shrink: 0;
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
.status-icon-success {
  color: #6ee7b7;
  flex-shrink: 0;
}
.coinbase-text {
  color: #fcd34d; 
  font-weight: 600;
}
.amount-cell {
  font-weight: 600;
  font-family: monospace;
}

.pagination-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
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