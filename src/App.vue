<template>
  <div class="dashboard-layout"> 
    <NavBar 
      @navigate="handleNavigation"
      @open-connect-modal="isModalOpen = true" 
      @search="handleSearch"
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

const handleSearch = async (query) => {
  try {
    const response = await fetch(`${apiState.baseUrl}/api/search/${query}`);
    if (response.ok) {
      const result = await response.json();
      if (result.found) {
        switch (result.type) {
          case 'block':
            handleNavigation('BlockDetailsPage', { blockHash: result.identifier });
            break;
          case 'transaction':
            handleNavigation('TransactionDetailsPage', { txHash: result.identifier });
            break;
          case 'address':
            handleNavigation('AddressDetailsPage', { addressHash: result.identifier });
            break;
        }
      } else {
        alert("No results found for your search.");
      }
    } else {
      alert("Error during search.");
    }
  } catch (error) {
    console.error("Search error:", error);
    alert("An error occurred during the search.");
  }
};
</script>

<style>
.dashboard-layout {
  display: flex;
  flex-direction: column;
  transition: none;
  width: 100vw;  
  min-height: 100vh; 
}

.main-content {
  flex-grow: 1;
}
</style>