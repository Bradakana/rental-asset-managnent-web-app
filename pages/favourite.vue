<template>
  <div class="favourite-page">
    <div class="favourite-container">
      <h1 class="favourite-title">Your Favourites</h1>
      <div v-if="favourites.length === 0" class="favourite-empty">
        No favourite items yet.
      </div>
      <div v-else class="favourite-list">
        <div v-for="item in favourites" :key="item.id" class="favourite-card">
          <img :src="item.image" alt="Favourite" class="favourite-img" />
          <div class="favourite-info">
            <h2 class="favourite-item-title">{{ item.title }}</h2>
            <p class="favourite-item-location">{{ item.location }}</p>
            <p class="favourite-item-type">{{ item.type }}</p>
            <p class="favourite-item-price">€ {{ item.price }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "FavouritePage",
  data() {
    return {
      favourites: []
    };
  },
  mounted() {
    // Load favourites from localStorage (shared by cars.vue and estate.vue)
    const favs = JSON.parse(localStorage.getItem("favourites") || "[]");
    this.favourites = favs;
  }
};
</script>

<style scoped>
.favourite-page {
  min-height: 100vh;
  background: #f5f7fa;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 0;
}
.favourite-container {
  background: #fff;
  border-radius: 24px;
  box-shadow: 0 4px 32px rgba(29, 72, 87, 0.10);
  padding: 48px 36px;
  max-width: 900px;
  width: 100%;
}
.favourite-title {
  color: #1d4857;
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 32px;
  text-align: center;
}
.favourite-empty {
  text-align: center;
  color: #888;
  font-size: 1.2rem;
  margin-top: 40px;
}
.favourite-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 2rem;
}
.favourite-card {
  background: #f8f9fa;
  border-radius: 18px;
  box-shadow: 0 2px 12px rgba(29, 72, 87, 0.10);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.2rem;
}
.favourite-img {
  width: 100%;
  max-width: 220px;
  height: 140px;
  object-fit: cover;
  border-radius: 12px;
  margin-bottom: 1rem;
}
.favourite-info {
  text-align: center;
}
.favourite-item-title {
  font-size: 1.15rem;
  font-weight: 700;
  color: #23272f;
  margin-bottom: 0.4rem;
}
.favourite-item-location,
.favourite-item-type,
.favourite-item-price {
  color: #444;
  font-size: 1rem;
  margin-bottom: 0.2rem;
}
</style>