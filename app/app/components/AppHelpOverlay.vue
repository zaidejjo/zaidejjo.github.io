<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      id="helpOverlay"
      class="help-overlay"
      @click.self="close"
    >
      <div class="help-modal" role="dialog" aria-label="Available commands">
        <h3 class="help-title">
          <UIcon name="i-heroicons-command-line" />
          Available Commands
        </h3>

        <div class="help-commands">
          <div
            v-for="cmd in commands"
            :key="cmd.key"
            class="help-command"
          >
            <span class="key">{{ cmd.key }}</span>
            <span class="desc">{{ cmd.desc }}</span>
          </div>
        </div>

        <div class="help-close">
          Press <strong>Esc</strong> or type <strong>clear</strong> to close
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
const { currentSection } = useNavigation()

// Inject help overlay state from layouts/default.vue provider
const helpOverlay = inject('helpOverlay') as {
  isOpen: Ref<boolean>
  open: () => void
  close: () => void
  toggle: () => void
}

const { isOpen, close } = helpOverlay

const commands = [
  { key: 'home', desc: 'Go to Home' },
  { key: 'about', desc: 'Go to About' },
  { key: 'skills', desc: 'Go to Skills' },
  { key: 'projects', desc: 'Go to Projects' },
  { key: 'contact', desc: 'Go to Contact' },
  { key: 'resume', desc: 'Download Resume' },
  { key: 'clear', desc: 'Clear command' },
  { key: 'help', desc: 'Show this help' },
  { key: '1-5', desc: 'Navigate to section' },
  { key: 'Ctrl+K', desc: 'Focus command bar' },
]

// Allow command inputs to close help
watch(currentSection, () => {
  close()
})
</script>

<style scoped>
.help-overlay {
  position: fixed;
  inset: 0;
  z-index: 200;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: flex;
  justify-content: center;
  align-items: center;
}

.help-modal {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 32px;
  max-width: 480px;
  width: 90%;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.6);
}

.help-title {
  font-family: var(--font-mono);
  font-size: 1rem;
  color: var(--cyan);
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.help-commands {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.help-command {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  border-radius: var(--radius-sm);
  font-family: var(--font-mono);
  font-size: 0.82rem;
  transition: background var(--transition);
}

.help-command:hover {
  background: var(--bg-hover);
}

.key {
  color: var(--cyan);
  font-weight: 600;
  min-width: 70px;
}

.desc {
  color: var(--text-muted);
}

.help-close {
  margin-top: 20px;
  text-align: right;
  font-family: var(--font-mono);
  font-size: 0.78rem;
  color: var(--text-muted);
}
</style>
