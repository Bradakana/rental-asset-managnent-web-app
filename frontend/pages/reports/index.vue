<template>
  <div>
    <v-row class="mb-4">
      <v-col>
        <h1 class="text-h4 font-weight-bold">Reports</h1>
        <p class="text-subtitle-1 text-medium-emphasis">Generate PDF reports from database</p>
      </v-col>
    </v-row>

    <v-card elevation="2" class="mb-4">
      <v-card-text>
        <v-row>
          <v-col cols="12" md="4">
            <v-select
              v-model="reportType"
              :items="reportTypes"
              label="Report Type"
              density="comfortable"
            />
          </v-col>
          <v-col cols="12" md="3">
            <v-text-field v-model="dateFrom" type="date" label="From" density="comfortable" />
          </v-col>
          <v-col cols="12" md="3">
            <v-text-field v-model="dateTo" type="date" label="To" density="comfortable" />
          </v-col>
          <v-col cols="12" md="2" class="d-flex align-end">
            <v-btn color="primary" @click="generateReport" :loading="loading">Generate PDF</v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <v-card elevation="2">
      <v-card-title class="d-flex align-center">
        <v-icon class="mr-2">mdi-database</v-icon>
        Preview (first 10 rows)
        <v-spacer />
        <v-btn variant="text" icon="mdi-refresh" @click="loadPreview" :loading="loading" />
      </v-card-title>
      <v-card-text>
        <v-table v-if="rows.length">
          <thead>
            <tr>
              <th v-for="h in headers" :key="h">{{ h }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(r, idx) in rows.slice(0, 10)" :key="idx">
              <td v-for="h in headers" :key="h">{{ r[h] }}</td>
            </tr>
          </tbody>
        </v-table>
        <div v-else class="text-medium-emphasis">No data</div>
      </v-card-text>
    </v-card>
  </div>
  
</template>

<script setup>
import { ref } from 'vue'

definePageMeta({ layout: 'default' })

const loading = ref(false)
const reportType = ref('subscriptions')
const reportTypes = [
  { title: 'Subscriptions', value: 'subscriptions' },
  { title: 'Renters', value: 'renters' },
  { title: 'Rentals', value: 'rentals' }
]
const dateFrom = ref('')
const dateTo = ref('')
const headers = ref([])
const rows = ref([])

const authFetch = async (url) => {
  const { useAuthStore } = await import('~/stores/auth')
  const authStore = useAuthStore()
  await authStore.checkAuth()
  const res = await fetch(url, { headers: { 'Authorization': `Bearer ${authStore.token}` } })
  if (!res.ok) throw new Error('Request failed')
  return res.json()
}

const loadPreview = async () => {
  try {
    loading.value = true
    const from = dateFrom.value ? new Date(dateFrom.value).toISOString() : null
    const to = dateTo.value ? new Date(dateTo.value).toISOString() : null

    if (reportType.value === 'subscriptions') {
      const params = new URLSearchParams()
      if (from || to) params.append('status', 'active')
      const data = await authFetch(`http://localhost:3001/api/subscriptions/vendor-subscriptions?${params}`)
      const list = data.data || []
      headers.value = ['Username', 'FirstName', 'LastName', 'Email', 'Phone', 'Asset', 'Type', 'Status', 'SubscribedAt']
      rows.value = list.map(s => ({
        Username: s.userId?.username || '',
        FirstName: s.userId?.firstName || '',
        LastName: s.userId?.lastName || '',
        Email: s.userId?.email || '',
        Phone: s.userId?.phone || '',
        Asset: s.asset?.name || '',
        Type: s.assetType,
        Status: s.status,
        SubscribedAt: new Date(s.subscribedAt).toLocaleDateString()
      }))
    } else if (reportType.value === 'renters') {
      const params = new URLSearchParams()
      if (from || to) params.append('status', 'active')
      const data = await authFetch(`http://localhost:3001/api/renters?${params}`)
      const list = data.data || []
      headers.value = ['FirstName', 'LastName', 'Email', 'Phone', 'Address', 'LicenseNumber', 'PassportNumber', 'Status', 'Verified', 'TotalRentals', 'TotalSpent']
      rows.value = list.map(r => ({
        FirstName: r.firstName || '',
        LastName: r.lastName || '',
        Email: r.email,
        Phone: r.phone,
        Address: r.address || '',
        LicenseNumber: r.licenseNumber || '',
        PassportNumber: r.passportNumber || '',
        Status: r.status || 'active',
        Verified: r.verified ? 'Yes' : 'No',
        TotalRentals: r.totalRentals || 0,
        TotalSpent: r.totalSpent || 0
      }))
    } else if (reportType.value === 'rentals') {
      const data = await authFetch('http://localhost:3001/api/rentals')
      const list = data.data || []
      headers.value = ['RentalId', 'Asset', 'Type', 'RenterFirst', 'RenterLast', 'RenterEmail', 'StartDate', 'EndDate', 'DailyRate', 'Deposit', 'Status', 'Total']
      rows.value = list.map(r => ({
        RentalId: r._id,
        Asset: r.assetId?.name || r.asset?.name || '',
        Type: r.assetId?.type || r.asset?.type || '',
        RenterFirst: r.renterId?.firstName || '',
        RenterLast: r.renterId?.lastName || '',
        RenterEmail: r.renterId?.email || '',
        StartDate: new Date(r.startDate).toLocaleDateString(),
        EndDate: new Date(r.endDate).toLocaleDateString(),
        DailyRate: r.dailyRate,
        Deposit: r.deposit || 0,
        Status: r.status,
        Total: r.totalAmount
      }))
    }
  } catch (e) {
    console.error('Load preview error:', e)
    headers.value = []
    rows.value = []
  } finally {
    loading.value = false
  }
}

const generateReport = async () => {
  try {
    loading.value = true
    await loadPreview()

    if (!rows.value.length) return
    const { jsPDF } = await import('jspdf')
    const autoTable = (await import('jspdf-autotable')).default

    const doc = new jsPDF({ orientation: 'landscape' })
    const title = `Report - ${reportType.value} (${new Date().toLocaleDateString()})`
    doc.setFontSize(16)
    doc.text(title, 14, 16)

    autoTable(doc, {
      head: [headers.value],
      body: rows.value.map(r => headers.value.map(h => r[h] ?? '')),
      startY: 22,
      styles: { fontSize: 9 }
    })

    doc.save(`${reportType.value}-report-${Date.now()}.pdf`)
  } catch (e) {
    console.error('Generate PDF error:', e)
  } finally {
    loading.value = false
  }
}

// initial
loadPreview()
</script>