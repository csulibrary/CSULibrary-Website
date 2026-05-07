<template>
  <div class="w-full relative min-h-screen flex flex-col items-center bg-white overflow-x-hidden">
    <!-- HERO -->
    <div class="gallery-hero sr-item">
      <div class="hero-eyebrow">
        <span class="hero-line"></span>
        <span class="hero-label">Explore the CSU Library</span>
        <span class="hero-line hidden sm:inline-block"></span>
      </div>
      <h1 class="hero-title">Library Sections</h1>
    </div>

    <!-- FLOOR FILTER + SEARCH -->
    <div class="w-full sticky top-20 z-30 px-3 sm:px-5 lg:px-8 mt-3">
      <div
        class="w-full backdrop-blur-md bg-white/90 py-3 px-3 sm:px-4 lg:px-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 border border-gray-200 rounded-2xl shadow-lg"
      >
        <div class="w-full lg:w-auto overflow-x-auto scrollbar-hide">
          <div class="flex gap-2 sm:gap-3 min-w-max pb-1 lg:pb-0">
            <button
              v-for="(floor, i) in floors"
              :key="floor.id"
              @click="activeFloor = floor.id"
              :class="[
                'px-4 sm:px-6 lg:px-8 py-2.5 rounded-xl sm:rounded-2xl font-black transition-all duration-300 text-[10px] sm:text-xs uppercase tracking-widest border-2 nav-btn whitespace-nowrap',
                activeFloor === floor.id && !searchQuery
                  ? 'bg-[#0d2b0f] border-[#0d2b0f] text-white shadow-md'
                  : 'bg-transparent border-[#0d2b0f] text-[#0d2b0f] hover:bg-[#1b5e20] hover:border-[#1b5e20] hover:text-white',
              ]"
              :style="{ animationDelay: `${i * 0.12}s` }"
            >
              <i class="fas fa-layer-group mr-1 sm:mr-2 opacity-50"></i>
              {{ floor.name }}
            </button>
          </div>
        </div>

        <div class="relative w-full lg:max-w-[320px] nav-search">
          <i
            class="fas fa-search absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 text-[#0d2b0f] opacity-40"
          ></i>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search Section..."
            class="w-full pl-11 sm:pl-12 pr-4 py-3 rounded-xl sm:rounded-2xl bg-gray-50 border-2 border-[#0d2b0f] text-[#0d2b0f] font-bold text-sm focus:outline-none focus:ring-4 focus:ring-[#1b5e20]/10 transition-all shadow-inner"
          />
        </div>
      </div>
    </div>

    <!-- MAIN CONTENT -->
    <div
      class="w-full px-3 sm:px-5 lg:px-8 flex flex-col items-center mt-8 sm:mt-10 lg:mt-12 relative z-10 pb-20"
    >
      <!-- NO SEARCH RESULT -->
      <div
        v-if="searchQuery && displayedFloors.length === 0"
        class="group/empty w-full flex flex-col items-center justify-center py-16 sm:py-24 text-center animate-fade-in"
      >
        <div class="relative flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 mb-6">
          <div class="absolute inset-0 bg-yellow-500/5 rounded-full animate-pulse"></div>

          <div
            class="relative w-16 h-16 sm:w-20 sm:h-20 bg-gray-50 rounded-full flex items-center justify-center shadow-inner border border-white animate-float"
          >
            <i
              class="fas fa-search-minus text-gray-300 group-hover/empty:text-yellow-600 transition-colors duration-500 text-2xl"
            ></i>
          </div>
        </div>

        <div class="animate-fade-in" style="animation-delay: 0.2s">
          <h3 class="text-lg sm:text-xl font-black text-[#0d2b0f] uppercase">
            No Sections Found
          </h3>
          <p class="text-gray-500 mt-3 max-w-xs text-sm leading-relaxed mx-auto px-4">
            We couldn't find matches for
            <span class="text-[#0d2b0f] font-bold italic">"{{ searchQuery }}"</span>. Try checking
            your spelling or explore another floor.
          </p>
        </div>

        <button
          @click="searchQuery = ''"
          class="mt-8 px-6 sm:px-8 py-3 border-2 border-[#0d2b0f] text-[#0d2b0f] rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-[#0d2b0f] hover:text-white hover:scale-105 active:scale-95 transition-all duration-300 animate-fade-in shadow-lg shadow-[#0d2b0f]/5"
          style="animation-delay: 0.4s"
        >
          <i class="fas fa-sync-alt mr-2"></i>
          Clear Search
        </button>
      </div>

      <transition-group name="fade" tag="div" class="w-full">
        <div v-for="floor in displayedFloors" :key="floor.id" class="w-full mb-8 sm:mb-12">
          <div v-for="wing in floor.wings" :key="wing.name" class="mb-14 sm:mb-20">
            <!-- WING HEADER -->
            <div
              class="flex flex-col sm:flex-row sm:items-center sm:justify-center mb-8 sm:mb-10 gap-2 sm:gap-6 sr-item text-center sm:text-left"
            >
              <span class="text-yellow-600 font-bold tracking-widest text-xs sm:text-sm uppercase">
                {{ floor.name }}
              </span>
              <h3
                class="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0d2b0f] uppercase tracking-tight"
              >
                {{ wing.name }}
              </h3>
              <div
                class="hidden sm:block h-0.5 grow max-w-[150px] bg-gradient-to-r from-[#0d2b0f] to-yellow-500"
              ></div>
            </div>

            <!-- EMPTY WING -->
            <div
              v-if="!isLoading && wing.sections.length === 0"
              class="w-full py-14 sm:py-20 px-5 flex flex-col items-center justify-center border-2 border-dashed border-gray-100 rounded-3xl sm:rounded-[2rem] bg-gray-50/30 mb-10 group/empty animate-fade-in"
            >
              <div class="relative w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center mb-6">
                <div class="absolute inset-0 bg-yellow-500/10 rounded-full animate-ping"></div>

                <div
                  class="relative w-14 h-14 sm:w-16 sm:h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center animate-float"
                >
                  <i
                    class="fas fa-images text-gray-300 text-2xl group-hover/empty:text-yellow-500 transition-colors duration-500"
                  ></i>
                </div>
              </div>

              <h4 class="text-[#0d2b0f] font-black text-xs sm:text-sm uppercase mb-2 text-center">
                No photos uploaded for this wing yet
              </h4>
              <p class="text-gray-400 text-xs font-medium max-w-80 text-center leading-relaxed">
                Our librarians are still curating photos for this wing. Check back soon!
              </p>
            </div>

            <!-- GRID -->
            <div
              class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5"
            >
              <template v-if="isLoading">
                <div
                  v-for="i in 4"
                  :key="i"
                  class="h-[280px] sm:h-80 lg:h-96 rounded-2xl bg-gray-100 animate-pulse relative overflow-hidden"
                >
                  <div class="absolute inset-0 skeleton-shimmer"></div>
                </div>
              </template>

              <template v-else>
                <div
                  v-for="section in wing.sections"
                  :key="section.id"
                  @click="openGallery(section)"
                  @mouseenter="startCarousel(section)"
                  @mouseleave="stopCarousel(section)"
                  class="sr-item group relative h-[280px] sm:h-80 lg:h-96 rounded-2xl overflow-hidden cursor-pointer shadow-xl transition-all duration-500 hover:-translate-y-2 lg:hover:-translate-y-3 bg-gray-100"
                >
                  <div
                    class="absolute inset-0 transition-opacity duration-700 bg-cover bg-center"
                    :style="{
                      backgroundImage:
                        section.images.length > 0 ? `url('${section.images[0]}')` : 'none',
                    }"
                  ></div>

                  <div
                    class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent group-hover:from-[#1b5e20]/95 transition-all duration-500"
                  ></div>

                  <div class="absolute inset-0 p-5 sm:p-6 lg:p-8 flex flex-col justify-end">
                    <div
                      v-if="section.images && section.images.length > 0"
                      class="mb-3 flex items-center gap-2 w-fit px-2.5 py-1 rounded-lg bg-black/40 backdrop-blur-sm border border-white/10 text-white text-[10px] font-black uppercase tracking-widest opacity-100 sm:opacity-0 group-hover:opacity-100 transform sm:translate-y-2 group-hover:translate-y-0 transition-all duration-300"
                    >
                      <i class="fas fa-images text-yellow-500"></i>
                      {{ section.images.length }} Files
                    </div>

                    <h4
                      class="text-white font-black text-xl sm:text-2xl uppercase group-hover:text-yellow-500 transition-colors leading-tight"
                    >
                      {{ section.title }}
                    </h4>
                    <p class="text-white/70 text-xs sm:text-sm mt-2 line-clamp-2">
                      {{ section.description }}
                    </p>
                  </div>
                </div>
              </template>
            </div>
          </div>
        </div>
      </transition-group>
    </div>

    <!-- SCROLL TO TOP -->
    <Transition name="fade">
      <button
        v-show="showScrollTop"
        @click="scrollToTop"
        class="fixed bottom-5 right-5 z-50 w-11 h-11 rounded-xl bg-[#06260f] text-white grid place-items-center shadow-2xl transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
        aria-label="Scroll to top"
        type="button"
      >
        <svg class="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2.5"
            d="M5 11l7-7 7 7"
          />
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2.5"
            d="M5 17l7-7 7 7"
          />
        </svg>
      </button>
    </Transition>

    <!-- MODAL -->
    <div
      v-if="showModal"
      class="fixed inset-0 z-[100] bg-[#0d2b0f]/95 flex items-center justify-center p-2 sm:p-4 backdrop-blur-md"
      @click.self="closeModal"
    >
      <button
        @click="closeModal"
        class="absolute top-3 right-4 sm:top-6 sm:right-8 text-white hover:text-yellow-500 text-4xl sm:text-5xl z-[110] transition-colors"
        aria-label="Close gallery"
        type="button"
      >
        &times;
      </button>

      <div
        class="w-full max-w-6xl max-h-[92vh] overflow-hidden rounded-2xl sm:rounded-3xl bg-white shadow-2xl relative"
      >
        <div v-if="selectedSection" class="flex flex-col lg:flex-row h-[92vh] lg:h-[72vh]">
          <!-- IMAGE VIEWER -->
          <div
            class="relative flex-1 min-h-[42vh] lg:min-h-0 bg-black flex items-center justify-center group/viewer overflow-hidden"
          >
            <button
              v-if="selectedSection.images.length > 1"
              @click.stop="prevImg"
              class="absolute left-3 sm:left-6 z-10 p-3 sm:p-4 rounded-full bg-white/10 text-white hover:bg-yellow-500 transition"
              aria-label="Previous image"
              type="button"
            >
              <i class="fas fa-chevron-left"></i>
            </button>

            <img
              v-if="selectedSection.images.length > 0"
              :src="selectedSection.images[currentImgIndex]"
              :alt="selectedSection.title"
              class="w-full h-full object-contain"
            />

            <div
              v-else
              class="w-full h-full flex items-center justify-center text-white/60 text-sm font-bold uppercase tracking-widest"
            >
              No Image Available
            </div>

            <button
              v-if="selectedSection.images.length > 1"
              @click.stop="nextImg"
              class="absolute right-3 sm:right-6 z-10 p-3 sm:p-4 rounded-full bg-white/10 text-white hover:bg-yellow-500 transition"
              aria-label="Next image"
              type="button"
            >
              <i class="fas fa-chevron-right"></i>
            </button>
          </div>

          <!-- DETAILS -->
          <div
            class="w-full lg:w-[350px] p-5 sm:p-7 lg:p-10 flex flex-col justify-between bg-white overflow-y-auto"
          >
            <div>
              <div
                class="inline-block px-3 py-1 rounded-full bg-[#0d2b0f]/10 text-[#0d2b0f] text-[10px] font-bold uppercase tracking-widest mb-4"
              >
                {{ activeFloorName }}
              </div>

              <h2
                class="text-[#0d2b0f] text-2xl sm:text-3xl font-black uppercase mb-4 leading-tight"
              >
                {{ selectedSection.title }}
              </h2>

              <p class="text-gray-600 text-sm leading-relaxed">
                {{ selectedSection.description }}
              </p>
            </div>

            <div
              v-if="selectedSection.images.length > 0"
              class="grid grid-cols-5 sm:grid-cols-6 lg:grid-cols-4 gap-2 mt-6 lg:mt-8"
            >
              <div
                v-for="(img, idx) in selectedSection.images"
                :key="idx"
                @click="currentImgIndex = idx"
                class="aspect-square rounded-lg cursor-pointer overflow-hidden border-2"
                :class="
                  currentImgIndex === idx ? 'border-yellow-500' : 'border-transparent opacity-45'
                "
              >
                <img
                  :src="img"
                  :alt="`${selectedSection.title} ${idx + 1}`"
                  class="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { getGallerySectionsWithImages } from '@/services/manageGallery'

/* =====================================================
  TYPES & STATE
===================================================== */
interface Section {
  id: string
  title: string
  description: string
  note?: string
  images: string[]
}
interface Wing {
  name: string
  sections: Section[]
}
interface Floor {
  id: string
  name: string
  wings: Wing[]
}

const isLoading = ref(true)
const activeFloor = ref('floor1')
const searchQuery = ref('')
const showModal = ref(false)
const selectedSection = ref<Section | null>(null)
const currentImgIndex = ref(0)
const showScrollTop = ref(false)
const hoverIntervals = new Map<string, any>()

// Utility to reset structure without repetition
const createFloorStructure = (): Floor[] => [
  { id: 'floor1', name: '1st Floor', wings: [{ name: 'Left Wing', sections: [] }, { name: 'Right Wing', sections: [] }] },
  { id: 'floor2', name: '2nd Floor', wings: [{ name: 'Left Wing', sections: [] }, { name: 'Right Wing', sections: [] }] },
  { id: 'floor3', name: '3rd Floor', wings: [{ name: 'Left Wing', sections: [] }, { name: 'Right Wing', sections: [] }] },
]

const floors = ref<Floor[]>(createFloorStructure())

/* =====================================================
  DATA FETCHING (Optimized to 1 Request)
===================================================== */
const fetchGalleryData = async () => {
  try {
    isLoading.value = true
    
    const rawData = await getGallerySectionsWithImages()
    const temp = createFloorStructure()

    rawData.forEach((sec: any) => {
      const formatted: Section = {
        id: sec.id,
        title: sec.section_name,
        description: sec.description,
        note: sec.note,
        images: sec.gallery_images?.map((img: any) => img.image_url) || [],
      }

      const floorObj = temp.find((f) => f.name === sec.floor)
      if (floorObj) {
        const wingObj = floorObj.wings.find((w) => w.name === sec.wing)
        if (wingObj) wingObj.sections.push(formatted)
      }
    })

    floors.value = temp
  } catch (err) {
    console.error('Failed to fetch gallery:', err)
  } finally {
    isLoading.value = false
    nextTick(initObserver)
  }
}

/* =====================================================
  CAROUSEL LOGIC
===================================================== */
const startCarousel = (section: Section) => {
  if (!section.images || section.images.length < 2) return
  stopCarousel(section) 

  const intervalId = setInterval(() => {
    const img = section.images.shift()
    if (img) section.images.push(img)
  }, 1200)

  hoverIntervals.set(section.id, intervalId)
}

const stopCarousel = (section: Section) => {
  const interval = hoverIntervals.get(section.id)
  if (interval) {
    clearInterval(interval)
    hoverIntervals.delete(section.id)
  }
}

/* =====================================================
  COMPUTED & SEARCH
===================================================== */
const activeFloorName = computed(
  () => floors.value.find((f) => f.id === activeFloor.value)?.name || '',
)

const displayedFloors = computed(() => {
  const q = searchQuery.value.toLowerCase().trim()

  if (!q) return floors.value.filter((f) => f.id === activeFloor.value)

  return floors.value
    .map((f) => ({
      ...f,
      wings: f.wings
        .map((w) => ({
          ...w,
          sections: w.sections.filter(
            (s) =>
              s.title.toLowerCase().includes(q) ||
              (s.description && s.description.toLowerCase().includes(q)),
          ),
        }))
        .filter((w) => w.sections.length > 0),
    }))
    .filter((f) => f.wings.length > 0)
})

/* =====================================================
  UTILITIES & LIFECYCLE
===================================================== */
const handleWindowScroll = () => {
  showScrollTop.value = window.scrollY > 400
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

let observer: IntersectionObserver | null = null
function initObserver() {
  if (observer) observer.disconnect()
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('in-view')
      })
    },
    { threshold: 0.1 },
  )
  document.querySelectorAll('.sr-item').forEach((el) => observer?.observe(el))
}

