<template>
  <div class="card">
    <div class="card-header">
      <Activity />
      <h3>Latest Transactions</h3>
    </div>
    <div class="table-container">
      <div class="table-header">
        <span class="col-hash">Transaction Hash</span>
        <span class="col-from-to">From → To</span>
        <span class="col-value">Value</span>
        <span class="col-fee">Fee</span>
        <span class="col-status">Status</span>
        <span class="col-block">Block</span>
      </div>
      <div class="table-body">
        <div v-for="tx in transactions" :key="tx.hash" class="table-row">
          <div class="col-hash font-mono">
            <a href="#">{{ tx.hash }}</a>
          </div>
          <div class="col-from-to font-mono">
            <a href="#">{{ tx.from }}</a> → <a href="#">{{ tx.to }}</a>
          </div>
          <div class="col-value">{{ tx.amount }} ETH</div>
          <div class="col-fee">{{ tx.fee.toFixed(6) }}</div>
          <div class="col-status">
            <span class="status-badge" :class="tx.status">
              {{ tx.status }}
            </span>
          </div>
          <div class="col-block">
            <a href="#">#{{ tx.block_number.toLocaleString() }}</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Activity } from 'lucide-vue-next';
defineProps({ transactions: Array });
</script>

<style scoped>
.table-container { padding: 1rem; }
.table-header, .table-row {
  display: grid;
  grid-template-columns: 1.5fr 2fr 1fr 1fr 1fr 1fr;
  align-items: center;
  gap: 1rem;
  padding: 0 1rem;
}
.table-header {
  color: var(--color-text-secondary);
  font-size: 0.8rem;
  text-transform: uppercase;
  font-weight: 500;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--glass-border);
}
.table-row {
  padding: 1.25rem 1rem;
  border-bottom: 1px solid var(--glass-border);
  transition: background-color 0.2s ease;
}
.table-row:last-child { border-bottom: none; }
.table-row:hover { background-color: rgba(255, 255, 255, 0.05); }
.col-hash, .col-from-to {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
a { color: var(--color-blue); text-decoration: none; }
a:hover { text-decoration: underline; }
.status-badge {
  padding: 0.25rem 0.6rem;
  border-radius: 9999px;
  font-weight: 500;
  font-size: 0.75rem;
  text-transform: capitalize;
}
.status-badge.success {
  background-color: rgba(129, 201, 149, 0.15);
  color: var(--color-green);
}
.status-badge.failed {
  background-color: rgba(255, 117, 117, 0.15);
  color: var(--color-red);
}
</style>