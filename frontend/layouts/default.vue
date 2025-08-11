<template>
  <v-app>
    <!-- Navigation Drawer -->
    <v-navigation-drawer
      v-model="drawer"
      :rail="rail"
      permanent
      @click="rail = false"
      class="sidebar"
    >
      <v-list-item
        prepend-avatar="https://randomuser.me/api/portraits/men/85.jpg"
        :title="user?.name || 'User'"
        :subtitle="user?.email || 'user@example.com'"
        nav
      >
        <template v-slot:append>
          <v-btn
            variant="text"
            icon="mdi-chevron-left"
            @click.stop="rail = !rail"
          ></v-btn>
        </template>
      </v-list-item>

      <v-divider></v-divider>

      <v-list density="compact" nav>
        <v-list-item
          prepend-icon="mdi-view-dashboard"
          title="Dashboard"
          value="dashboard"
          to="/dashboard"
        ></v-list-item>
        
        <v-list-item
          prepend-icon="mdi-car"
          title="Cars"
          value="cars"
          to="/cars-admin"
        ></v-list-item>
        
        <v-list-item
          prepend-icon="mdi-home"
          title="Real Estate"
          value="estates"
          to="/estates-admin"
        ></v-list-item>
        
        <v-list-item
          prepend-icon="mdi-account-group"
          title="Renters"
          value="renters"
          to="/renters"
        ></v-list-item>
        
        <v-list-item
          prepend-icon="mdi-file-document"
          title="Rentals"
          value="rentals"
          to="/rentals"
        ></v-list-item>
        
        <v-list-item
          prepend-icon="mdi-bell-ring"
          title="Subscriptions"
          value="subscriptions"
          to="/admin-subscriptions"
        ></v-list-item>
        
        <v-list-item
          prepend-icon="mdi-chart-line"
          title="Reports"
          value="reports"
          to="/reports"
        ></v-list-item>
        
        <v-list-item
          prepend-icon="mdi-cog"
          title="Settings"
          value="settings"
          to="/settings"
        ></v-list-item>

        <v-divider class="my-2"></v-divider>
        
        <v-list-item
          prepend-icon="mdi-web"
          title="View User Site"
          value="user-site"
          to="/pages-user"
          color="primary"
          variant="tonal"
        ></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- App Bar -->
    <v-app-bar
      elevation="1"
      class="app-bar"
    >
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      
      <v-toolbar-title class="font-weight-bold">
        Rental Asset Management
      </v-toolbar-title>
      
      <v-spacer></v-spacer>
      
      <!-- Language Selector -->
      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn
            icon
            v-bind="props"
            class="mr-2"
          >
            <v-icon>mdi-earth</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item @click="changeLanguage('en')">
            <v-list-item-title>English</v-list-item-title>
          </v-list-item>
          <v-list-item @click="changeLanguage('mn')">
            <v-list-item-title>Монгол</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      
      <!-- Theme Toggle -->
      <v-btn
        icon
        @click="toggleTheme"
        class="mr-2"
      >
        <v-icon>{{ isDark ? 'mdi-weather-sunny' : 'mdi-weather-night' }}</v-icon>
      </v-btn>
      
      <!-- User Menu -->
      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn
            icon
            v-bind="props"
          >
            <v-icon>mdi-account-circle</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item @click="goToProfile">
            <v-list-item-title>Profile</v-list-item-title>
          </v-list-item>
          <v-list-item @click="goToUserSite">
            <v-list-item-title>View User Site</v-list-item-title>
          </v-list-item>
          <v-list-item @click="logout">
            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <!-- Main Content -->
    <v-main class="main-content">
      <v-container fluid>
        <slot />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '~/stores/auth'

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

const goToUserSite = () => {
  navigateTo('/pages-user')
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