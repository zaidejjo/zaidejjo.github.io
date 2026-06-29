import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface RouteConfig {
  id: string
  title: string
  indicator: string
}

const ROUTES: Record<string, RouteConfig> = {
  home:    { id: 'section-home',    title: 'Zaid Ajo — Django Backend & Vue.js Frontend Engineer', indicator: 'home' },
  about:   { id: 'section-about',   title: 'About — Zaid Ajo',    indicator: 'about' },
  skills:  { id: 'section-skills',  title: 'Skills — Zaid Ajo',   indicator: 'skills' },
  projects:{ id: 'section-projects',title: 'Projects — Zaid Ajo', indicator: 'projects' },
  contact: { id: 'section-contact', title: 'Contact — Zaid Ajo',  indicator: 'contact' },
}

// Module-level state (shared across all callers)
const visibleSection = ref('home')
const currentSection = ref('home')
const isTransitioning = ref(false)

let activeTimeline: gsap.core.Timeline | null = null

export function useNavigation() {
  const sectionIndicator = computed(() => {
    return ROUTES[currentSection.value]?.indicator ?? 'home'
  })

  function navigate(route: string, options?: { suppressHash?: boolean }) {
    if (isTransitioning.value || route === currentSection.value) return
    if (!ROUTES[route]) return

    isTransitioning.value = true
    const prevRoute = currentSection.value
    const target = ROUTES[route]

    // Update URL hash
    if (!options?.suppressHash) {
      history.pushState(null, '', '#' + route)
    }

    // Sidebar active state: update currentSection immediately for nav highlight
    // (pageTitle computed in app.vue reactively picks this up)
    currentSection.value = route

    // Get DOM elements
    const prevEl = document.getElementById(ROUTES[prevRoute].id)
    const nextEl = document.getElementById(target.id)

    // Fallback if elements not found
    if (!prevEl || !nextEl) {
      visibleSection.value = route
      isTransitioning.value = false
      return
    }

    // Kill any in-flight timeline
    activeTimeline?.kill()
    activeTimeline = null

    const tl = gsap.timeline({
      onComplete: () => {
        visibleSection.value = route
        isTransitioning.value = false
        activeTimeline = null

        // Refresh ScrollTrigger for new visible content
        nextTick(() => ScrollTrigger.refresh())

        // Scroll content area to top
        const contentInner = document.querySelector('.content-inner')
        if (contentInner) {
          contentInner.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      },
    })

    activeTimeline = tl

    // Prevent flash: ensure next section starts hidden (overrides any v-show)
    if (prevRoute !== visibleSection.value) {
      // Coming back from a previous transition — next is hidden, prev is visible
    }

    // Step 1: Exit animation on current visible section
    tl.to(prevEl, {
      opacity: 0,
      y: -12,
      duration: 0.2,
      ease: 'power2.in',
      onComplete: () => {
        // Hide previous, show next
        prevEl.style.display = 'none'
        nextEl.style.display = 'block'
        // Force reflow for enter animation
        void nextEl.offsetWidth
      },
    })

    // Step 2: Enter animation on next section
    tl.fromTo(
      nextEl,
      { opacity: 0, y: 16 },
      {
        opacity: 1,
        y: 0,
        duration: 0.4,
        ease: 'power2.out',
      }
    )

    // Close mobile sidebar
    const overlay = document.querySelector('.sidebar-overlay') as HTMLElement | null
    if (overlay?.classList.contains('active')) {
      overlay.classList.remove('active')
      document.getElementById('sidebar')?.classList.remove('open')
    }

  }

  // Handle browser back/forward
  function setupPopState() {
    window.addEventListener('popstate', () => {
      const hash = window.location.hash.replace('#', '') || 'home'
      if (ROUTES[hash] && hash !== currentSection.value) {
        navigate(hash, { suppressHash: true })
      }
    })
  }

  // Set initial section from hash on mount
  function initFromHash() {
    const hash = window.location.hash.replace('#', '') || 'home'
    if (ROUTES[hash]) {
      currentSection.value = hash
      visibleSection.value = hash

      // Hide all sections, show only the target
      Object.values(ROUTES).forEach((route) => {
        const el = document.getElementById(route.id)
        if (el) {
          el.style.display = route.id === ROUTES[hash].id ? 'block' : 'none'
          el.classList.remove('active', 'enter', 'exit')
          if (route.id === ROUTES[hash].id) {
            el.classList.add('active')
            el.style.opacity = '1'
          }
        }
      })
    }
  }

  return {
    visibleSection: readonly(visibleSection),
    currentSection: readonly(currentSection),
    sectionIndicator,
    isTransitioning: readonly(isTransitioning),
    navigate,
    setupPopState,
    initFromHash,
    ROUTES,
  }
}
