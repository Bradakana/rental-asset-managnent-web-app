<template>
  <div>
    <!-- Page Header -->
    <v-row class="mb-6">
      <v-col>
        <div class="d-flex align-center justify-space-between">
          <div>
            <h1 class="text-h4 font-weight-bold">Assets Management</h1>
            <p class="text-subtitle-1 text-medium-emphasis">Manage cars and estates</p>
          </div>
          <v-btn
            color="primary"
            prepend-icon="mdi-plus"
            @click="showAddDialog = true"
          >
            Add {{ activeTab === 'cars' ? 'Car' : 'Estate' }}
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <!-- Asset Type Tabs -->
    <v-row class="mb-4">
      <v-col>
        <v-tabs v-model="activeTab" color="primary">
          <v-tab value="cars">
            <v-icon class="mr-2">mdi-car</v-icon>
            Cars
          </v-tab>
          <v-tab value="estates">
            <v-icon class="mr-2">mdi-home</v-icon>
            Real Estate
          </v-tab>
        </v-tabs>
      </v-col>
    </v-row>

    <!-- Filters and Search -->
    <v-card class="mb-6" elevation="2">
      <v-card-text>
        <v-row>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="search"
              label="Search assets..."
              prepend-inner-icon="mdi-magnify"
              clearable
              hide-details
            />
          </v-col>
          <v-col cols="12" md="3">
            <v-select
              v-model="selectedType"
              label="Asset Type"
              :items="assetTypes"
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

    <!-- View Toggle -->
    <v-row class="mb-4">
      <v-col>
        <div class="d-flex align-center justify-space-between">
          <div class="d-flex align-center">
            <v-btn-toggle
              v-model="viewMode"
              mandatory
              class="mr-4"
            >
              <v-btn value="grid" icon="mdi-view-grid" />
              <v-btn value="list" icon="mdi-view-list" />
            </v-btn-toggle>
            <span class="text-body-2 text-medium-emphasis">
              {{ filteredAssets.length }} assets found
            </span>
          </div>
          <v-btn
            icon="mdi-refresh"
            variant="text"
            @click="loadAssets"
            :loading="loading"
          />
        </div>
      </v-col>
    </v-row>

    <!-- Assets Grid View -->
    <v-row v-if="viewMode === 'grid'">
      <v-col
        v-for="asset in filteredAssets"
        :key="asset.id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <v-card class="asset-card" elevation="2" @click="viewAsset(asset.id)">
          <v-img
            :src="asset.image || '/placeholder-asset.jpg'"
            height="200"
            cover
            class="asset-image"
          >
            <template v-slot:placeholder>
              <div class="d-flex align-center justify-center fill-height">
                <v-icon size="64" color="grey-lighten-1">
                  {{ asset.type === 'car' ? 'mdi-car' : 'mdi-home' }}
                </v-icon>
              </div>
            </template>
            <v-chip
              :color="getStatusColor(asset.status)"
              size="small"
              class="ma-2"
            >
              {{ asset.status }}
            </v-chip>
          </v-img>
          
          <v-card-text>
            <div class="d-flex align-center mb-2">
              <v-icon class="mr-2" :color="asset.type === 'car' ? 'blue' : 'green'">
                {{ asset.type === 'car' ? 'mdi-car' : 'mdi-home' }}
              </v-icon>
              <span class="text-caption text-uppercase">{{ asset.type }}</span>
            </div>
            <h3 class="text-h6 font-weight-bold mb-1">{{ asset.name }}</h3>
            <p class="text-body-2 text-medium-emphasis mb-2">{{ asset.description }}</p>
            <div class="d-flex justify-space-between align-center">
              <span class="text-h6 font-weight-bold text-primary">
                ${{ asset.dailyRate }}/day
              </span>
              <v-btn
                icon="mdi-dots-vertical"
                size="small"
                variant="text"
                @click.stop="showAssetMenu(asset, $event)"
              />
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Assets List View -->
    <v-card v-else elevation="2">
      <v-table>
        <thead>
          <tr>
            <th>Asset</th>
            <th>Type</th>
            <th>Daily Rate</th>
            <th>Status</th>
            <th>Last Rental</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="asset in filteredAssets" :key="asset.id">
            <td>
              <div class="d-flex align-center">
                <v-avatar size="40" class="mr-3">
                  <v-img
                    :src="asset.image || '/placeholder-asset.jpg'"
                    :alt="asset.name"
                  />
                </v-avatar>
                <div>
                  <div class="font-weight-bold">{{ asset.name }}</div>
                  <div class="text-caption text-medium-emphasis">{{ asset.description }}</div>
                </div>
              </div>
            </td>
            <td>
              <v-chip
                :color="asset.type === 'car' ? 'blue' : 'green'"
                size="small"
              >
                {{ asset.type }}
              </v-chip>
            </td>
            <td class="font-weight-bold">${{ asset.dailyRate }}/day</td>
            <td>
              <v-chip
                :color="getStatusColor(asset.status)"
                size="small"
              >
                {{ asset.status }}
              </v-chip>
            </td>
            <td>{{ asset.lastRental || 'Never' }}</td>
            <td>
              <v-btn
                icon="mdi-eye"
                size="small"
                variant="text"
                @click="viewAsset(asset.id)"
              />
              <v-btn
                icon="mdi-pencil"
                size="small"
                variant="text"
                @click="editAsset(asset.id)"
              />
              <v-btn
                icon="mdi-delete"
                size="small"
                variant="text"
                color="error"
                @click="deleteAsset(asset.id)"
              />
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card>

    <!-- Add Asset Dialog -->
    <v-dialog v-model="showAddDialog" max-width="600px">
      <v-card>
        <v-card-title>Add New Asset</v-card-title>
        <v-card-text>
          <v-form ref="assetForm" @submit.prevent="saveAsset">
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="newAsset.name"
                  label="Asset Name"
                  :rules="nameRules"
                  required
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  v-model="newAsset.type"
                  label="Asset Type"
                  :items="assetTypes"
                  :rules="typeRules"
                  required
                />
              </v-col>
            </v-row>
            
            <v-textarea
              v-model="newAsset.description"
              label="Description"
              rows="3"
            />
            
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="newAsset.dailyRate"
                  label="Daily Rate ($)"
                  type="number"
                  :rules="rateRules"
                  required
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="newAsset.location"
                  label="Location"
                />
              </v-col>
            </v-row>
            
            <v-file-input
              v-model="newAsset.image"
              label="Asset Image"
              accept="image/*"
              prepend-icon="mdi-camera"
            />
            <v-text-field v-model="newAsset.imageUrl" label="Зурагны линк" />
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
            @click="saveAsset"
            :loading="saving"
          >
            Save Asset
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Asset Menu -->
    <v-menu
      v-model="showMenu"
      :position-x="menuX"
      :position-y="menuY"
    >
      <v-list>
        <v-list-item @click="viewAsset(selectedAsset?.id)">
          <v-list-item-title>View Details</v-list-item-title>
        </v-list-item>
        <v-list-item @click="editAsset(selectedAsset?.id)">
          <v-list-item-title>Edit Asset</v-list-item-title>
        </v-list-item>
        <v-list-item @click="deleteAsset(selectedAsset?.id)" color="error">
          <v-list-item-title>Delete Asset</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useAuthStore } from '~/stores/auth'

