<template>
  <div class="card">
    <div class="card-header">
      <div class="title-container">
        <Activity class="title-icon" />
        <h3>Recent Transactions</h3>
      </div>
      <button class="view-all-button" @click="goToTransactionsPage">
        <span>View All</span>
        <ExternalLink :size="16" />
      </button>
    </div>

    <div class="transactions-list">
      <div v-for="tx in transactions" :key="tx.hash" class="transaction-item">
        <div class="icon-wrapper" :class="tx.status === 'success' ? 'bg-green-light' : 'bg-red-light'">
          <CheckCircle v-if="tx.status === 'success'" :size="20" class="text-green" />
          <XCircle v-else :size="20" class="text-red" />
        </div>
        <div class="tx-info">
          <p class="tx-hash">{{ tx.hash }}</p>
          <div class="tx-details">
            <span class="address">{{ tx.from }}</span>
            <ArrowRight :size="14" class="arrow-icon" />
            <span class="address">{{ tx.to }}</span>
          </div>
        </div>
        <div class="tx-amount">
          <span class="amount-badge">{{ tx.amount }} KNL</span>
          <span class="fee-text">Fee: {{ tx.fee.toFixed(6) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Activity, ExternalLink, CheckCircle, XCircle, ArrowRight } from 'lucide-vue-next';

defineProps({
  transactions: Array
});

const emit = defineEmits(['navigate-to-transactions']);

const goToTransactionsPage = () => {
  emit('navigate-to-transactions');
};
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.title-container {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
}

.title-icon {
  width: 20px;
  height: 20px;
}

.view-all-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s;
}
.view-all-button:hover {
  background-color: #f9fafb;
  color: #111827;
}

.transactions-list {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.transaction-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  transition: box-shadow 0.2s;
}
.transaction-item:hover {
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.07);
}

.icon-wrapper {
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.bg-green-light { background-color: #f0fdf4; }
.text-green { color: #16a34a; }
.bg-red-light { background-color: #fef2f2; }
.text-red { color: #ef4444; }

.tx-info {
  flex-grow: 1;
  min-width: 0; /* Empêche le débordement de texte */
}

.tx-hash {
  font-family: monospace;
  font-weight: 500;
  color: #111827;
  margin: 0 0 0.25rem 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.tx-details {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #6b7280;
}
.address {
  font-family: monospace;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.arrow-icon {
  flex-shrink: 0;
}

.tx-amount {
  text-align: right;
}

.amount-badge {
  background-color: #f5f3ff;
  color: #7c3aed;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-weight: 500;
  font-size: 0.875rem;
  display: inline-block;
  margin-bottom: 0.25rem;
}

.fee-text {
  font-size: 0.75rem;
  color: #6b7280;
  display: block;
}
</style>