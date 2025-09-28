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
        <h2 class="card-title">Address Information</h2>
        <div class="info-grid">
          <div class="detail-row">
            <span class="label"><MapPin class="icon" />Address</span>
            <span class="value font-mono">{{ addressDetails.address }}</span>
          </div>
          <div class="detail-row">
            <span class="label"><Wallet class="icon" />Balance</span>
            <span class="value balance-amount">{{ addressDetails.current_balance }} KNL</span>
          </div>
          <div class="detail-row">
            <span class="label"><ArrowLeftRight class="icon" />Transaction Count</span>
            <span class="value">
              <span class="tx-badge">{{ addressDetails.transaction_count }}</span>
            </span>
          </div>
          <div class="detail-row">
            <span class="label"><DownloadCloud class="icon" />Total Received</span>
            <span class="value">{{ addressDetails.total_received }} KNL</span>
          </div>
          <div class="detail-row">
            <span class="label"><UploadCloud class="icon" />Total Sent</span>
            <span class="value">{{ addressDetails.total_sent }} KNL</span>
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
               <span>From</span>
               <span>To</span>
               <span class="text-right">Amount</span>
             </div>
             <div class="list-body">
               <div v-for="tx in paginatedTransactions" :key="tx.hash" class="list-row">
                 <div class="txn-hash-cell">
                   <CheckCircle2 size="18" class="status-icon-success" />
                   <a href="#" @click.prevent="$emit('navigate', 'TransactionDetailsPage', { txHash: tx.hash })" class="font-mono hash-link">{{ truncateHash(tx.hash) }}</a>
                 </div>
                 
                 <a href="#" @click.prevent="$emit('navigate', 'BlockDetailsPage', { blockHash: tx.block_hash })" class="font-mono hash-link">{{ tx.block_height }}</a>
 
                 <span v-if="tx.from[0] === 'Coinbase'" class="font-mono coinbase-text">Coinbase</span>
                 <a v-else href="#" @click.prevent="$emit('navigate', 'AddressDetailsPage', { addressHash: tx.from[0] })" class="font-mono hash-link">{{ truncateHash(tx.from[0]) }}</a>
 
                 <a href="#" @click.prevent="$emit('navigate', 'AddressDetailsPage', { addressHash: findMainRecipient(tx.to, tx.from, true) })" class="font-mono hash-link address-to">
                   <ArrowRight size="14" />
                   {{ findMainRecipient(tx.to, tx.from) }}
                 </a>
                 
                 <span class="text-right value-col" :class="tx.direction === 'IN' ? 'text-green' : 'text-red'">
                   {{ tx.direction === 'IN' ? '+' : '-' }} {{ tx.value }} KNL
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
import { ArrowLeft, MapPin, Wallet, ArrowLeftRight, DownloadCloud, UploadCloud, ArrowRight, CheckCircle2 } from 'lucide-vue-next';

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

const findMainRecipient = (outputs, inputs, fullAddress = false) => {
  const recipientOutput = outputs.find(out => !inputs.includes(out.address));
  const address = recipientOutput ? recipientOutput.address : (outputs[0] ? outputs[0].address : '');
  return fullAddress ? address : truncateHash(address);
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

const truncateHash = (hash) => {
  if (!hash || hash.length <= 10) return hash;
  return `${hash.substring(0, 5)}-${hash.substring(hash.length - 5)}`;
};
</script>

<style scoped>
.container { padding: 2rem 2.5rem; }
.loading-message { text-align: center; padding: 4rem; font-size: 1.25rem; color: var(--color-text-secondary); }
.page-header { display: flex; align-items: center; gap: 1rem; margin-bottom: 2rem; }
.back-button { background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2); color: white; border-radius: 50%; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: background-color 0.2s; }
.back-button:hover { background: rgba(255, 255, 255, 0.2); }
.page-title { font-size: 2.5rem; font-weight: 800; }
.card { margin-bottom: 2rem; }
.card-title { font-size: 1.25rem; font-weight: 600; padding: 1.25rem 1.5rem; border-bottom: 1px solid rgba(255, 255, 255, 0.1); }
.info-grid { display: flex; flex-direction: column; }
.detail-row { display: grid; grid-template-columns: 200px 1fr; gap: 1.5rem; padding: 1rem 1.5rem; border-bottom: 1px solid rgba(255, 255, 255, 0.1); font-size: 0.875rem; }
.detail-row:last-child { border-bottom: none; }
.label { color: var(--color-text-secondary); display: flex; align-items: center; gap: 0.75rem; font-weight: 500; }
.label .icon { width: 16px; height: 16px; color: #a5b4fc; }
.value { color: var(--color-text-primary); font-weight: 500; }
.font-mono { font-family: monospace; }
a.hash-link { color: var(--color-blue); cursor: pointer; text-decoration: none; }
a.hash-link:hover { text-decoration: underline; }
.balance-amount { font-weight: 700; color: #6ee7b7; }
.tx-badge { background-color: rgba(129, 140, 248, 0.2); color: #a5b4fc; padding: 0.35rem 0.75rem; border-radius: 6px; }
.no-data-message { padding: 2rem 1.5rem; text-align: center; color: var(--color-text-secondary); }
.list-container { padding: 0 1.5rem 1.5rem; }
.list-header, .list-row { display: grid; grid-template-columns: 1.5fr 1fr 1.2fr 1.2fr 1fr; gap: 1rem; align-items: center; }
.list-header { padding: 1rem 0; font-size: 0.75rem; color: var(--color-text-secondary); text-transform: uppercase; font-weight: 500; border-bottom: 1px solid rgba(255, 255, 255, 0.1); }
.list-body { display: flex; flex-direction: column; }
.list-row { padding: 1rem 0; border-bottom: 1px solid rgba(255, 255, 255, 0.1); font-size: 0.875rem; }
.list-row:last-child { border-bottom: none; }
.text-right { text-align: right; }
.address-to { display: flex; align-items: center; gap: 0.5rem; }
.value-col { font-weight: 600; }
.text-green { color: #6ee7b7; }
.text-red { color: #fca5a5; }
.txn-hash-cell { display: flex; align-items: center; gap: 0.75rem; }
.status-icon-success { color: #6ee7b7; }
.coinbase-text { color: #fcd34d; font-weight: 600; }

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