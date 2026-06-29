<template>
  <div class="section-label">{{ label }}</div>
</template>

<script setup lang="ts">
defineProps<{
  label: string
}>()
</script>

<style scoped>
.section-label {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--cyan);
  letter-spacing: 1.5px;
  text-transform: uppercase;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.section-label::before {
  content: '';
  display: inline-block;
  width: 24px;
  height: 1px;
  background: var(--cyan);
}
</style>
