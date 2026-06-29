export function useClock() {
  const clock = ref('--:--')

  function update() {
    const now = new Date()
    clock.value =
      String(now.getHours()).padStart(2, '0') +
      ':' +
      String(now.getMinutes()).padStart(2, '0')
  }

  onMounted(() => {
    update()
    const interval = setInterval(update, 10000)
    onBeforeUnmount(() => {
      clearInterval(interval)
    })
  })

  return { clock }
}
