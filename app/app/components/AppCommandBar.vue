<template>
  <div
    class="command-palette"
    :class="{
      expanded: showDropdown || outputContent,
      'has-output': !!outputContent,
    }"
  >
    <!-- Palette Overlay: Output or Dropdown -->
    <div
      ref="paletteOverlayRef"
      class="palette-overlay"
    >
      <!-- Output display (e.g., neofetch, whoami, date) -->
      <div
        v-if="outputContent"
        class="output-area"
      >
        <pre class="output-text">{{ outputContent }}</pre>
      </div>

      <!-- Searchable command dropdown -->
      <div
        v-else-if="showDropdown"
        class="dropdown"
        role="listbox"
        aria-label="Available commands"
      >
        <div
          v-for="(cmd, i) in filteredCommands"
          :key="cmd.id"
          class="dropdown-item"
          :class="{ selected: i === selectedIndex }"
          role="option"
          :aria-selected="i === selectedIndex"
          @mousedown.prevent="executeCommand(cmd)"
          @mouseenter="selectedIndex = i"
        >
          <UIcon
            v-if="cmd.icon"
            :name="cmd.icon"
            class="cmd-icon"
          />
          <span class="cmd-name">{{ cmd.name }}</span>
          <span class="cmd-desc">{{ cmd.description }}</span>
        </div>
        <div
          v-if="filteredCommands.length === 0 && inputValue.length > 0"
          class="dropdown-empty"
        >
          <UIcon name="i-heroicons-x-circle" class="empty-icon" />
          No matching command
        </div>
      </div>
    </div>

    <!-- Input Row -->
    <div class="input-row">
      <span class="prompt">$</span>
      <span class="path">~</span>
      <span class="sep">❯</span>
      <input
        id="cmdInput"
        ref="inputElRef"
        v-model="inputValue"
        type="text"
        class="cmd-input"
        placeholder="Type a command or search..."
        aria-label="Terminal command input"
        autocomplete="off"
        spellcheck="false"
        @keydown="onKeydown"
        @focus="onFocus"
        @blur="onBlur"
      />
      <span class="cmd-hint">{{ hint }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
// ─── Types ────────────────────────────────────────────────────
interface Command {
  id: string
  name: string
  aliases: string[]
  description: string
  icon?: string
  category: 'navigation' | 'display' | 'action' | 'easter-egg'
  execute: (api: CommandApi) => void
}

interface CommandApi {
  raw: string
  args: string[]
  setOutput: (text: string) => void
  clearPalette: () => void
}

// ─── Refs ──────────────────────────────────────────────────────
const inputElRef = ref<HTMLInputElement | null>(null)
const paletteOverlayRef = ref<HTMLElement | null>(null)

const inputValue = ref('')
const hint = ref('')
const selectedIndex = ref(0)
const outputContent = ref<string | null>(null)
const showDropdown = ref(false)

const commandHistory = ref<string[]>([])
const historyIndex = ref(-1)

const { navigate } = useNavigation()
const helpOverlay = inject('helpOverlay') as {
  toggle: () => void
} | null

// ─── Output API ────────────────────────────────────────────────
function setOutput(text: string) {
  outputContent.value = text
  showDropdown.value = false
}

function clearOutput() {
  outputContent.value = null
}

function clearInput() {
  inputValue.value = ''
  if (inputElRef.value) {
    inputElRef.value.blur()
  }
}

function clearPalette() {
  outputContent.value = null
  showDropdown.value = false
  inputValue.value = ''
}

// ─── Command Registry ──────────────────────────────────────────
const commands: Command[] = [
  // Navigation
  {
    id: 'nav-home', name: 'home', aliases: ['h', '1'],
    description: 'Go to Home', icon: 'i-heroicons-home',
    category: 'navigation',
    execute: () => { navigate('home'); clearPalette() },
  },
  {
    id: 'nav-about', name: 'about', aliases: ['a', '2'],
    description: 'Go to About', icon: 'i-heroicons-user',
    category: 'navigation',
    execute: () => { navigate('about'); clearPalette() },
  },
  {
    id: 'nav-skills', name: 'skills', aliases: ['s', '3'],
    description: 'Go to Skills', icon: 'i-heroicons-cog-6-tooth',
    category: 'navigation',
    execute: () => { navigate('skills'); clearPalette() },
  },
  {
    id: 'nav-projects', name: 'projects', aliases: ['p', '4'],
    description: 'Go to Projects', icon: 'i-heroicons-rocket-launch',
    category: 'navigation',
    execute: () => { navigate('projects'); clearPalette() },
  },
  {
    id: 'nav-contact', name: 'contact', aliases: ['c', '5'],
    description: 'Go to Contact', icon: 'i-heroicons-paper-airplane',
    category: 'navigation',
    execute: () => { navigate('contact'); clearPalette() },
  },

  // Display
  {
    id: 'ls', name: 'ls', aliases: [],
    description: 'List available sections', icon: 'i-heroicons-list-bullet',
    category: 'display',
    execute: (api) => {
      setOutput(
        'home/    about/    skills/    projects/    contact/\n\n' +
        'Type a section name or number (1-5) to navigate.'
      )
    },
  },
  {
    id: 'help', name: 'help', aliases: ['?'],
    description: 'Show available commands', icon: 'i-heroicons-question-mark-circle',
    category: 'display',
    execute: () => { helpOverlay?.toggle(); clearInput() },
  },
  {
    id: 'whoami', name: 'whoami', aliases: [],
    description: 'Display current user info', icon: 'i-heroicons-user-circle',
    category: 'display',
    execute: () => {
      setOutput(
        'zaid\n' +
        '─'.repeat(20) + '\n' +
        'Role:      Django Backend & Vue.js Frontend Engineer\n' +
        'Focus:     Performance optimization, system architecture\n' +
        'Location:  Remote / Worldwide\n' +
        'Mission:   Build systems that stay fast under load.'
      )
    },
  },
  {
    id: 'date', name: 'date', aliases: ['datetime', 'now'],
    description: 'Show current date and time', icon: 'i-heroicons-calendar-days',
    category: 'display',
    execute: () => {
      const d = new Date()
      setOutput(d.toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'short',
      }))
    },
  },
  {
    id: 'uptime', name: 'uptime', aliases: [],
    description: 'Show session statistics', icon: 'i-heroicons-clock',
    category: 'display',
    execute: () => {
      const sessionMinutes = Math.floor(
        (Date.now() - performance.now()) / 60000
      )
      const hours = Math.floor(sessionMinutes / 60)
      const mins = sessionMinutes % 60
      setOutput(
        `  up ${hours > 0 ? `${hours} hours, ` : ''}${mins} minutes\n` +
        '─'.repeat(30) + '\n' +
        'Sections visited:  ~5\n' +
        'Commands issued:   —\n' +
        'Focus mode:        ENGAGED\n' +
        'System status:     OPTIMAL'
      )
    },
  },

  // Actions
  {
    id: 'clear', name: 'clear', aliases: ['clr'],
    description: 'Clear command output', icon: 'i-heroicons-x-circle',
    category: 'action',
    execute: () => { clearPalette(); inputElRef.value?.focus() },
  },
  {
    id: 'resume', name: 'resume', aliases: ['cv', 'download'],
    description: 'Download resume (PDF)', icon: 'i-heroicons-arrow-down-tray',
    category: 'action',
    execute: () => {
      useResumeDownload().triggerResume()
      setOutput('Initiating download: zaid_ajo_resume.pdf ...')
    },
  },
  {
    id: 'theme', name: 'theme', aliases: ['theme-dark', 'theme-light', 'theme-system'],
    description: 'Toggle theme (dark/light/system)', icon: 'i-heroicons-sun',
    category: 'action',
    execute: (api) => {
      const themeApi = useTheme()
      const sub = api.args[0]?.toLowerCase()
      if (sub === 'dark') { themeApi.setTheme('dark'); setOutput('Theme → dark') }
      else if (sub === 'light') { themeApi.setTheme('light'); setOutput('Theme → light') }
      else if (sub === 'system') { themeApi.setTheme('system'); setOutput('Theme → system') }
      else { themeApi.toggle(); setOutput(`Theme → ${themeApi.isDark.value ? 'dark' : 'light'}`) }
    },
  },

  // Easter eggs
  {
    id: 'neofetch', name: 'neofetch', aliases: ['system-info', 'specs'],
    description: 'Display system information', icon: 'i-heroicons-computer-desktop',
    category: 'easter-egg',
    execute: () => {
      setOutput(
        '          .ed"""" """$$$be.\n' +
        '        -"           ^""**$$$e.\n' +
        '      ."                   \'$$$c\n' +
        '     /                      "4$$b\n' +
        '    d   .                   $$zd\n' +
        '    $  $          .ze$e     $$\'$\n' +
        '    $:$$  $$e$e$  $$c$$   $$\'$\n' +
        '    $$\'$  $$$$$  $$\'$$$   $$\n' +
        '    $$ $$  $$$$  $$\'$$$   $\n' +
        '    "4$$$c $$J  J$$J$$$c"\n' +
        '      "***" "  " "*"\n' +
        '  ───────────────────────────────\n' +
        '  zaid@archbox\n' +
        '  ───────────────────────────────\n' +
        '  OS:        Arch Linux x86_64\n' +
        '  Host:      Custom Desktop\n' +
        '  Kernel:    6.x.x-arch1-1\n' +
        '  Shell:     zsh 5.9\n' +
        '  Terminal:  kitty 0.38\n' +
        '  DE:        GNOME 47\n' +
        '  CPU:       AMD Ryzen 7 7800X3D (16) @ 5.0GHz\n' +
        '  GPU:       NVIDIA GeForce RTX 4090 (24GB)\n' +
        '  Memory:    63308MiB / 64252MiB\n' +
        '  Disk:      /dev/nvme0n1p2 — 856G / 1TB (ext4)\n' +
        '  Uptime:    6 days, 14 hours, 22 mins\n' +
        '  Packages:  1842 (pacman), 246 (yay)\n' +
        '  Resolution: 2560x1440 @ 165Hz\n' +
        '  ───────────────────────────────\n' +
        '  › Load average: 0.84 0.62 0.48\n' +
        '  › Processes:   347\n' +
        '  › Headroom:    PLENTY'
      )
    },
  },
  {
    id: 'sudo', name: 'sudo', aliases: ['sudo !!'],
    description: 'Execute with elevated privileges', icon: 'i-heroicons-shield-exclamation',
    category: 'easter-egg',
    execute: (api) => {
      const rest = api.args.length > 0 ? api.args.join(' ') : ''
      if (rest) {
        setOutput(
          `[sudo] password for zaid:\n` +
          `Sorry, try again.\n` +
          `[sudo] password for zaid:\n` +
          `sudo: ${api.args[0]}: command not found\n` +
          `(Nice try though. 😄)`
        )
      } else {
        setOutput(
          `[sudo] password for zaid:\n` +
          `Sorry, user zaid is not allowed to execute '${api.args[0] || 'root'}' as root.\n` +
          `This incident has been reported to the sysadmin.\n\n` +
          `(Just kidding. But no sudo here.)`
        )
      }
    },
  },
  {
    id: 'echo', name: 'echo', aliases: ['say'],
    description: 'Display a line of text', icon: 'i-heroicons-megaphone',
    category: 'easter-egg',
    execute: (api) => {
      const text = api.args.join(' ') || '(empty)'
      setOutput(text)
    },
  },
]

