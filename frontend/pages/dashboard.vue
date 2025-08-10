<template>
  <div>
    <!-- Page Header -->
    <v-row class="mb-6">
      <v-col>
        <h1 class="text-h4 font-weight-bold">Dashboard</h1>
        <p class="text-subtitle-1 text-medium-emphasis">Welcome back, {{ user?.firstName || 'User' }}!</p>
      </v-col>
    </v-row>

    <!-- Statistics Cards -->
    <v-row class="mb-6">
      <v-col cols="12" sm="6" md="3">
        <v-card class="stat-card" elevation="2">
          <v-card-text class="text-center">
            <v-icon size="48" color="primary" class="mb-2">mdi-car</v-icon>
            <div class="text-h4 font-weight-bold">{{ stats.totalAssets }}</div>
            <div class="text-subtitle-2 text-medium-emphasis">Total Assets</div>
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
            <div class="text-subtitle-2 text-medium-emphasis">Currently Rented</div>
          </v-card-text>
        </v-card>
      </v-col>
      
      <v-col cols="12" sm="6" md="3">
        <v-card class="stat-card" elevation="2">
          <v-card-text class="text-center">
            <v-icon size="48" color="info" class="mb-2">mdi-currency-usd</v-icon>
            <div class="text-h4 font-weight-bold">${{ stats.monthlyRevenue.toLocaleString() }}</div>
            <div class="text-subtitle-2 text-medium-emphasis">Monthly Revenue</div>
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
        
        <!-- Alerts -->
        <v-card class="mt-4" elevation="2" color="warning-lighten-5">
          <v-card-title class="d-flex align-center">
            <v-icon class="mr-2" color="warning">mdi-alert</v-icon>
            Alerts
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
import { ref, reactive, onMounted } from 'vue'
import { useAuthStore } from '~/stores/auth'

// Admin layout ашиглах
definePageMeta({
  layout: 'default'
})

const authStore = useAuthStore()
const user = computed(() => authStore.user)

// Mock data - replace with actual API calls
const stats = reactive({
  totalAssets: 24,
  availableAssets: 18,
  rentedAssets: 6,
  monthlyRevenue: 15420
})

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
</style> 