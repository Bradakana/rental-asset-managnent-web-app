<template>
  <div>
    <!-- Page Header -->
    <v-row class="mb-6">
      <v-col>
        <div class="d-flex align-center justify-space-between">
          <div>
            <h1 class="text-h4 font-weight-bold">Rentals</h1>
            <p class="text-subtitle-1 text-medium-emphasis">Manage rental agreements and track asset usage</p>
          </div>
          <v-btn
            color="primary"
            prepend-icon="mdi-plus"
            @click="showAddDialog = true"
          >
            New Rental
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <!-- Statistics Cards -->
    <v-row class="mb-6">
      <v-col cols="12" sm="6" md="3">
        <v-card class="stat-card" elevation="2">
          <v-card-text class="text-center">
            <v-icon size="48" color="primary" class="mb-2">mdi-file-document</v-icon>
            <div class="text-h4 font-weight-bold">{{ stats.totalRentals }}</div>
            <div class="text-subtitle-2 text-medium-emphasis">Total Rentals</div>
          </v-card-text>
        </v-card>
      </v-col>
      
      <v-col cols="12" sm="6" md="3">
        <v-card class="stat-card" elevation="2">
          <v-card-text class="text-center">
            <v-icon size="48" color="success" class="mb-2">mdi-check-circle</v-icon>
            <div class="text-h4 font-weight-bold">{{ stats.activeRentals }}</div>
            <div class="text-subtitle-2 text-medium-emphasis">Active</div>
          </v-card-text>
        </v-card>
      </v-col>
      
      <v-col cols="12" sm="6" md="3">
        <v-card class="stat-card" elevation="2">
          <v-card-text class="text-center">
            <v-icon size="48" color="warning" class="mb-2">mdi-clock-alert</v-icon>
            <div class="text-h4 font-weight-bold">{{ stats.overdueRentals }}</div>
            <div class="text-subtitle-2 text-medium-emphasis">Overdue</div>
          </v-card-text>
        </v-card>
      </v-col>
      
      <v-col cols="12" sm="6" md="3">
        <v-card class="stat-card" elevation="2">
          <v-card-text class="text-center">
            <v-icon size="48" color="info" class="mb-2">mdi-currency-usd</v-icon>
            <div class="text-h4 font-weight-bold">${{ stats.totalRevenue.toLocaleString() }}</div>
            <div class="text-subtitle-2 text-medium-emphasis">Total Revenue</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Filters -->
    <v-card class="mb-6" elevation="2">
      <v-card-text>
        <v-row>
          <v-col cols="12" md="3">
            <v-text-field
              v-model="search"
              label="Search rentals..."
              prepend-inner-icon="mdi-magnify"
              clearable
              hide-details
            />
          </v-col>
          <v-col cols="12" md="3">
            <v-select
              v-model="selectedStatus"
              label="Status"
              :items="statusOptions"
              clearable
              hide-details
            />
          </v-col>
          <v-col cols="12" md="3">
            <v-select
              v-model="selectedAssetType"
              label="Asset Type"
              :items="assetTypes"
              clearable
              hide-details
            />
          </v-col>
          <v-col cols="12" md="3">
            <v-btn
              color="secondary"
              variant="outlined"
              @click="clearFilters"
              block
            >
              Clear Filters
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Rentals Table -->
    <v-card elevation="2">
      <v-card-title class="d-flex align-center justify-space-between">
        <div class="d-flex align-center">
          <v-icon class="mr-2">mdi-file-document</v-icon>
          Rental Agreements
        </div>
        <v-btn
          icon="mdi-refresh"
          variant="text"
          @click="loadRentals"
          :loading="loading"
        />
      </v-card-title>
      <v-card-text>
        <v-table>
          <thead>
            <tr>
              <th>Rental ID</th>
              <th>Asset</th>
              <th>Renter</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Total Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="rental in filteredRentals" :key="rental.id">
              <td>
                <span class="font-weight-bold">#{{ rental.id }}</span>
              </td>
              <td>
                <div class="d-flex align-center">
                  <v-icon class="mr-2" :color="rental.assetType === 'car' ? 'blue' : 'green'">
                    {{ rental.assetType === 'car' ? 'mdi-car' : 'mdi-home' }}
                  </v-icon>
                  <div>
                    <div class="font-weight-bold">{{ rental.assetName }}</div>
                    <div class="text-caption text-medium-emphasis">{{ rental.assetType }}</div>
                  </div>
                </div>
              </td>
              <td>
                <div>
                  <div class="font-weight-bold">{{ rental.renterName }}</div>
                  <div class="text-caption text-medium-emphasis">{{ rental.renterEmail }}</div>
                </div>
              </td>
              <td>{{ formatDate(rental.startDate) }}</td>
              <td>{{ formatDate(rental.endDate) }}</td>
              <td class="font-weight-bold text-primary">${{ rental.totalAmount }}</td>
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
                <v-btn
                  icon="mdi-pencil"
                  size="small"
                  variant="text"
                  @click="editRental(rental.id)"
                />
                <v-btn
                  v-if="rental.status === 'active'"
                  icon="mdi-check"
                  size="small"
                  variant="text"
                  color="success"
                  @click="completeRental(rental.id)"
                />
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-card-text>
    </v-card>

    <!-- New Rental Dialog -->
    <v-dialog v-model="showAddDialog" max-width="800px">
      <v-card>
        <v-card-title>Create New Rental</v-card-title>
        <v-card-text>
          <v-form ref="rentalForm" @submit.prevent="saveRental">
            <v-row>
              <v-col cols="12" md="6">
                <v-select
                  v-model="newRental.assetId"
                  label="Select Asset"
                  :items="availableAssets"
                  item-title="name"
                  item-value="id"
                  :rules="assetRules"
                  required
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  v-model="newRental.renterId"
                  label="Select Renter"
                  :items="renters"
                  item-title="name"
                  item-value="id"
                  :rules="renterRules"
                  required
                />
              </v-col>
            </v-row>
            
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="newRental.startDate"
                  label="Start Date"
                  type="date"
                  :rules="dateRules"
                  required
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="newRental.endDate"
                  label="End Date"
                  type="date"
                  :rules="[...dateRules, endDateRule]"
                  required
                />
              </v-col>
            </v-row>
            
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="newRental.dailyRate"
                  label="Daily Rate ($)"
                  type="number"
                  :rules="rateRules"
                  required
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="newRental.deposit"
                  label="Deposit ($)"
                  type="number"
                />
              </v-col>
            </v-row>
            
            <v-textarea
              v-model="newRental.notes"
              label="Notes"
              rows="3"
            />
            
            <v-text-field v-model="newRental.imageUrl" label="Зурагны линк" />
            
            <v-file-input
              v-model="newRental.contract"
              label="Upload Contract (PDF)"
              accept=".pdf"
              prepend-icon="mdi-file-pdf-box"
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="grey"
            variant="text"
            @click="showAddDialog = false"
          >
            Cancel
          </v-btn>
          <v-btn
            color="primary"
            @click="saveRental"
            :loading="saving"
          >
            Create Rental
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'