// ─── Computed: Filtered commands ──────────────────────────────
const filteredCommands = computed(() => {
  const query = inputValue.value.trim().toLowerCase()
  if (!query) {
    // Show all commands when input is empty (just focused)
    return commands
  }

  return commands.filter((cmd) => {
    if (cmd.name.toLowerCase().startsWith(query)) return true
    if (cmd.aliases.some((a) => a.toLowerCase().startsWith(query))) return true
    if (cmd.description.toLowerCase().includes(query)) return true
    // Handle "theme dark" → match on theme command
    if (cmd.name === 'theme' && query.startsWith('theme ')) return true
    if (cmd.name === 'sudo' && query.startsWith('sudo ')) return true
    if (cmd.name === 'echo' && query.startsWith('echo ')) return true
    return false
  })
})

// ─── Focus / Blur ─────────────────────────────────────────────
function onFocus() {
  showDropdown.value = true
  selectedIndex.value = 0
}

function onBlur() {
  // Use setTimeout so mousedown on dropdown items fires before we hide
  setTimeout(() => {
    if (document.activeElement !== inputElRef.value) {
      showDropdown.value = false
      hint.value = ''
    }
  }, 200)
}

// ─── Key handlers ──────────────────────────────────────────────
function onKeydown(e: KeyboardEvent) {
  switch (e.key) {
    case 'Enter':
      e.preventDefault()
      onSubmit()
      break

    case 'Tab':
      e.preventDefault()
      onTab()
      break

    case 'ArrowUp':
      e.preventDefault()
      if (showDropdown && filteredCommands.value.length > 0) {
        selectedIndex.value = Math.max(0, selectedIndex.value - 1)
      } else {
        browseHistory(-1)
      }
      break

    case 'ArrowDown':
      e.preventDefault()
      if (showDropdown && filteredCommands.value.length > 0) {
        selectedIndex.value = Math.min(
          filteredCommands.value.length - 1,
          selectedIndex.value + 1
        )
      } else {
        browseHistory(1)
      }
      break

    case 'Escape':
      e.preventDefault()
      if (outputContent.value) {
          outputContent.value = null
          showDropdown.value = false
        } else if (showDropdown.value) {
          showDropdown.value = false
      } else {
        inputElRef.value?.blur()
      }
      break
  }
}

