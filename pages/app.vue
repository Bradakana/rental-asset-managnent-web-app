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
    <div class="feature-section">
      <div class="feature-hero">
        <h1 class="feature-title">Here's What You'll Get</h1>
        <p class="feature-desc">
          We're committed to your satisfaction by providing everything you need to rent cars and real estate with ease.  
          Enjoy exclusive offers and a <span class="highlight">20% discount</span> on your first rental.  
          This special price is yours for life as a valued customer.
        </p>
      </div>
      <div class="feature-cards">
        <div class="feature-card">
          <div class="feature-icon">
            <img src="https://img.icons8.com/fluency/48/000000/customer-support.png" alt="Support" />
          </div>
          <h2 class="feature-card-title">Expert Support Team</h2>
          <p class="feature-card-desc">
            Our support team is available 24/7 to answer your questions and help you rent cars or properties quickly and easily. Personalized assistance is always just a message away.
          </p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">
            <img src="https://img.icons8.com/fluency/48/000000/clock.png" alt="Fast Setup" />
          </div>
          <h2 class="feature-card-title">Rent in Minutes</h2>
          <p class="feature-card-desc">
            Our streamlined process lets you book a car or estate in just a few clicks. Step-by-step guides and video tours make getting started simple for everyone.
          </p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">
            <img src="https://img.icons8.com/fluency/48/000000/garage.png" alt="Unlimited Rentals" />
          </div>
          <h2 class="feature-card-title">Unlimited Rentals</h2>
          <p class="feature-card-desc">
            Choose from a wide range of vehicles and properties. Rent as many times as you want, whenever you need—no limits, just convenience and flexibility.
          </p>
        </div>
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
.feature-section {
  background: #0a0a0a;
  min-height: 100vh;
  padding-bottom: 3rem;
}
.feature-hero {
  background: url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80') center/cover no-repeat;
  padding: 4rem 2rem 3rem 2rem;
  text-align: center;
  color: #fff;
  position: relative;
}
.feature-hero::after {
  content: "";
  position: absolute;
  inset: 0;
  background: rgba(10,10,10,0.7);
  z-index: 0;
}
.feature-title {
  position: relative;
  z-index: 1;
  font-size: 2.8rem;
  font-weight: 700;
  margin-bottom: 1.2rem;
  letter-spacing: -1px;
}
.feature-desc {
  position: relative;
  z-index: 1;
  font-size: 1.15rem;
  max-width: 700px;
  margin: 0 auto;
  line-height: 1.7;
}
.highlight {
  color: #8f4afc;
  font-weight: 700;
}
.feature-cards {
  display: flex;
  gap: 2rem;
  justify-content: center;
  margin-top: -3rem;
  flex-wrap: wrap;
  position: relative;
  z-index: 2;
}
.feature-card {
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 4px 32px rgba(29, 72, 87, 0.10);
  padding: 2.2rem 1.7rem 1.7rem 1.7rem;
  max-width: 340px;
  width: 100%;
  text-align: left;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.feature-icon {
  margin-bottom: 1rem;
}
.feature-card-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #23272f;
  margin-bottom: 0.7rem;
}
.feature-card-desc {
  color: #444;
  font-size: 1.05rem;
  line-height: 1.6;
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
  .feature-cards {
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
    margin-top: 0;
  }
  .feature-card {
    max-width: 95vw;
  }
  .feature-hero {
    padding: 2.5rem 1rem 2rem 1rem;
  }
  .feature-title {
    font-size: 2rem;
  }
}
</style>
