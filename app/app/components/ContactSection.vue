<template>
  <div>
    <SectionCmd cmd="./connect.sh" args="--all-channels" :showCursor="true" />
    <SectionLabel label="Connect" />
    <SectionTitle>./<span class="glow-text">connect</span> --reach-out</SectionTitle>

    <div class="contact-grid">
      <!-- Contacts list -->
      <div class="contact-card">
        <div class="contact-card-header">
          <span class="arrow">❯</span> cat contacts.cfg
        </div>
        <div class="contact-links">
          <a
            href="mailto:zaidejjodev@gmail.com"
            class="contact-link"
          >
            <UIcon name="i-heroicons-envelope" class="contact-icon" />
            zaidejjodev@gmail.com
          </a>
          <a
            href="https://github.com/zaidejjo"
            target="_blank"
            class="contact-link"
          >
            <UIcon name="i-simple-icons-github" class="contact-icon" />
            github.com/zaidejjo
          </a>
          <a
            href="https://linkedin.com/in/zaidajo"
            target="_blank"
            class="contact-link"
          >
            <UIcon name="i-simple-icons-linkedin" class="contact-icon" />
            linkedin.com/in/zaidajo
          </a>
          <a
            href="https://x.com/zaid_ejjo"
            target="_blank"
            class="contact-link"
          >
            <UIcon name="i-simple-icons-x" class="contact-icon" />
            @zaid_ejjo
          </a>
        </div>
      </div>

      <!-- Availability -->
      <div class="contact-card">
        <div class="contact-card-header">
          <span class="arrow">❯</span> cat availability.txt
        </div>
        <p class="availability-text">
          Available for <strong>Full-Time Remote</strong> engagements,
          <strong>Consulting</strong> contracts, and
          <strong>Open Source</strong> collaboration.
        </p>
        <p class="response-text">
          Response time: typically &lt; 24h
        </p>
      </div>
    </div>

    <!-- Resume Simulation -->
    <ResumeSimulation ref="resumeSimRef" />
  </div>
</template>

<script setup lang="ts">
const resumeSimRef = ref<InstanceType<typeof ResumeSimulation> | null>(null)

function triggerResume() {
  resumeSimRef.value?.trigger()
}

defineExpose({ triggerResume })
</script>

<style scoped>
.contact-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.contact-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 24px;
  transition: border-color var(--transition);
}

.contact-card:hover {
  border-color: rgba(6, 182, 212, 0.2);
}

.contact-card-header {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  color: var(--green);
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.contact-card-header .arrow {
  color: var(--text-muted);
}

.contact-links {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.contact-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  border-radius: var(--radius-sm);
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 0.9rem;
  transition: all var(--transition);
}

.contact-link:hover {
  background: var(--bg-hover);
  color: var(--cyan);
}

.contact-icon {
  width: 20px;
  color: var(--cyan);
  font-size: 1.05rem;
  flex-shrink: 0;
}

.availability-text {
  color: var(--text-secondary);
  font-size: 0.9rem;
  line-height: 1.7;
}

.availability-text strong {
  color: var(--text-primary);
}

.response-text {
  color: var(--text-muted);
  font-size: 0.85rem;
  margin-top: 16px;
  font-family: var(--font-mono);
}

@media (max-width: 768px) {
  .contact-grid {
    grid-template-columns: 1fr;
  }
}
</style>
