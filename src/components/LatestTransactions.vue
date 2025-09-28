<template>
  <div class="card">
    <div class="card-header">
      <Activity />
      <h3>Recent Transactions</h3>
      <a href="#" @click.prevent="$emit('navigate', 'TransactionsPage')" class="view-all-button">
        View All
        <ExternalLink :size="14" />
      </a>
    </div>

    <div class="transactions-list">
      <div v-for="tx in transactions" :key="tx.hash" class="transaction-item">
        <div class="icon-wrapper">
          <CheckCircle2 :size="20" class="status-icon-success" />
        </div>
        <div class="tx-info">
          <p class="tx-hash">{{ truncateHash(tx.hash)}}</p>
          <div class="tx-details">
            <span class="font-mono">{{ truncateHash(tx.from[0]) }} &rarr; {{ truncateHash(tx.to[0]) }}</span>
          </div>
        </div>
        <div class="tx-value">
          <span class="tx-amount-value">{{ tx.value }} KNL</span>
          <span class="tx-fee">Fee: {{ tx.fee }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Activity, CheckCircle2, ExternalLink } from 'lucide-vue-next';

defineProps({
  transactions: {
    type: Array,
    default: () => []
  }
});

defineEmits(['navigate']);

const truncateHash = (hash) => {
  if (!hash || hash.length <= 10) return hash;
  return `${hash.substring(0, 5)}-${hash.substring(hash.length - 5)}`;
};
</script>

<style scoped>
.card-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
}

.view-all-button {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.875rem;
  color: var(--color-blue);
  text-decoration: none;
  font-weight: 500;
  transition: opacity 0.2s;
}
.view-all-button:hover {
  opacity: 0.8;
}

.transactions-list {
  padding: 0.5rem 1.5rem 1.5rem;
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
  background-color: rgba(52, 211, 153, 0.1); 
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.status-icon-success {
    color: #6ee7b7;
}

.tx-info {
  flex-grow: 1;
  min-width: 0; 
}
.tx-hash {
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0 0 0.25rem 0;
  font-family: monospace;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.tx-details {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
}
.font-mono {
  font-family: monospace;
  font-size: 0.8rem;
}

.tx-value {
  margin-left: auto;
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  white-space: nowrap;
  text-align: right;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
.tx-amount-value {
    font-weight: 600;
    color: var(--color-text-primary);
    background-color: rgba(255, 255, 255, 0.1);
    padding: 0.25rem 0.5rem;
    border-radius: 6px;
}
.tx-fee {
    font-size: 0.75rem;
}
</style>