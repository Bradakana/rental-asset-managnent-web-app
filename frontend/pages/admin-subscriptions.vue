<template>
  <div>
    <!-- Page Header -->
    <v-row class="mb-6">
      <v-col>
        <h1 class="text-h4 font-weight-bold">Subscription Management</h1>
        <p class="text-subtitle-1 text-medium-emphasis">Manage customer subscriptions and convert to rentals</p>
      </v-col>
    </v-row>

    <!-- Filters and Actions -->
    <v-row class="mb-4">
      <v-col cols="12" md="8">
        <v-row>
          <v-col cols="12" sm="4">
            <v-select
              v-model="filters.status"
              :items="statusOptions"
              label="Status"
              variant="outlined"
              density="compact"
              @update:model-value="fetchSubscriptions"
            />
          </v-col>
          <v-col cols="12" sm="4">
            <v-select
              v-model="filters.assetType"
              :items="assetTypeOptions"
              label="Asset Type"
              variant="outlined"
              density="compact"
              @update:model-value="fetchSubscriptions"
            />
          </v-col>
          <v-col cols="12" sm="4">
            <v-text-field
              v-model="filters.search"
              label="Search customer..."
              variant="outlined"
              density="compact"
              prepend-inner-icon="mdi-magnify"
              @update:model-value="debouncedSearch"
            />
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12" md="4" class="text-right">
        <v-btn
          color="primary"
          prepend-icon="mdi-refresh"
          @click="fetchSubscriptions"
        >
          Refresh
        </v-btn>
      </v-col>
    </v-row>

    <!-- Statistics Cards -->
    <v-row class="mb-6">
      <v-col cols="12" sm="6" md="3">
        <v-card elevation="2">
          <v-card-text class="text-center">
            <v-icon size="48" color="primary" class="mb-2">mdi-bell</v-icon>
            <div class="text-h4 font-weight-bold">{{ stats.totalSubscriptions }}</div>
            <div class="text-subtitle-2 text-medium-emphasis">Total Subscriptions</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card elevation="2">
          <v-card-text class="text-center">
            <v-icon size="48" color="success" class="mb-2">mdi-check-circle</v-icon>
            <div class="text-h4 font-weight-bold">{{ stats.activeSubscriptions }}</div>
            <div class="text-subtitle-2 text-medium-emphasis">Active</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card elevation="2">
          <v-card-text class="text-center">
            <v-icon size="48" color="warning" class="mb-2">mdi-trending-up</v-icon>
            <div class="text-h4 font-weight-bold">{{ stats.newSubscriptions }}</div>
            <div class="text-subtitle-2 text-medium-emphasis">New This Month</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card elevation="2">
          <v-card-text class="text-center">
            <v-icon size="48" color="info" class="mb-2">mdi-swap-horizontal</v-icon>
            <div class="text-h4 font-weight-bold">{{ stats.conversions }}</div>
            <div class="text-subtitle-2 text-medium-emphasis">Converted to Rentals</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Subscriptions Table -->
    <v-card elevation="2">
      <v-card-title class="d-flex align-center">
        <v-icon class="mr-2">mdi-format-list-bulleted</v-icon>
        Customer Subscriptions
      </v-card-title>
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="subscriptions"
          :loading="loading"
          item-value="_id"
        >
          <!-- Customer Column -->
          <template v-slot:item.customer="{ item }">
            <div class="d-flex align-center">
              <v-avatar size="32" class="mr-3" color="primary">
                <span class="text-white">{{ getInitials(item.userId) }}</span>
              </v-avatar>
              <div>
                <div class="font-weight-medium">{{ item.userId?.firstName }} {{ item.userId?.lastName }}</div>
                <div class="text-caption text-medium-emphasis">{{ item.userId?.email }}</div>
              </div>
            </div>
          </template>

          <!-- Asset Column -->
          <template v-slot:item.asset="{ item }">
            <div class="d-flex align-center">
              <v-avatar size="40" class="mr-3" variant="tonal" :color="getAssetTypeColor(item.assetType)">
                <v-icon>{{ getAssetTypeIcon(item.assetType) }}</v-icon>
              </v-avatar>
              <div>
                <div class="font-weight-medium">{{ item.asset?.name || 'Unknown Asset' }}</div>
                <div class="text-caption text-medium-emphasis">{{ item.asset?.location }}</div>
              </div>
            </div>
          </template>

          <!-- Status Column -->
          <template v-slot:item.status="{ item }">
            <v-chip 
              :color="getStatusColor(item.status)" 
              size="small"
              variant="tonal"
            >
              {{ item.status }}
            </v-chip>
          </template>

          <!-- Date Column -->
          <template v-slot:item.subscribedAt="{ item }">
            <div>
              <div>{{ formatDate(item.subscribedAt) }}</div>
              <div class="text-caption text-medium-emphasis">{{ formatTimeAgo(item.subscribedAt) }}</div>
            </div>
          </template>

          <!-- Actions Column -->
          <template v-slot:item.actions="{ item }">
            <v-menu>
              <template v-slot:activator="{ props }">
                <v-btn
                  icon="mdi-dots-vertical"
                  variant="text"
                  size="small"
                  v-bind="props"
                />
              </template>
              <v-list>
                <v-list-item
                  v-if="item.status === 'active'"
                  @click="openConvertDialog(item)"
                  prepend-icon="mdi-swap-horizontal"
                >
                  Convert to Rental
                </v-list-item>
                <v-list-item
                  @click="viewDetails(item)"
                  prepend-icon="mdi-eye"
                >
                  View Details
                </v-list-item>
                <v-list-item
                  @click="sendMessage(item)"
                  prepend-icon="mdi-message"
                >
                  Contact Customer
                </v-list-item>
              </v-list>
            </v-menu>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <!-- Convert to Rental Dialog -->
    <v-dialog v-model="convertDialog" max-width="600px">
      <v-card>
        <v-card-title class="d-flex align-center">
          <v-icon class="mr-2">mdi-swap-horizontal</v-icon>
          Convert Subscription to Rental
        </v-card-title>
        <v-card-text>
          <v-form v-model="convertForm.valid" @submit.prevent="convertToRental">
            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="convertForm.startDate"
                  label="Start Date"
                  type="date"
                  variant="outlined"
                  :rules="[v => !!v || 'Start date is required']"
                  required
                />
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="convertForm.endDate"
                  label="End Date"
                  type="date"
                  variant="outlined"
                  :rules="[v => !!v || 'End date is required']"
                  required
                />
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="convertForm.dailyRate"
                  label="Daily Rate (€)"
                  type="number"
                  variant="outlined"
                  :rules="[v => !!v || 'Daily rate is required', v => v > 0 || 'Must be greater than 0']"
                  required
                />
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="convertForm.deposit"
                  label="Deposit (€)"
                  type="number"
                  variant="outlined"
                />
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="convertForm.notes"
                  label="Notes"
                  variant="outlined"
                  rows="3"
                />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="convertDialog = false">Cancel</v-btn>
          <v-btn 
            color="primary" 
            @click="convertToRental"
            :loading="converting"
            :disabled="!convertForm.valid"
          >
            Convert to Rental
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Details Dialog -->
    <v-dialog v-model="detailsDialog" max-width="800px">
      <v-card v-if="selectedSubscription">
        <v-card-title class="d-flex align-center">
          <v-icon class="mr-2">mdi-information</v-icon>
          Subscription Details
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="6">
              <h3 class="mb-3">Customer Information</h3>
              <v-list>
                <v-list-item>
                  <v-list-item-title>Name</v-list-item-title>
                  <v-list-item-subtitle>{{ selectedSubscription.userId?.firstName }} {{ selectedSubscription.userId?.lastName }}</v-list-item-subtitle>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title>Email</v-list-item-title>
                  <v-list-item-subtitle>{{ selectedSubscription.userId?.email }}</v-list-item-subtitle>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title>Phone</v-list-item-title>
                  <v-list-item-subtitle>{{ selectedSubscription.userId?.phone || 'Not provided' }}</v-list-item-subtitle>
                </v-list-item>
              </v-list>
            </v-col>
            <v-col cols="12" md="6">
              <h3 class="mb-3">Asset Information</h3>
              <v-list>
                <v-list-item>
                  <v-list-item-title>Asset</v-list-item-title>
                  <v-list-item-subtitle>{{ selectedSubscription.asset?.name }}</v-list-item-subtitle>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title>Type</v-list-item-title>
                  <v-list-item-subtitle>{{ selectedSubscription.assetType }}</v-list-item-subtitle>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title>Location</v-list-item-title>
                  <v-list-item-subtitle>{{ selectedSubscription.asset?.location }}</v-list-item-subtitle>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title>Price</v-list-item-title>
                  <v-list-item-subtitle>€{{ selectedSubscription.asset?.price }}</v-list-item-subtitle>
                </v-list-item>
              </v-list>
            </v-col>
          </v-row>
          
          <v-divider class="my-4" />
          
          <h3 class="mb-3">Subscription Details</h3>
          <v-row>
            <v-col cols="12" sm="6">
              <v-list>
                <v-list-item>
                  <v-list-item-title>Status</v-list-item-title>
                  <v-list-item-subtitle>
                    <v-chip :color="getStatusColor(selectedSubscription.status)" size="small">
                      {{ selectedSubscription.status }}
                    </v-chip>
                  </v-list-item-subtitle>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title>Subscribed</v-list-item-title>
                  <v-list-item-subtitle>{{ formatDate(selectedSubscription.subscribedAt) }}</v-list-item-subtitle>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title>Expires</v-list-item-title>
                  <v-list-item-subtitle>{{ formatDate(selectedSubscription.expiresAt) }}</v-list-item-subtitle>
                </v-list-item>
              </v-list>
            </v-col>
            <v-col cols="12" sm="6">
              <h4 class="mb-2">Notification Preferences</h4>
              <v-list>
                <v-list-item>
                  <template v-slot:prepend>
                    <v-icon :color="selectedSubscription.preferences?.emailNotifications ? 'success' : 'grey'">
                      {{ selectedSubscription.preferences?.emailNotifications ? 'mdi-check' : 'mdi-close' }}
                    </v-icon>
                  </template>
                  <v-list-item-title>Email Notifications</v-list-item-title>
                </v-list-item>
                <v-list-item>
                  <template v-slot:prepend>
                    <v-icon :color="selectedSubscription.preferences?.priceAlerts ? 'success' : 'grey'">
                      {{ selectedSubscription.preferences?.priceAlerts ? 'mdi-check' : 'mdi-close' }}
                    </v-icon>
                  </template>
                  <v-list-item-title>Price Alerts</v-list-item-title>
                </v-list-item>
                <v-list-item>
                  <template v-slot:prepend>
                    <v-icon :color="selectedSubscription.preferences?.availabilityAlerts ? 'success' : 'grey'">
                      {{ selectedSubscription.preferences?.availabilityAlerts ? 'mdi-check' : 'mdi-close' }}
                    </v-icon>
                  </template>
                  <v-list-item-title>Availability Alerts</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="detailsDialog = false">Close</v-btn>
          <v-btn 
            color="primary" 
            @click="openConvertDialog(selectedSubscription)"
            v-if="selectedSubscription.status === 'active'"
          >
            Convert to Rental
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Success Snackbar -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color">
      {{ snackbar.message }}
      <template v-slot:actions>
        <v-btn variant="text" @click="snackbar.show = false">Close</v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '~/stores/auth'

