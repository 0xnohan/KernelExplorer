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

// Import des pages
import HomePage from './views/HomePage.vue';
import BlocksPage from './views/BlocksPage.vue';
import TransactionsPage from './views/TransactionsPage.vue';
import BlockDetailsPage from './views/BlockDetailsPage.vue';
import AddressDetailsPage from './views/AddressDetailsPage.vue';

// --- Gestion de la modale de connexion ---
const isModalOpen = ref(false);

const saveConnection = (newUrl) => {
  // 1. Sauvegarde la nouvelle URL dans le localStorage du navigateur
  localStorage.setItem('kernelApiUrl', newUrl);
  
  // 2. Met à jour l'état actuel (facultatif mais propre)
  apiState.baseUrl = newUrl;
  
  // 3. Ferme la modale
  isModalOpen.value = false;
  
  // 4. Recharge la page pour utiliser la nouvelle configuration partout
  window.location.reload(); 
};

// --- Gestion de la barre latérale ---
const isSidebarOpen = ref(true);
const toggleSidebar = () => { isSidebarOpen.value = !isSidebarOpen.value; };

// --- Logique de navigation ---
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
/* Style global pour la mise en page du dashboard */
.dashboard-layout {
  display: grid;
  grid-template-columns: 240px 1fr;
  transition: grid-template-columns 0.3s ease-in-out;
  height: 100vh; /* S'assurer que le layout prend toute la hauteur */
}

.dashboard-layout.sidebar-closed {
  grid-template-columns: 88px 1fr;
}

.main-content {
  overflow-y: auto;
  height: 100vh;
  background-color: #f9fafb;
  display: flex; /* Ajout important */
  flex-direction: column; /* Ajout important */
}
</style>