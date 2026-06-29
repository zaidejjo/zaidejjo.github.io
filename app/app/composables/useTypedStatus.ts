const COMMANDS: Record<string, string> = {
  home: '❯ cd ~',
  about: '❯ cat ~/about.md',
  skills: '❯ ls -la /skills/',
  projects: '❯ ./production --showcase',
  contact: '❯ ./connect.sh',
}

export function useTypedStatus() {
  const typedText = ref('')

  let interval: ReturnType<typeof setInterval> | null = null
  let clearTimeoutId: ReturnType<typeof setTimeout> | null = null
  const { currentSection } = useNavigation()

  function typeCommand(cmd: string) {
    // Clear any running animations
    if (interval) clearInterval(interval)
    if (clearTimeoutId) clearTimeout(clearTimeoutId)
    interval = null
    clearTimeoutId = null

    typedText.value = ''
    let i = 0

    interval = setInterval(() => {
      if (i < cmd.length) {
        typedText.value = cmd.slice(0, i + 1)
        i++
      } else {
        if (interval) clearInterval(interval)
        interval = null
        // Clear after 2 seconds
        clearTimeoutId = setTimeout(() => {
          typedText.value = ''
          clearTimeoutId = null
        }, 2000)
      }
    }, 30)
  }

  // Watch for section changes
  watch(currentSection, (section) => {
    const cmd = COMMANDS[section]
    if (cmd) typeCommand(cmd)
  })

  onBeforeUnmount(() => {
    if (interval) clearInterval(interval)
    if (clearTimeoutId) clearTimeout(clearTimeoutId)
  })

  return { typedText }
}
