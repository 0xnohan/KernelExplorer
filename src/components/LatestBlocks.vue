<template>
  <div class="card">
    <div class="card-header">
      <LayoutGrid />
      <h3>Recent Blocks</h3>
      <a href="#" @click.prevent="$emit('navigate', 'BlocksPage')" class="view-all-button">
        View All
        <ExternalLink :size="14" />
      </a>
    </div>

    <div class="blocks-list">
      <div v-for="block in blocks" :key="block.height" class="block-item" @click="$emit('navigate', 'BlockDetailsPage', { blockHash: block.hash })">
        <div class="icon-wrapper">
          <Package :size="20" />
        </div>
        <div class="block-info">
          <p class="block-number">{{ block.height.toLocaleString() }}</p>
          <div class="block-details">
            <span>Transactions: {{ block.transaction_count }}</span>
            <span class="block-hash-text">Hash: {{ block.hash.substring(0, 35)}}...</span>
          </div>
        </div>
        <div class="block-timestamp">
          <span>{{ formatTimestampAgo(block.timestamp) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { LayoutGrid, Package, ExternalLink } from 'lucide-vue-next';

defineProps({
  blocks: Array
});

defineEmits(['navigate']);

const formatTimestampAgo = (isoString) => {
  const now = new Date();
  const past = new Date(isoString);
  const seconds = Math.floor((now - past) / 1000);

  if (seconds < 2) return `just now`;
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
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

.blocks-list {
  padding: 0.5rem 1.5rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.block-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: 0.75rem;
  background-color: rgba(255, 255, 255, 0.05);
  transition: background-color 0.2s;
  cursor: pointer; 
}
.block-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.icon-wrapper {
  background-color: rgba(129, 140, 248, 0.1);
  color: #a5b4fc;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.block-info {
  flex-grow: 1;
  min-width: 0;
}
.block-number {
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0 0 0.5rem 0;
}

.block-details {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.25rem;
  font-size: 0.875rem;
  color: var(--color-text-secondary);
}
.block-hash-text {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 100%;
}

.block-timestamp {
  margin-left: auto;
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  white-space: nowrap;
}
</style>