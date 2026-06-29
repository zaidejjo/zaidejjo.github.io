<template>
  <div class="stack-category">
    <div class="stack-category-header" />
    <div class="stack-items">
      <div
        v-for="item in items"
        :key="item.label"
        class="stack-item"
      >
        <UIcon v-if="item.icon" :name="item.icon" class="stack-icon" />
        <i
          v-else-if="item.faIcon"
          :class="item.faIcon"
          class="stack-icon-fa"
        />
        {{ item.label }}
        <span v-if="item.sub" class="sub">{{ item.sub }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
export interface StackItem {
  icon?: string
  faIcon?: string
  label: string
  sub?: string
}

defineProps<{
  items: StackItem[]
}>()
</script>

<style scoped>
.stack-category {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 22px 20px;
  transition: all var(--transition);
}

.stack-category:hover {
  border-color: rgba(6, 182, 212, 0.2);
  background: var(--bg-hover);
  transform: translateY(-2px);
}

.stack-category-header {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  font-weight: 500;
  color: var(--green);
  margin-bottom: 14px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  gap: 6px;
}

.stack-category-header::before {
  content: '~/skills/';
  color: var(--text-muted);
}

.stack-category-header::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--border);
  margin-left: 8px;
}

.stack-items {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.stack-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.88rem;
  color: var(--text-secondary);
  padding: 5px 0;
}

.stack-icon {
  width: 18px;
  color: var(--cyan);
  font-size: 1rem;
  flex-shrink: 0;
}

.stack-icon-fa {
  width: 18px;
  color: var(--cyan);
  font-size: 1rem;
  flex-shrink: 0;
  text-align: center;
}

.sub {
  font-size: 0.75rem;
  color: var(--text-muted);
  font-family: var(--font-mono);
}
</style>
