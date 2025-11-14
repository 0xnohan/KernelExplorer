<template>
  <nav class="navbar">
    <div class="nav-left">
      <a href="#" @click.prevent="navigate('HomePage')" class="logo-link">
        <img class="logo" src="/kore-logo.png" alt="Kore Logo" />
        <span class="logo-text">Korescan</span>
      </a>
      <div class="main-nav">
        <a href="#" @click.prevent="navigate('BlocksPage')">
          <span class="link-text">Blocks</span>
        </a>
        <a href="#" @click.prevent="navigate('TransactionsPage')">
          <span class="link-text">Transactions</span>
        </a>
        <a href="#" @click.prevent="navigate('MempoolPage')">
          <span class="link-text">Mempool</span>
        </a>
      </div>
    </div>

    <div class="nav-right">
      <SearchBar @search="performSearch" />
      
      <div class="connection-card" @click="$emit('open-connect-modal')" title="Connection Status">
        <div class="status-indicator" :class="apiState.isConnected ? 'connected' : 'disconnected'"></div>
        <Plug :size="16" class="connect-icon" />
      </div>
    </div>
  </nav>
</template>

<script setup>
import { Plug } from 'lucide-vue-next';
import { apiState } from '../store.js';
import SearchBar from './SearchBar.vue';

const emit = defineEmits(['navigate', 'open-connect-modal', 'search']);

const navigate = (pageName) => {
  emit('navigate', pageName);
};

const performSearch = (query) => {
  emit('search', query);
};
</script>

<style scoped>
.navbar {
  background: var(--color-glass-bg);
  -webkit-backdrop-filter: blur(20px);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: space-between; 
  padding: 0.75rem 1.5rem;
  color: #f9fafb;
  height: 65px;
  flex-shrink: 0;
}

.nav-left {
  display: flex;
  align-items: center;
  gap: 5rem;
}

.logo-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
}

.logo { height: 50px; }
.logo-text {
  font-size: 1.50rem;
  font-weight: 600;
  color: white;
  white-space: nowrap;
}

.main-nav {
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
}

.main-nav a {
  display: flex;
  align-items: center;
  gap: 0;
  color: #c7d2fe;
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  transition: all 0.2s;
  white-space: nowrap;
}
.main-nav a:hover {
  color: white;
  background-color: rgba(255, 255, 255, 0.1);
}


.nav-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.nav-right :deep(.search-container) {
  width: 100%;
  max-width: 600px;
  min-width: 300px;
}

.connection-card {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.65rem;
  background-color: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
}
.connection-card:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.status-indicator {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}
.status-indicator.connected { background-color: #34d399; }
.status-indicator.disconnected { background-color: #f87171; }

.connect-icon {
  color: #c7d2fe;
  flex-shrink: 0;
}
.connection-card:hover .connect-icon {
  color: white;
}
</style>