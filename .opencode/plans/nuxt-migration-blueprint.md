# Portfolio Migration Blueprint: Vanilla HTML → Nuxt 4 + Nuxt UI v4

**Source analyzed:**
- `index.html` — main portfolio (Terminal/CLI + Code Editor hybrid theme, dark/light mode, custom SPA routing, GSAP/Three.js/Typed.js)
- `2.html` — alternate version (gradient cards, simpler layout)
- `AGENTS.md` — deployment via GitHub Pages (SSG, push to `main`)

**Target stack:**
- **Nuxt 4** (v4.0.0+, `bun create nuxt@latest -- -t v4`)
- **Nuxt UI v4** (auto-registers `@nuxt/icon`, `@nuxt/fonts`, `@nuxtjs/color-mode`)
- **Tailwind CSS v4** (via Nuxt UI)
- **TypeScript** (strict mode, Composition API with `<script setup lang="ts">`)
- **Package manager:** `bun`

---

## 1. Architecture & Folder Structure (Nuxt 4 Native)

Nuxt 4 changes the default `srcDir` from `.` to `app/`. This means all application source code lives inside `app/`, while `nuxt.config.ts`, `package.json`, `public/`, and `server/` remain at the project root.

```
porfolio/                              # Repo root → GitHub Pages root
├── app/                               # Nuxt 4 srcDir (default)
│   ├── assets/
│   │   ├── css/
│   │   │   ├── main.css               # Tailwind v4 + @nuxt/ui import + CSS variables
│   │   │   ├── base.css               # Reset, scrollbar, selection, fonts
│   │   │   └── transitions.css        # Section enter/exit keyframes
│   │   └── fonts/                     # (optional local font fallbacks)
│   │
│   ├── components/
│   │   ├── AppStatusBar.vue           # Top bar: user@host:path + typed cmd + clock + hamburger
│   │   ├── AppSidebar.vue             # Left nav: profile, routes, resume btn, socials, theme toggle
│   │   ├── AppCommandBar.vue          # Bottom input: $ ~ ❯ with history + tab-complete
│   │   ├── AppHelpOverlay.vue         # Modal: command reference table
│   │   ├── AppThemeToggle.vue         # Dark/Light radio (uses useColorMode)
│   │   ├── AppScanlines.vue           # CRT scanline + vignette overlay
│   │   ├── AppThreeBackground.vue     # Three.js particle grid (ClientOnly)
│   │   ├── AppFooterNote.vue          # Copyright line
│   │   │
│   │   ├── TerminalWindow.vue         # Reusable terminal chrome (dots, title, body slot)
│   │   ├── TerminalBlock.vue          # Inline `$ cat file` block
│   │   ├── SectionCmd.vue            # Section header: `$ cmd arg ▊`
│   │   ├── SectionLabel.vue          # Cyan section label (e.g. "About")
│   │   ├── SectionTitle.vue          # h2 with optional glow-text span
│   │   │
│   │   ├── HeroSection.vue           # Terminal window + hero name + typed.js + CTAs + profile ring
│   │   ├── AboutSection.vue          # About cards + metrics grid + quote block
│   │   ├── SkillsSection.vue         # Stack category grid (4 categories)
│   │   ├── ProjectsSection.vue       # Project cards (Madar Core, ajo-cli)
│   │   └── ContactSection.vue        # Contact cards + resume simulation
│   │
│   ├── composables/
│   │   ├── useTheme.ts               # Wraps useColorMode with terminal theme helpers
│   │   ├── useCommandRouter.ts       # Command parsing, history, tab-complete, route mapping
│   │   ├── useNavigation.ts          # Section navigation + GSAP transition orchestration
│   │   ├── useScrollAnimations.ts    # ScrollTrigger fade-ins
│   │   ├── useClock.ts               # Live clock for status bar
│   │   ├── useResumeDownload.ts      # Terminal-simulated progress + file download
│   │   └── useTypedStatus.ts         # Status bar typewriter on route change
│   │
│   ├── layouts/
│   │   └── default.vue               # Shell: status bar + sidebar + <slot /> + command bar + overlays
│   │
│   ├── pages/
│   │   └── index.vue                 # Single page — all sections via internal SPA navigation
│   │
│   ├── plugins/
│   │   ├── gsap.client.ts            # Register GSAP + ScrollTrigger globally
│   │   └── typed.client.ts           # Register Typed.js globally (or import per-component)
│   │
│   ├── utils/
│   │   └── constants.ts              # Shared constants (command map, route config, nav items)
│   │
│   ├── app.vue                       # Root: <NuxtLayout><NuxtPage /></NuxtLayout>
│   ├── app.config.ts                 # Nuxt UI theming (primary: cyan, neutral: slate)
│   └── router.options.ts             # (optional — if we need custom scroll behavior)
│
├── public/                           # Static assets served at /
│   ├── zaidajo.webp                  # Profile photo
│   ├── madarcore.webp               # Project screenshot
│   ├── zaid_resume.pdf              # Resume download
│   └── favicon.ico                   # Favicon
│
├── server/                           # (empty for SSG — no API routes needed)
│
├── nuxt.config.ts                    # Nuxt 4 config: SSG, modules, nitro prerender
├── package.json                      # Dependencies, scripts
├── bun.lock                          # Bun lockfile
├── tsconfig.json                     # TypeScript config
├── .gitignore
├── .env                              # (optional — not needed for SSG)
├── AGENTS.md                         # Updated with new build instructions
│
├── index.html                        # OLD — to be removed once Nuxt app replaces it
├── 2.html                            # OLD — to be removed once Nuxt app replaces it
└── *.png / *.webp                    # OLD assets — to be moved to public/ then removed from root
```

