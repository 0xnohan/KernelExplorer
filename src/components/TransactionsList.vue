<template>
  <div class="card">
    <div class="card-header">
      <div class="title-container">
        <Activity class="title-icon" />
        <h3>Transactions</h3>
      </div>
    </div>

    <div class="list-container">
      <div class="list-header">
        <span>Txn Hash</span>
        <span>Block</span>
        <span>From</span>
        <span>To</span>
        <span class="text-right">Value</span>
      </div>

      <div class="list-body">
        <div v-for="tx in transactions" :key="tx.hash" class="list-row">
          <div class="cell-content">
            <CheckCircle2 size="16" class="cell-icon status-icon-success" />
            <a href="#" @click.prevent="$emit('navigate', 'TransactionDetailsPage', { txHash: tx.hash })" class="font-mono hash-link">
              {{ tx.hash.substring(0, 12) }}...
            </a>
          </div>

          <a href="#" @click.prevent="$emit('navigate', 'BlockDetailsPage', { blockHash: tx.block_hash })" class="cell-content block-height">
            <Package class="cell-icon" />
            <span>{{ tx.block_height }}</span>
          </a>

          <div class="cell-content">
            <User class="cell-icon" />
            <a href="#" @click.prevent="$emit('navigate', 'AddressDetailsPage', { addressHash: tx.from[0] })" class="font-mono address-link">
              {{ tx.from[0].substring(0, 12) }}...
            </a>
          </div>

          <div class="cell-content address-to">
             <ArrowRight size="14" class="cell-icon" />
             <a href="#" @click.prevent="$emit('navigate', 'AddressDetailsPage', { addressHash: tx.to[0] })" class="font-mono address-link">
              {{ tx.to[0].substring(0, 12) }}...
            </a>
          </div>

          <div class="text-right">
            <span class="value-badge">
              {{ tx.value }} KNL
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Activity, Package, User, ArrowRight, CheckCircle2 } from 'lucide-vue-next';

defineProps({
  transactions: Array
});

defineEmits(['navigate']);

</script>

<style scoped>
.card {
  overflow: hidden;
}
.card-header {
  padding: 1.25rem 1.5rem;
}
.title-container {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.25rem;
  font-weight: 600;
}
.list-container {
  padding: 0 1.5rem 1.5rem;
}
.list-header, .list-row {
  display: grid;
  grid-template-columns: 1.5fr 1fr 1.5fr 1.5fr 1fr;
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
.cell-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--color-text-secondary);
}
.cell-icon {
  width: 16px;
  height: 16px;
  color: #a5b4fc;
  flex-shrink: 0;
}
.status-icon-success {
  color: #6ee7b7;
}
.font-mono {
  font-family: monospace;
  font-size: 0.8rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
a {
  text-decoration: none;
  transition: color 0.2s;
}
.hash-link, .block-height, .address-link {
  color: var(--color-text-primary);
}
.hash-link:hover, .block-height:hover, .address-link:hover {
  color: var(--color-blue);
  text-decoration: underline;
}

.address-to {
  gap: 0.25rem;
}
.address-to .cell-icon {
    color: var(--color-text-secondary);
}

.value-badge {
  background-color: rgba(255, 255, 255, 0.1);
  padding: 0.35rem 0.75rem;
  border-radius: 6px;
  font-weight: 500;
}
.text-right {
  text-align: right;
}
</style>