<template>
  <div class="container">
    <div v-if="loading" class="loading-message">Loading Transaction Details...</div>
    <div v-else-if="transaction">
      <div class="page-header">
        <button class="back-button" @click="$emit('navigate', 'HomePage')">
          <ArrowLeft />
        </button>
        <h1 class="page-title">Transaction Details</h1>
      </div>

      <div class="card summary-card">
        <h2 class="card-title address-title">
          <span class="font-mono">{{ transaction.hash }}</span>
          <Copy size="18" class="copy-icon" @click="copyToClipboard(transaction.hash)" title="Copy hash" />
        </h2>
        
        <div class="summary-grid">
          <div class="summary-column">
              <div class="detail-row">
              <span class="label"><Package class="icon" />Block</span>
              <div class="value-with-copy">
                <a href="#" @click.prevent="$emit('navigate', 'BlockDetailsPage', { blockHash: transaction.block_hash })" class="value font-mono hash-link">{{ transaction.block_height }}</a>
                <Copy size="14" class="copy-icon-inline" @click="copyToClipboard(transaction.block_hash)" title="Copy block hash" />
              </div>
            </div>
            <div class="detail-row">
              <span class="label"><Clock class="icon" />Timestamp</span>
              <span class="value">
                {{ formatTimestampAgo(transaction.timestamp) }}
                <span class="timestamp-full">({{ formatFullTimestamp(transaction.timestamp) }})</span>
              </span>
            </div>
            <div class="detail-row">
              <span class="label"><CheckCircle2 class="icon" />Status</span>
              <span class="value">
                  <span class="status-badge" :class="transaction.status === 'Confirmed' ? 'success' : 'pending'">
                    {{ transaction.status }}
                  </span>
              </span>
            </div>
          </div>
          
          <div class="summary-column">
            <div class="detail-row">
              <span class="label"><ShieldCheck class="icon" />Confirmations</span>
              <span class="value font-mono">{{ transaction.confirmations }}</span>
            </div>
            <div class="detail-row">
              <span class="label"><Coins class="icon" />Total Amount</span>
              <span class="value font-mono amount-value ">{{ transaction.value }} KOR</span>
            </div>
            <div class="detail-row">
              <span class="label"><FileText class="icon" />Transaction Fee</span>
              <span class="value font-mono fee-value">{{ transaction.fee }} KOR</span>
            </div>
          </div>
        </div>
      </div>

      <div class="card tx-io-card">
        <div class="io-container">
            <div class="io-column">
                <div class="io-header">
                  <h3 class="io-title">Inputs ({{ transaction.inputs.length }})</h3>
                  <span class="io-total-value">{{ totalInputValue }} KOR</span>
                </div>
                <div v-for="(input, index) in transaction.inputs" :key="`in-${index}`" class="io-item">
                    <User class="io-icon" :class="{ 'coinbase-icon': input.address === 'Coinbase' }" />
                    <div class="address-details">
                        <span v-if="input.address === 'Coinbase'" class="font-mono coinbase-text">Coinbase</span>
                        <div v-else class="value-with-copy">
                          <a href="#" @click.prevent="$emit('navigate', 'AddressDetailsPage', { addressHash: input.address })" class="font-mono hash-link" :title="input.address">
                            {{ input.address }}
                          </a>
                          <Copy size="14" class="copy-icon-inline" @click="copyToClipboard(input.address)" title="Copy address" />
                        </div>
                        <span v-if="input.value !== null" class="io-value">{{ input.value }} KOR</span>
                    </div>
                </div>
            </div>

            <div class="arrow-separator">
                <ArrowRightCircle />
            </div>

            <div class="io-column">
                <div class="io-header">
                  <h3 class="io-title">Outputs ({{ transaction.outputs.length }})</h3>
                  <span class="io-total-value">{{ totalOutputValue }} KOR</span>
                </div>
                <div v-for="(output, index) in transaction.outputs" :key="`out-${index}`" class="io-item">
                    <User class="io-icon" />
                    <div class="address-details">
                        <div class="value-with-copy">
                          <a href="#" @click.prevent="$emit('navigate', 'AddressDetailsPage', { addressHash: output.address })" class="font-mono hash-link" :title="output.address">
                            {{ output.address }}
                          </a>
                          <Copy size="14" class="copy-icon-inline" @click="copyToClipboard(output.address)" title="Copy address" />
                        </div>
                        <span class="io-value">{{ output.value }} KOR</span>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
    <div v-else class="loading-message">Transaction not found.</div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { apiState } from '../store.js';
import { 
  ArrowLeft, Clock, Hash, CheckCircle2, Package, User, 
  ArrowRightCircle, Coins, ShieldCheck, Copy, FileText 
} from 'lucide-vue-next';

