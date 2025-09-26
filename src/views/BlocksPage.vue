<template>
  <div class="container">
    <BlocksList :blocks="blocks" @navigate="$emit('navigate', $event)" />
  </div>
</template>

<script setup>
import BlocksList from '../components/BlocksList.vue';
import { latestBlocks } from '../data/mockData.js';


defineEmits(['navigate']);

const blocks = latestBlocks;
</script>

<style scoped>
.container {
  padding: 2rem;
}
</style>