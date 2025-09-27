<template>
  <div class="card stat-card">
    <div class="icon-wrapper" :class="`bg-${color}-light`">
      <component :is="icon" class="icon" :class="`text-${color}`" />
    </div>
    <div class="text-content">
      <p class="title">{{ title }}</p>
      <p class="value">{{ value }}</p>
      <p class="change" :class="changeType === 'increase' ? 'text-green' : 'text-red'">
        <ArrowUp v-if="changeType === 'increase'" class="change-icon" />
        {{ change }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { ArrowUp } from 'lucide-vue-next';

defineProps({
  title: String,
  value: String,
  change: String,
  changeType: String,
  icon: Object,
  color: String
});
</script>

<style scoped>
.stat-card {
  display: flex;
  align-items: center;
  padding: 1.5rem;
  gap: 1rem;
}
.icon-wrapper {
  padding: 0.75rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.icon {
  width: 24px;
  height: 24px;
}
.text-content {
  flex-grow: 1;
}
.title {
  font-size: 0.875rem;
  color: #e0e7ff; /* Texte plus clair */
}
.value {
  font-size: 1.75rem;
  font-weight: 700;
  color: #ffffff; /* Texte blanc */
}
.change {
  display: flex;
  align-items: center;
  font-size: 0.875rem;
  font-weight: 500;
  gap: 0.25rem;
}
.change-icon {
  width: 14px;
  height: 14px;
}

.bg-blue-light { background-color: rgba(129, 140, 248, 0.2); }
.text-blue { color: #a5b4fc; }
.bg-purple-light { background-color: rgba(167, 139, 250, 0.2); }
.text-purple { color: #c4b5fd; }
.bg-green-light { background-color: rgba(52, 211, 153, 0.2); }
.text-green { color: #6ee7b7; }
.bg-orange-light { background-color: rgba(245, 158, 11, 0.2); }
.text-orange { color: #fcd34d; }
.text-red { color: #f87171; } /* Ajout pour le cas 'decrease' */
</style>