<template>
  <div>
    <SectionCmd cmd="ls" args="-la /skills/" :showCursor="true" />
    <SectionLabel label="Core Stack" />
    <SectionTitle>$ <span class="glow-text">ls</span> -la /skills/</SectionTitle>

    <div class="stack-grid">
      <StackCategory :items="backendItems" />
      <StackCategory :items="perfItems" />
      <StackCategory :items="dataItems" />
      <StackCategory :items="opsItems" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { StackItem } from './StackCategory.vue'

const backendItems: StackItem[] = [
  { icon: 'i-simple-icons-python', label: 'Django / DRF / Ninja', sub: 'REST API' },
  { icon: 'i-simple-icons-vuedotjs', label: 'Vue.js 3 / Nuxt', sub: 'Composition API, Pinia' },
  { faIcon: 'fa-solid fa-bolt', label: 'Async Processing', sub: 'Celery / Redis / Channels' },
  { faIcon: 'fa-solid fa-code', label: 'RESTful API Design', sub: 'OpenAPI, versioning' },
]

const perfItems: StackItem[] = [
  { faIcon: 'fa-solid fa-gauge-high', label: 'PostgreSQL Optimisation', sub: 'Indexing, Partitioning' },
  { faIcon: 'fa-solid fa-chart-line', label: 'High-Concurrency', sub: '10k+ req/s, Locust-tested' },
  { faIcon: 'fa-solid fa-microchip', label: 'Query Tuning', sub: '30-50% latency reduction' },
  { faIcon: 'fa-solid fa-database', label: 'Redis Caching', sub: 'Queues, sessions, rate limiting' },
]

const dataItems: StackItem[] = [
  { faIcon: 'fa-solid fa-database', label: 'PostgreSQL', sub: 'Expert: Optimisation / Indexing' },
  { faIcon: 'fa-solid fa-bolt', label: 'Redis', sub: 'Caching / Queues / Session Mgmt' },
  { faIcon: 'fa-solid fa-database', label: 'MySQL', sub: 'Legacy migration expertise' },
  { faIcon: 'fa-solid fa-cloud', label: 'S3 / Object Storage' },
]

const opsItems: StackItem[] = [
  { icon: 'i-simple-icons-linux', label: 'Arch Linux', sub: 'Daily driver since 2016' },
  { icon: 'i-simple-icons-docker', label: 'Docker & Swarm', sub: 'Container orchestration' },
  { faIcon: 'fa-solid fa-cloud', label: 'AWS + Oracle Cloud', sub: 'EC2 / RDS / S3' },
  { faIcon: 'fa-solid fa-brain', label: 'AI Agents', sub: 'LangChain / OpenAI' },
]
</script>

<style scoped>
.stack-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

@media (max-width: 768px) {
  .stack-grid {
    grid-template-columns: 1fr;
  }
}
</style>
