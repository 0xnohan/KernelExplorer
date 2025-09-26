<template>
  <div class="card">
    <div class="card-header">
      <div class="title-container">
        <Activity class="title-icon" />
        <h3>Transactions</h3>
      </div>
    </div>

    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>Transaction Hash</th>
            <th>From → To</th>
            <th>Value</th>
            <th>Fee</th>
            <th>Status</th>
            <th>Block</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="tx in transactions" :key="tx.hash">
            <td>
              <span class="font-mono text-blue">{{ tx.hash }}</span>
            </td>
            <td>
              <div class="address-group">
                <span> <span class="font-mono">{{ tx.from }}</span>→ <span class="font-mono">{{ tx.to }}</span></span>
              </div>
            </td>
            <td>
              <span class="font-semibold">{{ tx.amount }} KNL</span>
            </td>
            <td>
              <span>{{ tx.fee.toFixed(6) }}</span>
            </td>
            <td>
              <span class="status-badge" :class="tx.status === 'success' ? 'status-success' : 'status-failed'">
                <CheckCircle v-if="tx.status === 'success'" :size="14" />
                <XCircle v-else :size="14" />
                {{ tx.status }}
              </span>
            </td>
            <td>
              <span class="text-blue">#{{ tx.block_number.toLocaleString() }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { Activity, CheckCircle, XCircle } from 'lucide-vue-next';

defineProps({
  transactions: Array
});
</script>

<style scoped>
.card {
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.05);
  color: #111827;
}
.card-header {
  padding: 1.5rem;
}
.title-container {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.25rem;
  font-weight: 600;
}
.title-icon {
  width: 24px;
  height: 24px;
}
.table-container {
  overflow-x: auto;
}
table {
  width: 100%;
  border-collapse: collapse;
}
th {
  padding: 0.75rem 1.5rem;
  text-align: left;
  font-size: 0.75rem;
  color: #6b7280;
  text-transform: uppercase;
  font-weight: 500;
  border-bottom: 1px solid #e5e7eb;
}
td {
  padding: 1rem 1.5rem;
  font-size: 0.875rem;
  color: #374151;
  border-bottom: 1px solid #e5e7eb;
}
tbody tr:last-child td {
  border-bottom: none;
}
tbody tr:hover {
  background-color: #f9fafb;
}

.font-semibold { font-weight: 600; }
.font-mono { 
  font-family: monospace;
  font-size: 0.8rem;
}
.text-blue { color: #3b82f6; }

.address-group {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-weight: 500;
  font-size: 0.75rem;
}
.status-success {
  background-color: #f0fdf4;
  color: #16a34a;
}
.status-failed {
  background-color: #fef2f2;
  color: #ef4444;
}
</style>