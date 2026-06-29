import type { Ref } from 'vue'

type THREE = typeof import('three')

interface Particle {
  positions: Float32Array
  colors: Float32Array
  sizes: Float32Array
  velocities: Float32Array
  basePositions: Float32Array
}

export function useThreeBackground(canvasRef: Ref<HTMLCanvasElement | null>) {
  const isReady = ref(false)

  let THREE: THREE | null = null

  let scene: import('three').Scene | null = null
  let camera: import('three').PerspectiveCamera | null = null
  let renderer: import('three').WebGLRenderer | null = null
  let particles: import('three').Points | null = null
  let particleData: Particle | null = null
  let animationId: number | null = null
  let resizeObserver: ResizeObserver | null = null

  // Mouse tracking
  const mouseTarget = { x: 0, y: 0 }
  const mouseCurrent = { x: 0, y: 0 }

  // Reduced motion detection
  const prefersReducedMotion = ref(false)

  function getThemeColors(): { cyan: string; violet: string } {
    const style = getComputedStyle(document.documentElement)
    return {
      cyan: style.getPropertyValue('--cyan').trim() || '#06b6d4',
      violet: style.getPropertyValue('--violet').trim() || '#8b5cf6',
    }
  }

  function hexToRgb(hex: string): [number, number, number] {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    if (!result) return [6, 182, 212]
    return [
      parseInt(result[1], 16) / 255,
      parseInt(result[2], 16) / 255,
      parseInt(result[3], 16) / 255,
    ]
  }

  async function init() {
    // Dynamic import keeps THREE in a lazy-loaded chunk, reducing initial JS
    THREE = await import('three')

    const canvas = canvasRef.value
    if (!canvas) return

    const colors = getThemeColors()
    const cyanRgb = hexToRgb(colors.cyan)
    const violetRgb = hexToRgb(colors.violet)

    // Scene
    scene = new THREE.Scene()

    // Camera
    const aspect = window.innerWidth / window.innerHeight
    camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000)
    camera.position.z = 40

    // Renderer
    renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'low-power',
    })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)

    // Particles
    const particleCount = prefersReducedMotion.value ? 300 : 900
    const spread = 50

    const positions = new Float32Array(particleCount * 3)
    const colors_arr = new Float32Array(particleCount * 3)
    const sizes = new Float32Array(particleCount)
    const velocities = new Float32Array(particleCount)
    const basePositions = new Float32Array(particleCount * 3)

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3
      positions[i3] = (Math.random() - 0.5) * spread
      positions[i3 + 1] = (Math.random() - 0.5) * spread
      positions[i3 + 2] = (Math.random() - 0.5) * spread

      basePositions[i3] = positions[i3]
      basePositions[i3 + 1] = positions[i3 + 1]
      basePositions[i3 + 2] = positions[i3 + 2]

      // Color interpolation between cyan and violet
      const t = Math.random()
      colors_arr[i3] = cyanRgb[0] + (violetRgb[0] - cyanRgb[0]) * t
      colors_arr[i3 + 1] = cyanRgb[1] + (violetRgb[1] - cyanRgb[1]) * t
      colors_arr[i3 + 2] = cyanRgb[2] + (violetRgb[2] - cyanRgb[2]) * t

      sizes[i] = Math.random() * 2.5 + 0.5
      velocities[i] = Math.random() * 0.005 + 0.002
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors_arr, 3))
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))

    // Custom shader material for size attribute support
    const material = new THREE.PointsMaterial({
      size: 0.15,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    })

    particles = new THREE.Points(geometry, material)
    scene.add(particles)

    particleData = { positions, colors: colors_arr, sizes, velocities, basePositions }

    // Mouse tracking
    function onMouseMove(e: MouseEvent) {
      mouseTarget.x = (e.clientX / window.innerWidth) * 2 - 1
      mouseTarget.y = -(e.clientY / window.innerHeight) * 2 + 1
    }
    window.addEventListener('mousemove', onMouseMove, { passive: true })

    // Resize
    function onResize() {
      if (!renderer || !camera) return
      const w = window.innerWidth
      const h = window.innerHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }

    resizeObserver = new ResizeObserver(onResize)
    resizeObserver.observe(canvas)

    // Animation loop
    function animate() {
      animationId = requestAnimationFrame(animate)
      if (!particles || !particleData || !renderer || !scene || !camera) return

      // Smooth mouse following
      mouseCurrent.x += (mouseTarget.x - mouseCurrent.x) * 0.05
      mouseCurrent.y += (mouseTarget.y - mouseCurrent.y) * 0.05

      // Rotate based on mouse position
      particles.rotation.y += 0.0008 + mouseCurrent.x * 0.0004
      particles.rotation.x += mouseCurrent.y * 0.0002

      // Gentle float animation
      if (!prefersReducedMotion.value) {
        const positions2 = particles.geometry.attributes.position.array as Float32Array
        const time = Date.now() * 0.0003
        for (let i = 0; i < positions2.length / 3; i++) {
          const i3 = i * 3
          // Subtle sine-wave float on Y axis
          positions2[i3 + 1] = particleData.basePositions[i3 + 1] + Math.sin(time + i) * 0.4
          // Subtle X drift
          positions2[i3] = particleData.basePositions[i3] + Math.cos(time * 0.7 + i * 0.5) * 0.3
        }
        particles.geometry.attributes.position.needsUpdate = true
      }

      renderer.render(scene, camera)
    }

    animate()
    isReady.value = true

    // Listen for reduced motion changes
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    mediaQuery.addEventListener('change', (e) => {
      prefersReducedMotion.value = e.matches
    })
  }

  function cleanup() {
    if (animationId !== null) {
      cancelAnimationFrame(animationId)
      animationId = null
    }

    if (particles) {
      particles.geometry.dispose()
      if (Array.isArray(particles.material)) {
        particles.material.forEach((m) => m.dispose())
      } else {
        particles.material.dispose()
      }
      particles = null
    }

    if (renderer) {
      renderer.dispose()
      renderer = null
    }

    if (resizeObserver) {
      resizeObserver.disconnect()
      resizeObserver = null
    }

    scene = null
    camera = null
    particleData = null
    isReady.value = false
  }

  onMounted(() => {
    prefersReducedMotion.value = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches
    init().catch(console.error)
  })

  onBeforeUnmount(() => {
    cleanup()
  })

  return { isReady }
}