// Admin layout ашиглах
definePageMeta({
  layout: 'default'
})
const authStore = useAuthStore()

// Reactive data
const activeTab = ref('cars')
const loading = ref(false)
const saving = ref(false)
const showAddDialog = ref(false)
const showMenu = ref(false)
const menuX = ref(0)
const menuY = ref(0)
const selectedAsset = ref(null)
const viewMode = ref('grid')
const search = ref('')

// Form ref
const assetForm = ref(null)

// Data arrays
const cars = ref([])
const estates = ref([])

// New car form
const newCar = reactive({
  brand: '',
  model: '',
  year: new Date().getFullYear(),
  fuel: 'Gasoline',
  seats: 5,
  transmission: 'Automatic',
  location: '',
  price: '',
  image: '',
  description: ''
})

// New estate form
const newEstate = reactive({
  title: '',
  location: '',
  size: '',
  rooms: 1,
  bathrooms: 1,
  floor: 0,
  totalFloors: 1,
  furnished: false,
  petsAllowed: false,
  price: '',
  image: '',
  description: '',
  propertyType: 'Apartment'
})

// Validation rules
const nameRules = [
  v => !!v || 'Name is required',
  v => v.length >= 2 || 'Name must be at least 2 characters'
]

const typeRules = [
  v => !!v || 'Type is required'
]

