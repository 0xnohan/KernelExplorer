<template>
  <div class="card">
    <div class="card-header">
      <div class="title-container">
        <LayoutGrid class="title-icon" />
        <h3>Blocks</h3>
      </div>
    </div>

    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>Block</th>
            <th>Timestamp</th>
            <th>Transactions</th>
            <th>Miner</th>
            <th>Block Size Used</th>
            <th>Reward</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="block in blocks" :key="block.height">
            <td>
              <a href="#" @click.prevent="$emit('navigate', { blockHash: block.hash })">
                #{{ block.height }}
              </a>
            </td>
            <td>
              <div class="cell-content">
                <Clock class="cell-icon" />
                <span>{{ formatTimestamp(block.timestamp) }}</span>
              </div>
            </td>
            <td>
              <div class="cell-content">
                <ArrowLeftRight class="cell-icon" />
                <span>{{ block.transaction_count }}</span>
              </div>
            </td>
            <td>
              <div class="cell-content">
                <User class="cell-icon" />
                <span class="font-mono">{{ block.miner }}</span>
              </div>
            </td>
            <td>
              <div class="cell-content">
                <Zap class="cell-icon text-yellow" />
                <span>{{ block.size_used}}%</span>
              </div>
            </td>
            <td>
              <span class="reward-badge">
                {{ block.reward }} KNL
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { LayoutGrid, Package, Clock, ArrowLeftRight, User, Zap } from 'lucide-vue-next';

defineProps({
  blocks: Array
});

defineEmits(['navigate']);

const formatTimestamp = (isoString) => {
  const date = new Date(isoString);
  const options = { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
  return new Intl.DateTimeFormat('en-US', options).format(date);
};
</script>

<style scoped>
.card {
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.05);
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
  color: #111827;
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

.cell-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.cell-icon {
  width: 16px;
  height: 16px;
  color: #9ca3af;
}
.font-semibold { font-weight: 600; }
.font-mono { font-family: monospace; }
.text-blue { color: #3b82f6; }
.text-yellow { color: #f59e0b; }

.reward-badge {
  background-color: #f0fdf4;
  color: #16a34a;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-weight: 500;
  font-size: 0.875rem;
}

.clickable {
  text-decoration: none;
  color: inherit;
  transition: color 0.2s;
}
.clickable:hover .font-semibold {
  color: #3b82f6;
  text-decoration: underline;
}
</style>