**Key structural decisions:**
- Nuxt 4's default `app/` srcDir maps 1:1 to our architecture — no custom `dir.app` override needed.
- Single `pages/index.vue` — no file-based multi-routing. Section switching is an internal SPA managed by `useNavigation` composable.
- `public/` at root level means assets like `zaidajo.webp` are served at `/zaidajo.webp` — same as the current site.
- Three.js / GSAP / Typed.js all in `client.ts` plugins or `<ClientOnly>` components — safe for SSG.

---

## 2. Component Breakdown

### 2.1 Shell / Layout Components (`layouts/default.vue`)

| Component | Role | Replaces in original |
|---|---|---|
| `AppStatusBar` | Fixed top bar: `zaid@archbox:~/portfolio $` + typed cmd + clock + hamburger | `<header class="status-bar">` (L1281) |
| `AppSidebar` | Fixed left nav with profile, route buttons, resume btn, social links, theme toggle | `<nav class="sidebar">` (L1305) |
| `AppCommandBar` | Bottom bar: `$ ~ ❯` input with history, tab-complete, help | `<div class="command-bar">` (L1756) |
| `AppHelpOverlay` | Modal overlay listing all commands | `<div class="help-overlay">` (L1765) |
| `AppThreeBackground` | Three.js particle grid (wrapped in `<ClientOnly>`) | `<canvas id="bg-canvas">` + init script (L2192) |
| `AppScanlines` | CRT scanline + vignette overlay | `<div class="scanline">` (L103) |
| `AppFooterNote` | Copyright footer | `<div class="footer-note">` (L1749) |

### 2.2 Page Content Components (`pages/index.vue`)

| Component | Original section | Key sub-components |
|---|---|---|
| `HeroSection` | `section-home` (L1376) | `TerminalWindow`, `ProfileRing`, Typed.js, hero CTAs |
| `AboutSection` | `section-about` (L1432) | `SectionCmd`, `SectionLabel`, `SectionTitle`, about cards, metrics grid, quote |
| `SkillsSection` | `section-skills` (L1491) | `SectionCmd`, `SectionTitle`, `StackCategory` × 4 |
| `ProjectsSection` | `section-projects` (L1545) | `SectionCmd`, `SectionTitle`, `ProjectCard` × 2 |
| `ContactSection` | `section-contact` (L1671) | `SectionCmd`, `SectionTitle`, contact cards, `ResumeSimulation` |

