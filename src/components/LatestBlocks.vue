<template>
  <div class="card">
    <div class="card-header">
      <div class="title-container">
        <LayoutGrid class="title-icon" />
        <h3>Recent Blocks</h3>
      </div>
      <button class="view-all-button" @click="goToBlocksPage">
        <span>View All</span>
        <ExternalLink :size="16" />
      </button>
    </div>

    <div class="blocks-list">
      <div v-for="block in blocks" :key="block.height" class="block-item">
        <div class="icon-wrapper">
          <Package :size="20" />
        </div>
        <div class="block-info">
          <p class="block-number">Block {{ block.height.toLocaleString() }}</p>
          <div class="block-details">
            <span class="detail-item">
              <Clock :size="14" /> {{ formatTimestamp(block.timestamp) }}
            </span>
            <span class="detail-item">
              <ArrowLeftRight :size="14" /> {{ block.txns }} txns
            </span>
            <span class="detail-item">
              <User :size="14" /> {{ block.miner }}
            </span>
          </div>
        </div>
        <div class="block-reward">
          <span>{{ block.reward }} KNL</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { LayoutGrid, ExternalLink, Package, Clock, ArrowLeftRight, User } from 'lucide-vue-next';

defineProps({
  blocks: Array
});

const emit = defineEmits(['navigate-to-blocks']);

const goToBlocksPage = () => {
  emit('navigate-to-blocks');
};

const formatTimestamp = (isoString) => {
  const date = new Date(isoString);
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
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

.blocks-list {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.block-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  transition: box-shadow 0.2s;
}
.block-item:hover {
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.07);
}

.icon-wrapper {
  background-color: #eff6ff;
  color: #3b82f6;
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
}

.block-number {
  font-weight: 600;
  color: #111827;
  margin: 0 0 0.25rem 0;
}

.block-details {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 0.875rem;
  color: #6b7280;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.block-reward {
  background-color: #f0fdf4;
  color: #16a34a;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-weight: 500;
  font-size: 0.875rem;
}
</style>