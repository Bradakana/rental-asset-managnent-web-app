<template>
  <div>
    <!-- Page Header -->
    <v-row class="mb-6">
      <v-col>
        <div class="d-flex align-center justify-space-between">
          <div>
            <h1 class="text-h4 font-weight-bold">Real Estate Management</h1>
            <p class="text-subtitle-1 text-medium-emphasis">Manage rental properties</p>
          </div>
          <v-btn
            color="primary"
            prepend-icon="mdi-plus"
            @click="showAddDialog = true"
          >
            Add Property
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <!-- Estates Grid -->
    <v-row>
      <v-col cols="12" sm="6" md="4" lg="3" v-for="estate in estates" :key="estate._id">
        <v-card elevation="2" class="estate-card">
          <v-img :src="estate.image" height="200" cover>
            <template v-slot:placeholder>
              <v-row class="fill-height ma-0" align="center" justify="center">
                <v-progress-circular indeterminate color="grey-lighten-5"></v-progress-circular>
              </v-row>
            </template>
          </v-img>
          
          <v-card-text>
            <h3 class="text-h6 font-weight-bold mb-2">{{ estate.title }}</h3>
            <v-chip size="small" color="primary" class="mb-2">{{ estate.propertyType }}</v-chip>
            <p class="text-body-2 mb-2">{{ estate.rooms }} rooms • {{ estate.size }}m²</p>
            <p class="text-body-2 mb-2">{{ estate.location }}</p>
            <p class="text-h6 text-primary font-weight-bold">${{ estate.price }}/month</p>
          </v-card-text>
          
          <v-card-actions>
            <v-btn variant="text" color="primary" @click="editEstate(estate)">
              <v-icon>mdi-pencil</v-icon>
              Edit
            </v-btn>
            <v-btn variant="text" color="error" @click="deleteEstate(estate._id)">
              <v-icon>mdi-delete</v-icon>
              Delete
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Add/Edit Estate Dialog -->
    <v-dialog v-model="showAddDialog" max-width="900px">
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ editingEstate ? 'Edit Property' : 'Add New Property' }}</span>
        </v-card-title>
        
        <v-card-text>
          <v-form ref="estateFormRef" v-model="formValid">
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="estateForm.title"
                  label="Property Title"
                  :rules="[v => !!v || 'Title is required']"
                  required
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  v-model="estateForm.propertyType"
                  label="Property Type"
                  :items="['Apartment', 'House', 'Studio', 'Room', 'Commercial']"
                  :rules="[v => !!v || 'Property type is required']"
                  required
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="estateForm.location"
                  label="Location"
                  :rules="[v => !!v || 'Location is required']"
                  required
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="estateForm.size"
                  label="Size (m²)"
                  type="number"
                  :rules="[v => !!v || 'Size is required', v => v >= 10 || 'Size must be at least 10m²']"
                  required
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="estateForm.rooms"
                  label="Rooms"
                  type="number"
                  :rules="[v => !!v || 'Rooms is required', v => v >= 1 || 'Must have at least 1 room']"
                  required
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="estateForm.bathrooms"
                  label="Bathrooms"
                  type="number"
                  :rules="[v => v >= 1 || 'Must have at least 1 bathroom']"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="estateForm.floor"
                  label="Floor"
                  type="number"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="estateForm.totalFloors"
                  label="Total Floors"
                  type="number"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-switch
                  v-model="estateForm.furnished"
                  label="Furnished"
                  color="primary"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-switch
                  v-model="estateForm.petsAllowed"
                  label="Pets Allowed"
                  color="primary"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="estateForm.price"
                  label="Price per month ($)"
                  type="number"
                  :rules="[v => !!v || 'Price is required', v => v > 0 || 'Price must be positive']"
                  required
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="estateForm.image"
                  label="Image URL"
                  :rules="[v => !!v || 'Image URL is required']"
                  required
                />
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="estateForm.description"
                  label="Description"
                  :rules="[v => !!v || 'Description is required']"
                  rows="3"
                  required
                />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="closeDialog">Cancel</v-btn>
          <v-btn color="primary" @click="saveEstate" :loading="saving" :disabled="!formValid">
            {{ editingEstate ? 'Update' : 'Add' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Loading -->
    <v-overlay v-model="loading" class="align-center justify-center">
      <v-progress-circular size="64" indeterminate></v-progress-circular>
    </v-overlay>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'

// Admin layout ашиглах
definePageMeta({
  layout: 'default'
})

// Reactive data
const loading = ref(false)
const saving = ref(false)
const showAddDialog = ref(false)
const editingEstate = ref(null)
const formValid = ref(false)
const estates = ref([])

// Form refs
const estateFormRef = ref(null)

// Estate form data
const estateForm = reactive({
  title: '',
  propertyType: 'Apartment',
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
  description: ''
})

// API Functions
const fetchEstates = async () => {
  loading.value = true
  try {
    const response = await fetch('http://localhost:3001/api/estates')
    const data = await response.json()
    if (data.success) {
      estates.value = data.estates
    }
  } catch (error) {
    console.error('Error fetching estates:', error)
  } finally {
    loading.value = false
  }
}

const saveEstate = async () => {
  if (!formValid.value) return
  
  saving.value = true
  try {
    const url = editingEstate.value 
      ? `http://localhost:3001/api/estates/${editingEstate.value._id}`
      : 'http://localhost:3001/api/estates'
    
    const method = editingEstate.value ? 'PUT' : 'POST'
    const { useAuthStore } = await import('~/stores/auth')
    const authStore = useAuthStore()
    await authStore.checkAuth()

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore.token}`
      },
      body: JSON.stringify(estateForm)
    })
    
    const data = await response.json()
    if (data.success) {
      await fetchEstates() // Refresh list
      closeDialog()
    } else {
      alert('Error: ' + data.error)
    }
  } catch (error) {
    console.error('Error saving estate:', error)
    alert('Failed to save property')
  } finally {
    saving.value = false
  }
}

const editEstate = (estate) => {
  editingEstate.value = estate
  Object.assign(estateForm, estate)
  showAddDialog.value = true
}

const deleteEstate = async (estateId) => {
  if (!confirm('Are you sure you want to delete this property?')) return
  
  loading.value = true
  try {
    const { useAuthStore } = await import('~/stores/auth')
    const authStore = useAuthStore()
    await authStore.checkAuth()

    const response = await fetch(`http://localhost:3001/api/estates/${estateId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    })
    
    const data = await response.json()
    if (data.success) {
      await fetchEstates() // Refresh list
    } else {
      alert('Error: ' + data.error)
    }
  } catch (error) {
    console.error('Error deleting estate:', error)
    alert('Failed to delete property')
  } finally {
    loading.value = false
  }
}

const closeDialog = () => {
  showAddDialog.value = false
  editingEstate.value = null
  Object.assign(estateForm, {
    title: '',
    propertyType: 'Apartment',
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
    description: ''
  })
  if (estateFormRef.value) {
    estateFormRef.value.resetValidation()
  }
}

// Lifecycle
onMounted(() => {
  fetchEstates()
})
</script>

<style scoped>
.estate-card {
  transition: transform 0.2s;
}

.estate-card:hover {
  transform: translateY(-2px);
}
</style>