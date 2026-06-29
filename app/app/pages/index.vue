<template>
  <div ref="pageSectionsRef" class="page-sections">
    <!-- HOME -->
    <section
      :id="ROUTES.home.id"
      class="spa-section"
      :class="{ active: visibleSection === 'home' }"
    >
      <HeroSection />
    </section>

    <!-- ABOUT -->
    <section
      :id="ROUTES.about.id"
      class="spa-section animate-on-scroll"
      :class="{ active: visibleSection === 'about' }"
    >
      <AboutSection />
    </section>

    <!-- SKILLS -->
    <section
      :id="ROUTES.skills.id"
      class="spa-section animate-on-scroll"
      :class="{ active: visibleSection === 'skills' }"
    >
      <SkillsSection />
    </section>

    <!-- PROJECTS -->
    <section
      :id="ROUTES.projects.id"
      class="spa-section animate-on-scroll"
      :class="{ active: visibleSection === 'projects' }"
    >
      <ProjectsSection />
    </section>

    <!-- CONTACT -->
    <section
      :id="ROUTES.contact.id"
      class="spa-section animate-on-scroll"
      :class="{ active: visibleSection === 'contact' }"
    >
      <ContactSection ref="contactSectionRef" />
    </section>

    <!-- Footer -->
    <AppFooterNote />
  </div>
</template>

<script setup lang="ts">
const {
  visibleSection,
  navigate,
  setupPopState,
  initFromHash,
  ROUTES,
} = useNavigation()

const pageSectionsRef = ref<HTMLElement | null>(null)
const contactSectionRef = ref<InstanceType<typeof ContactSection> | null>(null)

// Setup scroll-triggered fade-in animations on content elements
useScrollAnimations(pageSectionsRef, '.animate-on-scroll > * > .about-block, .animate-on-scroll > * > .about-metric, .animate-on-scroll > * > .quote-block, .animate-on-scroll > * > .stack-category, .animate-on-scroll > * > .project-card, .animate-on-scroll > * > .contact-card, .animate-on-scroll > * > .resume-sim', visibleSection)

// Watch for resume download signal from sidebar/command bar
const resumeRequested = inject('resumeRequested') as Ref<number>
watch(resumeRequested, () => {
  if (visibleSection.value !== 'contact') {
    navigate('contact')
    nextTick(() => {
      setTimeout(() => {
        contactSectionRef.value?.triggerResume()
      }, 700)
    })
  } else {
    nextTick(() => {
      contactSectionRef.value?.triggerResume()
    })
  }
})

// Initialize from URL hash on mount
onMounted(() => {
  setupPopState()
  initFromHash()
})
</script>

<style scoped>
.page-sections {
  width: 100%;
}

.spa-section {
  display: none;
}

.spa-section.active {
  display: block;
}
</style>