// Admin layout ашиглах
definePageMeta({
  layout: 'default'
})

const authStore = useAuthStore()
const { $socket } = useNuxtApp()

// Reactive state
const loading = ref(false)
const converting = ref(false)
const subscriptions = ref([])
const convertDialog = ref(false)
const detailsDialog = ref(false)
const selectedSubscription = ref(null)

const stats = reactive({
  totalSubscriptions: 0,
  activeSubscriptions: 0,
  newSubscriptions: 0,
  conversions: 0
})

const filters = reactive({
  status: '',
  assetType: '',
  search: ''
})

const convertForm = reactive({
  valid: false,
  startDate: '',
  endDate: '',
  dailyRate: '',
  deposit: 0,
  notes: ''
})

const snackbar = reactive({
  show: false,
  message: '',
  color: 'success'
})

// Options for filters
const statusOptions = [
  { title: 'All Status', value: '' },
  { title: 'Active', value: 'active' },
  { title: 'Cancelled', value: 'cancelled' },
  { title: 'Expired', value: 'expired' },
  { title: 'Completed', value: 'completed' }
]

const assetTypeOptions = [
  { title: 'All Types', value: '' },
  { title: 'Cars', value: 'car' },
  { title: 'Properties', value: 'estate' },
  { title: 'Assets', value: 'asset' }
]

