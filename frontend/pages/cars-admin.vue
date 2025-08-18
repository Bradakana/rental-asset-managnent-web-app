<template>
  <div>
    <!-- Page Header -->
    <v-row class="mb-6">
      <v-col>
        <div class="d-flex align-center justify-space-between">
          <div>
            <h1 class="text-h4 font-weight-bold">Cars Management</h1>
            <p class="text-subtitle-1 text-medium-emphasis">Manage rental cars</p>
          </div>
          <v-btn
            color="primary"
            prepend-icon="mdi-plus"
            @click="showAddDialog = true"
          >
            Add Car
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <!-- Cars Grid -->
    <v-row>
      <v-col cols="12" sm="6" md="4" lg="3" v-for="car in cars" :key="car._id">
        <v-card elevation="2" class="car-card">
          <v-img :src="car.image" height="200" cover>
            <template v-slot:placeholder>
              <v-row class="fill-height ma-0" align="center" justify="center">
                <v-progress-circular indeterminate color="grey-lighten-5"></v-progress-circular>
              </v-row>
            </template>
          </v-img>
          
          <v-card-text>
            <h3 class="text-h6 font-weight-bold mb-2">{{ car.brand }} {{ car.model }}</h3>
            <v-chip size="small" color="primary" class="mb-2">{{ car.year }}</v-chip>
            <p class="text-body-2 mb-2">{{ car.fuel }} • {{ car.transmission }}</p>
            <p class="text-body-2 mb-2">{{ car.seats }} seats • {{ car.location }}</p>
            <p class="text-h6 text-primary font-weight-bold">${{ car.price }}/day</p>
          </v-card-text>
          
          <v-card-actions>
            <v-btn variant="text" color="primary" @click="editCar(car)">
              <v-icon>mdi-pencil</v-icon>
              Edit
            </v-btn>
            <v-btn variant="text" color="error" @click="deleteCar(car._id)">
              <v-icon>mdi-delete</v-icon>
              Delete
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Add/Edit Car Dialog -->
    <v-dialog v-model="showAddDialog" max-width="800px">
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ editingCar ? 'Edit Car' : 'Add New Car' }}</span>
        </v-card-title>
        
        <v-card-text>
          <v-form ref="carFormRef" v-model="formValid">
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="carForm.brand"
                  label="Brand"
                  :rules="[v => !!v || 'Brand is required']"
                  required
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="carForm.model"
                  label="Model"
                  :rules="[v => !!v || 'Model is required']"
                  required
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="carForm.year"
                  label="Year"
                  type="number"
                  :rules="[v => !!v || 'Year is required', v => v >= 1990 || 'Year must be after 1990']"
                  required
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  v-model="carForm.fuel"
                  label="Fuel Type"
                  :items="['Gasoline', 'Diesel', 'Hybrid', 'Electric', 'Gas']"
                  :rules="[v => !!v || 'Fuel type is required']"
                  required
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="carForm.seats"
                  label="Seats"
                  type="number"
                  :rules="[v => !!v || 'Seats is required', v => v >= 2 && v <= 9 || 'Seats must be 2-9']"
                  required
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  v-model="carForm.transmission"
                  label="Transmission"
                  :items="['Manual', 'Automatic']"
                  :rules="[v => !!v || 'Transmission is required']"
                  required
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="carForm.location"
                  label="Location"
                  :rules="[v => !!v || 'Location is required']"
                  required
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="carForm.price"
                  label="Price per day ($)"
                  type="number"
                  :rules="[v => !!v || 'Price is required', v => v > 0 || 'Price must be positive']"
                  required
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="carForm.image"
                  label="Image URL"
                  :rules="[v => !!v || 'Image URL is required']"
                  required
                />
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="carForm.description"
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
          <v-btn color="primary" @click="saveCar" :loading="saving" :disabled="!formValid">
            {{ editingCar ? 'Update' : 'Add' }}
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
const editingCar = ref(null)
const formValid = ref(false)
const cars = ref([])

// Form refs
const carFormRef = ref(null)

// Car form data - ref объект болгон өөрчилье
const carForm = ref({
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

// API Functions
const fetchCars = async () => {
  loading.value = true
  try {
    const response = await fetch('http://localhost:3001/api/cars')
    const data = await response.json()
    if (data.success) {
      cars.value = data.cars
    }
  } catch (error) {
    console.error('Error fetching cars:', error)
  } finally {
    loading.value = false
  }
}

const saveCar = async () => {
  if (!formValid.value) return
  
  saving.value = true
  try {
    const url = editingCar.value 
      ? `http://localhost:3001/api/cars/${editingCar.value._id}`
      : 'http://localhost:3001/api/cars'
    
    const method = editingCar.value ? 'PUT' : 'POST'
    
    // Type conversion үйлдэнэ
    const carData = {
      ...carForm.value,
      year: parseInt(carForm.value.year),
      seats: parseInt(carForm.value.seats),
      price: parseFloat(carForm.value.price)
    }
    
    console.log('Sending car data:', carData) // Debug log
    
    // Ensure authenticated so backend can extract vendorId from token
    const { useAuthStore } = await import('~/stores/auth')
    const authStore = useAuthStore()
    await authStore.checkAuth()

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore.token}`
      },
      body: JSON.stringify(carData)
    })
    
    const data = await response.json()
    console.log('Response data:', data) // Debug log
    
    if (data.success) {
      alert('Car добавлен успешно!')
      await fetchCars() // Refresh list
      closeDialog()
    } else {
      console.error('Save car error:', data.error)
      alert('Error: ' + data.error)
    }
  } catch (error) {
    console.error('Error saving car:', error)
    alert('Failed to save car')
  } finally {
    saving.value = false
  }
}

const editCar = (car) => {
  editingCar.value = car
  Object.assign(carForm.value, car)
  showAddDialog.value = true
}

const deleteCar = async (carId) => {
  if (!confirm('Are you sure you want to delete this car?')) return
  
  loading.value = true
  try {
    const { useAuthStore } = await import('~/stores/auth')
    const authStore = useAuthStore()
    await authStore.checkAuth()

    const response = await fetch(`http://localhost:3001/api/cars/${carId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    })
    
    const data = await response.json()
    if (data.success) {
      await fetchCars() // Refresh list
    } else {
      alert('Error: ' + data.error)
    }
  } catch (error) {
    console.error('Error deleting car:', error)
    alert('Failed to delete car')
  } finally {
    loading.value = false
  }
}

const closeDialog = () => {
  showAddDialog.value = false
  editingCar.value = null
  Object.assign(carForm.value, {
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
  if (carFormRef.value) {
    carFormRef.value.resetValidation()
  }
}

// Lifecycle
onMounted(() => {
  fetchCars()
})
</script>

<style scoped>
.car-card {
  transition: transform 0.2s;
}

.car-card:hover {
  transform: translateY(-2px);
}
</style>