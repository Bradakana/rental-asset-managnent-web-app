<template>
  <v-container fluid class="auth-bg">
    <v-row justify="center" align="center" class="fill-height">
      <v-col cols="12" md="10" lg="8">
        <v-card class="auth-card" elevation="8">
          <v-row>
            <!-- Left Info Section -->
            <v-col cols="12" md="5" class="info-section">
              <h2 class="font-weight-bold mb-4">Rental Asset Management</h2>
              <p class="mb-4">Manage your car and real estate rentals in one place</p>
              <div class="mb-4">
                <v-icon class="mr-2">mdi-car</v-icon>
                <span>Car Rentals</span>
              </div>
              <div class="mb-4">
                <v-icon class="mr-2">mdi-home</v-icon>
                <span>Real Estate Rentals</span>
              </div>
              <div class="mb-4">
                <v-icon class="mr-2">mdi-shield-check</v-icon>
                <span>Document Management</span>
              </div>
              <div class="mb-4">
                <v-icon class="mr-2">mdi-chart-line</v-icon>
                <span>Analytics & Reports</span>
              </div>
              <div class="mt-10 text-caption">
                Terms • Privacy • Docs • Help
                <v-icon class="mx-2">mdi-earth</v-icon> English
              </div>
            </v-col>
            
            <!-- Right Auth Section -->
            <v-col cols="12" md="7">
              <v-card class="pa-8" elevation="0" color="rgba(30,30,30,0.7)">
                <!-- Toggle between Login and Register -->
                <v-tabs v-model="activeTab" class="mb-6">
                  <v-tab value="login">Login</v-tab>
                  <v-tab value="register">Register</v-tab>
                </v-tabs>

                <!-- Login Form -->
                <v-form v-if="activeTab === 'login'" @submit.prevent="handleLogin" ref="loginFormRef">
                  <v-text-field
                    v-model="loginForm.email"
                    label="Email"
                    prepend-inner-icon="mdi-email-outline"
                    type="email"
                    :rules="emailRules"
                    required
                  />
                  <v-text-field
                    v-model="loginForm.password"
                    label="Password"
                    prepend-inner-icon="mdi-lock-outline"
                    :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    @click:append-inner="showPassword = !showPassword"
                    :type="showPassword ? 'text' : 'password'"
                    :rules="passwordRules"
                    required
                  />
                  <v-btn 
                    color="yellow" 
                    block 
                    class="mt-4 font-weight-bold"
                    type="submit"
                    :loading="authStore.loading"
                  >
                    Login
                  </v-btn>
                </v-form>

                <!-- Register Form -->
                <v-form v-if="activeTab === 'register'" @submit.prevent="handleRegister" ref="registerFormRef">
                  <v-row>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="registerForm.firstName"
                        label="First Name"
                        prepend-inner-icon="mdi-account"
                        :rules="nameRules"
                        required
                      />
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="registerForm.lastName"
                        label="Last Name"
                        prepend-inner-icon="mdi-account"
                        :rules="nameRules"
                        required
                      />
                    </v-col>
                  </v-row>
                  
                  <v-text-field
                    v-model="registerForm.username"
                    label="Username"
                    prepend-inner-icon="mdi-account-outline"
                    :rules="usernameRules"
                    required
                  />
                  
                  <v-text-field
                    v-model="registerForm.email"
                    label="Email"
                    prepend-inner-icon="mdi-email-outline"
                    type="email"
                    :rules="emailRules"
                    required
                  />
                  
                  <v-text-field
                    v-model="registerForm.password"
                    label="Password"
                    prepend-inner-icon="mdi-lock-outline"
                    :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    @click:append-inner="showPassword = !showPassword"
                    :type="showPassword ? 'text' : 'password'"
                    :rules="passwordRules"
                    hint="Minimum length is 8 characters."
                    persistent-hint
                    required
                  />
                  
                  <v-text-field
                    v-model="registerForm.confirmPassword"
                    label="Confirm Password"
                    prepend-inner-icon="mdi-lock-outline"
                    :append-inner-icon="showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    @click:append-inner="showConfirmPassword = !showConfirmPassword"
                    :type="showConfirmPassword ? 'text' : 'password'"
                    :rules="[...passwordRules, confirmPasswordRule]"
                    required
                  />
                  
                  <!-- Vendor Name -->
                  <v-text-field
                    v-model="registerForm.vendorName"
                    label="Vendor Name"
                    prepend-inner-icon="mdi-domain"
                    :rules="[v => !!v || 'Vendor name is required']"
                    required
                  />
                  <!-- Vendor Type -->
                  <v-select
                    v-model="registerForm.vendorType"
                    :items="['car', 'real-estate', 'both']"
                    label="Vendor Type"
                    prepend-inner-icon="mdi-format-list-bulleted"
                    :rules="[v => !!v || 'Vendor type is required']"
                    required
                  />
                  <v-btn 
                    color="yellow" 
                    block 
                    class="mt-4 font-weight-bold"
                    type="submit"
                    :loading="authStore.loading"
                  >
                    Sign Up
                  </v-btn>
                  
                  <div class="mt-2 text-caption">
                    By creating an account, you agree to the <a href="#">Terms of Service</a>.
                    We'll occasionally send you account-related emails.
                  </div>
                </v-form>

                <!-- Error/Success Messages -->
                <v-alert
                  v-if="message"
                  :type="messageType"
                  class="mt-4"
                  closable
                  @click:close="message = ''"
                >
                  {{ message }}
                </v-alert>
              </v-card>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