### 2.3 Reusable Components

| Component | Props | Notes |
|---|---|---|
| `TerminalWindow` | `title: string` | Chrome frame with R/Y/G dots + title bar + slot for body |
| `TerminalBlock` | `cmd: string, args: string, showCursor?: boolean` | Inline `$ cmd args ▊` |
| `SectionCmd` | `cmd: string, args: string` | Section header with prompt symbol |
| `SectionLabel` | `label: string` | Cyan uppercase label with left line |
| `SectionTitle` | `title: string, glow?: string` | h2 with optional `.glow-text` span |
| `ProfileRing` | `src: string, alt: string` | Conic-gradient spinning ring + image |
| `ProjectCard` | `project: ProjectData` | Full card: visual, info, tags, metrics, actions |
| `ProjectMetrics` | `metrics: Metric[]` | Number grid inside project cards |
| `StackCategory` | `name: string, items: SkillItem[]` | Skill group card |
| `StackItem` | `icon: string, label: string, sub?: string` | Single skill row |
| `ResumeSimulation` | (self-contained) | `cat` progress bar + download flow |
| `HelpCommandList` | `commands: HelpCommand[]` | Key/desc list inside help modal |

---

## 3. Nuxt UI v4 Integration Strategy

Nuxt UI v4 uses **Tailwind CSS v4** and **Reka UI** under the hood. It auto-registers three modules:
- `@nuxt/icon` (iconify integration — replaces Font Awesome)
- `@nuxt/fonts` (auto Google Fonts subsetting — replaces manual `<link>`)
- `@nuxtjs/color-mode` (dark/light mode — replaces manual `data-theme`)

| Vanilla HTML element | Nuxt UI v4 replacement | Notes |
|---|---|---|
| `.status-bar` | Custom `AppStatusBar` using `UContainer` / flex layout | No native Nuxt UI status bar; we build it with Nuxt UI primitives |
| `.sidebar` | Custom sidebar with `UVerticalNavigation` or `UNavigationMenu` | Active route highlighting via `useNavigation` |
| `.nav-item` | `UNavigationMenu` item or `UButton` variant `ghost` | Terminal-style: `❯ ~/home` with icon prefix |
| `.resume-btn` | `UButton` with slot override for `prompt/cmd/arg` | Slot for terminal text styling |
| `.theme-toggle` | `USegmented` (or `UButtonGroup`) + `useColorMode()` | Dark/Light icon toggle |
| `.btn` / `.btn-primary` / `.btn-outline` | `UButton` with `color="primary"` / `variant="outline"` | Nuxt UI handles hover/focus/disabled states |
| `.help-overlay` modal | `UModal` | Native modal, accessible, backdrop dismiss |
| `.help-commands` list | `UCommandPalette` (premier upgrade) | Searchable command palette with groups |
| `.command-bar` input | `UCommandPalette` trigger + custom `UInput` fallback | Fuzzy search, keyboard nav, groups |
| `.terminal-dot` | Decorative `<span>` elements (no Nuxt UI equivalent needed) | Pure CSS: red/yellow/green circles |
| `.contact-link` | `UButton` variant `link` or `UNavigationMenu` item | Icon + label |
| `.project-tag` | `UBadge` with color variants | Cyan for main, amber for live, violet for OSS |
| `.about-metric` / `.stack-category` | `UCard` with custom `ui` prop | Consistent card border/background styling |
| `.profile-ring` | Custom CSS — no Nuxt UI equivalent needed | Purely decorative animation |

### Color Mode Strategy

Nuxt UI v4 auto-registers `@nuxtjs/color-mode`. Configuration:

```ts
// nuxt.config.ts
colorMode: {
  preference: 'dark',
  fallback: 'dark',
  dataValue: 'theme',     // sets <html data-theme="dark|light">
  storageKey: 'portfolio-theme',
}
```

