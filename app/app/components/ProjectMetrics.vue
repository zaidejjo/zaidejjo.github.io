<template>
  <div class="project-metrics">
    <div
      v-for="metric in metrics"
      :key="metric.label"
      class="metric"
    >
      <span
        class="metric-value"
        :class="{ amber: metric.accent === 'amber' }"
      >
        {{ metric.value }}
      </span>
      <span class="metric-label">{{ metric.label }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
export interface Metric {
  value: string
  label: string
  accent?: 'amber'
}

defineProps<{
  metrics: Metric[]
}>()
</script>

<style scoped>
.project-metrics {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 6px;
  padding: 10px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: var(--radius-sm);
  border: 1px solid var(--border);
  margin-bottom: 12px;
}

.metric {
  text-align: center;
  padding: 2px;
}

.metric-value {
  display: block;
  font-family: var(--font-mono);
  font-size: clamp(0.85rem, 1.3vw, 1rem);
  font-weight: 700;
  color: var(--cyan);
  letter-spacing: -0.3px;
}

.metric-value.amber {
  color: var(--amber);
}

.metric-label {
  font-size: 0.58rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-family: var(--font-mono);
  margin-top: 1px;
}

@media (max-width: 768px) {
  .project-metrics {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .project-metrics {
    grid-template-columns: 1fr 1fr;
    gap: 4px;
    padding: 8px;
  }
}
</style>
