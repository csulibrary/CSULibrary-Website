<template>
  <div class="flex h-screen w-full overflow-hidden bg-gray-50 text-gray-900">
    <!-- SIDEBAR -->
    <aside class="hidden md:block h-full flex-shrink-0 border-r bg-white overflow-y-auto">
      <Sidebar />
    </aside>

    <!-- MAIN CONTENT -->
    <main class="flex-1 h-full overflow-y-auto overflow-x-hidden custom-scrollbar">
      <div class="py-10 px-6 md:pl-8 md:pr-16 mx-auto" style="font-family: 'Poppins', sans-serif;">

        <!-- HEADER -->
        <header class="mb-5 flex items-center gap-4">
          <div>
            <div class="header-breadcrumb flex items-center gap-2 text-sm text-gray-500 mb-2">
              <span class="cursor-pointer hover:text-[#0d2b0f] transition-colors"
                @click="$router.push('/admin/website/general')">
                BACK
              </span>
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M9 5l7 7-7 7" />
              </svg>
              <span>WEBSITE MANAGEMENT</span>
            </div>
            <h1
              class="-mt-3 text-[clamp(1.8rem,3vw,2.6rem)] font-black mb-5 tracking-[-0.03em] opacity-0 translate-y-2.5 [animation:titleFade_0.6s_ease_forwards_0.2s]">
              <span
                class="relative inline-block after:content-[''] after:absolute after:bottom-[2px] after:left-0 after:w-[260px] after:h-1 after:rounded-sm after:bg-[linear-gradient(90deg,#0d2b0f_0%,#1b5e20_20%,#f9a825_100%)]">Web
                Images</span><span class="text-yellow-500"> Overview</span>
            </h1>
            <p class="header-sub text-gray-600">Edit carousel slides and featured feature cards</p>
          </div>
        </header>

        <!-- NAVIGATION -->
        <div class="flex gap-4 mb-8 flex-wrap">
          <button v-for="tab in ['carousel', 'cards']" :key="tab" @click="activeSection = tab" :class="activeSection === tab
              ? 'bg-[#0B2010] text-white'
              : 'bg-white text-gray-600 hover:bg-gray-100'
            " class="px-6 py-3 rounded-xl font-bold shadow-sm transition capitalize">
            {{ tab === 'carousel' ? 'Home Images' : 'Feature Cards' }}
          </button>
        </div>

        <!-- HERO CAROUSEL SECTION -->
        <section v-if="activeSection === 'carousel'" class="animate-fade-in">
          <div class="bg-white rounded-3xl shadow-lg p-10">
            <div class="flex justify-between items-center mb-8">
              <h4 class="font-black text-xl">Home Carousel Slides</h4>
              <button @click="goToEditor('New Slide', '')"
                class="px-6 py-3 bg-[#0d2b0f] text-white rounded-xl font-bold hover:bg-[#1b5e20] transition">
                Add Slide
              </button>
            </div>

            <div class="grid md:grid-cols-2 gap-6">
              <!-- Skeleton Loader -->
              <template v-if="isInitialLoading">
                <div v-for="i in 4" :key="i"
                  class="flex items-center gap-6 bg-gray-50 p-6 rounded-2xl border animate-pulse-shimmer">
                  <div class="w-40 h-24 bg-gray-200 rounded-xl"></div>
                  <div class="flex-1 space-y-3">
                    <div class="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div class="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </template>

              <!-- Actual Content -->
              <template v-else>
                <div v-for="slide in carouselImages" :key="slide.id"
                  class="flex items-center gap-6 bg-gray-50 p-6 rounded-2xl border hover:shadow-md transition group">
                  <div class="w-40 h-24 bg-gray-200 rounded-xl overflow-hidden relative">
                    <img :src="slide.image_url || slide.thumbnail_url"
                      class="w-full h-full object-cover opacity-0 transition-opacity duration-700"
                      @load="(e) => (e.target as HTMLImageElement).style.opacity = '1'" />
                  </div>
                  <div class="flex-1">
                    <h5 class="font-bold text-gray-800">{{ slide.title }}</h5>
                  </div>
                  <button @click="goToEditor(slide.title, slide.image_url)"
                    class="px-5 py-2 bg-[#0d2b0f] text-white rounded-lg text-sm hover:bg-[#1b5e20] transition">
                    Edit
                  </button>
                </div>
              </template>
            </div>
          </div>
        </section>

        <!-- FEATURE CARDS SECTION -->
        <section v-if="activeSection === 'cards'" class="animate-fade-in">
          <div class="bg-white rounded-3xl shadow-lg p-10">
            <h4 class="font-black text-xl mb-8">Feature Cards</h4>
            <div class="grid md:grid-cols-3 gap-8">
              <!-- Skeleton Loader -->
              <template v-if="isInitialLoading">
                <div v-for="i in 3" :key="i" class="aspect-[4/5] bg-gray-100 rounded-3xl animate-pulse-shimmer"></div>
              </template>

              <!-- Actual Content -->
              <template v-else>
                <div v-for="card in featureCards" :key="card.id"
                  class="aspect-[4/5] bg-gray-50 border-2 border-dashed rounded-3xl overflow-hidden relative group">
                  <img :src="card.image_url || card.thumbnail_url"
                    class="w-full h-full object-cover opacity-0 transition-opacity duration-700"
                    @load="(e) => (e.target as HTMLImageElement).style.opacity = '1'" />
                  <div class="absolute top-2 right-2">
                    <button @click.stop="goToEditor(card.title, card.image_url)"
                      class="px-4 py-2 bg-[#0d2b0f] text-white rounded-lg text-sm hover:bg-[#1b5e20] transition">
                      Edit
                    </button>
                  </div>
                </div>
              </template>
            </div>
          </div>
        </section>

        <!-- LIBRARY BANNER SECTION -->
        <!-- <section v-if="activeSection === 'library'" class="animate-fade-in">
          <div class="bg-white rounded-3xl shadow-lg p-10">
            <h4 class="font-black text-xl mb-8">CSU Library Banner</h4>
            <div v-if="isInitialLoading" class="aspect-[21/9] rounded-3xl bg-gray-100 animate-pulse-shimmer"></div>
            <div v-else class="aspect-[21/9] rounded-3xl overflow-hidden relative group bg-gray-100">
              <img v-if="libraryBanner" :src="libraryBanner.image_url || libraryBanner.thumbnail_url"
                class="w-full h-full object-cover opacity-0 transition-opacity duration-700"
                @load="(e) => (e.target as HTMLImageElement).style.opacity = '1'" />
              <div
                class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                <button @click="goToEditor(libraryBanner?.title, libraryBanner?.image_url)"
                  class="px-8 py-4 bg-white text-[#0d2b0f] font-bold rounded-xl hover:bg-gray-100 transition shadow-xl">
                  Replace Banner
                </button>
              </div>
            </div>
          </div>
        </section> -->

      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Sidebar from '@/components/Sidebar.vue'
