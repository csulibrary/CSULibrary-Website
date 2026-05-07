<template>
  <header class="fixed top-0 left-0 w-full bg-white border-t-4 border-[#FBC02D] shadow-sm z-50">
    <div class="w-full px-6 lg:px-10">
      <div class="flex justify-between items-center h-20">
        <!-- LOGO -->
        <RouterLink to="/" class="flex items-center" @click="closeMenu">
          <img src="/csu-logo.png" alt="University Logo" class="w-40 h-auto" />
          <div class="flex flex-col font-serif leading-tight text-[#003300]"></div>
        </RouterLink>

        <!-- DESKTOP NAV -->
        <nav class="hidden xl:flex items-center">
          <RouterLink
            v-for="link in navLinks"
            :key="link.path"
            :to="link.path"
            class="nav-link"
          >
            {{ link.name }}
          </RouterLink>
        </nav>

        <!-- MOBILE MENU BUTTON -->
        <div class="xl:hidden">
          <button
            type="button"
            class="p-2 text-[#003300] hover:text-[#009900] transition"
            aria-label="Toggle menu"
            @click="toggleMenu"
          >
            <!-- HAMBURGER ICON -->
            <svg
              v-if="!isMenuOpen"
              class="h-7 w-7"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2.5"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>

            <!-- CLOSE ICON -->
            <svg
              v-else
              class="h-7 w-7"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2.5"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- MOBILE DROPDOWN MENU -->
    <transition name="mobile-menu">
      <div
        v-if="isMenuOpen"
        class="xl:hidden absolute top-full left-0 w-full bg-white border-t border-gray-100 shadow-lg"
      >
        <nav class="flex flex-col px-6 py-4">
          <RouterLink
            v-for="link in navLinks"
            :key="link.path"
            :to="link.path"
            class="mobile-nav-link"
            @click="closeMenu"
          >
            {{ link.name }}
          </RouterLink>
        </nav>
      </div>
    </transition>
  </header>

  <!-- BACKDROP FOR MOBILE MENU -->
  <div
    v-if="isMenuOpen"
    class="fixed inset-0 bg-black/20 z-40 xl:hidden"
    @click="closeMenu"
  ></div>

  <!-- IMPORTANT: add spacer so content won't hide under fixed navbar -->
  <div class="h-20"></div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

const route = useRoute()
const isMenuOpen = ref(false)

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Announcement', path: '/announcements' },
  { name: 'Gallery', path: '/gallery' },
  { name: 'Personnel', path: '/personnel' },
  { name: 'Records', path: '/records' },
  { name: 'Services', path: '/services' },
  { name: 'About Us', path: '/about' },
  { name: 'Admin', path: '/admin/login' },
]

function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value
}

function closeMenu() {
  isMenuOpen.value = false
}

// Auto-close mobile menu when route changes
watch(
  () => route.fullPath,
  () => {
    closeMenu()
  },
)
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@500;600;700&display=swap');

.font-serif {
  font-family: Georgia, serif;
}

.nav-link {
  font-family: 'Poppins', sans-serif;
  font-weight: 700;
  font-size: 0.95rem;
  color: #003300;
  transition: all 0.3s ease;
  text-transform: capitalize;
  margin: 0 10px;
  padding: 6px 0;
  border-bottom: 2px solid transparent;
}

.nav-link:hover {
  color: #009900;
}

/* Desktop active route */
.router-link-active {
  color: #009900;
  border-bottom: 2px solid #f9dc07;
}

/* Mobile links */
.mobile-nav-link {
  font-family: 'Poppins', sans-serif;
  font-weight: 700;
  font-size: 0.95rem;
  color: #003300;
  text-transform: capitalize;
  padding: 14px 0;
  border-bottom: 1px solid rgba(0, 51, 0, 0.08);
  transition: all 0.25s ease;
}

.mobile-nav-link:hover {
  color: #009900;
  padding-left: 8px;
}

.mobile-nav-link.router-link-active {
  color: #009900;
  border-bottom: 1px solid rgba(0, 51, 0, 0.08);
  border-left: 4px solid #f9dc07;
  padding-left: 10px;
}

/* Mobile menu animation */
.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition:
    opacity 0.25s ease,
    transform 0.25s ease;
}

.mobile-menu-enter-from,
.mobile-menu-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.mobile-menu-enter-to,
.mobile-menu-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>