<template>
  <div class="card">
    <div class="card-header">
      <div class="title-container">
        <LayoutGrid class="title-icon" />
        <h3>Blocks</h3>
      </div>
    </div>

    <div class="list-container">
      <div class="list-header">
        <span>Block</span>
        <span>Timestamp</span>
        <span>Transactions</span>
        <span>Miner</span>
        <span>Gas Used</span>
        <span class="text-right">Reward</span>
      </div>

      <div class="list-body">
        <div v-for="block in blocks" :key="block.height" class="list-row">
          <a href="#" @click.prevent="$emit('navigate', 'BlockDetailsPage', { blockHash: block.hash })" class="cell-content block-height">
            <Package class="cell-icon" />
            <span>{{ block.height }}</span>
          </a>
          <div class="cell-content">
            <Clock class="cell-icon" />
            <span>{{ formatTimestamp(block.timestamp) }}</span>
          </div>
          <div class="cell-content">
            <ArrowLeftRight class="cell-icon" />
            <span>{{ block.transaction_count }}</span>
          </div>
          <div class="cell-content">
            <User class="cell-icon" />
            <a href="#" @click.prevent="$emit('navigate', 'AddressDetailsPage', { addressHash: block.miner })" class="font-mono miner-link">
              {{ block.miner }}
            </a>
          </div>
          <div class="cell-content">
            <Zap class="cell-icon text-yellow" />
            <span>{{ block.size_used }}%</span>
          </div>
          <div class="text-right">
            <span class="reward-badge">
              {{ block.reward }} KNL
            </span>
          </div>
        </div>
      </div>
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
  grid-template-columns: 1.2fr 1.5fr 1fr 2fr 1fr 1fr;
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
.block-height {
  font-weight: 600;
  color: var(--color-text-primary);
  text-decoration: none;
  transition: color 0.2s;
}
.block-height:hover {
  color: var(--color-blue);
}
.block-height .cell-icon {
  color: var(--color-blue);
}
.font-mono {
  font-family: monospace;
  font-size: 0.8rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 150px;
}

.miner-link {
  color: var(--color-text-secondary);
  text-decoration: none;
  transition: color 0.2s;
}
.miner-link:hover {
  color: var(--color-blue);
  text-decoration: underline;
}
.text-yellow {
  color: #fcd34d;
}
.reward-badge {
  background-color: rgba(52, 211, 153, 0.2);
  color: #6ee7b7;
  padding: 0.35rem 0.75rem;
  border-radius: 9999px;
  font-weight: 500;
  font-size: 0.875rem;
}
.text-right {
  text-align: right;
}
</style>