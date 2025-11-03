<template>
  <div class="dashboard-layout" :class="{ 'sidebar-closed': !isSidebarOpen }">
    <NavBar 
      :is-open="isSidebarOpen" 
      @navigate="handleNavigation"
      @toggle-sidebar="toggleSidebar"
      @open-connect-modal="isModalOpen = true" 
    />
    <main class="main-content">
      <component 
        :is="activeComponent" 
        v-bind="currentPage.props" 
        @navigate="handleNavigation" 
      />
    </main>
    <ConnectionModal 
      v-if="isModalOpen"
      @close="isModalOpen = false"
      @save="saveConnection"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import NavBar from './components/NavBar.vue';
import ConnectionModal from './components/ConnectionModal.vue';
import { apiState } from './store.js';

import HomePage from './views/HomePage.vue';
import BlocksPage from './views/BlocksPage.vue';
import TransactionsPage from './views/TransactionsPage.vue';
import BlockDetailsPage from './views/BlockDetailsPage.vue';
import AddressDetailsPage from './views/AddressDetailsPage.vue';
import TransactionDetailsPage from './views/TransactionDetailsPage.vue';
import MempoolPage from './views/MempoolPage.vue';

const isModalOpen = ref(false);

const saveConnection = (newUrl) => {
  localStorage.setItem('koreApiUrl', newUrl);
  apiState.baseUrl = newUrl;
  isModalOpen.value = false;
  window.location.reload(); 
};

const isSidebarOpen = ref(true);
const toggleSidebar = () => { isSidebarOpen.value = !isSidebarOpen.value; };

const pages = { 
  HomePage, 
  BlocksPage,
  TransactionsPage,
  BlockDetailsPage,
  AddressDetailsPage,
  TransactionDetailsPage,
  MempoolPage
};
const currentPage = ref({ name: 'HomePage', props: {} });
const activeComponent = computed(() => pages[currentPage.value.name]);

const handleNavigation = (pageName, props = {}) => {
  if (pages[pageName]) {
    currentPage.value = { name: pageName, props: props };
  } else {
    console.warn(`Error while navigating to "${pageName}": Page not found`);
  }
};
</script>

<style>
.dashboard-layout {
  display: grid;
  grid-template-columns: 240px 1fr;
  transition: grid-template-columns 0.3s ease-in-out;
  height: 100vh; 
  width: 100vw;  
  overflow: hidden;
}

.dashboard-layout.sidebar-closed {
  grid-template-columns: 85px 1fr;
}

.main-content {
  flex-grow: 1;
  overflow-y: auto;
  height: 100vh;
}

</style>