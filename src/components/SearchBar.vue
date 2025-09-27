<template>
  <div class="search-container">
    <input
      type="text"
      class="search-input"
      placeholder="Search by block number, transaction hash, or address..."
    >
    <button type="submit" class="search-button">
      <Search class="icon" />
    </button>
  </div>
</template>

<script setup>
import { Search } from 'lucide-vue-next';
</script>

<style scoped>
.search-container {
  display: flex;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.75rem;
  padding: 0.25rem;
  padding-left: 1rem;
}

.search-input {
  flex-grow: 1;
  background: none;
  border: none;
  padding: 0.75rem 0.5rem;
  color: white;
  font-size: 1rem;
  outline: none;
}

.search-input::placeholder {
  color: #c7d2fe;
  opacity: 1;
}

.search-button {
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.6rem;
  cursor: pointer;
  display: flex;
  transition: background-color 0.2s ease;
}

.search-button:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.icon {
  width: 20px;
  height: 20px;
}
</style>