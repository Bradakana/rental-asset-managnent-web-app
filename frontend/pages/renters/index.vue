<template>
  <div>
    <!-- Page Header -->
    <v-row class="mb-6">
      <v-col>
        <div class="d-flex align-center justify-space-between">
          <div>
            <h1 class="text-h4 font-weight-bold">Renters</h1>
            <p class="text-subtitle-1 text-medium-emphasis">Manage renter profiles and documents</p>
          </div>
          <v-btn
            color="primary"
            prepend-icon="mdi-plus"
            @click="showAddDialog = true"
          >
            Add Renter
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <!-- Statistics Cards -->
    <v-row class="mb-6">
      <v-col cols="12" sm="6" md="3">
        <v-card class="stat-card" elevation="2">
          <v-card-text class="text-center">
            <v-icon size="48" color="primary" class="mb-2">mdi-account-group</v-icon>
            <div class="text-h4 font-weight-bold">{{ stats.totalRenters }}</div>
            <div class="text-subtitle-2 text-medium-emphasis">Total Renters</div>
          </v-card-text>
        </v-card>
      </v-col>
      
      <v-col cols="12" sm="6" md="3">
        <v-card class="stat-card" elevation="2">
          <v-card-text class="text-center">
            <v-icon size="48" color="success" class="mb-2">mdi-check-circle</v-icon>
            <div class="text-h4 font-weight-bold">{{ stats.activeRenters }}</div>
            <div class="text-subtitle-2 text-medium-emphasis">Active Renters</div>
          </v-card-text>
        </v-card>
      </v-col>
      
      <v-col cols="12" sm="6" md="3">
        <v-card class="stat-card" elevation="2">
          <v-card-text class="text-center">
            <v-icon size="48" color="warning" class="mb-2">mdi-file-document-alert</v-icon>
            <div class="text-h4 font-weight-bold">{{ stats.expiringDocs }}</div>
            <div class="text-subtitle-2 text-medium-emphasis">Expiring Documents</div>
          </v-card-text>
        </v-card>
      </v-col>
      
      <v-col cols="12" sm="6" md="3">
        <v-card class="stat-card" elevation="2">
          <v-card-text class="text-center">
            <v-icon size="48" color="info" class="mb-2">mdi-star</v-icon>
            <div class="text-h4 font-weight-bold">{{ stats.avgRating }}</div>
            <div class="text-subtitle-2 text-medium-emphasis">Average Rating</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Search and Filters -->
    <v-card class="mb-6" elevation="2">
      <v-card-text>
        <v-row>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="search"
              label="Search renters..."
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
              v-model="selectedSort"
              label="Sort By"
              :items="sortOptions"
              hide-details
            />
          </v-col>
          <v-col cols="12" md="2">
            <v-btn
              color="secondary"
              variant="outlined"
              @click="clearFilters"
              block
            >
              Clear
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Renters Grid -->
    <v-row>
      <v-col
        v-for="renter in filteredRenters"
        :key="renter.id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <v-card class="renter-card" elevation="2">
          <v-card-text class="text-center pb-0">
            <v-avatar size="80" class="mb-3">
              <v-img
                :src="renter.avatar || '/placeholder-avatar.jpg'"
                :alt="renter.name"
              />
            </v-avatar>
            <h3 class="text-h6 font-weight-bold mb-1">{{ renter.name }}</h3>
            <p class="text-body-2 text-medium-emphasis mb-2">{{ renter.email }}</p>
            <p class="text-caption text-medium-emphasis mb-3">{{ renter.phone }}</p>
            
            <div class="d-flex justify-center mb-3">
              <v-chip
                :color="getStatusColor(renter.status)"
                size="small"
                class="mr-2"
              >
                {{ renter.status }}
              </v-chip>
              <v-chip
                v-if="renter.verified"
                color="success"
                size="small"
                prepend-icon="mdi-check-decagram"
              >
                Verified
              </v-chip>
            </div>
            
            <div class="d-flex justify-space-between align-center mb-3">
              <div class="text-center">
                <div class="text-h6 font-weight-bold">{{ renter.totalRentals }}</div>
                <div class="text-caption">Rentals</div>
              </div>
              <div class="text-center">
                <div class="text-h6 font-weight-bold">${{ renter.totalSpent }}</div>
                <div class="text-caption">Spent</div>
              </div>
              <div class="text-center">
                <div class="text-h6 font-weight-bold">{{ renter.rating }}</div>
                <div class="text-caption">Rating</div>
              </div>
            </div>
          </v-card-text>
          
          <v-card-actions class="pt-0">
            <v-btn
              color="primary"
              variant="text"
              block
              @click="viewRenter(renter.id)"
            >
              View Profile
            </v-btn>
            <v-btn
              icon="mdi-dots-vertical"
              size="small"
              variant="text"
              @click="showRenterMenu(renter, $event)"
            />
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Add Renter Dialog -->
    <v-dialog v-model="showAddDialog" max-width="600px">
      <v-card>
        <v-card-title>Add New Renter</v-card-title>
        <v-card-text>
          <v-form ref="renterForm" @submit.prevent="saveRenter">
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="newRenter.firstName"
                  label="First Name"
                  :rules="nameRules"
                  required
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="newRenter.lastName"
                  label="Last Name"
                  :rules="nameRules"
                  required
                />
              </v-col>
            </v-row>
            
            <v-text-field
              v-model="newRenter.email"
              label="Email"
              type="email"
              :rules="emailRules"
              required
            />
            
            <v-text-field
              v-model="newRenter.phone"
              label="Phone Number"
              :rules="phoneRules"
              required
            />
            
            <v-text-field
              v-model="newRenter.address"
              label="Address"
            />
            
            <v-text-field v-model="newRenter.imageUrl" label="Зурагны линк" />
            
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="newRenter.licenseNumber"
                  label="License Number"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="newRenter.passportNumber"
                  label="Passport Number"
                />
              </v-col>
            </v-row>
            
            <v-textarea
              v-model="newRenter.notes"
              label="Notes"
              rows="3"
            />
            
            <v-file-input
              v-model="newRenter.documents"
              label="Upload Documents"
              accept=".pdf,.jpg,.jpeg,.png"
              prepend-icon="mdi-file-upload"
              multiple
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
            @click="saveRenter"
            :loading="saving"
          >
            Save Renter
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Renter Menu -->
    <v-menu
      v-model="showMenu"
      :position-x="menuX"
      :position-y="menuY"
    >
      <v-list>
        <v-list-item @click="viewRenter(selectedRenter?.id)">
          <v-list-item-title>View Profile</v-list-item-title>
        </v-list-item>
        <v-list-item @click="editRenter(selectedRenter?.id)">
          <v-list-item-title>Edit Profile</v-list-item-title>
        </v-list-item>
        <v-list-item @click="viewDocuments(selectedRenter?.id)">
          <v-list-item-title>View Documents</v-list-item-title>
        </v-list-item>
        <v-list-item @click="viewRentalHistory(selectedRenter?.id)">
          <v-list-item-title>Rental History</v-list-item-title>
        </v-list-item>
        <v-list-item @click="deleteRenter(selectedRenter?.id)" color="error">
          <v-list-item-title>Delete Renter</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
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
const showMenu = ref(false)
const menuX = ref(0)
const menuY = ref(0)
const selectedRenter = ref(null)
const search = ref('')
const selectedStatus = ref('')
const selectedSort = ref('name')

