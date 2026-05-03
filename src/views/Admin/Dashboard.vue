<template>
  <div class="flex h-screen bg-white overflow-hidden font-sans">
    <Sidebar :activeTab="activeTab" @updateActiveTab="handleTabChange" />

    <main class="flex-1 relative overflow-hidden flex flex-col min-w-0">
      <header class="relative z-20 h-20 flex items-center justify-between px-12 bg-transparent">
        <div class="flex flex-col"></div>
        <div class="flex items-center gap-4">
          <div class="text-right hidden md:block">
            <p class="date-pill">{{ currentDate }}</p>
          </div>
        </div>
      </header>

      <div
        class="flex-1 relative z-10 flex flex-col items-center justify-center text-center px-6 overflow-y-auto"
      >
        <transition name="fade" mode="out-in">
          <div :key="activeTab" class="w-full max-w-6xl py-12">
            <div v-if="activeTab === 'DASHBOARD'" class="space-y-2">
              <!-- Floating Open Book Icon -->
              <div class="book-icon-wrapper anim-fade-in" style="animation-delay: 0.1s">
                <svg
                  class="book-float"
                  width="120"
                  height="100"
                  viewBox="-70 -50 140 100"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <ellipse
                    cx="0"
                    cy="44"
                    rx="52"
                    ry="7"
                    fill="#0d2b0f"
                    opacity="0.12"
                    class="book-glow"
                  />
                  <path
                    d="M-4,-38 Q-44,-42 -60,-30 L-60,38 Q-44,28 -4,30 Z"
                    fill="#c8e6c9"
                    stroke="#0d2b0f"
                    stroke-width="1.5"
                    stroke-linejoin="round"
                  />
                  <line
                    x1="-52"
                    y1="-14"
                    x2="-10"
                    y2="-12"
                    stroke="#2e7d32"
                    stroke-width="1"
                    opacity="0.6"
                  />
                  <line
                    x1="-52"
                    y1="-4"
                    x2="-10"
                    y2="-3"
                    stroke="#2e7d32"
                    stroke-width="1"
                    opacity="0.6"
                  />
                  <line
                    x1="-52"
                    y1="6"
                    x2="-10"
                    y2="6"
                    stroke="#2e7d32"
                    stroke-width="1"
                    opacity="0.6"
                  />
                  <line
                    x1="-52"
                    y1="16"
                    x2="-10"
                    y2="15"
                    stroke="#2e7d32"
                    stroke-width="1"
                    opacity="0.6"
                  />
                  <line
                    x1="-52"
                    y1="26"
                    x2="-10"
                    y2="24"
                    stroke="#2e7d32"
                    stroke-width="1"
                    opacity="0.6"
                  />
                  <path
                    d="M4,-38 Q44,-42 60,-30 L60,38 Q44,28 4,30 Z"
                    fill="#c8e6c9"
                    stroke="#0d2b0f"
                    stroke-width="1.5"
                    stroke-linejoin="round"
                  />
                  <line
                    x1="52"
                    y1="-14"
                    x2="10"
                    y2="-12"
                    stroke="#2e7d32"
                    stroke-width="1"
                    opacity="0.6"
                  />
                  <line
                    x1="52"
                    y1="-4"
                    x2="10"
                    y2="-3"
                    stroke="#2e7d32"
                    stroke-width="1"
                    opacity="0.6"
                  />
                  <line
                    x1="52"
                    y1="6"
                    x2="10"
                    y2="6"
                    stroke="#2e7d32"
                    stroke-width="1"
                    opacity="0.6"
                  />
                  <line
                    x1="52"
                    y1="16"
                    x2="10"
                    y2="15"
                    stroke="#2e7d32"
                    stroke-width="1"
                    opacity="0.6"
                  />
                  <line
                    x1="52"
                    y1="26"
                    x2="10"
                    y2="24"
                    stroke="#2e7d32"
                    stroke-width="1"
                    opacity="0.6"
                  />
                  <path d="M-4,-38 Q0,-36 4,-38 L4,30 Q0,32 -4,30 Z" fill="#0d2b0f" opacity="0.9" />
                  <path
                    d="M-60,38 Q-44,30 -4,30 L-4,34 Q-44,34 -60,42 Z"
                    fill="#0d2b0f"
                    opacity="0.75"
                  />
                  <path d="M60,38 Q44,30 4,30 L4,34 Q44,34 60,42 Z" fill="#0d2b0f" opacity="0.75" />
                  <polygon points="6,-38 10,-38 10,-22 8,-25 6,-22" fill="#f9a825" />
                </svg>
              </div>

              <h2 class="welcome-title">
                Welcome,
                <span class="anim-shimmer"> {{ firstName || 'User' }} </span>.
              </h2>

              <div
                class="relative py-4 max-w-2xl mx-auto anim-fade-in"
                style="animation-delay: 0.5s"
              >
                <p class="quote-text">"{{ currentQuote.text }}"</p>
                <p class="quote-author">— {{ currentQuote.author }}</p>
                <div class="quote-line anim-expand"></div>
              </div>
            </div>

            <div v-else class="text-[#1b5e20]">
              <h2 class="text-5xl font-black">{{ activeTab }}</h2>
              <p>Loading...</p>
            </div>
          </div>
        </transition>
      </div>

      <footer class="p-6 text-center">
        <p class="footer-text">Caraga State University Library Management</p>
      </footer>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import Sidebar from '@/components/Sidebar.vue'
