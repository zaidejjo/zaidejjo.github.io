<template>
  <div class="theme-toggle" role="radiogroup" aria-label="Color theme">
    <button
      class="theme-option"
      :class="{ active: colorMode.value === 'dark' }"
      :aria-checked="colorMode.value === 'dark'"
      role="radio"
      title="Dark terminal theme"
      @click="colorMode.preference = 'dark'"
    >
      <UIcon name="i-heroicons-command-line" />
    </button>
    <button
      class="theme-option"
      :class="{ active: colorMode.value === 'light' }"
      :aria-checked="colorMode.value === 'light'"
      role="radio"
      title="Light terminal theme"
      @click="colorMode.preference = 'light'"
    >
      <UIcon name="i-heroicons-sun" />
    </button>
  </div>
</template>

<script setup lang="ts">
const colorMode = useColorMode()
</script>

<style scoped>
.theme-toggle {
  display: flex;
  gap: 4px;
  background: var(--bg-terminal);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  padding: 3px;
}

.theme-option {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px 8px;
  border-radius: 4px;
  border: none;
  background: transparent;
  color: var(--text-muted);
  cursor: pointer;
  font-size: 0.72rem;
  transition: all var(--transition);
}

.theme-option.active {
  background: var(--bg-hover);
  color: var(--cyan);
}

.theme-option:hover:not(.active) {
  color: var(--text-primary);
}
</style>
