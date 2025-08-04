<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()

onMounted(async () => {
  await authStore.checkAuth()
})
</script>

<style scoped>
.home-page {
  max-width: 600px; 
  margin: 2rem auto;
  padding: 2rem;
  background: #f9f9f9;
  border-radius: 8px;
}
header h1 {
  margin-bottom: 0.5rem;
}
nav ul {
  list-style: none;
  padding: 0;
  display: flex;
  gap: 1rem;
}
nav a {
  text-decoration: none;
  color: #0078d4;
  font-weight: bold;
}
section h2 {
  margin-top: 2rem;
}
</style>