// Table headers
const headers = [
  { title: 'Customer', value: 'customer', sortable: false },
  { title: 'Asset', value: 'asset', sortable: false },
  { title: 'Type', value: 'assetType' },
  { title: 'Status', value: 'status' },
  { title: 'Subscribed', value: 'subscribedAt' },
  { title: 'Actions', value: 'actions', sortable: false, width: 100 }
]

// Computed
const debouncedSearch = computed(() => {
  let timeout
  return () => {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      fetchSubscriptions()
    }, 500)
  }
})

// Methods
const fetchSubscriptions = async () => {
  try {
    loading.value = true
    
    const params = new URLSearchParams()
    if (filters.status) params.append('status', filters.status)
    if (filters.assetType) params.append('assetType', filters.assetType)
    if (filters.search) params.append('search', filters.search)
    
    const response = await fetch(`http://localhost:3001/api/subscriptions/vendor-subscriptions?${params}`, {
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    })
    
    if (response.ok) {
      const data = await response.json()
      subscriptions.value = data.data
    }
  } catch (error) {
    console.error('Error fetching subscriptions:', error)
    showSnackbar('Failed to load subscriptions', 'error')
  } finally {
    loading.value = false
  }
}

const fetchStats = async () => {
  try {
    const response = await fetch('http://localhost:3001/api/subscriptions/analytics', {
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    })
    
    if (response.ok) {
      const data = await response.json()
      Object.assign(stats, data.data.overview)
    }
  } catch (error) {
    console.error('Error fetching stats:', error)
  }
}

