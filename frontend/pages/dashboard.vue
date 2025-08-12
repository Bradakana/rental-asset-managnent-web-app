<template>
  <div>
    <!-- Page Header -->
    <v-row class="mb-6">
      <v-col>
        <h1 class="text-h4 font-weight-bold">{{ $t('dashboard.title') }}</h1>
        <p class="text-subtitle-1 text-medium-emphasis">{{ $t('dashboard.welcome') }}, {{ user?.firstName || 'User' }}!</p>
      </v-col>
    </v-row>

    <!-- Statistics Cards -->
    <v-row class="mb-6">
      <v-col cols="12" sm="6" md="3">
        <v-card class="stat-card" elevation="2">
          <v-card-text class="text-center">
            <v-icon size="48" color="primary" class="mb-2">mdi-car</v-icon>
            <div class="text-h4 font-weight-bold">{{ stats.totalAssets }}</div>
            <div class="text-subtitle-2 text-medium-emphasis">{{ $t('dashboard.statistics.totalAssets') }}</div>
          </v-card-text>
        </v-card>
      </v-col>
      
      <v-col cols="12" sm="6" md="3">
        <v-card class="stat-card" elevation="2">
          <v-card-text class="text-center">
            <v-icon size="48" color="success" class="mb-2">mdi-check-circle</v-icon>
            <div class="text-h4 font-weight-bold">{{ stats.availableAssets }}</div>
            <div class="text-subtitle-2 text-medium-emphasis">Available</div>
          </v-card-text>
        </v-card>
      </v-col>
      
      <v-col cols="12" sm="6" md="3">
        <v-card class="stat-card" elevation="2">
          <v-card-text class="text-center">
            <v-icon size="48" color="warning" class="mb-2">mdi-clock</v-icon>
            <div class="text-h4 font-weight-bold">{{ stats.rentedAssets }}</div>
            <div class="text-subtitle-2 text-medium-emphasis">{{ $t('dashboard.statistics.totalRentals') }}</div>
          </v-card-text>
        </v-card>
      </v-col>
      
      <v-col cols="12" sm="6" md="3">
        <v-card class="stat-card" elevation="2">
          <v-card-text class="text-center">
            <v-icon size="48" color="info" class="mb-2">mdi-bell</v-icon>
            <div class="text-h4 font-weight-bold">{{ stats.totalSubscriptions }}</div>
            <div class="text-subtitle-2 text-medium-emphasis">{{ $t('dashboard.statistics.totalSubscriptions') }}</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Charts and Analytics -->
    <v-row class="mb-6">
      <v-col cols="12" lg="8">
        <v-card elevation="2">
          <v-card-title class="d-flex align-center">
            <v-icon class="mr-2">mdi-chart-line</v-icon>
            Revenue Overview
          </v-card-title>
          <v-card-text>
            <div class="chart-placeholder">
              <v-icon size="64" color="grey-lighten-1">mdi-chart-line</v-icon>
              <p class="text-medium-emphasis mt-2">Revenue chart will be displayed here</p>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      
      <v-col cols="12" lg="4">
        <v-card elevation="2">
          <v-card-title class="d-flex align-center">
            <v-icon class="mr-2">mdi-pie-chart</v-icon>
            Asset Distribution
          </v-card-title>
          <v-card-text>
            <div class="chart-placeholder">
              <v-icon size="64" color="grey-lighten-1">mdi-pie-chart</v-icon>
              <p class="text-medium-emphasis mt-2">Asset distribution chart will be displayed here</p>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Recent Rentals and Quick Actions -->
    <v-row>
      <v-col cols="12" lg="8">
        <v-card elevation="2">
          <v-card-title class="d-flex align-center justify-space-between">
            <div class="d-flex align-center">
              <v-icon class="mr-2">mdi-file-document</v-icon>
              Recent Rentals
            </div>
            <v-btn
              color="primary"
              variant="text"
              to="/rentals"
            >
              View All
            </v-btn>
          </v-card-title>
          <v-card-text>
            <v-table>
              <thead>
                <tr>
                  <th>Asset</th>
                  <th>Renter</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="rental in recentRentals" :key="rental.id">
                  <td>
                    <div class="d-flex align-center">
                      <v-icon class="mr-2" :color="rental.assetType === 'car' ? 'blue' : 'green'">
                        {{ rental.assetType === 'car' ? 'mdi-car' : 'mdi-home' }}
                      </v-icon>
                      {{ rental.assetName }}
                    </div>
                  </td>
                  <td>{{ rental.renterName }}</td>
                  <td>{{ formatDate(rental.startDate) }}</td>
                  <td>{{ formatDate(rental.endDate) }}</td>
                  <td>
                    <v-chip
                      :color="getStatusColor(rental.status)"
                      size="small"
                    >
                      {{ rental.status }}
                    </v-chip>
                  </td>
                  <td>
                    <v-btn
                      icon="mdi-eye"
                      size="small"
                      variant="text"
                      @click="viewRental(rental.id)"
                    />
                  </td>
                </tr>
              </tbody>
            </v-table>
          </v-card-text>
        </v-card>
      </v-col>
      
      <v-col cols="12" lg="4">
        <v-card elevation="2">
          <v-card-title class="d-flex align-center">
            <v-icon class="mr-2">mdi-lightning-bolt</v-icon>
            Quick Actions
          </v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item
                prepend-icon="mdi-plus"
                title="Add New Asset"
                @click="navigateTo('/assets/new')"
              />
              <v-list-item
                prepend-icon="mdi-account-plus"
                title="Add New Renter"
                @click="navigateTo('/renters/new')"
              />
              <v-list-item
                prepend-icon="mdi-file-plus"
                title="Create Rental"
                @click="navigateTo('/rentals/new')"
              />
              <v-list-item
                prepend-icon="mdi-download"
                title="Export Report"
                @click="exportReport"
              />
            </v-list>
          </v-card-text>
        </v-card>
        
        <!-- Subscription Notifications -->
        <v-card class="mt-4" elevation="2">
          <v-card-title class="d-flex align-center justify-space-between">
            <div class="d-flex align-center">
              <v-icon class="mr-2" color="primary">mdi-bell</v-icon>
              Subscription Notifications
              <v-chip 
                v-if="notifications.length > 0" 
                class="ml-2" 
                color="primary" 
                size="small"
              >
                {{ unreadNotifications }}
              </v-chip>
            </div>
            <v-btn
              variant="text"
              size="small"
              @click="markAllAsRead"
              v-if="unreadNotifications > 0"
            >
              Mark all read
            </v-btn>
          </v-card-title>
          <v-card-text>
            <v-list v-if="notifications.length > 0">
              <v-list-item
                v-for="notification in notifications.slice(0, 5)"
                :key="notification._id"
                :class="{ 'notification-unread': !notification.isRead }"
                @click="markAsRead(notification._id)"
              >
                <template v-slot:prepend>
                  <v-icon :color="getNotificationIcon(notification.type).color">
                    {{ getNotificationIcon(notification.type).icon }}
                  </v-icon>
                </template>
                <v-list-item-title>{{ notification.title }}</v-list-item-title>
                <v-list-item-subtitle>
                  {{ notification.message }}
                  <div class="text-caption mt-1">
                    {{ formatDate(notification.createdAt) }}
                  </div>
                </v-list-item-subtitle>
                <template v-slot:append>
                  <v-chip 
                    v-if="!notification.isRead" 
                    color="primary" 
                    size="x-small"
                  >
                    New
                  </v-chip>
                </template>
              </v-list-item>
            </v-list>
            <div v-else class="text-center text-medium-emphasis py-4">
              No notifications yet
            </div>
          </v-card-text>
        </v-card>
        
        <!-- Alerts -->
        <v-card class="mt-4" elevation="2" color="warning-lighten-5">
          <v-card-title class="d-flex align-center">
            <v-icon class="mr-2" color="warning">mdi-alert</v-icon>
            System Alerts
          </v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item
                v-for="alert in alerts"
                :key="alert.id"
                :prepend-icon="alert.icon"
                :title="alert.title"
                :subtitle="alert.message"
                :color="alert.color"
              />
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '~/stores/auth'