const rateRules = [
  v => !!v || 'Daily rate is required',
  v => v > 0 || 'Rate must be greater than 0'
]

const assets = ref([])
const error = ref(null)

const loadAssets = async () => {
  loading.value = true
  try {
    const response = await fetch('http://localhost:3001/api/assets')
    const data = await response.json()
    if (!response.ok) throw new Error(data.error || 'Asset авахад алдаа гарлаа')
    assets.value = data.assets
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

// Computed properties
const filteredAssets = computed(() => {
  let filtered = assets.value

  if (search.value) {
    filtered = filtered.filter(asset =>
      asset.name.toLowerCase().includes(search.value.toLowerCase()) ||
      asset.description.toLowerCase().includes(search.value.toLowerCase())
    )
  }

  if (selectedType.value) {
    filtered = filtered.filter(asset => asset.type === selectedType.value)
  }

  if (selectedStatus.value) {
    filtered = filtered.filter(asset => asset.status === selectedStatus.value)
  }

  return filtered
})

// Methods
const saveAsset = async () => {
  const { valid } = await assetForm.value.validate()
  if (!valid) return

  saving.value = true
  try {
    const vendorId = authStore.user?.vendorId || JSON.parse(localStorage.getItem('user'))?.vendorId
    const assetData = {
      ...newAsset, // бүх property
      vendorId // vendorId-г request body-д заавал явуулна
    }
    const response = await $fetch(`${useRuntimeConfig().public.apiBase}/api/assets`, {
      method: 'POST',
      body: assetData
    })
    if (response.error) {
      alert(response.error || 'Asset нэмэхэд алдаа гарлаа')
    } else {
      alert('Asset амжилттай нэмэгдлээ!')
      showAddDialog.value = false
      loadAssets() // Refresh assets after adding
      resetForm()
    }
  } catch (error) {
    console.error('Error saving asset:', error)
  } finally {
    saving.value = false
  }
}

const resetForm = () => {
  Object.assign(newAsset, {
    name: '',
    type: '',
    description: '',
    dailyRate: '',
    location: '',
    image: null,
    imageUrl: '' // Reset imageUrl
  })
}

const clearFilters = () => {
  search.value = ''
  selectedType.value = ''
  selectedStatus.value = ''
}

const getStatusColor = (status) => {
  switch (status) {
    case 'available':
      return 'success'
    case 'rented':
      return 'warning'
    case 'maintenance':
      return 'error'
    case 'unavailable':
      return 'grey'
    default:
      return 'grey'
  }
}

const viewAsset = (id) => {
  navigateTo(`/assets/${id}`)
}

const editAsset = (id) => {
  navigateTo(`/assets/${id}/edit`)
}

const deleteAsset = async (id) => {
  if (confirm('Are you sure you want to delete this asset?')) {
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 500))
      assets.value = assets.value.filter(asset => asset.id !== id)
    } catch (error) {
      console.error('Error deleting asset:', error)
    }
  }
}

const showAssetMenu = (asset, event) => {
  selectedAsset.value = asset
  menuX.value = event.clientX
  menuY.value = event.clientY
  showMenu.value = true
}

onMounted(() => {
  loadAssets()
})
</script>

<style scoped>
.asset-card {
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.asset-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.asset-image {
  position: relative;
}
</style> 