// Admin layout ашиглах
definePageMeta({
  layout: 'default'
})

// Reactive data
const loading = ref(false)
const saving = ref(false)
const showAddDialog = ref(false)
const search = ref('')
const selectedStatus = ref('')
const selectedAssetType = ref('')

// Form ref
const rentalForm = ref(null)

// Options
const statusOptions = ['active', 'completed', 'overdue', 'cancelled']
const assetTypes = ['car', 'real-estate']

// New rental form
const newRental = reactive({
  assetId: '',
  renterId: '',
  startDate: '',
  endDate: '',
  dailyRate: '',
  deposit: '',
  notes: '',
  contract: null,
  imageUrl: ''
})

// Validation rules
const assetRules = [
  v => !!v || 'Asset is required'
]

const renterRules = [
  v => !!v || 'Renter is required'
]

const dateRules = [
  v => !!v || 'Date is required'
]

const rateRules = [
  v => !!v || 'Daily rate is required',
  v => v > 0 || 'Rate must be greater than 0'
]

const endDateRule = (v) => {
  if (!v || !newRental.startDate) return true
  return new Date(v) > new Date(newRental.startDate) || 'End date must be after start date'
}

// Mock data
const stats = reactive({
  totalRentals: 45,
  activeRentals: 12,
  overdueRentals: 3,
  totalRevenue: 125000
})

