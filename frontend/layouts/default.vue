<template>
  <v-app>
    <navbar />
    <LanguageSwitcher class="ml-auto mr-4" />
    <NuxtPage />
  </v-app>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '~/stores/auth'
import LanguageSwitcher from '~/components/LanguageSwitcher.vue'

const authStore = useAuthStore()

const drawer = ref(true)
const rail = ref(false)
const isDark = ref(true) // Default to dark theme

const user = computed(() => authStore.user)

const toggleTheme = () => {
  isDark.value = !isDark.value
  // TODO: Implement actual theme switching with Vuetify
  console.log('Theme toggled to:', isDark.value ? 'dark' : 'light')
}

const changeLanguage = (locale) => {
  // TODO: Implement language change
  console.log('Changing language to:', locale)
}

const goToProfile = () => {
  navigateTo('/profile')
}

const logout = async () => {
  await authStore.logout()
  navigateTo('/auth')
}
</script>

<style scoped>
.sidebar {
  background: linear-gradient(135deg, #1e1e1e 0%, #2d2d2d 100%);
}

.app-bar {
  background: rgba(30, 30, 30, 0.95);
  backdrop-filter: blur(10px);
}

.main-content {
  background: #f5f5f5;
}

.v-theme--dark .main-content {
  background: #121212;
}
</style> 