import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null,
    isAuthenticated: false,
    vendorId: null,
    loading: false
  }),

  getters: {
    getUser: (state) => state.user,
    getToken: (state) => state.token,
    isLoggedIn: (state) => state.isAuthenticated,
    getVendorId: (state) => state.vendorId
  },

  actions: {
    async login(credentials) {
      this.loading = true
      try {
        const response = await fetch('http://localhost:3001/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(credentials)
        })
        const data = await response.json()
        if (!response.ok) throw new Error(data.error || 'Login failed')
        this.user = data.user
        this.token = data.token
        this.isAuthenticated = true
        if (process.client) {
          localStorage.setItem('token', data.token)
          localStorage.setItem('user', JSON.stringify(data.user))
        }
        return { success: true }
      } catch (error) {
        return { success: false, error: error.message }
      } finally {
        this.loading = false
      }
    },

    async register(userData) {
      this.loading = true
      try {
        const response = await fetch('http://localhost:3001/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userData)
        })
        const data = await response.json()
        if (!response.ok) throw new Error(data.error || 'Registration failed')
        this.user = data.user
        this.token = data.token
        this.isAuthenticated = true
        if (process.client) {
          localStorage.setItem('token', data.token)
          localStorage.setItem('user', JSON.stringify(data.user))
        }
        return { success: true }
      } catch (error) {
        return { success: false, error: error.message }
      } finally {
        this.loading = false
      }
    },

    async logout() {
      this.user = null
      this.token = null
      this.vendorId = null
      this.isAuthenticated = false
      
      if (process.client) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }
    },

    async checkAuth() {
      if (process.client) {
        const token = localStorage.getItem('token')
        const user = localStorage.getItem('user')
        
        if (token && user) {
          try {
            this.token = token
            this.user = JSON.parse(user)
            this.vendorId = this.user.vendorId
            this.isAuthenticated = true
            
            // TODO: Verify token with server
            // For now, just assume it's valid
          } catch (error) {
            // Token is invalid, clear everything
            await this.logout()
          }
        }
      }
    },

    async createVendor(vendorData) {
      try {
        // TODO: Replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        return { success: true, vendor: vendorData }
      } catch (error) {
        console.error('Create vendor error:', error)
        return { success: false, error: error.message }
      }
    },

    async getVendors() {
      try {
        // TODO: Replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        return { success: true, vendors: [] }
      } catch (error) {
        console.error('Get vendors error:', error)
        return { success: false, error: error.message }
      }
    }
  }
}) 