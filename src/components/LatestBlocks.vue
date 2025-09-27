<template>
  <div class="card">
    <div class="card-header">
      <LayoutGrid />
      <h3>Recent Blocks</h3>
    </div>

    <div class="blocks-list">
      <div v-for="block in blocks" :key="block.height" class="block-item">
        <div class="icon-wrapper">
          <Package :size="20" />
        </div>
        <div class="block-info">
          <p class="block-number">{{ block.height.toLocaleString() }}</p>
          <div class="block-details">
            <span>Transactions: {{ block.transaction_count }}</span>
            <span>Hash: {{ block.hash.substring(0, 35)}}...</span>
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
import { LayoutGrid, Package } from 'lucide-vue-next';

defineProps({
  blocks: Array
});

// 3. Nouvelle fonction pour le format "ago"
const formatTimestampAgo = (isoString) => {
  const now = new Date();
  const past = new Date(isoString);
  const seconds = Math.floor((now - past) / 1000);

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
}
.block-number {
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0 0 0.5rem 0; /* Marge inférieure augmentée */
}

/* --- NOUVEAU STYLE POUR L'AFFICHAGE VERTICAL --- */
.block-details {
  display: flex;
  flex-direction: column; /* Aligne les éléments verticalement */
  align-items: flex-start; /* Aligne le texte à gauche */
  gap: 0.25rem; /* Espace réduit entre les lignes */
  font-size: 0.875rem;
  color: var(--color-text-secondary);
}
.miner {
  font-family: monospace;
  font-size: 0.8rem;
}

.block-timestamp {
  margin-left: auto;
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  white-space: nowrap;
}
</style>