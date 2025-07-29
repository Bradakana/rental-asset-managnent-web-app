<template>
  <div class="car-page">
    <!-- Filter/Search Bar -->
    <div class="car-filters">
      <select v-model="filters.type">
        <option>Rent</option>
        <option>Lease</option>
      </select>
      <select v-model="filters.brand">
        <option>Any brand</option>
        <option>Toyota</option>
        <option>BMW</option>
        <option>Mercedes</option>
        <option>Audi</option>
      </select>
      <input v-model="filters.model" placeholder="Model" />
      <input v-model="filters.yearFrom" type="number" placeholder="Year from" style="width:90px" />
      <input v-model="filters.yearTo" type="number" placeholder="Year to" style="width:90px" />
      <select v-model="filters.fuel">
        <option>Any fuel</option>
        <option>Petrol</option>
        <option>Diesel</option>
        <option>Hybrid</option>
        <option>Electric</option>
      </select>
      <input v-model="filters.priceFrom" type="number" placeholder="From (€)" style="width:90px" />
      <input v-model="filters.priceTo" type="number" placeholder="To (€)" style="width:90px" />
      <button class="save-search">Save search</button>
    </div>

    <div class="car-main" :class="{ 'full-list': !selectedCar }">
      <!-- Car List -->
      <div class="car-list" :class="{ 'shrink': selectedCar }">
        <div
          v-for="car in filteredCars"
          :key="car.id"
          class="car-card"
          :class="{ active: selectedCar && selectedCar.id === car.id }"
        >
          <div class="car-card-img-wrap" @click="selectCar(car)">
            <img :src="car.image" alt="car" class="car-card-img" />
            <button class="fav-btn" @click.stop="toggleFav(car)">
              <svg v-if="car.fav" width="22" height="22" fill="#ffe066" stroke="#1d4857" stroke-width="2" viewBox="0 0 24 24">
                <path d="M12 21s-6.5-5.2-9-8.4C.7 10.1 1.6 7.2 4.1 6.2c1.6-.6 3.3.1 4.3 1.3C9.9 8.4 12 10.5 12 10.5s2.1-2.1 3.6-3c1-.8 2.7-1.5 4.3-1.3 2.5 1 3.4 3.9 1.1 6.4C18.5 15.8 12 21 12 21z"/>
              </svg>
              <svg v-else width="22" height="22" fill="none" stroke="#1d4857" stroke-width="2" viewBox="0 0 24 24">
                <path d="M12 21s-6.5-5.2-9-8.4C.7 10.1 1.6 7.2 4.1 6.2c1.6-.6 3.3.1 4.3 1.3C9.9 8.4 12 10.5 12 10.5s2.1-2.1 3.6-3c1-.8 2.7-1.5 4.3-1.3 2.5 1 3.4 3.9 1.1 6.4C18.5 15.8 12 21 12 21z"/>
              </svg>
            </button>
          </div>
          <div class="car-card-info">
            <div class="car-card-title">{{ car.brand }} {{ car.model }}</div>
            <div class="car-card-location">{{ car.location }}</div>
            <div class="car-card-details">
              <span>{{ car.year }}</span>
              <span>{{ car.fuel }}</span>
              <span>{{ car.seats }} seats</span>
              <span>{{ car.transmission }}</span>
            </div>
            <div class="car-card-price">€ {{ car.price }}/mo</div>
          </div>
        </div>
      </div>

      <!-- Car Details -->
      <div class="car-details" v-if="selectedCar">
        <button class="back-btn" @click="selectedCar = null">← Back to list</button>
        <div class="car-details-header">
          <div>
            <h2>{{ selectedCar.brand }} {{ selectedCar.model }}</h2>
            <div class="car-card-location">{{ selectedCar.location }}</div>
            <div class="car-card-details">
              <span>{{ selectedCar.year }}</span>
              <span>{{ selectedCar.fuel }}</span>
              <span>{{ selectedCar.seats }} seats</span>
              <span>{{ selectedCar.transmission }}</span>
            </div>
          </div>
          <div class="car-details-price">
            <span>€ {{ selectedCar.price }}/mo</span>
          </div>
        </div>
        <img :src="selectedCar.image" class="car-details-img" alt="car" />
        <div class="car-details-actions">
          <button class="photo-btn">Photo</button>
          <button class="plan-btn">Plan</button>
        </div>
        <div class="car-details-description">
          <strong>Description</strong>
          <p>{{ selectedCar.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const cars = ref([
  {
    id: 1,
    brand: 'Toyota',
    model: 'Corolla',
    year: 2022,
    fuel: 'Hybrid',
    seats: 5,
    transmission: 'Automatic',
    location: 'Warsaw, Main Street 10',
    price: 420,
    fav: false,
    image: 'https://smartcdn.gprod.postmedia.digital/driving/wp-content/uploads/2022/01/2022-Toyota-Corolla-Hybrid-7.jpg',
    description: 'Reliable and economical Toyota Corolla Hybrid, perfect for city and long trips. Spacious, comfortable, and equipped with modern safety features.'
  },
  {
    id: 2,
    brand: 'BMW',
    model: '320i',
    year: 2021,
    fuel: 'Petrol',
    seats: 5,
    transmission: 'Automatic',
    location: 'Warsaw, Liberty Ave 5',
    price: 650,
    fav: false,
    image: 'https://images.carexpert.com.au/resize/960/-/cms/v1/media/2023-02-bmw-320i-sedan-m-sport-hero-16x9-1.jpg',
    description: 'Sporty BMW 320i with automatic transmission, leather seats, and advanced navigation. Enjoy a premium driving experience.'
  },
  {
    id: 3,
    brand: 'Mercedes',
    model: 'A-Class',
    year: 2020,
    fuel: 'Diesel',
    seats: 5,
    transmission: 'Manual',
    location: 'Warsaw, Green Park 2',
    price: 590,
    fav: false,
    image: 'https://www.topgear.com/sites/default/files/2023/03/1-Mercedes-A-Class.jpg',
    description: 'Comfortable Mercedes A-Class, diesel engine, manual transmission. Great for families and business trips.'
  },
  {
    id: 4,
    brand: 'Audi',
    model: 'A3',
    year: 2023,
    fuel: 'Electric',
    seats: 5,
    transmission: 'Automatic',
    location: 'Warsaw, Electric Ave 7',
    price: 800,
    fav: false,
    image: 'https://cdn.motor1.com/images/mgl/AebbV/s3/audi-a3-sportback-45-tfsi-e-2021.webp',
    description: 'Brand new Audi A3 Electric, zero emissions, high-tech interior, and smooth ride. The future of driving.'
  }
]);

const selectedCar = ref(null);

const filters = ref({
  type: 'Rent',
  brand: 'Any brand',
  model: '',
  yearFrom: '',
  yearTo: '',
  fuel: 'Any fuel',
  priceFrom: '',
  priceTo: ''
});

const filteredCars = computed(() => {
  return cars.value.filter(car => {
    return (
      (filters.value.brand === 'Any brand' || car.brand === filters.value.brand) &&
      (!filters.value.model || car.model.toLowerCase().includes(filters.value.model.toLowerCase())) &&
      (!filters.value.yearFrom || car.year >= Number(filters.value.yearFrom)) &&
      (!filters.value.yearTo || car.year <= Number(filters.value.yearTo)) &&
      (filters.value.fuel === 'Any fuel' || car.fuel === filters.value.fuel) &&
      (!filters.value.priceFrom || car.price >= Number(filters.value.priceFrom)) &&
      (!filters.value.priceTo || car.price <= Number(filters.value.priceTo))
    );
  });
});

function selectCar(car) {
  selectedCar.value = car;
}

function toggleFav(car) {
  car.fav = !car.fav;
}
</script>

<style scoped>
.car-page {
  padding: 2rem 1rem;
  background: #1d4857;
  min-height: 100vh;
  border-radius: 24px;
}
.car-filters {
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
.car-filters select,
.car-filters input {
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
.car-main {
  display: flex;
  gap: 2rem;
  transition: all 0.3s;
}
.car-main.full-list {
  /* When no car is selected, car-list fills all space */
  .car-list {
    max-width: 100% !important;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  }
}
.car-list {
  flex: 1 1 350px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 2rem;
  max-width: 700px;
  transition: max-width 0.3s;
}
.car-list.shrink {
  max-width: 400px;
}
.car-card {
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
.car-card.active, .car-card:hover {
  border: 2px solid #ffe066;
  box-shadow: 0 4px 16px rgba(255,224,102,0.15);
}
.car-card-img-wrap {
  position: relative;
  width: 100%;
  height: 170px;
  overflow: hidden;
  border-radius: 18px 18px 0 0;
}
.car-card-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.2s;
}
.car-card-img-wrap:hover .car-card-img {
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
.car-card-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 1.1rem 1.1rem 1.2rem 1.1rem;
  gap: 0.4rem;
}
.car-card-title {
  font-weight: 600;
  font-size: 1.1rem;
  margin-bottom: 0.2rem;
  color: #1d4857;
}
.car-card-location {
  font-size: 0.97rem;
  color: #888;
  margin-bottom: 0.2rem;
}
.car-card-details {
  font-size: 0.95rem;
  color: #666;
  display: flex;
  gap: 0.7rem;
  margin-bottom: 0.2rem;
  flex-wrap: wrap;
}
.car-card-price {
  font-weight: 700;
  color: #1976d2;
  font-size: 1.15rem;
  margin-top: 0.2rem;
}
.car-details {
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
.car-details-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1rem;
}
.car-details-price {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1976d2;
}
.car-details-img {
  width: 100%;
  max-height: 260px;
  object-fit: cover;
  border-radius: 10px;
  margin-bottom: 1rem;
}
.car-details-actions {
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
.car-details-description {
  font-size: 1rem;
  color: #444;
}
@media (max-width: 1100px) {
  .car-main {
    flex-direction: column;
  }
  .car-list, .car-list.shrink, .car-details {
    max-width: 100%;
    width: 100%;
  }
  .car-details {
    margin-left: 0;
    margin-top: 2rem;
  }
}
</style>