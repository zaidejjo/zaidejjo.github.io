<template>
  <div>
    <SectionCmd cmd="./production" args="--showcase" :showCursor="true" />
    <SectionLabel label="Featured" />
    <SectionTitle>./<span class="glow-text">production</span> --showcase</SectionTitle>

    <ProjectCard :project="madarCore" />
    <ProjectCard :project="ajoCli" />
  </div>
</template>

<script setup lang="ts">
import type { ProjectData } from './ProjectCard.vue'

const madarCore: ProjectData = {
  name: 'Madar Core',
  subtitle: 'MC',
  description: 'Enterprise School ERP — Next-Gen B2B Educational Ecosystem',
  longDesc:
    'Decoupled infrastructure serving 15k+ daily users. Load-tested with Locust to sustain 200+ RPS. AI-powered diagnostics, automated curriculum generation, and real-time analytics — all behind a clean, RESTful API layer.',
  tags: ['Django', 'DRF', 'React', 'PostgreSQL', 'Docker Swarm', 'Redis'],
  metrics: [
    { value: '115K+', label: 'Lines of Code' },
    { value: '5M+', label: 'Requests / Month' },
    { value: '<45ms', label: 'p99 Latency' },
    { value: '200+', label: 'RPS Sustained', accent: 'amber' },
  ],
  visualType: 'image',
  visualSrc: '/madarcore.webp',
  badge: 'LIVE PRODUCTION',
  badgeType: 'live',
  actions: [
    {
      label: 'Live App',
      to: 'https://madarcore.onrender.com',
      icon: 'i-heroicons-arrow-top-right-on-square',
      primary: true,
      external: true,
    },
    {
      label: 'Ask for Source',
      icon: 'i-heroicons-envelope',
      primary: false,
      onClick: () => {
        window.location.href = 'mailto:zaidejjodev@gmail.com'
      },
    },
  ],
}

const ajoCli: ProjectData = {
  name: 'ajo-cli',
  description: 'Developer productivity CLI — scaffolding, deployment, automation',
  longDesc:
    'A command-line toolkit for Django developers. Project scaffolding, one-command deployments, database management, and automation scripts. Designed for developers who live in the terminal. Built with Python + Click.',
  tags: ['Python', 'Click', 'CLI', 'PyPI', 'Open Source'],
  metrics: [
    { value: '—', label: 'GitHub Stars' },
    { value: '—', label: 'PyPI Downloads' },
    { value: 'v1.0.0', label: 'Latest Release' },
  ],
  visualType: 'terminal',
  badge: 'OPEN SOURCE',
  badgeType: 'oss',
  terminalLines: [
    { type: 'cmd', text: 'ajo-cli --help' },
    { type: 'output', text: '<span class="highlight">ajo</span> — Developer productivity toolkit' },
    { type: 'output', text: '' },
    { type: 'output', text: '<span class="success">Usage:</span> ajo [OPTIONS] COMMAND' },
    { type: 'output', text: '' },
    { type: 'output', text: 'Commands:' },
    { type: 'output', text: '  <span class="highlight">init</span>    Project scaffolding' },
    { type: 'output', text: '  <span class="highlight">deploy</span>  One-command deployment' },
    { type: 'output', text: '  <span class="highlight">db</span>      Database management' },
    { type: 'output', text: '  <span class="highlight">doctor</span>  System diagnostics' },
    { type: 'output', text: '' },
    { type: 'comment', text: '# Built with Python + Click' },
    { type: 'cmd', text: '<span style="opacity:0.5;">_</span>' },
  ],
  actions: [
    {
      label: 'GitHub',
      to: 'https://github.com/zaidejjo/ajo-cli',
      icon: 'i-simple-icons-github',
      primary: true,
      external: true,
    },
    {
      label: 'Documentation',
      icon: 'i-heroicons-book-open',
      primary: false,
      to: '#',
    },
    {
      label: 'PyPI',
      icon: 'i-simple-icons-python',
      primary: false,
      to: '#',
    },
  ],
}
</script>
