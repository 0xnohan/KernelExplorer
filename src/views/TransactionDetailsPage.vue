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

      <div class="card info-card">
        <div class="info-grid">
          <div class="detail-row">
            <span class="label"><Hash class="icon" />Transaction Hash</span>
            <span class="value font-mono">{{ transaction.hash }}</span>
          </div>
          <div class="detail-row">
            <span class="label"><CheckCircle2 class="icon" />Status</span>
            <span class="value">
                <span class="status-badge success">{{ transaction.status }}</span>
            </span>
          </div>
          <div class="detail-row">
            <span class="label"><Package class="icon" />Block</span>
            <a href="#" @click.prevent="$emit('navigate', 'BlockDetailsPage', { blockHash: transaction.block_hash })" class="value font-mono hash-link">{{ transaction.block_height }}</a>
          </div>
          <div class="detail-row">
            <span class="label"><Clock class="icon" />Timestamp</span>
            <span class="value">{{ new Date(transaction.timestamp).toLocaleString() }}</span>
          </div>
        </div>
      </div>

      <div class="card tx-io-card">
        <div class="io-container">
            <div class="io-column">
                <h3 class="io-title">Inputs ({{ transaction.inputs.length }})</h3>
                <div v-for="(input, index) in transaction.inputs" :key="index" class="io-item">
                    <User class="io-icon" />
                    <div class="address-details">
                        <a href="#" @click.prevent="$emit('navigate', 'AddressDetailsPage', { addressHash: input.address })" class="font-mono hash-link">{{ input.address === 'Coinbase' ? 'Coinbase' : input.address }}</a>
                        <span v-if="input.value !== null" class="io-value">{{ input.value }} KOR</span>
                    </div>
                </div>
            </div>

            <div class="arrow-separator">
                <ArrowRightCircle />
            </div>

            <div class="io-column">
                <h3 class="io-title">Outputs ({{ transaction.outputs.length }})</h3>
                <div v-for="(output, index) in transaction.outputs" :key="index" class="io-item">
                    <User class="io-icon" />
                    <div class="address-details">
                        <a href="#" @click.prevent="$emit('navigate', 'AddressDetailsPage', { addressHash: output.address })" class="font-mono hash-link">{{ output.address }}</a>
                        <span class="io-value">{{ output.value }} KOR</span>
                    </div>
                </div>
            </div>
        </div>
      </div>

      <div class="card info-card">
            <div class="info-grid">
                 <div class="detail-row">
                    <span class="label"><Coins class="icon" />Transaction Fee</span>
                    <span class="value font-mono fee-value">{{ transaction.fee }} KOR</span>
                </div>
                <div class="detail-row">
                    <span class="label"><ShieldCheck class="icon" />Confirmations</span>
                    <span class="value font-mono">{{ transaction.confirmations }}</span>
                </div>
            </div>
        </div>
    </div>
    <div v-else class="loading-message">Transaction not found.</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { apiState } from '../store.js';
import { ArrowLeft, Clock, Hash, CheckCircle2, Package, User, ArrowRightCircle, Coins, ShieldCheck } from 'lucide-vue-next';

const props = defineProps({
  txHash: { type: String, required: true }
});

defineEmits(['navigate']);

const loading = ref(true);
const transaction = ref(null);

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
</script>

<style scoped>
.container { padding: 2rem 2.5rem; }
.loading-message { text-align: center; padding: 4rem; font-size: 1.25rem; color: var(--color-text-secondary); }
.page-header { display: flex; align-items: center; gap: 1rem; margin-bottom: 2rem; }
.back-button { background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2); color: white; border-radius: 50%; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: background-color 0.2s; }
.back-button:hover { background: rgba(255, 255, 255, 0.2); }
.page-title { font-size: 2.5rem; font-weight: 800; }
.card { margin-bottom: 2rem; }
.info-grid { display: flex; flex-direction: column; }
.detail-row { display: grid; grid-template-columns: 200px 1fr; gap: 1.5rem; padding: 1rem 1.5rem; border-bottom: 1px solid rgba(255, 255, 255, 0.1); font-size: 0.875rem; }
.detail-row:last-child { border-bottom: none; }
.label { color: var(--color-text-secondary); display: flex; align-items: center; gap: 0.75rem; font-weight: 500; }
.label .icon { width: 16px; height: 16px; color: #a5b4fc; }
.value { color: var(--color-text-primary); font-weight: 500; }
.font-mono { font-family: monospace; }
a.hash-link { color: var(--color-blue); cursor: pointer; text-decoration: none; }
a.hash-link:hover { text-decoration: underline; }
.status-badge.success { background-color: rgba(52, 211, 153, 0.2); color: #6ee7b7; padding: 0.35rem 0.75rem; border-radius: 6px; }
.fee-value { font-weight: 600; }
.tx-io-card { background: transparent; border: none; }
.io-container { display: flex; align-items: center; justify-content: space-between; gap: 2rem; }
.io-column { flex: 1; background-color: rgba(255, 255, 255, 0.05); padding: 1.5rem; border-radius: 0.75rem; }
.io-title { font-size: 1.25rem; font-weight: 600; margin-bottom: 1.5rem; }
.io-item { display: flex; gap: 1rem; align-items: center; margin-bottom: 1rem; }
.io-item:last-child { margin-bottom: 0; }
.io-icon { color: #a5b4fc; flex-shrink: 0; }
.address-details { display: flex; flex-direction: column; gap: 0.25rem; min-width: 0; }
.address-details .hash-link { font-size: 0.8rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.io-value { font-size: 0.875rem; color: var(--color-text-secondary); font-weight: 600; }
.arrow-separator { color: #a5b4fc; }
</style>