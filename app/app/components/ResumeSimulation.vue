<template>
  <div class="resume-sim">
    <div class="resume-cmd-line">
      <span class="prompt">$</span>
      <span class="cmd-name">cat</span> zaid_resume.pdf
    </div>

    <div class="resume-progress">
      <span id="resumeProgressLabel">{{ progressLabel }}</span>
      <span class="progress-bar-track">
        <span
          class="progress-bar-fill"
          :style="{ width: progressPct + '%' }"
        />
      </span>
      <span id="resumeProgressPct">{{ progressPct }}%</span>
    </div>

    <div class="resume-meta">
      <div>File: zaid_resume.pdf</div>
      <div>Size: {{ done ? '245 KB' : '—' }} | Pages: {{ done ? '2' : '—' }}</div>
      <div>Format: PDF</div>
    </div>

    <div
      v-if="done"
      class="resume-actions"
    >
      <UButton
        color="primary"
        variant="solid"
        @click="doDownload"
      >
        <UIcon name="i-heroicons-arrow-down-tray" />
        Download zaid_resume.pdf
      </UButton>
      <UButton
        color="neutral"
        variant="outline"
        @click="doPreview"
      >
        <UIcon name="i-heroicons-eye" />
        Preview
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
const progressPct = ref(0)
const progressLabel = ref('Reading file...')
const done = ref(false)
let interval: ReturnType<typeof setInterval> | null = null

function start() {
  progressPct.value = 0
  progressLabel.value = 'Reading file...'
  done.value = false

  interval = setInterval(() => {
    const increment = Math.floor(Math.random() * 8) + 2
    const next = Math.min(progressPct.value + increment, 100)
    progressPct.value = next

    if (next < 40) {
      progressLabel.value = 'Reading file...'
    } else if (next < 75) {
      progressLabel.value = 'Parsing document...'
    } else if (next < 100) {
      progressLabel.value = 'Verifying integrity...'
    } else {
      if (interval) clearInterval(interval)
      progressLabel.value = 'Transfer complete ✔'
      done.value = true
    }
  }, 120)
}

function doDownload() {
  const link = document.createElement('a')
  link.href = '/zaid_resume.pdf'
  link.download = 'zaid_ajo_resume.pdf'
  link.style.display = 'none'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

function doPreview() {
  window.open('/zaid_resume.pdf', '_blank')
}

function trigger() {
  start()
}

defineExpose({ trigger })

onBeforeUnmount(() => {
  if (interval) clearInterval(interval)
})
</script>

<style scoped>
.resume-sim {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 24px;
  margin-top: 20px;
}

.resume-cmd-line {
  font-family: var(--font-mono);
  font-size: 0.82rem;
  color: var(--text-primary);
  margin-bottom: 12px;
}

.resume-cmd-line .prompt {
  color: var(--green);
}

.resume-cmd-line .cmd-name {
  color: var(--cyan);
}

.resume-progress {
  font-family: var(--font-mono);
  font-size: 0.78rem;
  color: var(--text-muted);
  margin-bottom: 6px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.progress-bar-track {
  flex: 1;
  height: 18px;
  background: var(--bg-terminal);
  border: 1px solid var(--border);
  border-radius: 3px;
  overflow: hidden;
  max-width: 300px;
}

.progress-bar-fill {
  height: 100%;
  width: 0%;
  background: linear-gradient(90deg, var(--cyan), var(--green));
  transition: width 0.1s linear;
  border-radius: 2px;
}

.resume-meta {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--text-muted);
  margin-top: 10px;
  line-height: 1.6;
}

.resume-actions {
  display: flex;
  gap: 10px;
  margin-top: 16px;
}

@media (max-width: 480px) {
  .resume-actions {
    flex-direction: column;
  }
}
</style>
