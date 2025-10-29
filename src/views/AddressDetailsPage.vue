<template>
  <div class="container">
    <div v-if="loading" class="loading-message">Loading Address Details...</div>
    <div v-else-if="addressDetails">
      <div class="page-header">
        <button class="back-button" @click="$emit('navigate', 'HomePage')">
          <ArrowLeft />
        </button>
        <h1 class="page-title">Address Details</h1>
      </div>

      <div class="card info-card">
        <h2 class="card-title address-title">
          <span class="font-mono">{{ addressDetails.address }}</span>
          <Copy size="18" class="copy-icon" @click="copyToClipboard(addressDetails.address)" title="Copy address" />
        </h2>
        
        <div class="summary-grid">
          <div class="summary-column">
            <div class="detail-row">
              <span class="label"><ArrowLeftRight class="icon" />Transactions</span>
              <span class="value">
                <span class="tx-badge">{{ addressDetails.transaction_count }} total</span>
              </span>
            </div>
            <div class="detail-row">
              <span class="label"><DownloadCloud class="icon" />Total Received</span>
              <span class="value">{{ addressDetails.total_received }} KOR</span>
            </div>
            <div class="detail-row">
              <span class="label"><UploadCloud class="icon" />Total Sent</span>
              <span class="value">{{ addressDetails.total_sent }} KOR</span>
            </div>
          </div>
          
          <div class="summary-column">
            <div class="detail-row-full balance-row">
              <span class="label"><Wallet class="icon" />Balance</span>
              <span class="value balance-amount">{{ addressDetails.current_balance }} KOR</span>
            </div>
          </div>
        </div>
      </div>

      <div class="card tx-card">
        <h2 class="card-title">Transaction History ({{ addressDetails.transactions.length }})</h2>
        <div v-if="addressDetails.transactions.length > 0">
          <div class="list-container">
            <div class="list-header">
               <span>Txn Hash</span>
               <span>Block</span>
               <span>Timestamp</span>
               <span class="text-center">Direction</span>
               <span class="text-right">Value</span>
             </div>
             <div class="list-body">
               <div v-for="tx in paginatedTransactions" :key="tx.hash" class="list-row">
                 <div class="txn-hash-cell">
                   <a href="#" @click.prevent="$emit('navigate', 'TransactionDetailsPage', { txHash: tx.hash })" class="font-mono hash-link" :title="tx.hash">
                    {{ truncateHash(tx.hash) }}
                   </a>
                   <Copy size="14" class="copy-icon-inline" @click="copyToClipboard(tx.hash)" title="Copy hash" />
                 </div>
                 
                 <a href="#" @click.prevent="$emit('navigate', 'BlockDetailsPage', { blockHash: tx.block_hash })" class="font-mono hash-link block-link">
                    <Package size="14" /> {{ tx.block_height }}
                  </a>
 
                 <span class="timestamp-cell">
                    <Clock size="14" /> {{ formatTimestampAgo(tx.timestamp) }}
                 </span>
                 
                 <div class="text-center">
                    <span class="direction-badge" :class="tx.direction === 'IN' ? 'in' : 'out'">
                      {{ tx.direction }}
                    </span>
                 </div>

                 <span class="text-right value-col" :class="tx.direction === 'IN' ? 'text-green' : 'text-red'">
                   {{ tx.direction === 'IN' ? '+' : '-' }} {{ tx.value }} KOR
                 </span>
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
        <div v-else class="no-data-message">
          No transactions found for this address
        </div>
      </div>
    </div>
     <div v-else class="loading-message">Address not found</div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import { apiState } from '../store.js';
import { 
  ArrowLeft, MapPin, Wallet, ArrowLeftRight, DownloadCloud, 
  UploadCloud, Copy, Package, Clock 
} from 'lucide-vue-next';

const props = defineProps({
  addressHash: { type: String, required: true }
});

defineEmits(['navigate']);

const loading = ref(true);
const addressDetails = ref(null);
const currentPage = ref(1);
const itemsPerPage = 10;

const totalPages = computed(() => {
  if (!addressDetails.value) return 0;
  return Math.ceil(addressDetails.value.transactions.length / itemsPerPage);
});

const paginatedTransactions = computed(() => {
  if (!addressDetails.value) return [];
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return addressDetails.value.transactions.slice(start, end);
});

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++;
};

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};

