<template>
  <div class="subscriptions-page">
    <!-- Page Header -->
    <div class="page-header">
      <h1 class="page-title">My Subscriptions</h1>
      <p class="page-subtitle">Manage your asset subscriptions and preferences</p>
    </div>

    <!-- Subscription Filters -->
    <div class="subscription-filters">
      <select v-model="filters.status">
        <option value="">All Status</option>
        <option value="active">Active</option>
        <option value="cancelled">Cancelled</option>
        <option value="expired">Expired</option>
      </select>
      <select v-model="filters.assetType">
        <option value="">All Types</option>
        <option value="car">Cars</option>
        <option value="estate">Properties</option>
        <option value="asset">Assets</option>
      </select>
      <button class="refresh-btn" @click="fetchSubscriptions">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
          <path d="M21 3v5h-5"/>
          <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
          <path d="M3 21v-5h5"/>
        </svg>
        Refresh
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>Loading your subscriptions...</p>
    </div>

    <!-- Subscriptions List -->
    <div v-else-if="filteredSubscriptions.length > 0" class="subscriptions-grid">
      <div 
        v-for="subscription in filteredSubscriptions" 
        :key="subscription._id"
        class="subscription-card"
        :class="{ 'subscription-inactive': subscription.status !== 'active' }"
      >
        <div class="subscription-header">
          <div class="asset-type-badge" :class="`type-${subscription.assetType}`">
            <svg v-if="subscription.assetType === 'car'" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M5,11L6.5,6.5H17.5L19,11M17.5,16A1.5,1.5 0 0,1 16,14.5A1.5,1.5 0 0,1 17.5,13A1.5,1.5 0 0,1 19,14.5A1.5,1.5 0 0,1 17.5,16M6.5,16A1.5,1.5 0 0,1 5,14.5A1.5,1.5 0 0,1 6.5,13A1.5,1.5 0 0,1 8,14.5A1.5,1.5 0 0,1 6.5,16M18.92,6C18.72,5.42 18.16,5 17.5,5H6.5C5.84,5 5.28,5.42 5.08,6L3,12V20A1,1 0 0,0 4,21H5A1,1 0 0,0 6,20V19H18V20A1,1 0 0,0 19,21H20A1,1 0 0,0 21,20V12L18.92,6Z"/>
            </svg>
            <svg v-else-if="subscription.assetType === 'estate'" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z"/>
            </svg>
            <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"/>
            </svg>
            {{ subscription.assetType }}
          </div>
          <div class="subscription-status" :class="`status-${subscription.status}`">
            {{ subscription.status }}
          </div>
        </div>

        <div class="asset-info" v-if="subscription.asset">
          <div class="asset-image">
            <img 
              :src="subscription.asset.image || '/src/picture/1.jpg'" 
              :alt="subscription.asset.name"
              @error="$event.target.src = '/src/picture/1.jpg'"
            />
          </div>
          <div class="asset-details">
            <h3 class="asset-name">{{ subscription.asset.name }}</h3>
            <p class="asset-location">{{ subscription.asset.location }}</p>
            <div class="asset-price">
              <strong>€{{ subscription.asset.price }}</strong>
              <span>/{{ subscription.assetType === 'car' ? 'day' : 'month' }}</span>
            </div>
          </div>
        </div>

        <div class="subscription-preferences">
          <h4>Notification Preferences</h4>
          <div class="preferences-list">
            <div class="preference-item">
              <span class="preference-icon" :class="{ active: subscription.preferences.emailNotifications }">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20,8L12,13L4,8V6L12,11L20,6M20,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V6C2.89,4 2,4.89 2,4Z"/>
                </svg>
              </span>
              Email Notifications
            </div>
            <div class="preference-item">
              <span class="preference-icon" :class="{ active: subscription.preferences.priceAlerts }">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7,15H9C9,16.08 10.37,17 12,17C13.63,17 15,16.08 15,15C15,13.9 13.96,13.5 11.76,12.97C9.64,12.44 7,11.78 7,9C7,7.21 8.47,5.69 10.5,5.18V3H13.5V5.18C15.53,5.69 17,7.21 17,9H15C15,7.92 13.63,7 12,7C10.37,7 9,7.92 9,9C9,10.1 10.04,10.5 12.24,11.03C14.36,11.56 17,12.22 17,15C17,16.79 15.53,18.31 13.5,18.82V21H10.5V18.82C8.47,18.31 7,16.79 7,15Z"/>
                </svg>
              </span>
              Price Alerts
            </div>
            <div class="preference-item">
              <span class="preference-icon" :class="{ active: subscription.preferences.availabilityAlerts }">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9,10H7V12H9V10M13,10H11V12H13V10M17,10H15V12H17V10M19,3H18V1H16V3H8V1H6V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3M19,19H5V8H19V19Z"/>
                </svg>
              </span>
              Availability Alerts
            </div>
          </div>
        </div>

        <div class="subscription-meta">
          <div class="subscription-date">
            <span>Subscribed:</span>
            <strong>{{ formatDate(subscription.subscribedAt) }}</strong>
          </div>
          <div class="subscription-expiry">
            <span>Expires:</span>
            <strong>{{ formatDate(subscription.expiresAt) }}</strong>
          </div>
        </div>

        <div class="subscription-actions">
          <button 
            v-if="subscription.status === 'active'"
            class="cancel-btn"
            @click="cancelSubscription(subscription._id)"
            :disabled="cancelling === subscription._id"
          >
            {{ cancelling === subscription._id ? 'Cancelling...' : 'Cancel Subscription' }}
          </button>
          <button 
            v-else
            class="disabled-btn"
            disabled
          >
            {{ subscription.status === 'cancelled' ? 'Cancelled' : 'Expired' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="empty-state">
      <div class="empty-icon">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
          <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
        </svg>
      </div>
      <h2>No Subscriptions Yet</h2>
      <p>You haven't subscribed to any assets yet. Browse cars and properties to get started!</p>
      <div class="empty-actions">
        <button class="browse-btn" @click="$router.push('/pages-user/cars')">
          Browse Cars
        </button>
        <button class="browse-btn" @click="$router.push('/pages-user/estate')">
          Browse Properties
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

definePageMeta({
  layout: 'user'
})

const subscriptions = ref([])
const loading = ref(true)
const cancelling = ref(null)

const filters = ref({
  status: '',
  assetType: ''
})

const filteredSubscriptions = computed(() => {
  return subscriptions.value.filter(sub => {
    const statusMatch = !filters.value.status || sub.status === filters.value.status
    const typeMatch = !filters.value.assetType || sub.assetType === filters.value.assetType
    return statusMatch && typeMatch
  })
})

const fetchSubscriptions = async () => {
  try {
    loading.value = true
    const { useAuthStore } = await import('~/stores/auth')
    const authStore = useAuthStore()
    
    if (!authStore.isLoggedIn) {
      navigateTo('/pages-user/auth')
      return
    }

    const response = await fetch('http://localhost:3001/api/subscriptions/my-subscriptions', {
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    })

    if (response.ok) {
      const data = await response.json()
      subscriptions.value = data.data
    } else {
      console.error('Failed to fetch subscriptions')
    }
  } catch (error) {
    console.error('Error fetching subscriptions:', error)
  } finally {
    loading.value = false
  }
}

const cancelSubscription = async (subscriptionId) => {
  if (!confirm('Are you sure you want to cancel this subscription?')) return
  
  try {
    cancelling.value = subscriptionId
    const { useAuthStore } = await import('~/stores/auth')
    const authStore = useAuthStore()

    const response = await fetch(`http://localhost:3001/api/subscriptions/${subscriptionId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    })

    if (response.ok) {
      const subscription = subscriptions.value.find(s => s._id === subscriptionId)
      if (subscription) subscription.status = 'cancelled'
      alert('Subscription cancelled successfully')
    } else {
      alert('Failed to cancel subscription')
    }
  } catch (error) {
    console.error('Error cancelling subscription:', error)
    alert('Network error. Please try again.')
  } finally {
    cancelling.value = null
  }
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString()
}

onMounted(() => {
  fetchSubscriptions()
})
</script>

<style scoped>
.subscriptions-page {
  padding: 2rem 1rem;
  background: #1d4857;
  min-height: 100vh;
  border-radius: 24px;
}

.page-header {
  background: #fff;
  border-radius: 18px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 12px rgba(29, 72, 87, 0.10);
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1d4857;
  margin-bottom: 0.5rem;
}

.page-subtitle {
  font-size: 1.1rem;
  color: #666;
  margin: 0;
}

.subscription-filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  align-items: center;
  background: #fff;
  border-radius: 14px;
  padding: 1rem 1.5rem;
  box-shadow: 0 2px 8px rgba(29, 72, 87, 0.08);
}

.subscription-filters select {
  padding: 0.5rem 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 1rem;
  background: #fff;
  min-width: 150px;
}

.refresh-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #1976d2;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.2s;
}

.refresh-btn:hover {
  background: #1565c0;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  background: #fff;
  border-radius: 18px;
  color: #666;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e0e0e0;
  border-top: 4px solid #1976d2;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.subscriptions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 2rem;
}

.subscription-card {
  background: #fff;
  border-radius: 18px;
  padding: 1.5rem;
  box-shadow: 0 2px 12px rgba(29, 72, 87, 0.10);
  transition: box-shadow 0.2s;
  border: 2px solid transparent;
}

.subscription-card:hover {
  box-shadow: 0 4px 20px rgba(29, 72, 87, 0.15);
}

.subscription-inactive {
  opacity: 0.7;
  border: 2px solid #e0e0e0;
}

.subscription-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.asset-type-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: capitalize;
}

.type-car {
  background: #e3f2fd;
  color: #1976d2;
}

.type-estate {
  background: #e8f5e8;
  color: #2e7d32;
}

.type-asset {
  background: #fff3e0;
  color: #f57c00;
}

.subscription-status {
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: capitalize;
}

.status-active {
  background: #e8f5e8;
  color: #2e7d32;
}

.status-cancelled {
  background: #ffebee;
  color: #c62828;
}

.status-expired {
  background: #fafafa;
  color: #616161;
}

.asset-info {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e0e0e0;
}

.asset-image {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
}

.asset-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.asset-details {
  flex: 1;
}

.asset-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1d4857;
  margin: 0 0 0.25rem 0;
}

.asset-location {
  font-size: 0.875rem;
  color: #666;
  margin: 0 0 0.5rem 0;
}

.asset-price {
  font-size: 1rem;
  color: #1976d2;
}

.asset-price strong {
  font-weight: 700;
}

.subscription-preferences {
  margin-bottom: 1.5rem;
}

.subscription-preferences h4 {
  font-size: 0.875rem;
  font-weight: 600;
  color: #1d4857;
  margin: 0 0 0.75rem 0;
}

.preferences-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.preference-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #666;
}

.preference-icon {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
  color: #ccc;
}

.preference-icon.active {
  background: #e8f5e8;
  color: #2e7d32;
}

.subscription-meta {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  font-size: 0.875rem;
  color: #666;
}

.subscription-meta span {
  display: block;
  margin-bottom: 0.25rem;
}

.subscription-actions {
  display: flex;
  gap: 1rem;
}

.cancel-btn {
  background: #c62828;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.2s;
  flex: 1;
}

.cancel-btn:hover:not(:disabled) {
  background: #b71c1c;
}

.cancel-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.disabled-btn {
  background: #f5f5f5;
  color: #999;
  border: none;
  border-radius: 6px;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  cursor: not-allowed;
  flex: 1;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  background: #fff;
  border-radius: 18px;
  text-align: center;
}

.empty-icon {
  color: #ccc;
  margin-bottom: 1rem;
}

.empty-state h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1d4857;
  margin: 0 0 0.5rem 0;
}

.empty-state p {
  font-size: 1rem;
  color: #666;
  margin: 0 0 2rem 0;
  max-width: 400px;
}

.empty-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
}

.browse-btn {
  background: #1976d2;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.2s;
}

.browse-btn:hover {
  background: #1565c0;
}

@media (max-width: 768px) {
  .subscriptions-grid {
    grid-template-columns: 1fr;
  }
  
  .subscription-filters {
    flex-direction: column;
    align-items: stretch;
  }
  
  .subscription-filters select {
    min-width: auto;
  }
  
  .asset-info {
    flex-direction: column;
  }
  
  .asset-image {
    align-self: center;
  }
  
  .subscription-meta {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>