const openConvertDialog = (subscription) => {
  selectedSubscription.value = subscription
  convertForm.startDate = new Date().toISOString().split('T')[0]
  convertForm.endDate = ''
  convertForm.dailyRate = subscription.asset?.price || ''
  convertForm.deposit = 0
  convertForm.notes = ''
  convertDialog.value = true
  detailsDialog.value = false
}

const convertToRental = async () => {
  if (!convertForm.valid) return
  
  try {
    converting.value = true
    
    const response = await fetch(`http://localhost:3001/api/subscriptions/${selectedSubscription.value._id}/convert-to-rental`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore.token}`
      },
      body: JSON.stringify(convertForm)
    })
    
    if (response.ok) {
      const data = await response.json()
      showSnackbar('Subscription converted to rental successfully!', 'success')
      convertDialog.value = false
      await fetchSubscriptions()
      await fetchStats()
    } else {
      const error = await response.json()
      showSnackbar(error.error || 'Failed to convert subscription', 'error')
    }
  } catch (error) {
    console.error('Error converting subscription:', error)
    showSnackbar('Network error occurred', 'error')
  } finally {
    converting.value = false
  }
}

const viewDetails = async (subscription) => {
  try {
    const response = await fetch(`http://localhost:3001/api/subscriptions/${subscription._id}/details`, {
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    })
    
    if (response.ok) {
      const data = await response.json()
      selectedSubscription.value = data.data
      detailsDialog.value = true
    }
  } catch (error) {
    console.error('Error fetching subscription details:', error)
    showSnackbar('Failed to load details', 'error')
  }
}

