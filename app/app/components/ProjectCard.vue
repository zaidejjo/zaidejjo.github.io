<template>
  <div class="project-card">
    <!-- Visual side -->
    <div
      v-if="project.visualType === 'image'"
      class="project-visual"
    >
      <NuxtImg
        :src="project.visualSrc ?? ''"
        alt=""
        width="600"
        height="400"
        format="webp"
        quality="80"
        loading="lazy"
      />
    <div
      v-if="project.badge"
      class="project-badge"
      :class="{ oss: project.badgeType === 'oss' }"
    >
      <span class="badge-dot" aria-hidden="true" />
      {{ project.badge }}
    </div>
  </div>

  <!-- Terminal visual -->
  <div
    v-else-if="project.visualType === 'terminal'"
    class="project-visual terminal-visual-bg"
  >
    <div class="terminal-visual">
      <div
        v-for="(line, i) in project.terminalLines"
        :key="i"
        class="line"
        :class="{ output: line.type === 'output', comment: line.type === 'comment' }"
      >
        <span v-if="line.type === 'cmd'" class="prompt">$</span>
        <span
          :class="{
            'cmd-text': line.type === 'cmd',
            highlight: line.style === 'highlight',
            success: line.style === 'success',
            output: line.type === 'output',
            comment: line.type === 'comment',
          }"
          v-html="line.text"
        />
      </div>
    </div>
    <div
      v-if="project.badge"
      class="project-badge"
      :class="{ oss: project.badgeType === 'oss' }"
    >
      <span class="badge-dot" aria-hidden="true" />
      {{ project.badge }}
    </div>
  </div>

    <!-- Info side -->
    <div class="project-info">
      <h3 class="project-name">
        {{ project.name }}
        <span
          v-if="project.subtitle"
          class="project-subtitle-badge"
        >{{ project.subtitle }}</span>
      </h3>
      <p class="project-sub">{{ project.description }}</p>

      <div class="project-tags">
        <UBadge
          v-for="tag in project.tags"
          :key="tag"
          variant="subtle"
          color="neutral"
          class="project-tag"
        >
          {{ tag }}
        </UBadge>
      </div>

      <ProjectMetrics :metrics="project.metrics" />
      <p class="project-desc">{{ project.longDesc }}</p>

      <div class="project-actions">
        <UButton
          v-for="(action, idx) in project.actions"
          :key="idx"
          :color="action.primary ? 'primary' : 'neutral'"
          :variant="action.primary ? 'solid' : 'outline'"
          size="sm"
          :to="action.to"
          :target="action.external ? '_blank' : undefined"
          @click="action.onClick ?? undefined"
        >
          <UIcon v-if="action.icon" :name="action.icon" />
          {{ action.label }}
        </UButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Metric } from './ProjectMetrics.vue'

export interface TerminalLine {
  type: 'cmd' | 'output' | 'comment'
  text: string
  style?: 'highlight' | 'success'
}

export interface ProjectAction {
  label: string
  to?: string
  icon?: string
  primary?: boolean
  external?: boolean
  onClick?: () => void
}

export interface ProjectData {
  name: string
  subtitle?: string
  description: string
  longDesc: string
  tags: string[]
  metrics: Metric[]
  visualType: 'image' | 'terminal'
  visualSrc?: string
  badge?: string
  badgeType?: 'live' | 'oss'
  terminalLines?: TerminalLine[]
  actions: ProjectAction[]
}

defineProps<{
  project: ProjectData
}>()
</script>

<style scoped>
.project-card {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 0;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  transition: all var(--transition);
  margin-bottom: 24px;
}

.project-card:last-child {
  margin-bottom: 0;
}

.project-card:hover {
  border-color: rgba(6, 182, 212, 0.3);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(6, 182, 212, 0.1);
}

/* Visual side */
.project-visual {
  position: relative;
  min-height: 240px;
  background: var(--bg-secondary);
  overflow: hidden;
}

.project-visual img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.6;
  transition: opacity 0.5s, transform 0.5s;
}

.project-card:hover .project-visual img {
  opacity: 0.85;
  transform: scale(1.03);
}

.project-visual.terminal-visual-bg {
  background: #060a14;
}

/* Badge */
.project-badge {
  position: absolute;
  top: 16px;
  left: 16px;
  background: rgba(245, 158, 11, 0.10);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(245, 158, 11, 0.25);
  color: var(--amber);
  padding: 4px 14px;
  border-radius: 6px;
  font-family: var(--font-mono);
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 0.8px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.badge-dot {
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--amber);
  flex-shrink: 0;
  animation: pulse-dot 2s ease-in-out infinite;
}

.project-badge.oss .badge-dot {
  background: var(--violet);
}

.project-badge.oss {
  background: rgba(139, 92, 246, 0.10);
  border-color: rgba(139, 92, 246, 0.25);
  color: var(--violet);
}

.project-badge.oss i {
  color: var(--violet);
}

/* Terminal visual */
.terminal-visual {
  width: 100%;
  height: 100%;
  min-height: 240px;
  display: flex;
  flex-direction: column;
  padding: 16px;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  line-height: 1.6;
}

.line {
  display: flex;
  gap: 8px;
}

.line.output {
  padding-left: 16px;
}

.line.comment {
  font-style: italic;
}

.prompt {
  color: var(--green);
}

.cmd-text {
  color: var(--text-primary);
}

.highlight {
  color: var(--cyan);
}

.success {
  color: var(--green);
}

.output {
  color: var(--text-muted);
}

.comment {
  color: var(--text-muted);
  font-style: italic;
}

/* Info side */
.project-info {
  padding: 22px;
  display: flex;
  flex-direction: column;
}

.project-name {
  font-family: var(--font-mono);
  font-size: clamp(1.1rem, 2.2vw, 1.5rem);
  font-weight: 700;
  letter-spacing: -0.3px;
  margin-bottom: 3px;
}

.project-subtitle-badge {
  font-size: 0.8rem;
  color: var(--text-muted);
  font-weight: 400;
}

.project-sub {
  font-family: var(--font-sans);
  font-size: 0.82rem;
  color: var(--text-secondary);
  margin-bottom: 12px;
  line-height: 1.4;
}

.project-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-bottom: 12px;
}

.project-tag {
  font-family: var(--font-mono);
  font-size: 0.65rem;
  font-weight: 500;
  padding: 2px 8px;
  border: 1px solid var(--border);
  border-radius: 4px;
  background: rgba(6, 182, 212, 0.03);
  color: var(--text-muted);
}

.project-desc {
  color: var(--text-secondary);
  font-size: 0.82rem;
  line-height: 1.6;
  margin-bottom: 12px;
  flex: 1;
}

.project-actions {
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
  padding-top: 10px;
  border-top: 1px solid var(--border);
}

@media (max-width: 1024px) {
  .project-card {
    grid-template-columns: 1fr;
  }
  .project-visual {
    min-height: 180px;
  }
  .terminal-visual {
    min-height: 180px;
  }
}

@media (max-width: 768px) {
  .project-info {
    padding: 16px;
  }
}

@media (max-width: 480px) {
  .project-actions {
    flex-direction: column;
  }
}
</style>
