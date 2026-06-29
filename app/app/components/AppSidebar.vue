<template>
  <nav
    id="sidebar"
    class="sidebar"
    :class="{ open }"
    role="navigation"
    aria-label="Page sections"
  >
    <!-- Profile -->
    <div class="sidebar-profile">
      <NuxtImg
        src="/zaidajo.webp"
        alt="Zaid Ajo"
        class="sidebar-avatar"
        width="56"
        height="56"
        format="webp"
        quality="80"
        loading="lazy"
      />
      <div class="sidebar-name">Zaid Ajo</div>
      <div class="sidebar-title">Django · Vue.js · Perf Eng</div>
    </div>

    <!-- Navigation -->
    <div class="nav-section">
      <button
        v-for="item in navItems"
        :key="item.route"
        class="nav-item"
        :class="{ active: currentSection === item.route }"
        @click="navigate(item.route); emit('close')"
      >
        <UIcon :name="item.icon" class="nav-icon" />
        {{ item.label }}
      </button>
    </div>

    <hr class="sidebar-divider" />

    <!-- Bottom section -->
    <div class="sidebar-bottom">
      <!-- Resume button -->
      <button
        class="resume-btn"
        aria-label="Download resume"
        @click="handleResume"
      >
        <span class="prompt">$</span>
        <span class="cmd">wget</span>
        <span class="arg">zaid_resume.pdf</span>
        <UIcon
          name="i-heroicons-arrow-down-tray"
          class="download-icon"
        />
      </button>

      <!-- Social links -->
      <div class="sidebar-links">
        <a
          href="https://github.com/zaidejjo"
          target="_blank"
          class="sidebar-link"
          aria-label="GitHub profile"
        >
          <UIcon name="i-simple-icons-github" />
        </a>
        <a
          href="https://linkedin.com/in/zaidajo"
          target="_blank"
          class="sidebar-link"
          aria-label="LinkedIn profile"
        >
          <UIcon name="i-simple-icons-linkedin" />
        </a>
        <a
          href="https://x.com/zaid_ejjo"
          target="_blank"
          class="sidebar-link"
          aria-label="X profile"
        >
          <UIcon name="i-simple-icons-x" />
        </a>
        <a
          href="mailto:zaidejjodev@gmail.com"
          class="sidebar-link"
          aria-label="Send email"
        >
          <UIcon name="i-heroicons-envelope" />
        </a>
      </div>

      <!-- Theme Toggle -->
      <AppThemeToggle />
    </div>
  </nav>
</template>

<script setup lang="ts">
const { currentSection, navigate } = useNavigation()
const { triggerResume } = useResumeDownload()

const props = defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

const navItems = [
  { route: 'home', label: '~/home', icon: 'i-heroicons-command-line' },
  { route: 'about', label: '~/about', icon: 'i-heroicons-user-circle' },
  { route: 'skills', label: '~/skills', icon: 'i-heroicons-cog-6-tooth' },
  { route: 'projects', label: '~/projects', icon: 'i-heroicons-rocket-launch' },
  { route: 'contact', label: '~/contact', icon: 'i-heroicons-paper-airplane' },
]

function handleResume() {
  triggerResume()
  emit('close')
}
</script>

<style scoped>
.sidebar {
  position: fixed;
  top: 36px;
  left: 0;
  width: 220px;
  height: calc(100vh - 36px);
  background: rgba(8, 12, 22, 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  padding: 24px 16px;
  z-index: 90;
  transition: transform var(--transition), background var(--transition);
  overflow-y: auto;
}

.sidebar-profile {
  text-align: center;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--border);
  margin-bottom: 16px;
}

.sidebar-avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--cyan);
  margin-bottom: 8px;
  transition: border-color var(--transition);
}

.sidebar-name {
  font-family: var(--font-mono);
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--text-primary);
}

.sidebar-title {
  font-family: var(--font-mono);
  font-size: 0.62rem;
  color: var(--text-muted);
  margin-top: 2px;
}

.nav-section {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: var(--radius-sm);
  cursor: pointer;
  border: none;
  background: transparent;
  color: var(--text-secondary);
  font-family: var(--font-mono);
  font-size: 0.78rem;
  text-align: left;
  transition: all var(--transition);
  position: relative;
}

.nav-item:hover {
  background: var(--bg-hover);
  color: var(--text-primary);
}

.nav-item.active {
  color: var(--cyan);
  background: rgba(6, 182, 212, 0.06);
}

.nav-item.active::before {
  content: '❯';
  color: var(--cyan);
  font-size: 0.72rem;
  flex-shrink: 0;
  width: 16px;
}

.nav-item:not(.active)::before {
  content: '';
  width: 16px;
  flex-shrink: 0;
}

.nav-icon {
  width: 18px;
  flex-shrink: 0;
  font-size: 0.85rem;
  color: var(--text-muted);
}

.nav-item.active .nav-icon { color: var(--cyan); }
.nav-item:hover .nav-icon { color: var(--cyan); }

.sidebar-divider {
  border: none;
  height: 1px;
  background: var(--border);
  margin: 12px 0;
}

.sidebar-bottom {
  margin-top: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.resume-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border-radius: var(--radius-sm);
  background: rgba(6, 182, 212, 0.06);
  border: 1px solid rgba(6, 182, 212, 0.15);
  color: var(--cyan);
  font-family: var(--font-mono);
  font-size: 0.75rem;
  cursor: pointer;
  text-decoration: none;
  transition: all var(--transition);
  width: 100%;
}

.resume-btn:hover {
  background: rgba(6, 182, 212, 0.12);
  border-color: var(--cyan);
  box-shadow: 0 0 16px rgba(6, 182, 212, 0.1);
}

.resume-btn .prompt { color: var(--green); }
.resume-btn .cmd { color: var(--text-primary); }
.resume-btn .arg { color: var(--text-muted); }
.download-icon { margin-left: auto; font-size: 0.7rem; }

.sidebar-links {
  display: flex;
  gap: 12px;
  padding: 4px 0;
}

.sidebar-link {
  color: var(--text-muted);
  font-size: 0.95rem;
  transition: color var(--transition);
}

.sidebar-link:hover { color: var(--cyan); }

@media (max-width: 768px) {
  .sidebar {
    transform: translateX(-100%);
    width: 260px;
  }
  .sidebar.open { transform: translateX(0); }
  .sidebar-links { justify-content: center; }
}
</style>
