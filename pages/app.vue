<template>
  <div class="hero-section">
    <div class="hero-bg">
      <div class="hero-overlay">
        <div class="hero-content">
          <h1 class="hero-title">Cars & Real Estate for Rent</h1>
          <p class="hero-desc">
            Looking for a comfortable ride or a place to stay? Explore our range of vehicles and properties for rent. Whether you're on the road or settling in, we've got what you need.
          </p>
        </div>
      </div>
    </div>
    <div class="info-section">
      <div class="info-content">
        <h2 class="info-title">Rent With Confidence</h2>
        <p class="info-desc">
          Choose from our selection of well-maintained cars and top-quality real estate. We ensure reliability, safety, and comfort in every option.
        </p>
      </div>
      <div class="info-action">
        <button class="view-all-btn" @click="goToEstate">VIEW OFFERS</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "HomePage",
  methods: {
    goToEstate() {
      this.$router.push('/estate');
    }
  }
}
</script>

<style scoped>
.hero-section {
  min-height: 100vh;
  background: #f5f7fa;
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 0;
}
.hero-bg {
  background-image: url('https://images2.alphacoders.com/138/1388832.jpg');
  background-size: cover;
  background-position: center;
  min-height: 70vh;
  position: relative;
  display: flex;
  align-items: flex-end;
  justify-content: flex-start;
}
.hero-overlay {
  width: 100%;
  min-height: 70vh;
  background: linear-gradient(90deg, rgba(30,41,59,0.55) 0%, rgba(30,41,59,0.15) 100%);
  display: flex;
  align-items: flex-end;
}
.hero-content {
  padding: 3.5rem 2rem 2.5rem 4rem;
  color: #fff;
  max-width: 700px;
}
.hero-title {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1.2rem;
  line-height: 1.1;
  letter-spacing: -1px;
}
.hero-desc {
  font-size: 1.15rem;
  opacity: 0.95;
  line-height: 1.7;
  max-width: 600px;
}
.info-section {
  background: #f8f9fa;
  padding: 3rem 2rem 2.5rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 0 0 18px 18px;
  box-shadow: 0 2px 8px rgba(30,41,59,0.04);
  margin-top: -2rem;
  flex-wrap: wrap;
}
.info-content {
  flex: 1 1 350px;
}
.info-title {
  font-size: 2.2rem;
  font-weight: 600;
  color: #23272f;
  margin-bottom: 1.2rem;
}
.info-desc {
  color: #6c757d;
  font-size: 1.1rem;
  max-width: 600px;
}
.info-action {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  margin-left: 2rem;
}
.view-all-btn {
  background: #8f4afc;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 0.7rem 2.2rem;
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: 2px;
  cursor: pointer;
  transition: background 0.2s;
  margin-top: 1.2rem;
}
.view-all-btn:hover {
  background: #6c2bd7;
}
@media (max-width: 900px) {
  .hero-content {
    padding: 2rem 1rem 2rem 1rem;
  }
  .info-section {
    flex-direction: column;
    align-items: flex-start;
    padding: 2rem 1rem 2rem 1rem;
    margin-top: 0;
    border-radius: 0 0 18px 18px;
  }
  .info-action {
    margin-left: 0;
    margin-top: 1.5rem;
  }
}
</style>
