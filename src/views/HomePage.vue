<template>
  <div>
    <section class="hero-section">
      <div class="container">
        <h1 class="hero-title">Kernel Explorer</h1>
        <p class="hero-subtitle">Explore blocks, transactions, and addresses on the Kernel blockchain</p>
        <div class="search-bar-wrapper">
          <SearchBar />
        </div>
      </div>
    </section>

    <div class="main-content-area container">
      <div class="stats-grid">
        <StatCard 
          v-for="stat in stats" 
          :key="stat.title"
          :title="stat.title"
          :value="stat.value"
          :change="stat.change"
          :changeType="stat.changeType"
          :icon="stat.icon"
          :color="stat.color"
        />
      </div>

      <div class="lists-grid">
        <LatestBlocks :blocks="blocks" @navigate-to-blocks="$emit('navigate', 'BlocksPage')" />
        <LatestTransactions 
          :transactions="transactions" 
          @navigate-to-transactions="$emit('navigate', 'TransactionsPage')"
          @navigate-to-address="$emit('navigate', 'AddressDetailsPage')" 
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import StatCard from '../components/StatCard.vue';
import LatestBlocks from '../components/LatestBlocks.vue';
import LatestTransactions from '../components/LatestTransactions.vue';
import SearchBar from '../components/SearchBar.vue';
import { dashboardStats, latestBlocks, latestTransactions } from '../data/mockData.js';

defineEmits(['navigate']);

const stats = dashboardStats;
const blocks = latestBlocks;
const transactions = latestTransactions;
</script>

<style scoped>
.hero-section {
  padding: 4rem 0 6rem 0;
  background: linear-gradient(100deg, #4f46e5, #8b5cf6);
  color: white;
  text-align: center;
}
.hero-title {
  font-size: 3rem;
  font-weight: 800;
}
.hero-subtitle {
  font-size: 1.125rem;
  color: #e0e7ff;
  margin-top: 0.5rem;
  margin-bottom: 2rem;
}
.search-bar-wrapper {
  max-width: 600px;
  margin: 0 auto;
}
.search-bar-wrapper :deep(.search-input) {
  background-color: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
  color: white;
}
.search-bar-wrapper :deep(.search-input::placeholder) {
  color: #c7d2fe;
}
.search-bar-wrapper :deep(.search-button) {
  background-color: white;
  color: #4f46e5;
}

.main-content-area {
  margin-top: -4rem; 
}
</style>