const props = defineProps({
  txHash: { type: String, required: true }
});

defineEmits(['navigate']);

const loading = ref(true);
const transaction = ref(null);

const totalInputValue = computed(() => {
  if (!transaction.value || !transaction.value.inputs) return '0.00';
  const total = transaction.value.inputs.reduce((sum, input) => sum + (input.value || 0), 0);
  return total.toFixed(8); 
});

const totalOutputValue = computed(() => {
  if (!transaction.value || !transaction.value.outputs) return '0.00';
  const total = transaction.value.outputs.reduce((sum, output) => sum + (output.value || 0), 0);
  return total.toFixed(8); 
});

onMounted(async () => {
  if (!props.txHash) return;
  loading.value = true;
  try {
    const response = await fetch(`${apiState.baseUrl}/api/tx/${props.txHash}`);
    if (response.ok) {
      transaction.value = await response.json();
    }
  } catch (error) {
    console.error(`Impossible to fetch transaction details for ${props.txHash}:`, error);
  } finally {
    loading.value = false;
  }
});

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

</script>

<style scoped>
.container { padding: 2rem 2.5rem; }
.loading-message { text-align: center; padding: 4rem; font-size: 1.25rem; color: var(--color-text-secondary); }
.card { margin-bottom: 2rem; overflow: hidden; }

.page-header { display: flex; align-items: center; gap: 1rem; margin-bottom: 2rem; }
.back-button { background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2); color: white; border-radius: 50%; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: background-color 0.2s; }
.back-button:hover { background: rgba(255, 255, 255, 0.2); }
.page-title { font-size: 2.5rem; font-weight: 800; }

.summary-card {
  margin-bottom: 2rem;
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
  font-weight: 500;
}
.font-mono {
  font-family: monospace;
}
a.hash-link {
  color: var(--color-blue);
  cursor: pointer;
  text-decoration: none;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
a.hash-link:hover {
  text-decoration: underline;
}
.value-with-copy {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 0;
}
.value-with-copy .value, .value-with-copy .hash-link {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.copy-icon {
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: color 0.2s;
  flex-shrink: 0;
}
.copy-icon:hover {
  color: var(--color-text-primary);
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
.timestamp-full {
  color: var(--color-text-secondary);
  font-size: 0.8rem;
  margin-left: 0.5rem;
}

.status-badge {
  padding: 0.35rem 0.75rem;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.8rem;
}
.status-badge.success { 
  background-color: rgba(52, 211, 153, 0.2); 
  color: #6ee7b7; 
}
.status-badge.pending { 
  background-color: rgba(245, 158, 11, 0.2);
  color: #fcd34d;
}
.reward-badge {
  background-color: rgba(52, 211, 153, 0.2);
  color: #6ee7b7;
  padding: 0.35rem 0.75rem;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.8rem;
}
.fee-value { 
  font-weight: 600; 
  color: var(--color-text-secondary);
}
.amount-value {
  font-weight: 600;
  color: var(--color-text-primary);
}

.tx-io-card { 
  background: transparent; 
  border: none; 
  box-shadow: none;
}
.io-container { 
  display: grid;
  grid-template-columns: 1fr;
  align-items: start; 
  gap: 2rem; 
}
@media (min-width: 1024px) {
  .io-container {
    grid-template-columns: 1fr auto 1fr;
  }
}
.io-column { 
  flex: 1; 
  background-color: rgba(255, 255, 255, 0.05); 
  padding: 1.5rem; 
  border-radius: 0.75rem; 
  border: 1px solid rgba(255, 255, 255, 0.1);
  min-width: 0;
}
.io-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}
.io-title { 
  font-size: 1.25rem; 
  font-weight: 600; 
  margin: 0;
}
.io-total-value {
  font-family: monospace;
  font-weight: 600;
  color: #6ee7b7;
  font-size: 0.9rem;
  background-color: rgba(52, 211, 153, 0.1);
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
}
.io-item { 
  display: flex; 
  gap: 1rem; 
  align-items: center; 
  margin-bottom: 1rem; 
}
.io-item:last-child { margin-bottom: 0; }
.io-icon { 
  color: #a5b4fc; 
  flex-shrink: 0; 
}
.address-details { 
  display: flex; 
  flex-direction: column; 
  gap: 0.25rem; 
  min-width: 0; 
}
.io-value { 
  font-size: 0.875rem; 
  color: var(--color-text-primary); 
  font-weight: 600;
  font-family: monospace;
}
.arrow-separator { 
  color: #a5b4fc; 
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}
@media (min-width: 1024px) {
  .arrow-separator {
    padding-top: 5rem;
  }
}
.coinbase-text {
  color: #fcd34d; 
  font-weight: 600;
}
.coinbase-icon {
  color: #fcd34d;
}
</style>