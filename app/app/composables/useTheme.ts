export function useTheme() {
  const colorMode = useColorMode()

  const isDark = computed(() => colorMode.value === 'dark')
  const isLight = computed(() => colorMode.value === 'light')

  function toggle() {
    colorMode.preference = isDark.value ? 'light' : 'dark'
  }

  function setTheme(theme: 'dark' | 'light' | 'system') {
    colorMode.preference = theme
  }

  return {
    isDark,
    isLight,
    preference: colorMode.preference,
    toggle,
    setTheme,
  }
}