// Form ref
const renterForm = ref(null)

// Options
const statusOptions = ['active', 'inactive', 'suspended']
const sortOptions = [
  { title: 'Name', value: 'name' },
  { title: 'Recent Activity', value: 'recent' },
  { title: 'Total Rentals', value: 'rentals' },
  { title: 'Rating', value: 'rating' }
]

// New renter form
const newRenter = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  licenseNumber: '',
  passportNumber: '',
  notes: '',
  documents: [],
  imageUrl: '' // Add imageUrl to the newRenter object
})

// Validation rules
const nameRules = [
  v => !!v || 'Name is required',
  v => v.length >= 2 || 'Name must be at least 2 characters'
]

const emailRules = [
  v => !!v || 'Email is required',
  v => /.+@.+\..+/.test(v) || 'Email must be valid'
]

const phoneRules = [
  v => !!v || 'Phone number is required'
]

// Mock data
const stats = reactive({
  totalRenters: 28,
  activeRenters: 22,
  expiringDocs: 5,
  avgRating: 4.2
})

const renters = ref([
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1 (555) 123-4567',
    status: 'active',
    verified: true,
    avatar: null,
    totalRentals: 8,
    totalSpent: 2400,
    rating: 4.5
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '+1 (555) 987-6543',
    status: 'active',
    verified: true,
    avatar: null,
    totalRentals: 12,
    totalSpent: 3800,
    rating: 4.8
  },
  {
    id: 3,
    name: 'Mike Johnson',
    email: 'mike@example.com',
    phone: '+1 (555) 456-7890',
    status: 'inactive',
    verified: false,
    avatar: null,
    totalRentals: 3,
    totalSpent: 900,
    rating: 3.9
  },
  {
    id: 4,
    name: 'Sarah Wilson',
    email: 'sarah@example.com',
    phone: '+1 (555) 321-0987',
    status: 'active',
    verified: true,
    avatar: null,
    totalRentals: 15,
    totalSpent: 5200,
    rating: 4.7
  }
])