**CSS variable mapping:**
- `:root` → dark theme variables (matching original `:root`)
- `.light` or `[data-theme="light"]` → light theme variables (matching original `[data-theme="light"]`)

**Nuxt UI theme colors:**
```ts
// app.config.ts
export default defineAppConfig({
  ui: {
    colors: {
      primary: 'cyan',
      neutral: 'slate',
    }
  }
})
```

This maps Nuxt UI's `primary` to cyan (`#06b6d4`) for buttons, badges, and accents.

---

## 4. Animations & State Management (GSAP / Transitions)

### 4.1 Section Navigation

The original uses a custom `navigate()` function (L1822–L1907) with:
1. Add `.exit` class → 220ms CSS animation
2. `setTimeout` → hide previous, show next, add `.enter` class
3. `setTimeout` → clean up

**Nuxt 4 approach (`composables/useNavigation.ts`):**

```ts
export const useNavigation = () => {
  const currentSection = ref<string>('home')
  const isTransitioning = ref(false)

  function navigate(section: string) {
    if (isTransitioning.value || section === currentSection.value) return
    isTransitioning.value = true

    // 1. Build GSAP timeline
    const tl = gsap.timeline({
      onComplete: () => {
        currentSection.value = section
        isTransitioning.value = false
        // Refresh ScrollTrigger after DOM settles
        nextTick(() => ScrollTrigger.refresh())
      }
    })

    // 2. Exit animation on current section
    tl.to(currentSectionRef.value, {
      opacity: 0, y: -12, duration: 0.2, ease: 'power2.in'
    })

    // 3. Swap display
    tl.call(() => {
      // Hide current, show next (display swap)
    })

    // 4. Enter animation on next section
    tl.fromTo(nextSectionRef.value,
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }
    )
  }
}
```

**Improvements:**
- GSAP timeline eliminates brittle `setTimeout` chains.
- `ScrollTrigger.refresh()` called after enter animation via `nextTick`.
- `currentSection` is reactive — drives sidebar active state, URL hash, section indicator.
- URL hash updated via `history.pushState` (no page scroll).

### 4.2 GSAP Scroll-Triggered Fade-Ins

Extracted into `composables/useScrollAnimations.ts`:

```ts
export function useScrollAnimations(
  containerRef: Ref<HTMLElement | null>,
  selector: string,
  options?: { threshold?: number }
) {
  const instances: ScrollTrigger[] = []

  watch(containerRef, (el) => {
    // Kill old instances
    instances.forEach(i => i.kill())
    instances.length = 0

    if (!el) return

    nextTick(() => {
      const elements = el.querySelectorAll(selector)
      elements.forEach(el => {
        instances.push(
          ScrollTrigger.create({
            trigger: el,
            start: `top ${options?.threshold ?? 92}%`,
            toggleActions: 'play none none reverse',
            onEnter: () => gsap.to(el, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }),
            onLeave: () => gsap.set(el, { opacity: 0, y: 24 }),
            onEnterBack: () => gsap.to(el, { opacity: 1, y: 0, duration: 0.5 }),
            onLeaveBack: () => gsap.set(el, { opacity: 0, y: 24 }),
          })
        )
      })
    })
  })

  onBeforeUnmount(() => instances.forEach(i => i.kill()))
}
```

### 4.3 Hero Entrance

In `HeroSection.vue`'s `onMounted`:
```ts
onMounted(() => {
  const tl = gsap.timeline({ delay: 0.1 })
  tl.from(statusBarRef, { y: -36, opacity: 0, duration: 0.4 })
    .from(heroNameRef, { opacity: 0, x: -20, duration: 0.6 }, "+=0.2")
    .from(heroSubtitleRef, { opacity: 0, x: -20, duration: 0.6 }, "+=0.1")
    .from(typedContainerRef, { opacity: 0, duration: 0.5 }, "+=0.1")
    .from(heroActionsRef, { opacity: 0, y: 15, duration: 0.5 }, "+=0.1")
    .from(profileRingRef, { opacity: 0, scale: 0.8, duration: 0.8, ease: 'back.out(1.7)' }, "+=0.1")
})
```