// ─── Tab completion ────────────────────────────────────────────
function onTab() {
  const filtered = filteredCommands.value
  if (filtered.length === 1) {
    // Complete to the first matching command name
    inputValue.value = filtered[0].name + ' '
  } else if (filtered.length > 1) {
    // Find common prefix among command names
    const common = longestCommonPrefix(filtered.map((c) => c.name))
    if (common.length > inputValue.value.trim().length) {
      inputValue.value = common
    } else {
      // Cycle to next match
      selectedIndex.value = (selectedIndex.value + 1) % filtered.length
    }
  }
}

function longestCommonPrefix(strings: string[]): string {
  if (!strings.length) return ''
  let prefix = strings[0]
  for (let i = 1; i < strings.length; i++) {
    while (strings[i].indexOf(prefix) !== 0) {
      prefix = prefix.slice(0, -1)
      if (!prefix) return ''
    }
  }
  return prefix
}

// ─── History browsing ──────────────────────────────────────────
function browseHistory(direction: -1 | 1) {
  if (commandHistory.value.length === 0) return

  const newIndex = historyIndex.value + direction
  if (newIndex < 0) {
    historyIndex.value = -1
    inputValue.value = ''
  } else if (newIndex >= commandHistory.value.length) {
    historyIndex.value = commandHistory.value.length - 1
    inputValue.value = commandHistory.value[historyIndex.value]
  } else {
    historyIndex.value = newIndex
    inputValue.value = commandHistory.value[historyIndex.value]
  }

  // Move cursor to end
  nextTick(() => {
    const el = inputElRef.value
    if (el) {
      el.selectionStart = el.selectionEnd = el.value.length
    }
  })
}

