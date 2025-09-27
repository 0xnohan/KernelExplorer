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

const isModalOpen = ref(false);

const saveConnection = (newUrl) => {
  localStorage.setItem('kernelApiUrl', newUrl);
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
  AddressDetailsPage
};
const currentPage = ref({ name: 'HomePage', props: {} });
const activeComponent = computed(() => pages[currentPage.value.name]);

const handleNavigation = (pageName, props = {}) => {
  if (pages[pageName]) {
    currentPage.value = { name: pageName, props: props };
  } else {
    console.warn(`Navigation a échoué: Page "${pageName}" non trouvée.`);
  }
};
</script>

<style>
.dashboard-layout {
  display: grid;
  grid-template-columns: 240px 1fr;
  transition: grid-template-columns 0.3s ease-in-out;
  height: 100vh; 
}

.dashboard-layout.sidebar-closed {
  grid-template-columns: 88px 1fr;
}

.main-content {
  overflow-y: auto;
  height: 100vh;
  background-color: #f9fafb;
  display: flex; 
  flex-direction: column; 
}
</style>