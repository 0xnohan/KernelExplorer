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
  </aside>
</template>

<script setup>
import { Home, Package, ArrowLeftRight, Hourglass, ChevronsLeft } from 'lucide-vue-next';

defineProps({
  isOpen: Boolean
});

const emit = defineEmits(['navigate', 'toggle-sidebar']);
const navigate = (pageName) => {
  emit('navigate', pageName);
};

const toggle = () => {
  emit('toggle-sidebar');
};
</script>

<style scoped>
.sidebar {
  background-color: var(--color-bg-secondary); 
  border-right: 1px solid #374151;
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
  color: #9ca3af;
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
  background-color: #1f2937;
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
  border: 1px solid #374151;
  color: #9ca3af;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.toggle-button:hover {
  color: white;
  background-color: #1f2937;
  border-color: #4b5563;
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
}

.sidebar.is-closed .toggle-button .icon { 
  transform: rotate(180deg); 
}
</style>