// Admin layout ашиглах
definePageMeta({
  layout: 'default'
})

const authStore = useAuthStore()
const user = computed(() => authStore.user)
const { $socket } = useNuxtApp()

// Real-time dashboard statistics
const stats = reactive({
  totalAssets: 24,
  availableAssets: 18,
  rentedAssets: 6,
  totalSubscriptions: 0,
  totalRenters: 0,
  activeRenters: 0,
  totalRentals: 0,
  activeRentals: 0
})

// Real-time subscription updates
const recentSubscriptions = ref([])
const showSubscriptionAlert = ref(false)
const newSubscriptionData = ref(null)

const notifications = ref([])
const unreadNotifications = computed(() => 
  notifications.value.filter(n => !n.isRead).length
)

const recentRentals = ref([
  {
    id: 1,
    assetName: 'Toyota Camry 2023',
    assetType: 'car',
    renterName: 'John Doe',
    startDate: '2024-01-15',
    endDate: '2024-01-20',
    status: 'Active'
  },
  {
    id: 2,
    assetName: 'Downtown Apartment',
    assetType: 'real-estate',
    renterName: 'Jane Smith',
    startDate: '2024-01-10',
    endDate: '2024-02-10',
    status: 'Active'
  },
  {
    id: 3,
    assetName: 'Honda Civic 2022',
    assetType: 'car',
    renterName: 'Mike Johnson',
    startDate: '2024-01-12',
    endDate: '2024-01-15',
    status: 'Completed'
  }
])

