import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Sets up GSAP ScrollTrigger fade-in animations for elements matching
 * `selector` within `containerRef`. Automatically cleans up old triggers
 * when `watchSource` changes (e.g., section navigation).
 */
export function useScrollAnimations(
  containerRef: Ref<HTMLElement | null>,
  selector: string,
  watchSource: Ref<unknown>,
  options?: { threshold?: number }
) {
  const instances: ScrollTrigger[] = []
  const threshold = options?.threshold ?? 92

  function setup() {
    // Kill old instances
    instances.forEach((i) => i.kill())
    instances.length = 0

    const container = containerRef.value
    if (!container) return

    // Wait for DOM to settle after Vue re-render
    nextTick(() => {
      const elements = container.querySelectorAll<HTMLElement>(selector)
      if (!elements.length) return

      elements.forEach((el) => {
        // Set initial state
        gsap.set(el, { opacity: 0, y: 24 })

        const trigger = ScrollTrigger.create({
          trigger: el,
          start: `top ${threshold}%`,
          toggleActions: 'play none none reverse',
          invalidateOnRefresh: true,
          onEnter: () => {
            gsap.to(el, {
              opacity: 1,
              y: 0,
              duration: 0.5,
              ease: 'power2.out',
              overwrite: 'auto',
            })
          },
          onLeave: () => {
            gsap.set(el, { opacity: 0, y: 24 })
          },
          onEnterBack: () => {
            gsap.to(el, {
              opacity: 1,
              y: 0,
              duration: 0.5,
              ease: 'power2.out',
              overwrite: 'auto',
            })
          },
          onLeaveBack: () => {
            gsap.set(el, { opacity: 0, y: 24 })
          },
        })

        instances.push(trigger)
      })
    })
  }

  // Watch the source (e.g., visibleSection) and re-setup on change
  watch(watchSource, () => {
    setup()
  })

  // Initial setup
  onMounted(() => {
    // Small delay to ensure DOM is ready
    setTimeout(setup, 50)
  })

  // Cleanup on unmount
  onBeforeUnmount(() => {
    instances.forEach((i) => i.kill())
    instances.length = 0
  })

  return {
    refresh: () => {
      instances.forEach((i) => i.refresh())
    },
  }
}
