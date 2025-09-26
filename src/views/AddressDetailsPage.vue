<template>
  <div class="container">
    <div class="card header-card">
      <div class="address-info">
        <QrCode :size="48" class="qr-icon" />
        <div>
          <p class="address-label">ADDRESS</p>
          <h1 class="address-hash">{{ address.address }}</h1>
        </div>
      </div>
      <div class="balance-info">
        <p class="balance-label">AVAILABLE BALANCE</p>
        <h1 class="balance-amount">{{ address.balance }} KNL</h1>
      </div>
    </div>

    <div class="stats-grid">
      <div class="card stat-card">
        <p class="stat-label">UNSPENT TRANSACTIONS</p>
        <p class="stat-value">{{ address.unspent_tx_count }}</p>
      </div>
      <div class="card stat-card">
        <p class="stat-label">TOTAL TRANSACTIONS</p>
        <p class="stat-value">{{ address.total_tx_count }}</p>
      </div>
      <div class="card stat-card">
        <p class="stat-label">TOTAL RECEIVED</p>
        <p class="stat-value">{{ address.total_received }} KNL</p>
      </div>
      <div class="card stat-card">
        <p class="stat-label">TOTAL SENT</p>
        <p class="stat-value">{{ address.total_sent }} KNL</p>
      </div>
    </div>

    <h2 class="section-title">Unspent Outputs (UTXOs)</h2>
    <div class="transactions-container">
      <div v-for="tx in address.utxos" :key="tx.hash" class="card transaction-card">
        <p class="tx-hash font-mono">{{ tx.hash }}</p>
        <div class="io-grid">
          <div>
            <h4 class="io-title">INPUTS</h4>
            <div v-for="(input, index) in tx.inputs" :key="index" class="io-item">
              <span class="io-index">#{{ index }}</span>
              <span class="font-mono coinbase">{{ input.address }}</span>
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
</template>

<script setup>
import { QrCode } from 'lucide-vue-next';
import { mockAddressDetails } from '../data/mockData.js';
const address = mockAddressDetails;
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
  padding: 1.5rem 2rem;
  margin-bottom: 2rem;
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
  font-size: 0.75rem;
  font-weight: 600;
  color: #6b7280;
}
.address-hash {
  font-family: monospace;
  font-size: 1.25rem;
  font-weight: 500;
}
.balance-info {
  text-align: right;
}
.balance-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #6b7280;
}
.balance-amount {
  font-size: 2rem;
  font-weight: 700;
  color: #16a34a;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}
.stat-card {
  padding: 1.5rem;
  text-align: center;
}
.stat-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #6b7280;
  margin-bottom: 0.5rem;
}
.stat-value {
  font-size: 2rem;
  font-weight: 700;
}


.section-title { font-size: 2rem; font-weight: 700; margin-bottom: 1.5rem; }
.card { background-color: white; border: 1px solid #e5e7eb; border-radius: 0.75rem; box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.05); }
.transactions-container { display: flex; flex-direction: column; gap: 1.5rem; }
.transaction-card { padding: 1.5rem; }
.tx-hash { margin-bottom: 1.5rem; padding-bottom: 1.5rem; border-bottom: 1px solid #e5e7eb; word-break: break-all; }
.io-grid { display: grid; grid-template-columns: 1fr; gap: 1.5rem; }
@media (min-width: 768px) { .io-grid { grid-template-columns: 1fr 1fr; } }
.io-title { font-size: 0.75rem; font-weight: 600; text-transform: uppercase; color: #6b7280; margin: 0 0 1rem 0; }
.io-item { display: flex; align-items: center; gap: 1rem; margin-bottom: 0.5rem; background-color: #f9fafb; padding: 0.75rem; border-radius: 6px; }
.io-index { font-size: 0.75rem; font-weight: 500; background-color: #f3f4f6; padding: 0.25rem 0.5rem; border-radius: 4px; }
.coinbase { color: #6b7280; }
.amount-badge { margin-left: auto; background-color: #f0fdf4; color: #16a34a; padding: 0.25rem 0.75rem; border-radius: 9999px; font-weight: 500; font-size: 0.875rem; white-space: nowrap; }
.font-mono { font-family: monospace; }
.text-blue { color: #3b82f6; }
</style>