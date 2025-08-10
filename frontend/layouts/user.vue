<template>
  <v-app>
    <!-- User Navigation Component -->
    <NavbarUser />

    <!-- Main Content -->
    <v-main class="user-main-content">
      <slot />
    </v-main>
    
    <!-- Footer -->
    <v-footer class="user-footer bg-grey-lighten-1">
      <v-container>
        <v-row>
          <v-col cols="12" class="text-center">
            <p class="mb-0">&copy; 2024 Cars & Real Estate Rental. Бүх эрх хуулиар хамгаалагдсан.</p>
          </v-col>
        </v-row>
      </v-container>
    </v-footer>
  </v-app>
</template>

<script setup>
// User layout - navbar-user компонент ашиглана
</script>

<style scoped>
.user-main-content {
  background: #f8f9fa;
  min-height: calc(100vh - 64px - 60px); /* minus navbar and footer */
  padding-top: 0; /* navbar компонент дээд талд байгаа учир */
  overflow: visible; /* Dropdown filter-ууд харагдахын тулд */
}

.user-footer {
  background: #ffffff !important;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
}
</style>