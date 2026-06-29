<template>
  <div class="profile-ring">
    <div class="profile-image">
      <NuxtImg
        :src="src"
        :alt="alt"
        width="260"
        height="260"
        format="webp"
        quality="85"
        loading="lazy"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  src: string
  alt: string
}>()
</script>

<style scoped>
.profile-ring {
  width: 260px;
  height: 260px;
  margin: 0 auto;
  position: relative;
}

.profile-ring::before {
  content: '';
  position: absolute;
  inset: -6px;
  border-radius: 50%;
  background: conic-gradient(from 0deg, var(--cyan), var(--violet), var(--green), var(--cyan));
  animation: spinRing 6s linear infinite;
  -webkit-mask: radial-gradient(farthest-side, transparent calc(100% - 2px), #000 calc(100% - 1px));
  mask: radial-gradient(farthest-side, transparent calc(100% - 2px), #000 calc(100% - 1px));
  filter: blur(0.3px);
}

.profile-ring::after {
  content: '';
  position: absolute;
  inset: -12px;
  border-radius: 50%;
  background: conic-gradient(from 90deg, transparent 30%, rgba(6, 182, 212, 0.06), transparent 70%);
  animation: spinRing 10s linear infinite reverse;
  -webkit-mask: radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 1px));
  mask: radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 1px));
  pointer-events: none;
}

.profile-image {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: var(--bg-card);
  overflow: hidden;
  border: 3px solid var(--bg-primary);
  position: relative;
}

.profile-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

@media (max-width: 1024px) {
  .profile-ring {
    width: 220px;
    height: 220px;
  }
  .profile-ring::after {
    display: none;
  }
}

@media (max-width: 768px) {
  .profile-ring {
    width: 180px;
    height: 180px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .profile-ring::before,
  .profile-ring::after {
    animation: none;
  }
}
</style>