const alerts = ref([
  {
    id: 1,
    icon: 'mdi-clock-alert',
    title: 'Overdue Return',
    message: 'Toyota Camry is overdue for return',
    color: 'error'
  },
  {
    id: 2,
    icon: 'mdi-file-document-alert',
    title: 'Document Expiry',
    message: '3 renter documents expire this week',
    color: 'warning'
  }
])

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString()
}

const getStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case 'active':
      return 'success'
    case 'completed':
      return 'info'
    case 'overdue':
      return 'error'
    default:
      return 'grey'
  }
}

const viewRental = (id) => {
  navigateTo(`/rentals/${id}`)
}

const exportReport = () => {
  // TODO: Implement report export
  console.log('Exporting report...')
}

// Subscription notification functions
const fetchNotifications = async () => {
  try {
    if (!authStore.isLoggedIn || !authStore.token) return

    const response = await fetch('http://localhost:3001/api/subscriptions/vendor-notifications', {
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    })

    if (response.ok) {
      const data = await response.json()
      notifications.value = data.data
    }
  } catch (error) {
    console.error('Error fetching notifications:', error)
  }
}

const fetchSubscriptionStats = async () => {
  try {
    if (!authStore.isLoggedIn || !authStore.token) return

    const response = await fetch('http://localhost:3001/api/subscriptions/analytics', {
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    })

    if (response.ok) {
      const data = await response.json()
      stats.totalSubscriptions = data.data.overview.activeSubscriptions
    }
  } catch (error) {
    console.error('Error fetching subscription stats:', error)
  }
}

const fetchRealRentals = async () => {
  try {
    if (!authStore.isLoggedIn || !authStore.token) return

    const response = await fetch('http://localhost:3001/api/rentals', {
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    })

    if (response.ok) {
      const data = await response.json()
      if (data.success && data.data && data.data.length > 0) {
        // Update recent rentals with real data
        recentRentals.value = data.data.slice(0, 5).map(rental => ({
          id: rental._id,
          assetName: rental.assetId?.name || rental.assetId?.model || rental.assetId?.title || 'Unknown Asset',
          assetType: rental.assetId?.type || 'asset',
          renterName: rental.renterId?.firstName ? `${rental.renterId.firstName} ${rental.renterId.lastName}` : 'Unknown Renter',
          startDate: rental.startDate,
          endDate: rental.endDate,
          status: rental.status
        }))

        // Update stats with real data
        const activeRentals = data.data.filter(r => r.status === 'active').length
        const completedRentals = data.data.filter(r => r.status === 'completed').length
        stats.rentedAssets = activeRentals
        stats.availableAssets = stats.totalAssets - activeRentals
      }
    }
  } catch (error) {
    console.error('Error fetching real rentals:', error)
  }
}

const markAsRead = async (notificationId) => {
  try {
    const response = await fetch(`http://localhost:3001/api/subscriptions/notifications/${notificationId}/read`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    })

    if (response.ok) {
      const notification = notifications.value.find(n => n._id === notificationId)
      if (notification) notification.isRead = true
    }
  } catch (error) {
    console.error('Error marking notification as read:', error)
  }
}

