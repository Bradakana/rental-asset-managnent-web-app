<template>
  <v-app>
    <Navbar />
    <v-main>
      <NuxtPage />
    </v-main>
    <ActionButton />
  </v-app>
</template>

<script setup>
import Navbar from '~/components/navbar.vue'
</script>