// Admin auth хуудас - нийтэд нээлттэй layout ашиглана
definePageMeta({
  layout: 'user'
})

import { ref, reactive } from 'vue'
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()
const activeTab = ref('login')
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const message = ref('')
const messageType = ref('error')

// Form refs
const loginFormRef = ref(null)
const registerFormRef = ref(null)

// Login form data
const loginForm = reactive({
  email: '',
  password: ''
})

// Register form data
const registerForm = reactive({
  firstName: '',
  lastName: '',
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  vendorName: '', // ШИНЭ
  vendorType: 'car' // ШИНЭ, default
})

// Validation rules
const emailRules = [
  v => !!v || 'Email is required',
  v => /.+@.+\..+/.test(v) || 'Email must be valid'
]

const passwordRules = [
  v => !!v || 'Password is required',
  v => v.length >= 8 || 'Password must be at least 8 characters'
]

const nameRules = [
  v => !!v || 'Name is required',
  v => v.length >= 2 || 'Name must be at least 2 characters'
]

const usernameRules = [
  v => !!v || 'Username is required',
  v => v.length >= 3 || 'Username must be at least 3 characters'
]

const confirmPasswordRule = (v) => {
  return v === registerForm.password || 'Passwords must match'
}

// Handle login
const handleLogin = async () => {
  const { valid } = await loginFormRef.value.validate()
  if (!valid) return

  const result = await authStore.login({
    email: loginForm.email,
    password: loginForm.password
  })

  if (result.success) {
    messageType.value = 'success'
    message.value = 'Login successful!'
    setTimeout(() => {
      navigateTo('/dashboard')
    }, 1000)
  } else {
    messageType.value = 'error'
    message.value = result.error || 'Login failed'
  }
}

// Handle register
const handleRegister = async () => {
  const { valid } = await registerFormRef.value.validate()
  if (!valid) return

  const result = await authStore.register({
    firstName: registerForm.firstName,
    lastName: registerForm.lastName,
    username: registerForm.username,
    email: registerForm.email,
    password: registerForm.password,
    vendorName: registerForm.vendorName, // ШИНЭ
    vendorType: registerForm.vendorType  // ШИНЭ
  })

  if (result.success) {
    messageType.value = 'success'
    message.value = 'Registration successful!'
    setTimeout(() => {
      navigateTo('/dashboard')
    }, 1000)
  } else {
    messageType.value = 'error'
    message.value = result.error || 'Registration failed'
  }
}
</script>

<style scoped>
.auth-bg {
  background: linear-gradient(135deg, #232323 0%, #222a2a 100%);
  min-height: 100vh;
}

.auth-card {
  border-radius: 24px;
  overflow: hidden;
  background: rgba(30,30,30,0.95);
}

.info-section {
  color: #fff;
  background: none;
  padding: 48px 32px;
}

a {
  text-decoration: underline;
  color: #ffd700;
}

.v-tabs {
  background: transparent;
}

.v-tab {
  color: #fff;
}

.v-tab--selected {
  color: #ffd700;
}
</style>