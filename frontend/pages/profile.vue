<template>
  <v-container class="py-10">
    <v-row justify="center">
      <v-col cols="12" md="6">
        <v-card elevation="4" class="pa-6">
          <v-avatar size="80" class="mb-4">
            <v-icon size="80">mdi-account-circle</v-icon>
          </v-avatar>
          <h2 class="mb-2">{{ user?.firstName }} {{ user?.lastName }}</h2>
          <div class="mb-1"><strong>Email:</strong> {{ user?.email }}</div>
          <div class="mb-1"><strong>Username:</strong> {{ user?.username }}</div>
          <div class="mb-1"><strong>Role:</strong> {{ user?.role }}</div>
          <div class="mb-1"><strong>Vendor ID:</strong> {{ user?.vendorId }}</div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { useAuthStore } from '~/stores/auth'
const authStore = useAuthStore()
const user = authStore.user || JSON.parse(localStorage.getItem('user'))
</script>

<style scoped>
.v-avatar {
  margin: 0 auto;
}
.v-card {
  text-align: center;
}
</style>