### 4.4 Three.js Background

`AppThreeBackground.vue` with `<ClientOnly>`:
- All Three.js instantiation in `onMounted`, cleanup in `onBeforeUnmount`.
- `useThreeScene` composable with resize handler, mouse parallax, animation loop.
- Particle count reduced on mobile (matching original L2200).

### 4.5 Typed.js

In `HeroSection.vue`:
```ts
onMounted(() => {
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
})

onBeforeUnmount(() => {
  typedInstance?.destroy()
})
```

### 4.6 Status Bar Typing

`composables/useTypedStatus.ts` — watches `currentSection` from `useNavigation`:
```ts
export function useTypedStatus() {
  const { currentSection } = useNavigation()

  watch(currentSection, (section) => {
    const commands: Record<string, string> = {
      home: '❯ cd ~',
      about: '❯ cat ~/about.md',
      skills: '❯ ls -la /skills/',
      projects: '❯ ./production --showcase',
      contact: '❯ ./connect.sh',
    }
    animateTyping(commands[section] ?? '❯ cd ~')
  })
}
```

---

## 5. Upgrade Features

### 5.1 UCommandPalette — Real Terminal Executor (Premier Upgrade)

Replace the static `.command-bar` input with Nuxt UI v4's `UCommandPalette` triggered by `Cmd+K` / `Ctrl+K`.

**Commands:**

| Command | Action | Group |
|---|---|---|
| `home`, `about`, `skills`, `projects`, `contact` | Navigate to section | Navigation |
| `whoami` | Go to home | Navigation |
| `ls` | Go to projects | Navigation |
| `resume` | Trigger download simulation | Actions |
| `theme dark` / `theme light` | Switch color mode | Theme |
| `help` / `?` | Show help modal | Help |
| `clear` | Clear/reset | Help |
| `neofetch` | Display ASCII system info | Easter Eggs |
| `open github` | Open GitHub in new tab | External |
| `echo "..."` | Display toast/inline output | Utility |

**Implementation:**
```vue
<UCommandPalette
  :groups="commandGroups"
  @select="handleCommand"
  :autoselect="false"
  placeholder="Type a command..."
/>
```

The palette provides fuzzy search, keyboard navigation, group headers, and icons — all built-in.

### 5.2 @nuxt/content for Project Data (Recommended)

Add `@nuxt/content` and store projects as Markdown:

```markdown
---
title: 'Madar Core'
status: 'live'
tags: ['Django', 'DRF', 'React', 'PostgreSQL']
metrics:
  loc: '115K+'
  requests: '5M+/month'
  p99: '<45ms'
  rps: '200+'
links:
  live: 'https://madarcore.onrender.com'
  source: null
---

Enterprise School ERP serving 15k+ daily users, AI-powered diagnostics, automated curriculum generation, and real-time analytics.
```

This means:
- Editing project content = editing Markdown, not Vue templates
- Easy to add new projects without touching component code
- One `ProjectCard` component renders all projects dynamically
- Future extensibility: blog posts, case studies, testimonials

### 5.3 Keyboard Shortcuts & Easter Eggs

| Shortcut | Action |
|---|---|
| `Ctrl+K` / `Cmd+K` | Open command palette |
| `1`-`5` | Quick nav to section |
| `g h`, `g a`, `g s`, `g p`, `g c` | Vim-style `go to` |
| `?` | Toggle help overlay |
| `Esc` | Close overlays, blur input |

**Easter eggs:**
- `neofetch` — Colorful ASCII output with system "info" (name, title, uptime, shell, etc.)
- `sudo rm -rf /` — "Permission denied. Nice try."
- `vim` — "This is a browser, not a terminal emulator."
- `htop` — Animated CPU meter using GSAP