const openGallery = (section: Section) => {
  selectedSection.value = section
  currentImgIndex.value = 0
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

const nextImg = () => {

  if (selectedSection.value)

    currentImgIndex.value = (currentImgIndex.value + 1) % selectedSection.value.images.length

}

const prevImg = () => {

  if (selectedSection.value)

    currentImgIndex.value =

      (currentImgIndex.value - 1 + selectedSection.value.images.length) %

      selectedSection.value.images.length

}

onMounted(() => {
  fetchGalleryData()
  window.addEventListener('scroll', handleWindowScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleWindowScroll)
  if (observer) observer.disconnect()
  
  
  hoverIntervals.forEach((intervalId) => clearInterval(intervalId))
  hoverIntervals.clear()
})

watch([activeFloor, searchQuery], () => {
  setTimeout(initObserver, 200)
})
</script>



<style scoped>
/* Skeleton Animation */
.skeleton-shimmer {
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.4) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }

  100% {
    background-position: 200% 0;
  }
}

@keyframes float {
  0% {
    transform: translateY(0px) rotate(0deg);
  }

  50% {
    transform: translateY(-15px) rotate(2deg);
  }

  100% {
    transform: translateY(0px) rotate(0deg);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-float {
  animation: float 4s ease-in-out infinite;
}

.animate-fade-in {
  animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

/* Scroll Reveal Effect */
.sr-item {
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.6s cubic-bezier(0.22, 1, 0.36, 1);
}

.sr-item.in-view {
  opacity: 1;
  transform: translateY(0);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* REVEAL ANIMATION */
.sr-item {
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

.sr-item.in-view {
  opacity: 1;
  transform: translateY(0);
}

.animate-fade-in {
  animation: fadeIn 0.5s ease-out forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Reveal Animation */
.sr-item {
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.sr-item.in-view {
  opacity: 1;
  transform: translateY(0);
}

/* ── SCROLL REVEAL ── */
.sr-item {
  opacity: 0;
  transform: translateY(32px);
  transition:
    opacity 0.6s ease,
    transform 0.6s ease;
}

.sr-item.in-view {
  opacity: 1;
  transform: translateY(0);
}

/* ── HERO HEADER ── */
.gallery-hero {
  text-align: center;
  padding: 40px 30px 30px;
  width: 100%;
  background: white;
  margin-top: 1.6%;
}

.hero-eyebrow {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.hero-line {
  width: 36px;
  height: 2px;
  background: #f9a825;
}

.hero-label {
  font-size: 0.65rem;
  font-weight: 800;
  letter-spacing: 0.32em;
  text-transform: uppercase;
  color: #0d2b0f;
}

.hero-title {
  font-weight: 900;
  font-size: clamp(1.6rem, 5vw, 3.3rem);
  line-height: 1.02;
  color: #0d2b0f;
  letter-spacing: -0.03em;
  text-transform: uppercase;
}

/* ── PAGE TRANSITIONS ── */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.4s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

/* ── SCROLL TOP BUTTON ── */
.fade-btn-enter-active,
.fade-btn-leave-active {
  transition: opacity 0.3s ease;
}

.fade-btn-enter-from,
.fade-btn-leave-to {
  opacity: 0;
}

/* ── SCROLLBAR ── */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-thumb {
  background: #0d2b0f;
}

/* ── NAVBAR ANIMATIONS ── */
@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }

  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(20px);
  }

  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.nav-btn {
  opacity: 0;
  animation: slideInLeft 0.5s ease forwards;
}

.nav-search {
  opacity: 0;
  animation: slideInRight 0.5s ease 0.36s forwards;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
