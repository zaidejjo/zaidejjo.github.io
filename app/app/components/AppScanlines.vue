<template>
  <div class="scanline-overlay" aria-hidden="true" />
</template>

<style scoped>
.scanline-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9998;
  pointer-events: none;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0, 0, 0, 0.025) 2px,
    rgba(0, 0, 0, 0.025) 4px
  );
  opacity: 0.5;
  mix-blend-mode: overlay;
}

.scanline-overlay::after {
  content: '';
  position: fixed;
  inset: 0;
  background: radial-gradient(ellipse at center, transparent 60%, rgba(0, 0, 0, 0.12) 100%);
  pointer-events: none;
}
</style>
