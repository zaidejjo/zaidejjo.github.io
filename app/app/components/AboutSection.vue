<template>
  <div>
    <SectionCmd cmd="cat" args="~/about.md" :showCursor="true" />
    <SectionLabel label="About" />
    <SectionTitle>
      System <span class="glow-text">Architecture</span> Philosophy
    </SectionTitle>

    <div class="about-grid">
      <!-- Whoami block -->
      <div class="about-block">
        <div class="about-block-header">
          <span class="arrow">❯</span> cat whoami.txt
        </div>
        <p>
          Production-tested <strong>Django architect</strong>. Backends handling
          <strong>5M+ requests/month</strong> at sub-45ms p99.
          Data model–first approach — schema design drives performance,
          the rest is implementation.
        </p>
      </div>

      <!-- Approach block -->
      <div class="about-block">
        <div class="about-block-header">
          <span class="arrow">❯</span> cat approach.txt
        </div>
        <p>
          Every project starts with the data model. <strong>Schema design</strong> is the foundation
          of performance. I optimise for <strong>readability, maintainability,
          and query efficiency</strong> — in that order. Clean abstractions over clever hacks.
        </p>
      </div>

      <!-- Metrics row -->
      <div class="about-metrics">
        <div class="about-metric">
          <span class="about-metric-value">99.98%</span>
          <span class="about-metric-label">API Uptime</span>
        </div>
        <div class="about-metric">
          <span class="about-metric-value">&lt;45ms</span>
          <span class="about-metric-label">p99 Latency</span>
        </div>
        <div class="about-metric">
          <span class="about-metric-value accent-amber">30-50%</span>
          <span class="about-metric-label">Latency Reduction</span>
        </div>
        <div class="about-metric">
          <span class="about-metric-value">10k+</span>
          <span class="about-metric-label">Concurrent Users</span>
        </div>
      </div>

      <!-- Quote block -->
      <div class="quote-block">
        <blockquote>"Keep it simple, but not simpler."</blockquote>
        <cite>— zaid@archbox:~/portfolio $</cite>
      </div>
    </div>
  </div>
</template>

<style scoped>
.about-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.about-block {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 28px;
  transition: border-color var(--transition);
}

.about-block:hover {
  border-color: rgba(6, 182, 212, 0.25);
}

.about-block-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  font-family: var(--font-mono);
  font-size: 0.85rem;
  color: var(--green);
}

.about-block-header .arrow {
  color: var(--text-muted);
}

.about-block p {
  color: var(--text-secondary);
  font-size: 0.925rem;
  line-height: 1.7;
}

.about-block strong {
  color: var(--text-primary);
  font-weight: 600;
}

.about-metrics {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.about-metric {
  text-align: center;
  padding: 16px 12px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  transition: border-color var(--transition);
}

.about-metric:hover {
  border-color: rgba(6, 182, 212, 0.2);
}

.about-metric-value {
  font-family: var(--font-mono);
  font-size: clamp(1.1rem, 2vw, 1.4rem);
  font-weight: 700;
  color: var(--cyan);
  letter-spacing: -0.3px;
  display: block;
}

.about-metric-value.accent-amber {
  color: var(--amber);
}

.about-metric-label {
  font-family: var(--font-mono);
  font-size: 0.65rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-top: 2px;
  display: block;
}

.quote-block {
  grid-column: 1 / -1;
  text-align: center;
  padding: 32px 40px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  border-left: 3px solid var(--cyan);
}

.quote-block blockquote {
  font-size: 1.2rem;
  font-weight: 500;
  color: var(--text-primary);
  font-style: italic;
}

.quote-block cite {
  display: block;
  margin-top: 10px;
  font-family: var(--font-mono);
  font-size: 0.78rem;
  color: var(--text-muted);
  font-style: normal;
}

@media (max-width: 1024px) {
  .about-grid {
    grid-template-columns: 1fr;
  }
  .about-metrics {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .about-metrics {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .about-metrics {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