// Computed properties
const filteredRenters = computed(() => {
  let filtered = renters.value

  if (search.value) {
    filtered = filtered.filter(renter =>
      renter.name.toLowerCase().includes(search.value.toLowerCase()) ||
      renter.email.toLowerCase().includes(search.value.toLowerCase()) ||
      renter.phone.includes(search.value)
    )
  }

  if (selectedStatus.value) {
    filtered = filtered.filter(renter => renter.status === selectedStatus.value)
  }

  // Sort
  filtered.sort((a, b) => {
    switch (selectedSort.value) {
      case 'name':
        return a.name.localeCompare(b.name)
      case 'recent':
        return b.totalRentals - a.totalRentals
      case 'rentals':
        return b.totalRentals - a.totalRentals
      case 'rating':
        return b.rating - a.rating
      default:
        return 0
    }
  })

  return filtered
})

// Methods
const loadRenters = async () => {
  loading.value = true
  try {
    // TODO: Replace with actual API call
    await new Promise(resolve => setTimeout(resolve, 1000))
  } catch (error) {
    console.error('Error loading renters:', error)
  } finally {
    loading.value = false
  }
}

const saveRenter = async () => {
  const { valid } = await renterForm.value.validate()
  if (!valid) return

  saving.value = true
  try {
    await $fetch(`${useRuntimeConfig().public.apiBase}/api/renters`, {
      method: 'POST',
      body: {
        ...newRenter,
        imageUrl: newRenter.imageUrl
      }
    })
    // Амжилттай бол form-оо хаах, шинэчлэх гэх мэт
  } catch (error) {
    console.error('Error saving renter:', error)
  } finally {
    saving.value = false
  }
}

const resetForm = () => {
  Object.assign(newRenter, {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    licenseNumber: '',
    passportNumber: '',
    notes: '',
    documents: [],
    imageUrl: '' // Add imageUrl to the newRenter object
  })
}

const clearFilters = () => {
  search.value = ''
  selectedStatus.value = ''
  selectedSort.value = 'name'
}

const getStatusColor = (status) => {
  switch (status) {
    case 'active':
      return 'success'
    case 'inactive':
      return 'grey'
    case 'suspended':
      return 'error'
    default:
      return 'grey'
  }
}

const viewRenter = (id) => {
  navigateTo(`/renters/${id}`)
}

const editRenter = (id) => {
  navigateTo(`/renters/${id}/edit`)
}

const viewDocuments = (id) => {
  navigateTo(`/renters/${id}/documents`)
}

const viewRentalHistory = (id) => {
  navigateTo(`/renters/${id}/history`)
}

const deleteRenter = async (id) => {
  if (confirm('Are you sure you want to delete this renter?')) {
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 500))
      renters.value = renters.value.filter(renter => renter.id !== id)
    } catch (error) {
      console.error('Error deleting renter:', error)
    }
  }
}

const showRenterMenu = (renter, event) => {
  selectedRenter.value = renter
  menuX.value = event.clientX
  menuY.value = event.clientY
  showMenu.value = true
}

onMounted(() => {
  loadRenters()
})
</script>

<style scoped>
.renter-card {
  transition: transform 0.2s, box-shadow 0.2s;
}

.renter-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.stat-card {
  transition: transform 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
}
</style> 