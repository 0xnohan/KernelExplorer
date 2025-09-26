<template>
  <div class="dashboard-layout" :class="{ 'sidebar-closed': !isSidebarOpen }">
    <NavBar 
      :is-open="isSidebarOpen" 
      @navigate="handleNavigation"
      @toggle-sidebar="toggleSidebar" 
    />
    <main class="main-content">
      <component :is="activeComponent" @navigate="handleNavigation" />
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import NavBar from './components/NavBar.vue';
import HomePage from './views/HomePage.vue';
import BlocksPage from './views/BlocksPage.vue';
import TransactionsPage from './views/TransactionsPage.vue';

const isSidebarOpen = ref(true);
const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

const pages = { 
  HomePage, 
  BlocksPage,
  TransactionsPage,
  // MempoolPage 
};

const currentPage = ref('HomePage');
const activeComponent = computed(() => pages[currentPage.value]);

const handleNavigation = (pageName) => {
  if (pages[pageName]) {
    currentPage.value = pageName;
  } else {
    console.warn(`Goto "${pageName}" not found`);
  }
};
</script>

<style>
.dashboard-layout {
  display: grid;
  grid-template-columns: 240px 1fr;
  transition: grid-template-columns 0.3s ease-in-out;
}

.dashboard-layout.sidebar-closed {
  grid-template-columns: 88px 1fr;
}

.main-content {
  overflow-y: auto;
  height: 100vh;
  background-color: #f9fafb; 
  color: #111827; 
}
</style>