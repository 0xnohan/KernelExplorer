<template>
  <div class="container">
    <BlocksList :blocks="blocks" />
  </div>
</template>

<script setup>
import BlocksList from '../components/BlocksList.vue';
import { latestBlocks } from '../data/mockData.js';

const blocks = latestBlocks;
</script>

<style scoped>
.container {
  padding: 2rem;
}
</style>