### 5.4 SEO & Performance (Nuxt 4 Native)

- `useHead` / `useSeoMeta` for per-route meta tags, Open Graph, JSON-LD structured data.
- Automatic critical CSS extraction (built-in Nuxt feature).
- `<ClientOnly>` wraps Three.js and GSAP ScrollTrigger components — zero JS in initial HTML payload.
- `@nuxt/fonts` auto-subsets Google Fonts (Inter + JetBrains Mono) — eliminates manual preconnect/preload.
- `@nuxt/icon` replaces Font Awesome CDN — icons are tree-shaken, no external HTTP request.

---

## 6. Step-by-Step Migration Roadmap

### Phase 1: Project Scaffold & Core Shell ← YOU ARE HERE
1. `bun create nuxt@latest app -- -t v4` → scaffold Nuxt 4 in `app/`
2. `bun add @nuxt/ui tailwindcss` → install Nuxt UI v4 + Tailwind CSS v4
3. Configure `nuxt.config.ts`:
   - Add `@nuxt/ui` module
   - Add `nitro.prerender` for SSG
   - Configure `colorMode`
4. Create `app/assets/css/main.css` with Tailwind + Nuxt UI imports
5. Create `app/app.config.ts` with `ui.colors: { primary: 'cyan', neutral: 'slate' }`
6. Build `layouts/default.vue` shell with `<slot />`
7. Build static shell components:
   - `AppStatusBar` — hardcoded text, live clock via `useClock`
   - `AppSidebar` — nav items, profile card (static)
   - `AppCommandBar` — input with basic CSS (no logic yet)
   - `AppScanlines` — CRT overlay
8. Verify SSG: `bunx nuxi generate`
9. **Deliverable**: Blank Nuxt 4 app with terminal chrome visible

### Phase 2: Content & Section Components
1. Port all CSS custom properties from `:root` (L27–L78) into `app/assets/css/main.css` as `:root` and `.light` / `[data-theme="light"]` blocks
2. Build shared components: `TerminalWindow`, `TerminalBlock`, `SectionCmd`, `SectionLabel`, `SectionTitle`, `ProfileRing`
3. Build section components (copy HTML from `index.html` into Vue SFCs):
   - `HeroSection` (with Typed.js in `onMounted`)
   - `AboutSection`
   - `SkillsSection`
   - `ProjectsSection`
   - `ContactSection` (with `ResumeSimulation`)
4. Render all sections in `pages/index.vue` (all visible — no SPA hiding yet)
5. **Deliverable**: Full static content matches original

### Phase 3: SPA Navigation & State
1. Build `composables/useNavigation.ts` — reactive section state, GSAP timeline transitions
2. Build `composables/useCommandRouter.ts` — command input parsing, history, tab-complete
3. Implement section visibility toggling (show only active section)
4. Wire sidebar buttons + keyboard shortcuts to `navigate()`
5. Wire `useTypedStatus` composable
6. Add `AppHelpOverlay` component with keyboard trigger (`?`)
7. **Deliverable**: Full SPA navigation working with animations

### Phase 4: Nuxt UI v4 Refinement & Theme
1. Replace raw buttons with `UButton` (variants: primary, outline, ghost)
2. Replace raw cards with `UCard`
3. Replace help overlay with `UModal`
4. Replace theme toggle with Nuxt UI `USegmented` + `useColorMode()`
5. Replace Font Awesome icons with `@nuxt/icon` (`<UIcon name="..." />`)
6. Integrate `@nuxt/fonts` for Inter + JetBrains Mono
7. Replace contact links with `UButton` variant `link`
8. Replace project tags with `UBadge`
9. **Deliverable**: Terminal theme fully integrated with Nuxt UI v4