// ─── Submit / Execute ──────────────────────────────────────────
function onSubmit() {
  const raw = inputValue.value.trim()
  if (!raw) {
    // Enter with empty input — close the palette
    clearPalette()
    inputElRef.value?.blur()
    return
  }

  // Push to history
  commandHistory.value.unshift(raw)
  if (commandHistory.value.length > 50) {
    commandHistory.value.pop()
  }
  historyIndex.value = -1

  // Parse command and args
  const parts = raw.split(/\s+/)
  const cmdName = parts[0].toLowerCase()
  const args = parts.slice(1)

  // Check numeric shortcuts
  if (/^[1-5]$/.test(cmdName)) {
    const sections = ['home', 'about', 'skills', 'projects', 'contact']
    navigate(sections[parseInt(cmdName) - 1])
    clearInput()
    return
  }

  // Find matching command
  const matched = findCommand(cmdName)
  if (matched) {
    const api: CommandApi = { raw, args, setOutput, clearPalette }
    matched.execute(api)
    clearInput()
    return
  }

  // Unknown command
  setOutput(`zsh: command not found: ${cmdName}`)
  clearInput()
}

function findCommand(name: string): Command | undefined {
  return commands.find(
    (cmd) =>
      cmd.name === name ||
      cmd.aliases.includes(name)
  )
}

function executeCommand(cmd: Command) {
  const raw = inputValue.value.trim()
  const parts = raw.split(/\s+/)
  const args = parts.slice(1)

  // Push to history
  if (raw) {
    commandHistory.value.unshift(raw)
    historyIndex.value = -1
  }

  const api: CommandApi = { raw, args, setOutput, clearPalette }
  cmd.execute(api)
  clearInput()
}

