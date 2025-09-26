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
  color: var(--color-text-muted-dark);
}
.value {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--color-text-dark);
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

.bg-blue-light { background-color: #eff6ff; }
.text-blue { color: #2563eb; }
.bg-purple-light { background-color: #f5f3ff; }
.text-purple { color: #7c3aed; }
.bg-green-light { background-color: #f0fdf4; }
.text-green { color: #16a34a; }
.bg-orange-light { background-color: #fff7ed; }
.text-orange { color: #f97316; }
</style>