const rentals = ref([
  {
    id: 1,
    assetName: 'Toyota Camry 2023',
    assetType: 'car',
    renterName: 'John Doe',
    renterEmail: 'john@example.com',
    startDate: '2024-01-15',
    endDate: '2024-01-20',
    totalAmount: 225,
    status: 'active'
  },
  {
    id: 2,
    assetName: 'Downtown Apartment',
    assetType: 'real-estate',
    renterName: 'Jane Smith',
    renterEmail: 'jane@example.com',
    startDate: '2024-01-10',
    endDate: '2024-02-10',
    totalAmount: 3720,
    status: 'active'
  },
  {
    id: 3,
    assetName: 'Honda Civic 2022',
    assetType: 'car',
    renterName: 'Mike Johnson',
    renterEmail: 'mike@example.com',
    startDate: '2024-01-12',
    endDate: '2024-01-15',
    totalAmount: 105,
    status: 'completed'
  }
])

const availableAssets = ref([
  { id: 1, name: 'Toyota Camry 2023', type: 'car' },
  { id: 2, name: 'Downtown Apartment', type: 'real-estate' },
  { id: 3, name: 'Honda Civic 2022', type: 'car' }
])

const renters = ref([
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
  { id: 3, name: 'Mike Johnson', email: 'mike@example.com' }
])

// Computed properties
const filteredRentals = computed(() => {
  let filtered = rentals.value

  if (search.value) {
    filtered = filtered.filter(rental =>
      rental.assetName.toLowerCase().includes(search.value.toLowerCase()) ||
      rental.renterName.toLowerCase().includes(search.value.toLowerCase()) ||
      rental.id.toString().includes(search.value)
    )
  }

  if (selectedStatus.value) {
    filtered = filtered.filter(rental => rental.status === selectedStatus.value)
  }

  if (selectedAssetType.value) {
    filtered = filtered.filter(rental => rental.assetType === selectedAssetType.value)
  }

  return filtered
})

// Methods
const loadRentals = async () => {
  loading.value = true
  try {
    // TODO: Replace with actual API call
    await new Promise(resolve => setTimeout(resolve, 1000))
  } catch (error) {
    console.error('Error loading rentals:', error)
  } finally {
    loading.value = false
  }
}

const saveRental = async () => {
  const { valid } = await rentalForm.value.validate()
  if (!valid) return

  saving.value = true
  try {
    await $fetch(`${useRuntimeConfig().public.apiBase}/api/rentals`, {
      method: 'POST',
      body: {
        ...newRental,
        imageUrl: newRental.imageUrl
      }
    })
    // Амжилттай бол form-оо хаах, шинэчлэх гэх мэт
  } catch (error) {
    console.error('Error saving rental:', error)
  } finally {
    saving.value = false
  }
}

const calculateTotal = (startDate, endDate, dailyRate) => {
  const start = new Date(startDate)
  const end = new Date(endDate)
  const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24))
  return days * dailyRate
}

const resetForm = () => {
  Object.assign(newRental, {
    assetId: '',
    renterId: '',
    startDate: '',
    endDate: '',
    dailyRate: '',
    deposit: '',
    notes: '',
    contract: null,
    imageUrl: ''
  })
}

const clearFilters = () => {
  search.value = ''
  selectedStatus.value = ''
  selectedAssetType.value = ''
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString()
}

const getStatusColor = (status) => {
  switch (status) {
    case 'active':
      return 'success'
    case 'completed':
      return 'info'
    case 'overdue':
      return 'error'
    case 'cancelled':
      return 'grey'
    default:
      return 'grey'
  }
}

const viewRental = (id) => {
  navigateTo(`/rentals/${id}`)
}

const editRental = (id) => {
  navigateTo(`/rentals/${id}/edit`)
}

const completeRental = async (id) => {
  if (confirm('Mark this rental as completed?')) {
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 500))
      const rental = rentals.value.find(r => r.id === id)
      if (rental) {
        rental.status = 'completed'
      }
    } catch (error) {
      console.error('Error completing rental:', error)
    }
  }
}

onMounted(() => {
  loadRentals()
})
</script>

<style scoped>
.stat-card {
  transition: transform 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
}
</style> 