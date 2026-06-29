<template>
  <header class="status-bar" role="status" aria-live="polite">
    <button
      class="mobile-menu-btn"
      aria-label="Toggle navigation"
      @click="toggleSidebar"
    >
      <UIcon name="i-heroicons-bars-3" />
    </button>

    <span class="user">zaid</span>
    <span class="at">@</span>
    <span class="host">archbox</span>
    <span class="sep">:</span>
    <span class="path">~/portfolio</span>
    <span class="sep">$</span>
    <span
      ref="typedElRef"
      class="typed-cmd"
    >
      {{ typedText }}<span
        v-if="typedText && typedText.length > 0 && typedText.length < 20"
        class="typing-cursor"
      />
    </span>

    <span class="right">
      <span class="section-indicator">[{{ sectionIndicator }}]</span>
      <span class="clock">{{ clock }}</span>
    </span>
  </header>
</template>

<script setup lang="ts">
const { clock } = useClock()
const { sectionIndicator } = useNavigation()
const { typedText } = useTypedStatus()

const sidebar = inject('sidebar') as {
  isSidebarOpen: Ref<boolean>
  openSidebar: () => void
  closeSidebar: () => void
} | null

function toggleSidebar() {
  if (!sidebar) return
  if (sidebar.isSidebarOpen.value) {
    sidebar.closeSidebar()
  } else {
    sidebar.openSidebar()
  }
}
</script>

<style scoped>
.status-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 36px;
  background: rgba(6, 10, 20, 0.92);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  padding: 0 14px;
  z-index: 100;
  font-family: var(--font-mono);
  font-size: 0.7rem;
  color: var(--text-muted);
  user-select: none;
  gap: 4px;
  transition: background var(--transition);
}

.user { color: var(--green); font-weight: 600; }
.at { color: var(--text-muted); }
.host { color: var(--cyan); font-weight: 500; }
.sep { margin: 0 6px; color: var(--border); }
.path { color: var(--violet); }
.typed-cmd { color: var(--text-primary); display: inline-flex; align-items: center; gap: 2px; min-width: 0; }

.typing-cursor {
  display: inline-block;
  width: 6px;
  height: 14px;
  background: var(--cyan);
  animation: blink 0.8s step-end infinite;
  margin-left: 2px;
}

.right {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 14px;
  color: var(--text-muted);
}

.section-indicator { color: var(--text-muted); letter-spacing: 0.5px; }
.clock { color: var(--text-muted); }

.mobile-menu-btn {
  display: none;
  background: none;
  border: none;
  color: var(--text-muted);
  font-size: 1rem;
  cursor: pointer;
  padding: 4px 8px;
  transition: color var(--transition);
}

.mobile-menu-btn:hover { color: var(--cyan); }

@media (max-width: 768px) {
  .host, .path { display: none; }
  .section-indicator { display: none; }
  .clock { font-size: 0.65rem; }
  .mobile-menu-btn { display: block; }
}

@media (max-width: 480px) {
  .status-bar { height: 32px; font-size: 0.65rem; }
}
</style>