import { supabase } from '@/lib/supabase'

const currentQuote = ref({
  text: 'A library is not a luxury but one of the necessities of life.',
  author: 'Henry Ward Beecher',
})

const firstName = ref('')
const activeTab = ref('DASHBOARD')

let liveChannel: ReturnType<typeof supabase.channel> | null = null

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

async function fetchUserName() {
  const { data: auth } = await supabase.auth.getUser()
  if (!auth?.user?.email) return ''
  const { data, error } = await supabase
    .from('users')
    .select('first_name')
    .eq('email', auth.user.email)
    .single()
  if (error) {
    console.error('Failed to fetch user name:', error)
    return ''
  }
  return data?.first_name || ''
}

onMounted(async () => {
  firstName.value = await fetchUserName()
  liveChannel = supabase.channel('dashboard-live').subscribe()
})

onBeforeUnmount(() => {
  if (liveChannel) {
    supabase.removeChannel(liveChannel)
    liveChannel = null
  }
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@400;500;600&display=swap');

.date-pill {
  font-size: 11px;
  font-weight: 500;
  color: #1b5e20;
  background: rgba(13, 43, 15, 0.05);
  border: 1px solid rgba(13, 43, 15, 0.08);
  border-radius: 100px;
  padding: 5px 14px;
}

/* ── Floating Book Icon ── */
.book-icon-wrapper {
  display: flex;
  justify-content: center;
  margin-bottom: -1rem;
}

.book-float {
  animation: bookFloat 3.5s ease-in-out infinite;
  filter: drop-shadow(0 10px 20px rgba(27, 94, 32, 0.2));
}

.book-glow {
  animation: bookGlow 3.5s ease-in-out infinite;
}

@keyframes bookFloat {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes bookGlow {
  0%,
  100% {
    opacity: 0.12;
  }
  50% {
    opacity: 0.3;
  }
}

/* ── Welcome Title ── */
.welcome-title {
  font-family: 'Playfair Display', serif;
  font-size: clamp(3rem, 6vw, 4.5rem);
  font-weight: 900;
  color: #0d2b0f;
  line-height: 1.05;
}

/* ── Quote ── */
.quote-text {
  font-family: 'Playfair Display', serif;
  font-size: 1.25rem;
  font-style: italic;
  font-weight: 400;
  color: #1b5e20;
  line-height: 1.7;
  padding: 0 1.5rem;
  position: relative;
  z-index: 1;
}

.quote-author {
  margin-top: 0.75rem;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 0.35em;
  text-transform: uppercase;
  color: #0d2b0f;
  opacity: 0.7;
}

.quote-line {
  margin: 0.5rem auto 0;
  width: 7.5rem;
  height: 2px;
  background: linear-gradient(to right, #0d2b0f, #f9a825);
  border-radius: 100px;
}

/* ── Footer ── */
.footer-text {
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 0.5em;
  text-transform: uppercase;
  color: #0d2b0f;
}

/* ── Transitions ── */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* ── Shimmer animation ── */
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

.anim-fade-in {
  animation: fadeIn 0.6s ease both;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.anim-expand {
  animation: expand 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.6s both;
}

@keyframes expand {
  from {
    transform: scaleX(0);
    opacity: 0;
  }
  to {
    transform: scaleX(1);
    opacity: 1;
  }
}
</style>
