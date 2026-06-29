<template>
  <div class="app-shell">
    <!-- Background Canvas (Three.js) -->
    <ClientOnly>
      <AppThreeBackground />
    </ClientOnly>

    <!-- Scanline CRT overlay -->
    <AppScanlines />

    <!-- Status Bar -->
    <AppStatusBar />

    <!-- Sidebar Overlay (mobile) -->
    <div
      class="sidebar-overlay"
      :class="{ active: isSidebarOpen }"
      @click="isSidebarOpen = false"
    />

    <!-- App Layout -->
    <div class="app-layout">
      <!-- Sidebar -->
      <AppSidebar
        :open="isSidebarOpen"
        @close="isSidebarOpen = false"
      />

      <!-- Main Content Area -->
      <main class="main-content">
        <div class="content-inner">
          <slot />
        </div>
      </main>
    </div>

    <!-- Command Bar -->
    <AppCommandBar />

    <!-- Help Overlay -->
    <AppHelpOverlay />
  </div>
</template>

<script setup lang="ts">
const isSidebarOpen = ref(false)
const resumeRequested = ref(0)

function openSidebar() {
  isSidebarOpen.value = true
}

function closeSidebar() {
  isSidebarOpen.value = false
}

provide('sidebar', {
  isSidebarOpen: readonly(isSidebarOpen),
  openSidebar,
  closeSidebar,
})

// Resume download signal — page watches this and handles navigation + trigger
provide('resumeRequested', resumeRequested)

// Help overlay state — provided here so ALL children (including
// AppCommandBar, useKeyboardShortcuts, and AppHelpOverlay itself)
// can inject it without [Vue warn]: injection "helpOverlay" not found
const helpOverlayOpen = ref(false)

function openHelp() { helpOverlayOpen.value = true }
function closeHelp() { helpOverlayOpen.value = false }
function toggleHelp() { helpOverlayOpen.value = !helpOverlayOpen.value }

provide('helpOverlay', {
  isOpen: readonly(helpOverlayOpen),
  open: openHelp,
  close: closeHelp,
  toggle: toggleHelp,
})

// Initialize keyboard shortcuts (now helpOverlay is available via inject)
useKeyboardShortcuts()
</script>

<style scoped>
.app-shell {
  position: relative;
  min-height: 100vh;
}

.sidebar-overlay {
  display: none;
  position: fixed;
  inset: 0;
  z-index: 89;
  background: rgba(0, 0, 0, 0.5);
}

.sidebar-overlay.active {
  display: block;
}

.app-layout {
  display: flex;
  min-height: 100vh;
  padding-top: 36px;
  position: relative;
  z-index: 2;
}

.main-content {
  flex: 1;
  margin-left: 220px;
  min-height: calc(100vh - 36px);
  display: flex;
  flex-direction: column;
}

.content-inner {
  flex: 1;
  max-width: 960px;
  width: 100%;
  margin: 0 auto;
  padding: 40px 48px 120px;
}

@media (max-width: 1100px) {
  .content-inner {
    padding: 32px 28px 100px;
  }
}

@media (max-width: 768px) {
  .main-content {
    margin-left: 0;
  }

  .content-inner {
    padding: 24px 16px 80px;
  }
}
</style>
