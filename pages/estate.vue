<template>
  <div class="estate-page">
    <!-- Filter/Search Bar -->
    <div class="estate-filters">
      <select v-model="filters.type">
        <option>Rent</option>
        <option>Buy</option>
      </select>
      <select v-model="filters.category">
        <option>Apartment</option>
        <option>House</option>
        <option>Office</option>
      </select>
      <input v-model="filters.city" placeholder="City" />
      <input v-model="filters.district" placeholder="District" />
      <select v-model="filters.currency">
        <option>EUR</option>
        <option>USD</option>
        <option>PLN</option>
      </select>
      <input v-model="filters.priceFrom" type="number" placeholder="From (€)" style="width:90px" />
      <input v-model="filters.priceTo" type="number" placeholder="To (€)" style="width:90px" />
      <button class="save-search">Save search</button>
    </div>

    <div class="estate-main" :class="{ 'full-list': !selectedEstate }">
      <!-- Estate List -->
      <div class="estate-list" :class="{ 'shrink': selectedEstate }">
        <div
          v-for="estate in filteredEstates"
          :key="estate.id"
          class="estate-card"
          :class="{ active: selectedEstate && selectedEstate.id === estate.id }"
        >
          <div class="estate-card-img-wrap" @click="selectEstate(estate)">
            <img :src="estate.image" alt="estate" class="estate-card-img" />
            <button class="fav-btn" @click.stop="toggleFav(estate)">
              <svg v-if="estate.fav" width="22" height="22" fill="#ffe066" stroke="#1d4857" stroke-width="2" viewBox="0 0 24 24">
                <path d="M12 21s-6.5-5.2-9-8.4C.7 10.1 1.6 7.2 4.1 6.2c1.6-.6 3.3.1 4.3 1.3C9.9 8.4 12 10.5 12 10.5s2.1-2.1 3.6-3c1-.8 2.7-1.5 4.3-1.3 2.5 1 3.4 3.9 1.1 6.4C18.5 15.8 12 21 12 21z"/>
              </svg>
              <svg v-else width="22" height="22" fill="none" stroke="#1d4857" stroke-width="2" viewBox="0 0 24 24">
                <path d="M12 21s-6.5-5.2-9-8.4C.7 10.1 1.6 7.2 4.1 6.2c1.6-.6 3.3.1 4.3 1.3C9.9 8.4 12 10.5 12 10.5s2.1-2.1 3.6-3c1-.8 2.7-1.5 4.3-1.3 2.5 1 3.4 3.9 1.1 6.4C18.5 15.8 12 21 12 21z"/>
              </svg>
            </button>
            <div class="estate-card-badges">
              <span class="badge flag"><img src="https://flagcdn.com/16x12/ua.png" alt="UA" /></span>
              <span class="badge discount">-50%</span>
              <span class="badge realtor">Realtor</span>
            </div>
            <span class="estate-card-date">26.05.2022</span>
          </div>
          <div class="estate-card-info">
            <div class="estate-card-location">{{ estate.location }}</div>
            <div class="estate-card-details">
              <span>{{ estate.size }}㎡</span>
              <span>{{ estate.rooms }} rooms</span>
              <span>{{ estate.allowed ? 'Allowed' : 'Not allowed' }}</span>
            </div>
            <div class="estate-card-price">€ {{ estate.price }}</div>
          </div>
        </div>
      </div>

      <!-- Estate Details -->
      <div class="estate-details" v-if="selectedEstate">
        <button class="back-btn" @click="selectedEstate = null">← Back to list</button>
        <div class="estate-details-header">
          <div>
            <h2>{{ selectedEstate.title }}</h2>
            <div class="estate-card-location">{{ selectedEstate.location }}</div>
            <div class="estate-card-details">
              <span>{{ selectedEstate.size }}㎡</span>
              <span>{{ selectedEstate.rooms }} rooms</span>
              <span>{{ selectedEstate.allowed ? 'Animals allowed' : 'No animals' }}</span>
            </div>
          </div>
          <div class="estate-details-price">
            <span>€ {{ selectedEstate.price }}</span>
          </div>
        </div>
        <img :src="selectedEstate.image" class="estate-details-img" alt="estate" />
        <div class="estate-details-actions">
          <button class="photo-btn">Photo</button>
          <button class="plan-btn">Plan</button>
        </div>
        <div class="estate-details-description">
          <strong>Description</strong>
          <p>{{ selectedEstate.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const estates = ref([
  {
    id: 1,
    title: 'Apartment for rent',
    location: 'Warsaw, Grybowska 61, Wola',
    size: 76,
    rooms: 3,
    allowed: true,
    price: 1242,
    fav: false,
    image: 'https://www.digitalphotomentor.com/photography/2018/09/real-estate-photography-interior-photo-750x500.jpg',
    description: 'Well rent out cozy, warm 2-room apartment, 1/5 story building, #39/07, adjoining rooms, separate bathroom. The apartment has a fresh cosmetic renovation, double glazed windows everywhere, the balcony is glazed, sheathed. There are new tiles on the floor in the hallway, new tiles in the kitchen, parquet in the rooms. Utility meters for hot and cold water. Boiler 50L.'
  },
  {
    id: 2,
    title: 'Apartment for rent',
    location: 'Warsaw, Hubnera 19/12',
    size: 132,
    rooms: 4,
    allowed: true,
    price: 2500,
    fav: false,
    image: 'https://www.digitalphotomentor.com/photography/2018/09/real-estate-living-room-photo-2.jpg',
    description: 'Spacious 4-room apartment with modern amenities, large windows, and a balcony. Perfect for families.'
  },
  {
    id: 3,
    title: 'Apartment for rent',
    location: 'Warsaw, Kaliskia Ochota',
    size: 61,
    rooms: 2,
    allowed: false,
    price: 920,
    fav: false,
    image: 'https://plus.unsplash.com/premium_photo-1684348962314-64fa628992f0?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8cmVhbCUyMGVzdGF0ZSUyMGludGVyaW9yfGVufDB8fDB8fHww',
    description: 'Bright and cozy apartment in a quiet neighborhood. Close to public transport and shops.'
  },
  {
    id: 4,
    title: 'Apartment for rent',
    location: 'Warsaw, Aleja Na Skarpie 21',
    size: 45,
    rooms: 1,
    allowed: true,
    price: 1340,
    fav: false,
    image: 'https://www.photoplan.co.uk/wp-content/uploads/2021/05/Interior_Photography_-_100-2-1.jpg',
    description: 'Modern studio apartment with all conveniences. Ideal for singles or couples.'
  }
]);

const selectedEstate = ref(null);

const filters = ref({
  type: 'Rent',
  category: 'Apartment',
  city: '',
  district: '',
  currency: 'EUR',
  priceFrom: '',
  priceTo: ''
});

const filteredEstates = computed(() => {
  return estates.value.filter(e => {
    return (
      (!filters.value.city || e.location.toLowerCase().includes(filters.value.city.toLowerCase())) &&
      (!filters.value.category || e.title.toLowerCase().includes(filters.value.category.toLowerCase())) &&
      (!filters.value.priceFrom || e.price >= Number(filters.value.priceFrom)) &&
      (!filters.value.priceTo || e.price <= Number(filters.value.priceTo))
    );
  });
});

function selectEstate(estate) {
  selectedEstate.value = estate;
}

function toggleFav(estate) {
  estate.fav = !estate.fav;
}
</script>

<style scoped>
.estate-page {
  padding: 2rem 1rem;
  background: #1d4857;
  min-height: 100vh;
  border-radius: 24px;
}
.estate-filters {
  display: flex;
  gap: 0.7rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  align-items: center;
  background: #fff;
  border-radius: 14px;
  padding: 1rem 1.5rem;
  box-shadow: 0 2px 8px rgba(29, 72, 87, 0.08);
}
.estate-filters select,
.estate-filters input {
  padding: 0.4rem 0.7rem;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 1rem;
  background: #fff;
}
.save-search {
  background: #ffe066;
  border: none;
  border-radius: 6px;
  padding: 0.4rem 1.1rem;
  font-weight: 600;
  color: #23272f;
  cursor: pointer;
  transition: background 0.2s;
}
.save-search:hover {
  background: #ffd700;
}
.estate-main {
  display: flex;
  gap: 2rem;
  transition: all 0.3s;
}
.estate-main.full-list {
  .estate-list {
    max-width: 100% !important;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  }
}
.estate-list {
  flex: 1 1 350px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 2rem;
  max-width: 700px;
  transition: max-width 0.3s;
}
.estate-list.shrink {
  max-width: 50%;
}
.estate-card {
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 2px 12px rgba(29, 72, 87, 0.10);
  display: flex;
  flex-direction: column;
  cursor: pointer;
  transition: box-shadow 0.2s, border 0.2s;
  border: 2px solid transparent;
  overflow: hidden;
  min-height: 340px;
  position: relative;
}
.estate-card.active, .estate-card:hover {
  border: 2px solid #ffe066;
  box-shadow: 0 4px 16px rgba(255,224,102,0.15);
}
.estate-card-img-wrap {
  position: relative;
  width: 100%;
  height: 170px;
  overflow: hidden;
  border-radius: 18px 18px 0 0;
}
.estate-card-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.2s;
}
.estate-card-img-wrap:hover .estate-card-img {
  transform: scale(1.04);
}
.fav-btn {
  position: absolute;
  top: 10px;
  right: 12px;
  background: rgba(255,255,255,0.92);
  border: none;
  border-radius: 50%;
  padding: 6px;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(29, 72, 87, 0.10);
  transition: background 0.2s;
  z-index: 2;
}
.fav-btn:hover {
  background: #ffe066;
}
.estate-card-badges {
  position: absolute;
  top: 10px;
  left: 12px;
  display: flex;
  gap: 6px;
  z-index: 2;
}
.badge {
  background: #fff;
  border-radius: 6px;
  padding: 2px 7px;
  font-size: 0.85em;
  font-weight: 600;
  color: #1d4857;
  box-shadow: 0 1px 4px rgba(29, 72, 87, 0.10);
  display: flex;
  align-items: center;
}
.badge.flag {
  padding: 2px 3px;
}
.badge.discount {
  background: #e0f7fa;
  color: #1976d2;
}
.badge.realtor {
  background: #ffe066;
  color: #1d4857;
}
.estate-card-date {
  position: absolute;
  left: 12px;
  bottom: 10px;
  background: #fff;
  border-radius: 6px;
  padding: 2px 8px;
  font-size: 0.85em;
  color: #888;
  box-shadow: 0 1px 4px rgba(29, 72, 87, 0.10);
}
.estate-card-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 1.1rem 1.1rem 1.2rem 1.1rem;
  gap: 0.4rem;
}
.estate-card-location {
  font-size: 0.97rem;
  color: #888;
  margin-bottom: 0.2rem;
}
.estate-card-details {
  font-size: 0.95rem;
  color: #666;
  display: flex;
  gap: 0.7rem;
  margin-bottom: 0.2rem;
  flex-wrap: wrap;
}
.estate-card-price {
  font-weight: 700;
  color: #1976d2;
  font-size: 1.15rem;
  margin-top: 0.2rem;
}
.estate-details {
  flex: 2 1 500px;
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 2px 16px rgba(29, 72, 87, 0.12);
  padding: 2rem 2rem 1.5rem 2rem;
  min-width: 0;
  max-width: 700px;
  margin-left: auto;
  display: flex;
  flex-direction: column;
  animation: fadeIn 0.3s;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateX(40px);}
  to { opacity: 1; transform: translateX(0);}
}
.back-btn {
  background: none;
  border: none;
  color: #1976d2;
  font-size: 1rem;
  margin-bottom: 1rem;
  cursor: pointer;
  font-weight: 600;
  padding: 0;
}
.estate-details-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1rem;
}
.estate-details-price {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1976d2;
}
.estate-details-img {
  width: 100%;
  max-height: 260px;
  object-fit: cover;
  border-radius: 10px;
  margin-bottom: 1rem;
}
.estate-details-actions {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}
.photo-btn, .plan-btn {
  background: #f5f5f7;
  border: none;
  border-radius: 6px;
  padding: 0.4rem 1.1rem;
  font-size: 1rem;
  color: #23272f;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.2s;
}
.photo-btn:hover, .plan-btn:hover {
  background: #ffe066;
}
.estate-details-description {
  font-size: 1rem;
  color: #444;
}
@media (max-width: 1100px) {
  .estate-main {
    flex-direction: column;
  }
  .estate-list, .estate-list.shrink, .estate-details {
    max-width: 100%;
    width: 100%;
  }
  .estate-details {
    margin-left: 0;
    margin-top: 2rem;
  }
}
</style>