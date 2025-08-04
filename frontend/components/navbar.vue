<template>
  <v-app-bar app color="primary" dark elevation="4" height="80" class="px-2">
    <!-- Title -->
    <NuxtLink to="/home" class="text-white text-decoration-none">
      <div class="d-flex align-center" variant="text">
        <v-icon size="28" class="me-2">mdi-food</v-icon>
        <v-app-bar-title class="text-h6 font-weight-bold d-none d-sm-flex ml-4">
          Хоолны захиалга
        </v-app-bar-title>
      </div>
    </NuxtLink>

    <NuxtLink to="/about-us" class="text-white text-body-2 font-weight-bold text-decoration-none mx-5">
      Бидний тухай
    </NuxtLink>

    <v-spacer />

    <div class="d-flex align-center">
      <!-- Cart with Badge -->
      <v-badge
        v-if="userStore.user && uniqueCount > 0"
        :content="uniqueCount"
        color="white"
        overlap
        bordered
        location="end bottom"
        offset-x="6"
        offset-y="6"
        class="mx-1"
      >
        <v-btn v-if="userStore.user" @click="toCart" icon variant="text">
          <v-icon size="28">mdi-cart</v-icon>
          <v-tooltip activator="parent" location="bottom">
            Таны сагс ({{ uniqueCount }})
          </v-tooltip>
        </v-btn>
      </v-badge>

      <v-btn
        v-else
        v-if="userStore.user"
        @click="toCart"
        icon
        variant="text"
        class="mx-1"
      >
        <v-icon size="28">mdi-cart</v-icon>
        <v-tooltip activator="parent" location="bottom">Сагс</v-tooltip>
      </v-btn>

      <!-- Theme Toggle -->
      <v-btn
        v-if="userStore.user"
        @click="themeChange"
        icon
        class="mx-1"
        variant="text"
      >
        <v-icon size="28">
          {{ isDarkTheme ? "mdi-weather-sunny" : "mdi-weather-night" }}
        </v-icon>
        <v-tooltip activator="parent" location="bottom">
          {{ isDarkTheme ? "Гэрэлтэй" : "Харанхуй" }}
        </v-tooltip>
      </v-btn>

      <!-- Profile -->
      <v-badge
        v-if="userStore.user?.isVip"
        overlap
        bordered
        offset-x="12"
        offset-y="12"
        class="mx-1"
      >
        <template #badge>
          <v-icon color="orange" size="16">mdi-crown</v-icon>
        </template>

        <v-btn v-if="userStore.user" icon to="/profile" variant="text">
          <v-icon size="28">mdi-account</v-icon>
          <v-tooltip activator="parent" location="bottom">
            Профайл (VIP)
          </v-tooltip>
        </v-btn>
      </v-badge>

      <v-btn
        v-else
        v-if="userStore.user"
        icon
        to="/profile"
        class="mx-1"
        variant="text"
      >
        <v-icon size="28">mdi-account</v-icon>
        <v-tooltip activator="parent" location="bottom">Профайл</v-tooltip>
      </v-btn>

      <!-- Admin -->
      <v-btn
        v-if="isAdmin"
        icon
        to="/admin"
        class="mx-1"
        variant="text"
        color="warning"
      >
        <v-icon size="28">mdi-shield-crown</v-icon>
        <v-tooltip activator="parent" location="bottom">
          Админ самбар
        </v-tooltip>
      </v-btn>
    </div>
  </v-app-bar>
</template>

<script setup>

</script>