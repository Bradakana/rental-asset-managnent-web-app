<template>
  <div class="agencies-page">
    <div class="agencies-header">
      <h1>Find Real Estate & Car Dealer Agents</h1>
      <div class="agencies-filters">
        <input v-model="search" type="text" placeholder="Search by name or agency..." />
        <select v-model="type">
          <option value="">All Types</option>
          <option value="Real Estate">Real Estate</option>
          <option value="Car Dealer">Car Dealer</option>
        </select>
        <select v-model="minStars">
          <option value="0">All Ratings</option>
          <option value="3">3+ Stars</option>
          <option value="4">4+ Stars</option>
          <option value="5">5 Stars</option>
        </select>
      </div>
    </div>
    <div class="agencies-list">
      <div
        v-for="agent in filteredAgents"
        :key="agent.id"
        class="agency-card"
      >
        <img :src="agent.face" alt="Agent" class="agency-face" />
        <div class="agency-info">
          <h2 class="agency-name">{{ agent.name }}</h2>
          <p class="agency-type">{{ agent.type }}</p>
          <p class="agency-agency">{{ agent.agency }}</p>
          <div class="agency-stars">
            <span v-for="n in 5" :key="n" class="star" :class="{ filled: n <= agent.stars }">★</span>
            <span class="agency-rating">{{ agent.stars }}.0</span>
          </div>
        </div>
      </div>
      <div v-if="filteredAgents.length === 0" class="agencies-empty">
        No agents found.
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const agents = ref([
  {
    id: 1,
    name: "Anna Kowalska",
    type: "Real Estate",
    agency: "Dream Homes",
    stars: 5,
    face: "https://randomuser.me/api/portraits/women/44.jpg"
  },
  {
    id: 2,
    name: "John Smith",
    type: "Car Dealer",
    agency: "AutoPro",
    stars: 4,
    face: "https://randomuser.me/api/portraits/men/32.jpg"
  },
  {
    id: 3,
    name: "Maria Nowak",
    type: "Real Estate",
    agency: "City Estates",
    stars: 4,
    face: "https://randomuser.me/api/portraits/women/65.jpg"
  },
  {
    id: 4,
    name: "Robert Lee",
    type: "Car Dealer",
    agency: "CarMax",
    stars: 5,
    face: "https://randomuser.me/api/portraits/men/41.jpg"
  },
  {
    id: 5,
    name: "Eliza Green",
    type: "Real Estate",
    agency: "Green Realty",
    stars: 3,
    face: "https://randomuser.me/api/portraits/women/68.jpg"
  }
]);

const search = ref("");
const type = ref("");
const minStars = ref(0);

const filteredAgents = computed(() => {
  return agents.value.filter(agent => {
    const matchesType = !type.value || agent.type === type.value;
    const matchesStars = agent.stars >= minStars.value;
    const matchesSearch =
      !search.value ||
      agent.name.toLowerCase().includes(search.value.toLowerCase()) ||
      agent.agency.toLowerCase().includes(search.value.toLowerCase());
    return matchesType && matchesStars && matchesSearch;
  });
});
</script>

<style scoped>
.agencies-page {
  min-height: 100vh;
  background: #f5f7fa;
  padding: 2rem 0;
}
.agencies-header {
  text-align: center;
  margin-bottom: 2rem;
}
.agencies-header h1 {
  color: #1d4857;
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1.2rem;
}
.agencies-filters {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
}
.agencies-filters input,
.agencies-filters select {
  padding: 0.6rem 1rem;
  border-radius: 8px;
  border: 1px solid #d0d7de;
  font-size: 1rem;
  background: #fff;
}
.agencies-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 2rem;
  justify-content: center;
  max-width: 1100px;
  margin: 0 auto;
}
.agency-card {
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 4px 32px rgba(29, 72, 87, 0.10);
  padding: 2rem 1.2rem 1.2rem 1.2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.agency-face {
  width: 90px;
  height: 90px;
  object-fit: cover;
  border-radius: 50%;
  margin-bottom: 1rem;
  border: 3px solid #8f4afc;
}
.agency-info {
  text-align: center;
}
.agency-name {
  font-size: 1.15rem;
  font-weight: 700;
  color: #23272f;
  margin-bottom: 0.3rem;
}
.agency-type {
  color: #3a3afc;
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.2rem;
}
.agency-agency {
  color: #444;
  font-size: 1rem;
  margin-bottom: 0.5rem;
}
.agency-stars {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2px;
  margin-top: 0.2rem;
}
.star {
  font-size: 1.2rem;
  color: #e0e0e0;
}
.star.filled {
  color: #ffe066;
}
.agency-rating {
  margin-left: 6px;
  font-size: 1rem;
  color: #888;
}
.agencies-empty {
  grid-column: 1/-1;
  text-align: center;
  color: #888;
  font-size: 1.2rem;
  margin-top: 40px;
}
</style>