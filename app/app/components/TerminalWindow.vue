<template>
  <div class="terminal-window">
    <div class="terminal-titlebar">
      <div class="terminal-dots">
        <span class="terminal-dot" />
        <span class="terminal-dot" />
        <span class="terminal-dot" />
      </div>
      <span class="terminal-title">{{ title }}</span>
    </div>
    <div class="terminal-body">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title?: string
}>()
</script>

<style scoped>
.terminal-window {
  background: var(--bg-terminal);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.6);
  transition: border-color var(--transition), box-shadow var(--transition);
}

.terminal-window:hover {
  border-color: rgba(6, 182, 212, 0.35);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7),
    0 0 0 1px rgba(6, 182, 212, 0.2),
    0 0 60px rgba(6, 182, 212, 0.04);
}

.terminal-titlebar {
  background: #0f1729;
  padding: 10px 18px;
  display: flex;
  align-items: center;
  gap: 12px;
  border-bottom: 1px solid var(--border);
  min-height: 42px;
}

.terminal-dots {
  display: flex;
  gap: 6px;
}

.terminal-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  transition: filter 0.2s;
}

.terminal-dot:hover {
  filter: brightness(1.4);
}

.terminal-dot:nth-child(1) {
  background: #ef4444;
}

.terminal-dot:nth-child(2) {
  background: #eab308;
}

.terminal-dot:nth-child(3) {
  background: #22c55e;
}

.terminal-title {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  color: var(--text-muted);
  letter-spacing: 0.3px;
  flex: 1;
  text-align: center;
  opacity: 0.8;
}

.terminal-body {
  padding: 28px;
}

@media (max-width: 768px) {
  .terminal-body {
    padding: 20px;
  }
}
</style>
