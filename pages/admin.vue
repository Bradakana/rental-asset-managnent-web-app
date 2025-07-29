<template>
  <div class="admin-panel">
    <aside :class="['sidebar', { minimized }]">
      <div class="sidebar-header">
        <span class="sidebar-title" v-if="!minimized">Admin Panel</span>
        <button class="sidebar-toggle" @click="minimized = !minimized">
          <svg width="24" height="24" fill="none" stroke="#1d4857" stroke-width="2" viewBox="0 0 24 24">
            <path v-if="minimized" d="M9 6l6 6-6 6"/>
            <path v-else d="M15 6l-6 6 6 6"/>
          </svg>
        </button>
      </div>
      <nav class="sidebar-nav">
        <ul>
          <li :class="{active: tab==='records'}" @click="tab='records'">
            <span v-if="!minimized">Rental Records</span>
            <span v-else>📄</span>
          </li>
          <li :class="{active: tab==='history'}" @click="tab='history'">
            <span v-if="!minimized">View History</span>
            <span v-else>📜</span>
          </li>
          <li :class="{active: tab==='documents'}" @click="tab='documents'">
            <span v-if="!minimized">Renter Documents</span>
            <span v-else>📁</span>
          </li>
          <li :class="{active: tab==='assets'}" @click="tab='assets'">
            <span v-if="!minimized">Assets Status</span>
            <span v-else>🏠</span>
          </li>
          <li :class="{active: tab==='earnings'}" @click="tab='earnings'">
            <span v-if="!minimized">Earnings</span>
            <span v-else>💰</span>
          </li>
          <li :class="{active: tab==='alerts'}" @click="tab='alerts'">
            <span v-if="!minimized">Overdue Alerts</span>
            <span v-else>⚠️</span>
          </li>
        </ul>
      </nav>
    </aside>
    <main class="admin-main">
      <div v-if="tab==='records'">
        <h2>Rental Records</h2>
        <table class="admin-table">
          <thead>
            <tr>
              <th>Asset</th>
              <th>Renter</th>
              <th>Start</th>
              <th>End</th>
              <th>Status</th>
              <th>Mark Returned</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="r in rentals" :key="r.id">
              <td>{{ r.asset }}</td>
              <td>{{ r.renter }}</td>
              <td>{{ r.start }}</td>
              <td>{{ r.end }}</td>
              <td>
                <span :class="['status', r.status]">{{ r.status }}</span>
              </td>
              <td>
                <button v-if="r.status==='active'" @click="markReturned(r)">Mark Returned</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else-if="tab==='history'">
        <h2>Rental History</h2>
        <ul>
          <li v-for="h in history" :key="h.id">
            {{ h.asset }} - {{ h.renter }} ({{ h.start }} to {{ h.end }}) - {{ h.status }}
          </li>
        </ul>
      </div>
      <div v-else-if="tab==='documents'">
        <h2>Renter Documents</h2>
        <input type="file" @change="uploadDoc" />
        <ul>
          <li v-for="doc in documents" :key="doc.id">
            <a :href="doc.url" target="_blank">{{ doc.name }}</a>
          </li>
        </ul>
      </div>
      <div v-else-if="tab==='assets'">
        <h2>Assets Status</h2>
        <div class="assets-status">
          <div>
            <strong>Rented:</strong> {{ stats.rented }}
          </div>
          <div>
            <strong>Available:</strong> {{ stats.available }}
          </div>
          <div>
            <strong>Active Rentals:</strong> {{ stats.active }}
          </div>
        </div>
      </div>
      <div v-else-if="tab==='earnings'">
        <h2>Earnings</h2>
        <div class="earnings">
          <strong>Total:</strong> €{{ stats.earnings }}
        </div>
      </div>
      <div v-else-if="tab==='alerts'">
        <h2>Overdue Alerts</h2>
        <ul>
          <li v-for="a in alerts" :key="a.id">
            {{ a.asset }} - {{ a.renter }} (Due: {{ a.due }})
          </li>
        </ul>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const minimized = ref(false);
const tab = ref('records');

const rentals = ref([
  { id: 1, asset: 'Apartment 101', renter: 'John Doe', start: '2025-07-01', end: '2025-07-31', status: 'active' },
  { id: 2, asset: 'Car A3', renter: 'Jane Smith', start: '2025-06-15', end: '2025-07-15', status: 'returned' }
]);
const history = ref([
  { id: 1, asset: 'Apartment 101', renter: 'John Doe', start: '2025-06-01', end: '2025-06-30', status: 'returned' }
]);
const documents = ref([
  { id: 1, name: 'Lease_JohnDoe.pdf', url: '#' }
]);
const stats = ref({
  rented: 5,
  available: 3,
  active: 4,
  earnings: 3200
});
const alerts = ref([
  { id: 1, asset: 'Apartment 101', renter: 'John Doe', due: '2025-07-31' }
]);

function markReturned(rental) {
  rental.status = 'returned';
  stats.value.active--;
  stats.value.available++;
}

function uploadDoc(e) {
  if (e.target.files.length) {
    documents.value.push({
      id: Date.now(),
      name: e.target.files[0].name,
      url: '#'
    });
  }
}
</script>

<style scoped>
.admin-panel {
  display: flex;
  min-height: 100vh;
  background: #f8f9fa;
}
.sidebar {
  background: #1d4857;
  color: #fff;
  width: 220px;
  min-width: 60px;
  transition: width 0.2s;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0 12px rgba(29,72,87,0.08);
}
.sidebar.minimized {
  width: 60px;
}
.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 16px;
  border-bottom: 1px solid #17404a;
}
.sidebar-title {
  font-size: 1.2rem;
  font-weight: 700;
  letter-spacing: 1px;
}
.sidebar-toggle {
  background: none;
  border: none;
  cursor: pointer;
  color: #fff;
  padding: 0;
}
.sidebar-nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.sidebar-nav li {
  padding: 16px 18px;
  cursor: pointer;
  font-size: 1rem;
  display: flex;
  align-items: center;
  transition: background 0.2s;
  border-left: 4px solid transparent;
}
.sidebar-nav li.active,
.sidebar-nav li:hover {
  background: #17404a;
  border-left: 4px solid #ffe066;
}
.admin-main {
  flex: 1;
  padding: 36px 48px;
  background: #fff;
  border-radius: 0 24px 24px 0;
  box-shadow: 0 4px 32px rgba(29, 72, 87, 0.08);
  min-height: 100vh;
}
.admin-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 24px;
}
.admin-table th, .admin-table td {
  padding: 12px 10px;
  border-bottom: 1px solid #e0e0e0;
  text-align: left;
}
.status {
  padding: 4px 12px;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.98rem;
}
.status.active {
  background: #e0f7fa;
  color: #1976d2;
}
.status.returned {
  background: #ffe066;
  color: #1d4857;
}
.assets-status {
  display: flex;
  gap: 32px;
  margin: 18px 0;
  font-size: 1.1rem;
}
.earnings {
  font-size: 1.2rem;
  margin: 18px 0;
}
@media (max-width: 900px) {
  .admin-panel {
    flex-direction: column;
  }
  .sidebar {
    width: 100%;
    min-width: 0;
    flex-direction: row;
    border-radius: 24px 24px 0 0;
  }
  .admin-main {
    border-radius: 0 0 24px 24px;
    padding: 24px 12px;
  }
  }
</style>