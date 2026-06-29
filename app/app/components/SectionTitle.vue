<template>
  <h2 class="section-title">
    <slot />
  </h2>
</template>

<style scoped>
.section-title {
  font-family: var(--font-mono);
  font-size: clamp(1.5rem, 3vw, 2.2rem);
  font-weight: 700;
  letter-spacing: -0.5px;
  margin-bottom: 32px;
  line-height: 1.2;
}
</style>