### Phase 5: Animations & Three.js
1. Build `AppThreeBackground.vue` (`<ClientOnly>` + `useThreeScene` composable)
2. Build `composables/useScrollAnimations.ts` for GSAP ScrollTrigger
3. Orchestrate hero entrance animation in `HeroSection.vue`
4. Polish section transitions (easing, duration, stagger via GSAP timeline)
5. Add `prefers-reduced-motion` support via `useMediaQuery`
6. **Deliverable**: All animations fluid, Three.js rendering, GSAP scroll reveals

### Phase 6: Upgrade Features
1. Add `@nuxt/content` with `bun add @nuxt/content`
2. Convert project data to Markdown in `content/projects/`
3. Add `UCommandPalette` as the primary command interface
4. Add `neofetch` easter egg command
5. Add vim-style keyboard shortcuts (`g h`, `g a`, etc.)
6. Implement SEO meta tags with `useSeoMeta`
7. **Deliverable**: Feature-complete portfolio

### Phase 7: Polish, Cleanup & Deploy
1. Test all commands, keyboard shortcuts, navigation
2. Test responsive layout → match original mobile breakpoints
3. Move old static assets (`zaidajo.webp`, `madarcore.webp`, `zaid_resume.pdf`) from repo root to `public/`
4. Update `AGENTS.md` with new build/deploy instructions:
   ```
   Development: bun run dev (from repo root)
   Build:       bun run generate
   Deploy:     push to main — GitHub Pages auto-deploys from root
   ```
5. Remove old `index.html`, `2.html`, and stale assets from repo root
6. Final `bunx nuxi generate` → verify `app/.output/public/` contains index.html
7. **Deliverable**: Production-ready Nuxt 4 portfolio live on GitHub Pages

---

## Dependency Versions (Target)

| Package | Version | Purpose |
|---|---|---|
| `nuxt` | `^4.0.0` | Framework |
| `@nuxt/ui` | `^4.0.0` | UI components, auto-registers `icon`, `fonts`, `color-mode` |
| `tailwindcss` | `^4.0.0` | CSS engine (via Nuxt UI) |
| `gsap` | `^3.12.5` | Animations |
| `three` | `^0.170.0` | 3D particle background |
| `typed.js` | `^2.1.0` | Typewriter effect |
| `@nuxt/content` | `^3.0.0` | (Phase 6) Content management |
| `@vueuse/core` | `^12.0.0` | Utility composables |

---

## Summary of Key Improvements

| Area | Original (index.html) | Nuxt 4 Version |
|---|---|---|
| **Build** | None (hand-coded, 2374 lines) | `nuxi generate` — SSG, minified, hashed assets |
| **Components** | Monolithic HTML + inline `<style>` | 25+ typed Vue SFCs with scoped styles |
| **State** | `document.querySelector` + global functions | Reactive composables with proper lifecycle |
| **Routing** | Custom `navigate()` with `setTimeout` chains | `useNavigation` composable with GSAP timelines |
| **Theme** | CSS vars swapped by `data-theme` listener | `@nuxtjs/color-mode` (auto-registered by Nuxt UI) |
| **Commands** | Static `.help-commands` list in HTML | `UCommandPalette` with fuzzy search + groups |
| **Content** | Hardcoded in `<section>` tags | Optional Markdown via `@nuxt/content` |
| **Animations** | GSAP + `setTimeout` in global script | GSAP in lifecycle hooks + `onBeforeUnmount` cleanup |
| **TypeScript** | None | Strict mode `.ts` files throughout |
| **Icons** | Font Awesome CDN (external request) | `@nuxt/icon` (tree-shaken, no CDN) |
| **Fonts** | Google Fonts manual preconnect | `@nuxt/fonts` auto-subsetting + fallback |
| **SEO** | Manual `<meta>` tags in `<head>` | `useHead` + `useSeoMeta` with reactive state |

---

**Phase 1 is ready to begin.** The scaffold command will be:

```bash
# Remove empty placeholder app dir, scaffold Nuxt 4 fresh
rm -rf app && bun create nuxt@latest app -- -t v4
```

Then install dependencies and build the shell. Shall I proceed?
