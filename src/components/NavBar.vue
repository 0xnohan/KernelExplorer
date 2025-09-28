<template>
  <aside class="sidebar" :class="{ 'is-closed': !isOpen }">
    <div>
      <div class="sidebar-header">
        <a href="#" @click.prevent="navigate('HomePage')" class="logo-link">
          <img class="logo" src="/kernel-logo.png" alt="Kernel Logo" />
          <span class="logo-text">Kernel</span>
        </a>
        <button @click="toggle" class="toggle-button">
          <ChevronsLeft class="icon" />
        </button>
      </div>

      <nav class="main-nav">
        <a href="#" @click.prevent="navigate('HomePage')">
          <Home class="icon" />
          <span class="link-text">Home</span>
        </a>
        <a href="#" @click.prevent="navigate('BlocksPage')">
          <Package class="icon" />
          <span class="link-text">Blocks</span>
        </a>
        <a href="#" @click.prevent="navigate('TransactionsPage')">
          <ArrowLeftRight class="icon" />
          <span class="link-text">Transactions</span>
        </a>
        <a href="#" @click.prevent="navigate('MempoolPage')">
          <Hourglass class="icon" />
          <span class="link-text">Mempool</span>
        </a>
      </nav>
    </div>

    <div class="connection-card-wrapper">
      <div class="connection-card" :class="{ 'is-closed': !isOpen }">
        <div class="status-indicator" :class="apiState.isConnected ? 'connected' : 'disconnected'"></div>
        <div class="status-text">
          <p class="status-title">{{ apiState.isConnected ? 'Connected' : 'Disconnected' }}</p>
          <p class="status-url">{{ apiState.baseUrl }}</p>
        </div>
        <button class="connect-button" @click="$emit('open-connect-modal')">
          <Plug :size="16" />
        </button>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { Plug, Home, Package, ArrowLeftRight, Hourglass, ChevronsLeft } from 'lucide-vue-next';
import { apiState } from '../store.js';

defineProps({
  isOpen: Boolean
});

const emit = defineEmits(['navigate', 'toggle-sidebar', 'open-connect-modal']);

const navigate = (pageName) => {
  emit('navigate', pageName);
};

const toggle = () => {
  emit('toggle-sidebar');
};
</script>

<style scoped>
.sidebar {
  background: var(--color-glass-bg);
  -webkit-backdrop-filter: blur(20px);
  backdrop-filter: blur(20px);
  border-right: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 1.25rem;
  transition: all 0.3s ease-in-out;
  position: sticky;
  top: 0;
  height: 100vh;
  color: #f9fafb;
}
.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
}

.logo-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  overflow: hidden;
}

.logo { height: 40px; }

.logo-text {
  font-size: 1.5rem;
  font-weight: 600;
  color: white;
  white-space: nowrap;
}

.main-nav {
  display: flex;
  flex-direction: column;
}

.main-nav a {
  display: flex;
  align-items: center;
  gap: 1rem;
  color: #c7d2fe;
  text-decoration: none;
  font-weight: 500;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  margin-bottom: 0.5rem;
  transition: all 0.2s;
  white-space: nowrap;
}

.main-nav a:hover {
  color: white;
  background-color: rgba(255, 255, 255, 0.1);
}
.icon {
  width: 22px;
  height: 22px;
  flex-shrink: 0;
}
.link-text {
  opacity: 1;
  transition: opacity 0.2s ease-in-out;
}

.toggle-button {
  background: none;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #c7d2fe;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  display: flex;
  transition: all 0.2s ease;
}

.toggle-button:hover {
  color: white;
  background-color: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.3);
}

.toggle-button .icon {
  transition: transform 0.3s ease-in-out;
}

.sidebar.is-closed .logo-text,
.sidebar.is-closed .link-text {
  opacity: 0;
  width: 0;
  pointer-events: none;
}

.sidebar.is-closed .main-nav a {
  justify-content: center; 
  gap: 0; 
}

.sidebar.is-closed .toggle-button .icon {
  transform: rotate(180deg);
}

.connection-card {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background-color: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  transition: all 0.3s;
  margin-bottom: 30px;
}
.status-indicator {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}
.status-indicator.connected { background-color: #34d399; }
.status-indicator.disconnected { background-color: #f87171; }

.status-text {
  flex-grow: 1;
  min-width: 0;
  opacity: 1;
  transition: opacity 0.2s, width 0.3s;
}
.status-title {
  font-weight: 600;
  font-size: 0.875rem;
  margin: 0;
}
.status-url {
  font-size: 0.75rem;
  color: #c7d2fe;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0;
}
.connect-button {
  background: none;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #c7d2fe;
  border-radius: 6px;
  padding: 0.5rem;
  cursor: pointer;
  display: flex;
}
.connect-button:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
}

.connection-card.is-closed {
  justify-content: center;
  background-color: transparent;
  padding: 0;
  border: none;
}
.connection-card.is-closed .status-indicator,
.connection-card.is-closed .status-text {
  display: none;
}
.connection-card.is-closed .connect-button {
  border: none;
  background-color: rgba(0, 0, 0, 0.2);
  padding: 0.75rem;
}
</style>