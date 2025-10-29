<template>
  <div class="container">
    <div class="page-header">
      <h1 class="page-title">Mempool Stream</h1>
      <p class="page-subtitle">Transactions pending...</p>
    </div>

    <div class="stream-container">
      <div class="next-block-target">
        <div class="block-content">
          <div class="block-icon">
            <Package :size="48" />
          </div>
          <h3>Next Block</h3>
          <span>{{ settledTxs.length }} Txs</span>
        </div>
        <transition-group name="settle" tag="div" class="settled-grid">
          <div
            v-for="tx in settledTxs"
            :key="tx.hash"
            class="tx-square-settled"
            :style="getSettledSquareStyle(tx)"
            :title="`Hash: ${tx.hash.substring(0, 20)}...\nValue: ${tx.value.toFixed(4)} KOR`"
          ></div>
        </transition-group>
      </div>

      <div class="conveyor-belt">
        <div
          v-for="tx in slidingTxs"
          :key="tx.hash"
          class="tx-square-sliding"
          :style="getSlidingSquareStyle(tx)"
          :title="`Hash: ${tx.hash.substring(0, 20)}...\nValue: ${tx.value.toFixed(4)} KOR`"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { apiState } from '../store.js';
import { Package } from 'lucide-vue-next';

defineEmits(['navigate']);

const slidingTxs = ref([]);
const settledTxs = ref([]);
const pendingTimeouts = new Map();
let intervalId = null;

const settleTransaction = (txToSettle) => {
  if (!settledTxs.value.some(t => t.hash === txToSettle.hash)) {
    settledTxs.value.push(txToSettle);
  }
  slidingTxs.value = slidingTxs.value.filter(t => t.hash !== txToSettle.hash);
};

const fetchMempoolData = async () => {
  try {
    const response = await fetch(`${apiState.baseUrl}/api/mempool`);
    if (response.ok) {
      const newTxs = await response.json();
      const currentHashes = new Set([...slidingTxs.value, ...settledTxs.value].map(tx => tx.hash));
      const newHashes = new Set(newTxs.map(tx => tx.hash));
      settledTxs.value = settledTxs.value.filter(tx => newHashes.has(tx.hash));
      const removedSlidingTxs = slidingTxs.value.filter(tx => !newHashes.has(tx.hash));
      removedSlidingTxs.forEach(tx => {
        clearTimeout(pendingTimeouts.get(tx.hash));
        pendingTimeouts.delete(tx.hash);
      });
      slidingTxs.value = slidingTxs.value.filter(tx => newHashes.has(tx.hash));

      newTxs.forEach(tx => {
        if (!currentHashes.has(tx.hash)) {
          tx.createdAt = Date.now() + Math.random(); 
          slidingTxs.value.push(tx);

          const timeoutId = setTimeout(() => {
            settleTransaction(tx);
            pendingTimeouts.delete(tx.hash);
          }, 14000); 
          pendingTimeouts.set(tx.hash, timeoutId);
        }
      });
    }
  } catch (error) {
    console.error("Error fetching mempool data:", error);
  }
};

const getSlidingSquareStyle = (tx) => {
  const size = Math.max(15, Math.min(2 + Math.log(tx.value + 1) * 8, 80));
  const randomFactor = (tx.createdAt % 1000) / 1000;
  return {
    width: `${size}px`,
    height: `${size}px`,
    top: `${randomFactor * 99}%`, 
    animationDuration: `15s`, 
  };
};

const getSettledSquareStyle = (tx) => {
  const size = Math.max(10, Math.min(2 + Math.log(tx.value + 1) * 4, 25));
  return {
    width: `${size}px`,
    height: `${size}px`,
  };
};

onMounted(() => {
  fetchMempoolData();
  intervalId = setInterval(fetchMempoolData, 5000);
});

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId);
  }
  pendingTimeouts.forEach(timeoutId => clearTimeout(timeoutId));
});
</script>

<style scoped>
.container { padding: 2rem 2.5rem; }
.page-header { margin-bottom: 2rem; text-align: center; }
.page-title { font-size: 2.5rem; font-weight: 800; }
.page-subtitle { font-size: 1.125rem; color: var(--color-text-secondary); margin-top: 0.5rem; }

.stream-container {
  display: flex;
  background-color: rgba(12, 16, 43, 0.5);
  border-radius: 0.75rem;
  height: 60vh;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.next-block-target {
  flex-shrink: 0;
  width: 250px;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  display: flex;
  flex-direction: column;
  background: rgba(30, 41, 59, 0.3);
}
.block-content {
  position: absolute;
  top: 0; left: 0; right: 0;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  color: var(--color-text-secondary);
  padding: 2rem 0;
  background: linear-gradient(to bottom, rgba(30, 41, 59, 0.9), transparent);
  pointer-events: none;
}
.block-icon { color: #a5b4fc; }
.next-block-target h3 { font-size: 1.5rem; font-weight: 600; color: var(--color-text-primary); }
.next-block-target span { font-size: 1rem; font-weight: 500; background-color: rgba(129, 140, 248, 0.2); color: #a5b4fc; padding: 0.35rem 0.75rem; border-radius: 6px; }

.settled-grid {
  display: flex;
  flex-wrap: wrap-reverse;
  align-content: flex-end;
  padding: 10px;
  gap: 5px;
  width: 100%;
  height: 100%;
}
.tx-square-settled {
  background-color: #a5b4fc;
  border-radius: 2px;
}

.conveyor-belt {
  flex-grow: 1;
  position: relative;
}
.tx-square-sliding {
  position: absolute;
  right: -100px;
  background-image: linear-gradient(45deg, #818cf8, #a5b4fc);
  border-radius: 4px;
  box-shadow: 0 0 15px rgba(165, 180, 252, 0.3);
  animation: slideLeft linear infinite; 
}

@keyframes slideLeft {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(calc(-100vw + 300px));
  }
}

.settle-enter-active, .settle-leave-active {
  transition: all 0.5s ease;
}
.settle-enter-from, .settle-leave-to {
  opacity: 0;
  transform: scale(0);
}
</style>