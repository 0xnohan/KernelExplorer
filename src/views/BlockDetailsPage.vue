<template>
  <div class="container">
    <div v-if="loading" class="loading-message">Loading Block Details...</div>
    <div v-else-if="block">
      <h1 class="page-title">Block #{{ block.block_number }}</h1>
      <div class="card">
        <div class="detail-item highlighted">
          <span class="value font-mono">{{ block.hash }}</span>
        </div>
        <div class="detail-item">
          <span class="label">Previous Block Hash</span>
          <span class="value font-mono text-blue">{{ block.previous_hash }}</span>
        </div>
        <div class="detail-item">
          <span class="label">Confirmations</span>
          <span class="value">{{ block.confirmations }}</span>
        </div>
        <div class="detail-item">
          <span class="label">Transactions</span>
          <span class="value">{{ block.transaction_count }}</span>
        </div>
        <div class="detail-item">
          <span class="label">Size</span>
          <span class="value">{{ block.size.toLocaleString() }} bytes</span>
        </div>
        <div class="detail-item">
          <span class="label">Merkle Root</span>
          <span class="value font-mono">{{ block.merkle_root }}</span>
        </div>
        <div class="detail-item">
          <span class="label">Nonce</span>
          <span class="value font-mono">{{ block.nonce }}</span>
        </div>
        <div class="detail-item">
          <span class="label">Timestamp</span>
          <span class="value">{{ new Date(block.timestamp).toLocaleString() }}</span>
        </div>
      </div>

      <h2 class="section-title">Transactions</h2>
      <div class="transactions-container">
        <div v-for="tx in block.transactions" :key="tx.hash" class="card transaction-card">
          <p class="tx-hash font-mono">{{ tx.hash }}</p>
          <div class="io-grid">
            <div>
              <h4 class="io-title">INPUTS</h4>
              <div v-for="(input, index) in tx.inputs" :key="index" class="io-item">
                <span class="io-index">#{{ index }}</span>
                <span class="font-mono" :class="{ 'coinbase': input.address.includes('Coinbase') }">
                  {{ input.address }}
                </span>
              </div>
            </div>
            <div>
              <h4 class="io-title">OUTPUTS</h4>
              <div v-for="(output, index) in tx.outputs" :key="index" class="io-item">
                <span class="io-index">#{{ index }}</span>
                <span class="font-mono text-blue">{{ output.address }}</span>
                <span class="amount-badge">{{ output.amount }} KNL</span>
              </div>
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
import { apiState } from '../store.js'; // Importer l'état

const props = defineProps({
  blockHash: { type: String, required: true }
});

const loading = ref(true);
const block = ref(null);

onMounted(async () => {
  if (!props.blockHash) return;
  apiState.isConnecting = true;
  try {
    const response = await fetch(`${apiState.baseUrl}/api/block/${props.blockHash}`); // Utilise l'URL du store
    if (response.ok) {
      block.value = await response.json();
      apiState.isConnected = true;
    } else {
      apiState.isConnected = false;
    }
  } catch (error) {
    console.error(`Impossible de récupérer les détails du bloc ${props.blockHash}:`, error);
    apiState.isConnected = false;
  } finally {
    loading.value = false;
    apiState.isConnecting = false;
  }
});
</script>

<style scoped>
.container {
  padding: 2rem;
  color: #111827;
}

.header-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem; 
  margin-bottom: 1.5rem;
}
.address-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.qr-icon {
  color: #6b7280;
}
.address-label {
  font-size: 0.7rem; 
  font-weight: 600;
  color: #6b7280;
}
.address-hash {
  font-family: monospace;
  font-size: 1rem; 
  font-weight: 500;
}
.balance-info {
  text-align: right;
}
.balance-label {
  font-size: 0.7rem; 
  font-weight: 600;
  color: #6b7280;
}
.balance-amount {
  font-size: 1.5rem; 
  font-weight: 700;
  color: #16a34a;
}


.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem; 
  margin-bottom: 2rem;
}
.stat-card {
  padding: 1rem; 
  text-align: center;
}
.stat-label {
  font-size: 0.7rem; 
  font-weight: 600;
  color: #6b7280;
  margin-bottom: 0.25rem;
}
.stat-value {
  font-size: 1.5rem; 
  font-weight: 700;
}

.section-title { font-size: 1.5rem; font-weight: 700; margin-bottom: 1rem; }
.card { background-color: white; border: 1px solid #e5e7eb; border-radius: 0.75rem; box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.05); }
.transactions-container { display: flex; flex-direction: column; gap: 1rem; }
.transaction-card { padding: 1rem; }
.tx-hash { margin-bottom: 1rem; padding-bottom: 1rem; border-bottom: 1px solid #e5e7eb; word-break: break-all; font-size: 0.875rem; }
.io-grid { display: grid; grid-template-columns: 1fr; gap: 1rem; }
@media (min-width: 768px) { .io-grid { grid-template-columns: 1fr 1fr; } }
.io-title { font-size: 0.7rem; font-weight: 600; text-transform: uppercase; color: #6b7280; margin: 0 0 0.5rem 0; }
.io-item { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.5rem; background-color: #f9fafb; padding: 0.5rem; border-radius: 6px; }
.io-index { font-size: 0.7rem; font-weight: 500; background-color: #f3f4f6; padding: 0.2rem 0.4rem; border-radius: 4px; }
.coinbase { color: #6b7280; }
.amount-badge { margin-left: auto; background-color: #f0fdf4; color: #16a34a; padding: 0.2rem 0.6rem; border-radius: 9999px; font-weight: 500; font-size: 0.8rem; white-space: nowrap; }
.font-mono { font-family: monospace; }
.text-blue { color: #3b82f6; }
</style>