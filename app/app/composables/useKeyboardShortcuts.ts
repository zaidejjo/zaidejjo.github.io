const SECTION_KEYS = ['home', 'about', 'skills', 'projects', 'contact'] as const

export function useKeyboardShortcuts() {
  const { navigate } = useNavigation()
  const helpOverlay = inject('helpOverlay') as {
    toggle: () => void
    close: () => void
  } | null

  function handler(e: KeyboardEvent) {
    // Ctrl+K / Cmd+K — Focus command bar input
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault()
      const cmdInput = document.getElementById('cmdInput') as HTMLInputElement | null
      cmdInput?.focus()
      return
    }

    // Skip number/char shortcuts when user is typing in an input
    if (document.activeElement?.tagName === 'INPUT') return

    // Number keys 1-5 — Navigate to section
    const num = parseInt(e.key)
    if (num >= 1 && num <= 5) {
      navigate(SECTION_KEYS[num - 1])
      return
    }

    // ? — Toggle help overlay
    if (e.key === '?' && !e.ctrlKey && !e.metaKey && !e.altKey) {
      helpOverlay?.toggle()
      return
    }

    // Escape — Close overlays, blur input
    if (e.key === 'Escape') {
      helpOverlay?.close()
      const cmdInput = document.getElementById('cmdInput') as HTMLInputElement | null
      cmdInput?.blur()
      return
    }
  }

  onMounted(() => {
    window.addEventListener('keydown', handler)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('keydown', handler)
  })
}
