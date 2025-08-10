export default defineNuxtPlugin(() => {
  const authStore = useAuthStore()

  // Check auth on app mount
  authStore.checkAuth()
})