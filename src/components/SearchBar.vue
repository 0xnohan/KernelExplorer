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
  padding: 0.25rem;
  padding-left: 1rem;
}

.search-input {
  flex-grow: 1;
  background: none;
  border: 1px solid transparent;
  border-radius: 0.5rem;
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
  background-color: white;
  color: #4f46e5;
  border: none;
  border-radius: 6px;
  padding: 0.6rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease;
}

.search-button:hover {
  background-color: #e0e7ff;
}

.icon {
  width: 20px;
  height: 20px;
}
</style>