const sendMessage = (subscription) => {
  // TODO: Implement messaging functionality
  showSnackbar('Messaging feature coming soon!', 'info')
}

const getInitials = (user) => {
  if (!user) return '?'
  return `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase()
}

const getAssetTypeIcon = (type) => {
  switch (type) {
    case 'car': return 'mdi-car'
    case 'estate': return 'mdi-home'
    default: return 'mdi-package'
  }
}

const getAssetTypeColor = (type) => {
  switch (type) {
    case 'car': return 'blue'
    case 'estate': return 'green'
    default: return 'orange'
  }
}

const getStatusColor = (status) => {
  switch (status) {
    case 'active': return 'success'
    case 'cancelled': return 'error'
    case 'expired': return 'warning'
    case 'completed': return 'info'
    default: return 'grey'
  }
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString()
}

const formatTimeAgo = (dateString) => {
  const now = new Date()
  const date = new Date(dateString)
  const diffInMs = now - date
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))
  
  if (diffInDays === 0) return 'Today'
  if (diffInDays === 1) return 'Yesterday'
  if (diffInDays < 7) return `${diffInDays} days ago`
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`
  return `${Math.floor(diffInDays / 30)} months ago`
}

const showSnackbar = (message, color = 'success') => {
  snackbar.message = message
  snackbar.color = color
  snackbar.show = true
}

// Lifecycle
// Real-time subscription updates
const handleSubscriptionUpdate = (updateData) => {
  console.log('📋 Real-time subscription update received:', updateData)
  
  if (updateData.type === 'subscription_created') {
    // Add new subscription to the list
    if (updateData.data.subscription) {
      subscriptions.value.unshift(updateData.data.subscription)
      
      // Update stats
      if (updateData.data.stats) {
        Object.assign(stats, updateData.data.stats)
      }
      
      // Show success snackbar
      showSnackbar(`New subscription from ${updateData.data.subscription.user.firstName} ${updateData.data.subscription.user.lastName}`, 'success')
    }
  }
}

onMounted(async () => {
  await authStore.checkAuth()
  
  if (!authStore.isLoggedIn) {
    navigateTo('/auth')
    return
  }
  
  if (!authStore.canAccessAdminPages) {
    navigateTo('/pages-user')
    return
  }

  await Promise.all([fetchSubscriptions(), fetchStats()])
  
  // Setup real-time connection for admin subscriptions
  if ($socket && authStore.user?.vendorId) {
    console.log('🔌 Setting up real-time subscriptions for vendor:', authStore.user.vendorId)
    $socket.connect()
    $socket.joinVendorRoom(authStore.user.vendorId)
    $socket.onDashboardUpdate(handleSubscriptionUpdate)
    
    console.log('✅ Real-time subscriptions connected for vendor:', authStore.user.vendorId)
  } else {
    console.warn('⚠️ Cannot setup real-time subscriptions:', {
      hasSocket: !!$socket,
      vendorId: authStore.user?.vendorId,
      user: authStore.user
    })
  }
})

onUnmounted(() => {
  // Cleanup real-time connection
  if ($socket && authStore.user?.vendorId) {
    $socket.offDashboardUpdate(handleSubscriptionUpdate)
    $socket.leaveVendorRoom(authStore.user.vendorId)
    console.log('🔌 Subscriptions real-time connection cleaned up')
  }
})
</script>

<style scoped>
.v-card {
  transition: transform 0.2s;
}

.v-card:hover {
  transform: translateY(-2px);
}
</style>
