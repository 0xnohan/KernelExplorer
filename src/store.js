import { reactive } from 'vue';

const savedUrl = localStorage.getItem('kernelApiUrl') || 'http://127.0.0.1:5000';

export const apiState = reactive({
  baseUrl: savedUrl,
  isConnected: false,
  isConnecting: false,
});