const fetchAddressData = async (hash) => {
    if (!hash) return;
    loading.value = true;
    addressDetails.value = null;
    currentPage.value = 1;
    try {
        const response = await fetch(`${apiState.baseUrl}/api/address/${hash}`);
        if (response.ok) {
            addressDetails.value = await response.json();
        }
    } catch (error) {
        console.error(`Impossible to fetch address details for ${hash}:`, error);
    } finally {
        loading.value = false;
    }
};

onMounted(() => {
    fetchAddressData(props.addressHash);
});

watch(() => props.addressHash, (newHash) => {
    fetchAddressData(newHash);
});

const truncateHash = (hash, len = 10) => {
  if (!hash || hash.length <= (len * 2)) return hash;
  return `${hash.substring(0, len)}—${hash.substring(hash.length - len)}`;
};

const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
  } catch (err)
 {
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

</script>

<style scoped>
.container { padding: 2rem 2.5rem; }
.loading-message { text-align: center; padding: 4rem; font-size: 1.25rem; color: var(--color-text-secondary); }
.card { margin-bottom: 2rem; overflow: hidden; }

.page-header { display: flex; align-items: center; gap: 1rem; margin-bottom: 2rem; }
.back-button { background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2); color: white; border-radius: 50%; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: background-color 0.2s; }
.back-button:hover { background: rgba(255, 255, 255, 0.2); }
.page-title { font-size: 2.5rem; font-weight: 800; }

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
  gap: 0 1.5rem;
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
.summary-column:first-child {
  margin-bottom: 1.25rem;
}
@media (min-width: 768px) {
  .summary-column:first-child {
    margin-bottom: 0;
  }
}
.detail-row, .detail-row-full {
  display: grid;
  grid-template-columns: 160px 1fr;
  gap: 1rem;
  font-size: 0.875rem;
  align-items: start;
}
.detail-row-full {
  grid-template-columns: 1fr;
  gap: 0.5rem;
}
.label { color: var(--color-text-secondary); display: flex; align-items: center; gap: 0.75rem; font-weight: 500; }
.label .icon { width: 16px; height: 16px; color: #a5b4fc; }
.value { color: var(--color-text-primary); font-weight: 500; word-break: break-all; }
.font-mono { font-family: monospace; }

.balance-row .label {
  font-size: 1rem;
}
.balance-amount { 
  font-weight: 700; 
  font-size: 1.75rem;
  color: #6ee7b7; 
}
.tx-badge { 
  background-color: rgba(129, 140, 248, 0.2); 
  color: #a5b4fc; 
  padding: 0.35rem 0.75rem; 
  border-radius: 6px; 
  font-weight: 600;
  font-size: 0.8rem;
}

.no-data-message { padding: 2rem 1.5rem; text-align: center; color: var(--color-text-secondary); }
.list-container { padding: 0 1.5rem 1.5rem; }
.list-header, .list-row { 
  display: grid; 
  grid-template-columns: 1.5fr 1fr 1fr 0.8fr 1.2fr; 
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
.list-body { display: flex; flex-direction: column; }
.list-row { padding: 1rem 0; border-bottom: 1px solid rgba(255, 255, 255, 0.1); font-size: 0.875rem; }
.list-row:last-child { border-bottom: none; }

.text-right { text-align: right; }
.text-center { text-align: center; }

a.hash-link { 
  color: var(--color-blue); 
  cursor: pointer; 
  text-decoration: none; 
  transition: text-decoration 0.2s;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
a.hash-link:hover { text-decoration: underline; }
.block-link, .timestamp-cell {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--color-text-secondary);
}
.block-link {
  color: var(--color-text-primary);
}
.block-link:hover {
  color: var(--color-blue);
  text-decoration: underline;
}

.value-col { font-weight: 600; font-family: monospace; }
.text-green { color: #6ee7b7; }
.text-red { color: #fca5a5; }

.txn-hash-cell { display: flex; align-items: center; gap: 0.5rem; min-width: 0; }
.copy-icon-inline {
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: color 0.2s;
  flex-shrink: 0;
}
.copy-icon-inline:hover {
  color: var(--color-text-primary);
}

.direction-badge {
  padding: 0.35rem 0.75rem; 
  border-radius: 6px; 
  font-weight: 600;
  font-size: 0.8rem;
  text-transform: uppercase;
}
.direction-badge.in {
  background-color: rgba(52, 211, 153, 0.2); 
  color: #6ee7b7; 
}
.direction-badge.out {
  background-color: rgba(248, 113, 113, 0.2); 
  color: #fca5a5;
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