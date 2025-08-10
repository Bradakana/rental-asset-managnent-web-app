<template>
  <div>
    <v-container class="fill-height">
      <v-row justify="center" align="center">
        <v-col cols="12" class="text-center">
          <v-progress-circular
            indeterminate
            color="primary"
            size="64"
          ></v-progress-circular>
          <p class="mt-4">Loading Rental Asset Management...</p>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup>
// Redirect to pages-user/index page as the main landing page
await navigateTo('/pages-user');
</script> 