import { getAllWebsiteImages } from '@/services/websiteImageService'

const router = useRouter()
const activeSection = ref('carousel')
const mediaItems = ref<any[]>([])
const isInitialLoading = ref(true)

const loadMedia = async () => {
  isInitialLoading.value = true
  try {
    const data = await getAllWebsiteImages()
    mediaItems.value = data
  } catch (error) {
    console.error('Error fetching images:', error)
  } finally {
    setTimeout(() => {
      isInitialLoading.value = false
    }, 600)
  }
}

onMounted(() => loadMedia())

const carouselImages = computed(() =>
  mediaItems.value.filter((item) => item.page === 'homepage' && item.section === 'carousel')
)

const featureCards = computed(() =>
  mediaItems.value.filter((item) => item.page === 'homepage' && item.section === 'read-learn-discover')
)

// const libraryBanner = computed(() =>
//   mediaItems.value.find((item) => item.title === 'CSU Library Main Image')
// )

const goToEditor = (target: string, currentFile: string) => {
  router.push({
    name: 'website-images',
    query: { target, file: currentFile },
  })
}

// Auto-refresh after returning from editor
router.afterEach((to, from) => {
  if (from.name === 'website-images') {
    loadMedia()
  }
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');

/* Main Fade-in for sections */
.animate-fade-in {
  animation: fadeIn 0.5s ease-out forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Skeleton Shimmer Effect */
.animate-pulse-shimmer {
  background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite linear;
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }

  100% {
    background-position: 200% 0;
  }
}

/* Custom Scrollbar for better UI */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #cbd5e1;
}

@keyframes titleFade {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>