// ─── Watch input changes ──────────────────────────────────────
watch(inputValue, () => {
  // If user starts typing while output is shown, dismiss output
  if (outputContent.value && inputValue.value.length > 0) {
    outputContent.value = null
  }
  selectedIndex.value = 0
  showDropdown.value = inputValue.value.length > 0 || document.activeElement === inputElRef.value

  // Update hint contextually
  if (showDropdown.value && filteredCommands.value.length > 0) {
    const matchCount = filteredCommands.value.length
    hint.value = `${matchCount} result${matchCount !== 1 ? 's' : ''} · Tab to complete`
  } else {
    hint.value = ''
  }
})
</script>

<style scoped>
.command-palette {
  position: fixed;
  bottom: 0;
  left: 220px;
  right: 0;
  z-index: 100;
  font-family: var(--font-mono);
  transition: box-shadow var(--transition);
}

.command-palette.expanded {
  box-shadow: 0 -8px 32px rgba(6, 182, 212, 0.08), 0 -2px 8px rgba(0, 0, 0, 0.3);
}

/* ── Palette Overlay ────────────────────────────────────────── */
.palette-overlay {
  position: absolute;
  bottom: 100%;
  left: 0;
  right: 0;
  max-height: 320px;
  overflow-y: auto;
  background: rgba(6, 10, 20, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid var(--border);
  border-bottom: none;
  border-radius: var(--radius-md) var(--radius-md) 0 0;
}

.palette-overlay::-webkit-scrollbar {
  width: 4px;
}

.palette-overlay::-webkit-scrollbar-thumb {
  background: var(--border);
  border-radius: 2px;
}

/* ── Output Area ─────────────────────────────────────────────── */
.output-area {
  padding: 16px;
  max-height: 240px;
  overflow-y: auto;
}

.output-text {
  color: var(--text-primary);
  font-family: var(--font-mono);
  font-size: 0.72rem;
  line-height: 1.5;
  white-space: pre;
  word-wrap: normal;
  margin: 0;
  letter-spacing: 0.2px;
}

/* ── Dropdown ────────────────────────────────────────────────── */
.dropdown {
  display: flex;
  flex-direction: column;
  padding: 6px;
  gap: 1px;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  border-radius: var(--radius-sm);
  cursor: pointer;
  color: var(--text-secondary);
  transition: background 0.1s ease, color 0.1s ease;
}

.dropdown-item.selected,
.dropdown-item:hover {
  background: rgba(6, 182, 212, 0.10);
  color: var(--text-primary);
}

.cmd-icon {
  flex-shrink: 0;
  width: 16px;
  height: 16px;
  color: var(--text-muted);
  font-size: 0.85rem;
}

.dropdown-item.selected .cmd-icon,
.dropdown-item:hover .cmd-icon {
  color: var(--cyan);
}

.cmd-name {
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--text-primary);
  min-width: 80px;
  flex-shrink: 0;
}

.cmd-desc {
  font-size: 0.7rem;
  color: var(--text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dropdown-empty {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px;
  color: var(--text-muted);
  font-size: 0.78rem;
  justify-content: center;
}

.empty-icon {
  color: var(--text-muted);
  font-size: 1rem;
}

/* ── Input Row ───────────────────────────────────────────────── */
.input-row {
  display: flex;
  align-items: center;
  height: 44px;
  padding: 0 16px;
  gap: 8px;
  background: rgba(6, 10, 20, 0.92);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-top: 1px solid var(--border);
  transition: background var(--transition);
}

.prompt {
  color: var(--green);
  font-weight: 600;
}

.path {
  color: var(--violet);
}

.sep {
  color: var(--text-muted);
}

.cmd-input {
  flex: 1;
  background: transparent;
  border: none;
  color: var(--text-primary);
  font-family: var(--font-mono);
  font-size: 0.78rem;
  outline: none;
  caret-color: var(--cyan);
}

.cmd-input::placeholder {
  color: var(--text-muted);
  font-style: italic;
}

.cmd-hint {
  color: var(--text-muted);
  font-size: 0.68rem;
  white-space: nowrap;
}

/* ── Mobile ──────────────────────────────────────────────────── */
@media (max-width: 768px) {
  .command-palette {
    left: 0;
    display: none;
  }
}
</style>