const markAllAsRead = async () => {
  const unreadIds = notifications.value.filter(n => !n.isRead).map(n => n._id)
  
  for (const id of unreadIds) {
    await markAsRead(id)
  }
}

const getNotificationIcon = (type) => {
  switch (type) {
    case 'subscription_created':
      return { icon: 'mdi-account-plus', color: 'success' }
    case 'subscription_cancelled':
      return { icon: 'mdi-account-minus', color: 'warning' }
    case 'asset_available':
      return { icon: 'mdi-check-circle', color: 'success' }
    case 'price_changed':
      return { icon: 'mdi-currency-usd', color: 'info' }
    default:
      return { icon: 'mdi-bell', color: 'primary' }
  }
}

// Real-time dashboard functions
const fetchDashboardStats = async () => {
  try {
    // Fetch actual statistics from API
    const response = await fetch('http://localhost:3001/api/vendors/stats', {
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    })
    
    if (response.ok) {
      const data = await response.json()
      Object.assign(stats, data.data)
    }
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
  }
}

const handleDashboardUpdate = (updateData) => {
  console.log('📊 Real-time dashboard update received:', updateData)
  
  if (updateData.type === 'subscription_created') {
    // Update statistics
    if (updateData.data.stats) {
      Object.assign(stats, updateData.data.stats)
    }
    
    // Add to recent subscriptions
    if (updateData.data.subscription) {
      recentSubscriptions.value.unshift(updateData.data.subscription)
      
      // Keep only last 10 subscriptions
      if (recentSubscriptions.value.length > 10) {
        recentSubscriptions.value = recentSubscriptions.value.slice(0, 10)
      }
      
      // Show notification alert
      newSubscriptionData.value = updateData.data.subscription
      showSubscriptionAlert.value = true
      
      // Add to notifications
      notifications.value.unshift({
        _id: Date.now().toString(),
        type: 'subscription_created',
        title: 'New Subscription',
        message: `${updateData.data.subscription.user.firstName} ${updateData.data.subscription.user.lastName} subscribed to ${updateData.data.subscription.asset.name}`,
        isRead: false,
        createdAt: new Date(),
        metadata: updateData.data.subscription
      })
      
      // Keep only last 20 notifications
      if (notifications.value.length > 20) {
        notifications.value = notifications.value.slice(0, 20)
      }
    }
  }
}

onMounted(async () => {
  // Load dashboard data
  await authStore.checkAuth()
  
  // Admin эрх шалгах
  if (!authStore.isLoggedIn) {
    navigateTo('/auth')
    return
  }
  
  if (!authStore.canAccessAdminPages) {
    navigateTo('/pages-user')
    return
  }

  // Load subscription data for vendors
  if (authStore.user?.vendorId) {
    await fetchNotifications()
    await fetchSubscriptionStats()
    await fetchRealRentals()
    await fetchDashboardStats()
    
    // Setup real-time connection
    if ($socket && authStore.user?.vendorId) {
      console.log('🔌 Setting up real-time connection for vendor:', authStore.user.vendorId)
      $socket.connect()
      $socket.joinVendorRoom(authStore.user.vendorId)
      $socket.onDashboardUpdate(handleDashboardUpdate)
      
      console.log('✅ Real-time dashboard connected for vendor:', authStore.user.vendorId)
    } else {
      console.warn('⚠️ Cannot setup real-time connection:', {
        hasSocket: !!$socket,
        vendorId: authStore.user?.vendorId,
        user: authStore.user
      })
    }
  }
})

onUnmounted(() => {
  // Cleanup real-time connection
  if ($socket && authStore.user?.vendorId) {
    $socket.offDashboardUpdate(handleDashboardUpdate)
    $socket.leaveVendorRoom(authStore.user.vendorId)
    console.log('🔌 Dashboard real-time connection cleaned up')
  }
})
</script>

<style scoped>
.stat-card {
  transition: transform 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
}

.chart-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  text-align: center;
}

.notification-unread {
  background-color: #e3f2fd;
  border-left: 4px solid #1976d2;
}
</style> 