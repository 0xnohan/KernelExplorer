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
            <span class="value font-mono hash-link">{{ addressDetails.address }}</span>
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
        <div class="list-container">
           <div class="list-header">
              <span>Txn Hash</span>
              <span>Block</span>
              <span class="text-right">Timestamp</span>
              <span>Status</span>
            </div>
            <div class="list-body">
              <div v-for="tx in addressDetails.transactions" :key="tx.hash" class="list-row">
                <span class="font-mono hash-link">{{ tx.hash.substring(0, 15) }}...</span>
                <span>#{{ tx.block_height }}</span>
                <span class="text-right">{{ new Date(tx.timestamp).toLocaleString() }}</span>
                <span class="status-badge success">Success</span>
              </div>
            </div>
          </div>
      </div>
    </div>
     <div v-else class="loading-message">Address not found.</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { apiState } from '../store.js';
import { ArrowLeft, MapPin, Wallet, ArrowLeftRight, DownloadCloud, UploadCloud } from 'lucide-vue-next';

const props = defineProps({
  addressHash: { type: String, required: true }
});

defineEmits(['navigate']);

const loading = ref(true);
const addressDetails = ref(null);

onMounted(async () => {
  if (!props.addressHash) return;
  apiState.isConnecting = true;
  try {
    const response = await fetch(`${apiState.baseUrl}/api/address/${props.addressHash}`); 
    if (response.ok) {
      addressDetails.value = await response.json();
      apiState.isConnected = true;
    } else {
      apiState.isConnected = false;
    }
  } catch (error) {
    console.error(`Impossible de récupérer les détails de l'adresse ${props.addressHash}:`, error);
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
}

.card {
  margin-bottom: 2rem;
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
  font-weight: 500;
}
.font-mono {
  font-family: monospace;
}
.hash-link {
  color: var(--color-blue);
  cursor: pointer;
}
.balance-amount {
  font-weight: 700;
  color: #6ee7b7;
}
.tx-badge {
    background-color: rgba(129, 140, 248, 0.2);
    color: #a5b4fc;
    padding: 0.35rem 0.75rem;
    border-radius: 6px;
}

/* Styles pour la liste de transactions */
.list-container {
  padding: 0 1.5rem 1.5rem;
}
.list-header, .list-row {
  display: grid;
  grid-template-columns: 2fr 1fr 2fr 1fr;
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

.status-badge {
  padding: 0.35rem 0.75rem;
  border-radius: 9999px;
  font-weight: 500;
  font-size: 0.8rem;
  display: inline-block;
  text-align: center;
}
.status-badge.success {
  background-color: rgba(52, 211, 153, 0.2);
  color: #6ee7b7;
}
.text-right {
  text-align: right;
}
</style>