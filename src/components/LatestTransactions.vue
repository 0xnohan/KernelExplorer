<template>
  <div class="card">
    <div class="card-header">
      <Activity />
      <h3>Recent Transactions</h3>
    </div>

    <div class="transactions-list">
      <div v-for="tx in transactions" :key="tx.hash" class="transaction-item">
        <div class="icon-wrapper">
          <ArrowLeftRight :size="20" class="text-purple" />
        </div>
        <div class="tx-info">
          <p class="tx-hash">{{ tx.hash }}</p>
          <div class="tx-details">
            <span class="address">From: {{ tx.from }}</span>
            <span class="address">To: {{ tx.to }}</span>
          </div>
        </div>
        <div class="tx-amount">
          <span class="amount-badge">{{ tx.amount }} ETH</span>
          <span class="fee-text">Fee: {{ tx.fee.toFixed(6) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Activity, ArrowLeftRight } from 'lucide-vue-next';

defineProps({
  transactions: Array
});
</script>

<style scoped>
.transactions-list {
  padding: 0.5rem 1rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.transaction-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: 0.75rem;
  background-color: rgba(255, 255, 255, 0.05);
  transition: background-color 0.2s;
}
.transaction-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
}
.icon-wrapper {
  flex-shrink: 0;
}
.tx-info {
  flex-grow: 1;
  min-width: 0;
}
.tx-hash {
  font-family: monospace;
  font-weight: 500;
  color: var(--color-text-primary);
  margin: 0 0 0.25rem 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.tx-details {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.address {
  font-family: monospace;
}
.tx-amount {
  text-align: right;
  flex-shrink: 0;
}
.amount-badge {
  background-color: rgba(197, 138, 249, 0.15);
  color: var(--color-purple);
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-weight: 600;
  font-size: 0.875rem;
  display: inline-block;
  margin-bottom: 0.25rem;
}
.fee-text {
  font-size: 0.75rem;
  color: var(--color-text-secondary);
  display: block;
}
</style>