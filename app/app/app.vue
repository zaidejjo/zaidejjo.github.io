<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
// ─── Reactive SEO from navigation state ──────────────────────
const { currentSection } = useNavigation()
const { ROUTES } = useNavigation()

const SITE_URL = 'https://zaidejjo.github.io'

const sectionMeta: Record<string, { desc: string; ogImage?: string }> = {
  home: {
    desc: 'Django Backend & Vue.js Frontend Engineer. Performance engineering, database optimization, high-concurrency systems — sub-45ms p99 at 10k+ RPS.',
  },
  about: {
    desc: 'Learn about Zaid Ajo — performance engineer with expertise in Django, Vue.js, PostgreSQL, Redis, and building systems that stay fast under load.',
  },
  skills: {
    desc: 'Explore Zaid Ajo\'s technical stack — Python/Django, Vue.js/Nuxt, PostgreSQL, Redis, Docker, Celery, system architecture, and performance engineering.',
  },
  projects: {
    desc: 'View Zaid Ajo\'s production projects — high-performance APIs, real-time dashboards, e-commerce platforms, and open-source contributions.',
  },
  contact: {
    desc: 'Get in touch with Zaid Ajo for remote full-time engagements, consulting contracts, or open-source collaboration. Response typically within 24 hours.',
  },
}

const pageTitle = computed(() => {
  return ROUTES[currentSection.value]?.title ?? 'Zaid Ajo — Django Backend & Vue.js Frontend Engineer'
})

const pageDescription = computed(() => {
  return sectionMeta[currentSection.value]?.desc ?? sectionMeta.home.desc
})

// ─── SEO Meta Tags (reactive via refs) ────────────────────────
useSeoMeta({
  // Standard
  title: pageTitle,
  description: pageDescription,

  // Open Graph
  ogTitle: pageTitle,
  ogDescription: pageDescription,
  ogUrl: SITE_URL,
  ogImage: `${SITE_URL}/zaid_rounded.png`,
  ogImageWidth: 512,
  ogImageHeight: 512,
  ogType: 'website',
  ogSiteName: 'Zaid Ajo — Portfolio',
  ogLocale: 'en_US',

  // Twitter
  twitterCard: 'summary',
  twitterTitle: pageTitle,
  twitterDescription: pageDescription,
  twitterImage: `${SITE_URL}/zaid_rounded.png`,
  twitterCreator: '@zaid_ejjo',
  twitterSite: '@zaid_ejjo',

  // Indexing
  keywords: 'Zaid Ajo, Django developer, Vue.js developer, backend engineer, performance optimization, Python portfolio, full-stack developer, database optimization, high-concurrency systems',
  robots: 'index, follow, max-image-preview:large',
})

// ─── Head: JSON-LD + Canonical + Preconnect + Icons ──────────
const authorLd = computed(() => ({
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Zaid Ajo',
  url: SITE_URL,
  image: `${SITE_URL}/zaid_rounded.png`,
  jobTitle: 'Django Backend & Vue.js Frontend Engineer',
  description: pageDescription.value,
  sameAs: [
    'https://github.com/zaidejjo',
    'https://linkedin.com/in/zaidajo',
    'https://x.com/zaid_ejjo',
  ],
  knowsAbout: [
    'Django', 'Vue.js', 'Python', 'PostgreSQL', 'Redis',
    'Docker', 'REST API Design', 'Performance Engineering',
    'System Architecture', 'Celery', 'Linux', 'TypeScript',
  ],
  email: 'zaidejjodev@gmail.com',
  mainEntityOfPage: {
    '@type': 'WebSite',
    '@id': `${SITE_URL}/`,
    name: 'Zaid Ajo — Portfolio',
    url: SITE_URL,
  },
}))

useHead({
  title: pageTitle,
  script: [
    {
      type: 'application/ld+json',
      innerHTML: computed(() => JSON.stringify(authorLd.value, null, 2)),
      id: 'schema-person',
    },
  ],
  link: [
    { rel: 'canonical', href: SITE_URL },
    { rel: 'icon', type: 'image/png', href: '/zaid_rounded.png' },
    { rel: 'apple-touch-icon', href: '/zaid_rounded.png' },
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
  ],
  meta: [
    { name: 'theme-color', content: '#06b6d4' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { name: 'author', content: 'Zaid Ajo' },
    { name: 'application-name', content: 'Zaid Ajo — Portfolio' },
    { 'http-equiv': 'X-UA-Compatible', content: 'IE=edge' },
  ],
})
</script>
