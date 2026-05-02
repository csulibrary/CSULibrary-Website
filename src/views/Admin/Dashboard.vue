<template>
  <div class="flex h-screen bg-white overflow-hidden font-sans">
    <Sidebar :activeTab="activeTab" @updateActiveTab="handleTabChange" />

    <main class="flex-1 relative overflow-hidden flex flex-col min-w-0">
      <!-- Header -->
      <header class="relative z-20 h-20 flex items-center justify-between px-12 bg-transparent">
        <div class="flex flex-col">
          <span class="font-bold text-sm uppercase tracking-widest text-[#1b5e20]">
            {{ activeTab }} VIEW
          </span>
        </div>

        <div class="flex items-center gap-6">
          <div class="text-right hidden md:block">
            <p class="text-xs font-medium text-[#1b5e20]">{{ currentDate }}</p>
          </div>
        </div>
      </header>

      <!-- Content -->
      <div class="flex-1 relative z-10 flex flex-col items-center justify-center text-center px-6 overflow-y-auto">
        <transition name="fade" mode="out-in">
          <div :key="activeTab" class="w-full max-w-6xl py-12">

            <!-- DASHBOARD -->
            <div v-if="activeTab === 'DASHBOARD'" class="space-y-12">
              <h2 class="text-[#0d2b0f] text-6xl md:text-7xl font-black">
                Welcome!
              </h2>

              <!-- Quote -->
              <div class="relative py-4 max-w-2xl mx-auto anim-fade-in" style="animation-delay: 0.5s">
                <p class="text-[#1b5e20] text-3xl md:text-xl italic font-bold leading-tight px-6">
                  "{{ currentQuote.text }}"
                </p>
                <p class="mt-3 text-[#1b5e20] font-bold tracking-[0.3em] uppercase text-[11px] opacity-80">
                  — {{ currentQuote.author }}
                </p>

                <div class="mt-2 mx-auto w-30 h-0.5 bg-gradient-to-r from-[#0d2b0f] to-[#f9a825] rounded-full anim-expand"></div>
              </div>
            </div>

            <!-- Other Tabs -->
            <div v-else class="text-[#1b5e20]">
              <h2 class="text-5xl font-black">{{ activeTab }}</h2>
              <p>Content coming soon...</p>
            </div>

          </div>
        </transition>
      </div>

      <!-- Footer -->
      <footer class="p-6 text-center">
        <p class="text-[10px] uppercase tracking-[0.5em] font-black text-[#0d2b0f]">
          Caraga State University Library Website Management
        </p>
      </footer>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import Sidebar from '@/components/Sidebar.vue'

const activeTab = ref('DASHBOARD')
const firstName = ref('User')

const handleTabChange = (name: string) => {
  activeTab.value = name
}

const currentDate = computed(() =>
  new Date().toLocaleDateString('en-PH', {
    timeZone: 'Asia/Manila',
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }),
)

const currentQuote = ref({
  text: 'A library is not a luxury but one of the necessities of life.',
  author: 'Henry Ward Beecher',
})

</script>

<style scoped>
/* ── Wrapper — perspective container ── */
.stat-card-wrapper {
  animation: card-in 0.55s cubic-bezier(0.22, 1, 0.36, 1) both;
  animation-delay: calc(var(--i) * 0.1s);
  perspective: 600px;
  perspective-origin: center center;
}

@keyframes card-in {
  from {
    opacity: 0;
    transform: translateY(28px) scale(0.96);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.stat-card {
  position: relative;
  background: #fff;
  border: 2px solid #1b5e20;
  border-radius: 1rem;
  padding: 1.75rem 1.25rem 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: default;
  transform-style: preserve-3d;
  will-change: transform;
  transition:
    transform 0.5s cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 0.35s ease,
    background 0.28s ease,
    border-color 0.28s ease;
}

.stat-card-wrapper:hover .stat-card {
  background: #1b5e20;
  border-color: #2e7d32;
  box-shadow:
    0 30px 60px rgba(27, 94, 32, 0.3),
    0 10px 20px rgba(27, 94, 32, 0.18);
}

.stat-shimmer {
  position: absolute;
  inset: 0;
  pointer-events: none;
  border-radius: inherit;
  transition: background 0.08s linear;
}

.stat-accent-bar {
  position: absolute;
  top: 0;
  left: 15%;
  right: 15%;
  height: 2px;
  background: linear-gradient(90deg, transparent, #f9a825, transparent);
  opacity: 0;
  transition: opacity 0.28s ease;
}

.stat-card-wrapper:hover .stat-accent-bar {
  opacity: 1;
}

.stat-icon {
  color: #f9a825;
  display: flex;
  transition:
    color 0.28s ease,
    transform 0.28s cubic-bezier(0.22, 1, 0.36, 1);
}

.stat-card-wrapper:hover .stat-icon {
  color: #fff;
  transform: scale(1.18);
}

.stat-value {
  font-size: 2.25rem;
  font-weight: 900;
  margin-top: 0.5rem;
  color: #1b5e20;
  line-height: 1;
  transition: color 0.28s ease;
}

.stat-card-wrapper:hover .stat-value {
  color: #fff;
}

.stat-label {
  font-size: 0.6875rem;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  font-weight: 800;
  margin-top: 0.375rem;
  color: #1b5e20;
  transition: color 0.28s ease;
}

.stat-card-wrapper:hover .stat-label {
  color: rgba(255, 255, 255, 0.85);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.anim-shimmer {
  background: linear-gradient(90deg, #f9a825 25%, #fde68a 50%, #f9a825 75%);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: shimmer 2.5s linear infinite;
}

@keyframes shimmer {
  0% {
    background-position: -200% center;
  }
  100% {
    background-position: 200% center;
  }
}
</style>