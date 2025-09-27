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

const ip = ref('127.0.0.1');
const port = ref('5000');

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
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 15vh;   
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
  gap: 1rem;
}
.form-group {
  display: flex;
  flex-direction: column;
}
.form-group label {
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #d1d5db;
}
.form-group input {
  padding: 0.75rem;
  border-radius: 6px;
  border: 1px solid #4b5563;
  background-color: #1f2937;
  color: #f9fafb;
  font-size: 1rem;
}
.button-group {
  margin-top: 1rem;
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}
button {
  padding: 0.75rem 1rem;
  border-radius: 6px;
  border: none;
  font-weight: 600;
  cursor: pointer;
}
.button-cancel {
  background-color: transparent;
  color: #9ca3af;
}
.button-save {
  background-color: #8ab4f8;
  color: #111827;
}
</style>