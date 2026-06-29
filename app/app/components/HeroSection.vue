<template>
  <div class="hero-grid">
    <div>
      <TerminalWindow title="zaid@archbox:~/portfolio — zsh — 80×24">
        <div ref="heroPreambleRef" class="hero-preamble">
          <div>
            <span style="color:var(--green);">┌──(</span>
            <span style="color:var(--violet);">zaid@archbox</span>
            <span style="color:var(--green);">)</span>
            <span style="color:var(--text-muted);">-(</span>
            <span style="color:var(--violet);">~</span>
            <span style="color:var(--text-muted);">)</span>
          </div>
          <div>
            <span style="color:var(--green);">└─</span>
            <span style="color:var(--text-muted);">$ </span>
            <span style="color:var(--text-primary);">cat /etc/passwd | grep zaid</span>
          </div>
        </div>

        <h1 ref="heroNameRef" class="hero-name">
          Zaid <span class="accent">Ajo</span>
        </h1>

        <p ref="heroSubtitleRef" class="hero-subtitle">
          Django Backend · Vue.js Frontend · Performance Engineer
        </p>

        <div ref="typedContainerRef" class="typed-container">
          <span class="prompt">$&gt;</span>
          <span ref="typedOutputRef" id="typed-output" />
        </div>

        <div ref="heroActionsRef" class="hero-actions">
          <UButton
            color="primary"
            variant="solid"
            size="lg"
            @click="navigate('projects')"
          >
            <UIcon name="i-heroicons-rocket-launch" />
            Production Work
          </UButton>
          <UButton
            color="primary"
            variant="outline"
            size="lg"
            @click="navigate('contact')"
          >
            <UIcon name="i-heroicons-paper-airplane" />
            Connect
          </UButton>
          <UButton
            color="neutral"
            variant="outline"
            size="lg"
            to="https://github.com/zaidejjo"
            target="_blank"
          >
            <UIcon name="i-simple-icons-github" />
            GitHub
          </UButton>
        </div>
      </TerminalWindow>
    </div>

    <div ref="profileRingRef">
      <ProfileRing
        src="/zaidajo.webp"
        alt="Zaid Ajo portrait"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { gsap } from 'gsap'
import Typed from 'typed.js'

const { navigate } = useNavigation()
const { currentSection } = useNavigation()

const heroPreambleRef = ref<HTMLElement | null>(null)
const heroNameRef = ref<HTMLElement | null>(null)
const heroSubtitleRef = ref<HTMLElement | null>(null)
const typedContainerRef = ref<HTMLElement | null>(null)
const heroActionsRef = ref<HTMLElement | null>(null)
const profileRingRef = ref<HTMLElement | null>(null)
const typedOutputRef = ref<HTMLElement | null>(null)

let typedInstance: Typed | null = null
let entranceTimeline: gsap.core.Timeline | null = null

function playEntranceAnimation() {
  // Kill existing timeline to prevent overlap
  entranceTimeline?.kill()

  entranceTimeline = gsap.timeline({
    delay: 0.1,
    paused: true,
    defaults: { ease: 'power2.out' },
  })

  entranceTimeline
    .from(heroPreambleRef.value, { opacity: 0, duration: 0.4 })
    .from(heroNameRef.value, { opacity: 0, x: -20, duration: 0.6 }, '+=0.1')
    .from(heroSubtitleRef.value, { opacity: 0, x: -20, duration: 0.6 }, '+=0.1')
    .from(typedContainerRef.value, { opacity: 0, duration: 0.5 }, '+=0.1')
    .from(heroActionsRef.value, { opacity: 0, y: 15, duration: 0.5 }, '+=0.1')
    .from(profileRingRef.value, { opacity: 0, scale: 0.8, duration: 0.8, ease: 'back.out(1.7)' }, '+=0.1')

  entranceTimeline.play()
}

onMounted(() => {
  // Initialize Typed.js
  if (typedOutputRef.value) {
    typedInstance = new Typed(typedOutputRef.value, {
      strings: [
        'echo "Architecting systems at 10k+ concurrent requests."',
        'echo "Database optimization — 30-50% latency reduction delivered."',
        'echo "sub-45ms p99 · 200+ RPS sustained · 99.98% uptime."',
        'echo "Clean code, elegant architecture, relentless refactoring."',
      ],
      typeSpeed: 40,
      backSpeed: 20,
      backDelay: 3000,
      startDelay: 800,
      loop: true,
      showCursor: true,
      cursorChar: '▊',
    })
  }

  // Play entrance animation
  playEntranceAnimation()
})

onBeforeUnmount(() => {
  // Cleanup Typed.js
  typedInstance?.destroy()
  typedInstance = null

  // Cleanup GSAP
  entranceTimeline?.kill()
  entranceTimeline = null
})
</script>

<style scoped>
.hero-grid {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 48px;
  align-items: center;
  width: 100%;
}

.hero-preamble {
  font-family: var(--font-mono);
  font-size: 0.78rem;
  color: var(--text-muted);
  margin-bottom: 20px;
  line-height: 1.8;
}

.hero-name {
  font-family: var(--font-mono);
  font-size: clamp(2rem, 5.5vw, 3.6rem);
  font-weight: 800;
  letter-spacing: -2px;
  line-height: 1.05;
  margin-bottom: 12px;
}

.hero-name .accent {
  color: var(--cyan);
}

.hero-subtitle {
  font-family: var(--font-sans);
  font-size: clamp(1rem, 1.8vw, 1.2rem);
  color: var(--text-secondary);
  font-weight: 400;
  line-height: 1.5;
  margin-bottom: 28px;
}

.typed-container {
  height: 32px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-mono);
  font-size: 0.88rem;
  color: var(--text-muted);
  margin-bottom: 28px;
}

.typed-container .prompt {
  color: var(--green);
}

.hero-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

@media (max-width: 1024px) {
  .hero-grid { grid-template-columns: 1fr; gap: 32px; }
}

@media (max-width: 768px) {
  .hero-name { font-size: clamp(1.8rem, 7vw, 2.8rem); }
}

@media (max-width: 480px) {
  .hero-actions { flex-direction: column; }
}
</style>
