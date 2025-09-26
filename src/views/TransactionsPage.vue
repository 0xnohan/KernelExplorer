<template>
  <div class="container">
    <TransactionsList :transactions="transactions" />
  </div>
</template>

<script setup>
import TransactionsList from '../components/TransactionsList.vue';
import { latestTransactions } from '../data/mockData.js';

const transactions = latestTransactions;
</script>

<style scoped>
.container {
  padding: 2rem;
}
</style>