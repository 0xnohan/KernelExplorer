<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content card">
      <div class="card-header">
        <h3>Connect to API Server</h3>
      </div>
      <div class="form-container">
        <div class="form-group">
          <label for="ip-address">IP Address</label>
          <input id="ip-address" v-model="ip" type="text" placeholder="127.0.0.1">
        </div>
        <div class="form-group">
          <label for="port">Port</label>
          <input id="port" v-model="port" type="number" placeholder="5000">
        </div>
        <div class="button-group">
          <button class="button-cancel" @click="$emit('close')">Cancel</button>
          <button class="button-save" @click="handleSave">Save & Connect</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const emit = defineEmits(['close', 'save']);

const savedUrl = localStorage.getItem('kernelApiUrl') || 'http://127.0.0.1:5000';
const urlParts = savedUrl.replace('http://', '').split(':');
const ip = ref(urlParts[0] || '127.0.0.1');
const port = ref(urlParts[1] || '5000');

const handleSave = () => {
  if (ip.value && port.value) {
    emit('save', `http://${ip.value}:${port.value}`);
  }
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(10, 5, 40, 0.5); 
  -webkit-backdrop-filter: blur(10px); 
  backdrop-filter: blur(10px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  width: 90%;
  max-width: 400px;
}

.form-container {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem; 
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--color-text-secondary);
}

.form-group input {
  padding: 0.75rem 1rem;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background-color: rgba(255, 255, 255, 0.05);
  color: var(--color-text-primary);
  font-size: 1rem;
  transition: all 0.2s ease;
}

.form-group input:focus {
  outline: none;
  border-color: rgba(129, 140, 248, 0.7);
  background-color: rgba(255, 255, 255, 0.1);
}

.button-group {
  margin-top: 1rem;
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}

button {
  padding: 0.75rem 1.25rem;
  border-radius: 8px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.button-cancel {
  background-color: transparent;
  color: var(--color-text-secondary);
}

.button-cancel:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
}

.button-save {
  background-color: #818cf8;
  color: #1e1b4b;
}

.button-save:hover {
  background-color: #a5b4fc;
}
</style>