<template>
  <div class="section-cmd">
    <span class="prompt">$</span>
    <span class="cmd">{{ cmd }}</span>
    <span v-if="args" class="arg">{{ args }}</span>
    <span v-if="showCursor" class="cursor-blink" />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  cmd: string
  args?: string
  showCursor?: boolean
}>()
</script>

<style scoped>
.section-cmd {
  font-family: var(--font-mono);
  font-size: 0.78rem;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 6px;
  opacity: 0.7;
  min-height: 24px;
}

.prompt {
  color: var(--green);
}

.cmd {
  color: var(--cyan);
}

.arg {
  color: var(--text-muted);
}

.cursor-blink {
  display: inline-block;
  width: 8px;
  height: 16px;
  background: var(--cyan);
  animation: blink 0.8s step-end infinite;
  margin-left: 2px;
}
</style>
