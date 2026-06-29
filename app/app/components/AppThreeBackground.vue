<template>
  <canvas
    ref="canvasRef"
    class="bg-canvas"
    aria-hidden="true"
  />
</template>

<script setup lang="ts">
const canvasRef = ref<HTMLCanvasElement | null>(null)

useThreeBackground(canvasRef)
</script>

<style scoped>
.bg-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
  opacity: 0.35;
  transition: opacity 0.8s ease;
}

@media (max-width: 480px) {
  .bg-canvas {
    opacity: 0.15;
  }
}

@media (prefers-reduced-motion: reduce) {
  .bg-canvas {
    opacity: 0.1;
  }
}
</style>
