<template>
  <div class="hero-section">
    <div class="hero-content">
      <h1>Real Estate Platform</h1>
      <p class="subtitle">Marketplace for automated search of real estate or clients</p>
    </div>
    <div class="hero-image">
      <div class="browser-mockup">
        <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80" alt="Real Estate Example" />
        <div class="browser-bar">
          <span class="dot red"></span>
          <span class="dot yellow"></span>
          <span class="dot green"></span>
        </div>
        <div class="browser-content">
          <div class="browser-header">
            <span class="browser-title">Easy way to find real estate</span>
            <div class="browser-tabs">
              <button class="tab active">Rent</button>
              <button class="tab">Buy</button>
              <button class="tab">Sell</button>
              <button class="tab">Rent out</button>
            </div>
          </div>
          <div class="browser-search">
            <select>
              <option>Apartment</option>
              <option>House</option>
              <option>Office</option>
            </select>
            <input type="text" placeholder="Warsaw" />
            <input type="text" placeholder="45 (sqm)" />
            <input type="text" placeholder="EUR" />
            <input type="text" placeholder="Price from" />
            <input type="text" placeholder="Price to" />
            <button class="more-filters">More filters</button>
          </div>
          <div class="browser-request">
            <div>
              <strong>Create your unique request</strong>
              <p>Create your request and see the best offers directly from the owners of real estate</p>
            </div>
            <button class="create-request">Create your request</button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <section class="about-section">
    <h2>About the project</h2>
    <p>
      Realsy is a platform where you can find real estate to rent or purchase, or clients for your real estate.
      The platform automatically matches search requests from the owner and the client, and sends only the most relevant offers.
    </p>
  </section>
</template>

<script>
export default {
  name: "HomePage"
}
</script>

<style scoped>
.hero-section {
  display: flex;
  flex-wrap: wrap;
  background-image: url('src/picture/1.jpg');
  min-height: 60vh;
  border-radius: 18px;
  overflow: hidden;
  margin: 2rem 0 0 0;
}
.hero-content {
  flex: 1 1 350px;
  padding: 3rem 2rem 2rem 3rem;
  color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.hero-content h1 {
  font-size: 2.8rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  letter-spacing: -1px;
}
.subtitle {
  font-size: 1.2rem;
  opacity: 0.85;
  margin-bottom: 2rem;
}
.hero-image {
  flex: 1 1 400px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: 2rem 2rem 2rem 0;
}
.browser-mockup {
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.18);
  overflow: hidden;
  width: 420px;
  max-width: 100%;
  position: relative;
}
.browser-bar {
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  background: #f5f5f7;
  border-bottom: 1px solid #e0e0e0;
}
.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;
  margin-right: 5px;
}
.red { background: #ff5f56; }
.yellow { background: #ffbd2e; }
.green { background: #27c93f; }
.browser-content {
  padding: 1.2rem 1.2rem 1.5rem 1.2rem;
}
.browser-header {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
}
.browser-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}
.browser-tabs {
  display: flex;
  gap: 0.5rem;
}
.tab {
  background: #f5f5f7;
  border: none;
  border-radius: 6px;
  padding: 0.3rem 1.1rem;
  font-size: 0.95rem;
  color: #23272f;
  cursor: pointer;
  transition: background 0.2s;
}
.tab.active, .tab:hover {
  background: #ffe066;
  color: #23272f;
}
.browser-search {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.2rem;
}
.browser-search select,
.browser-search input {
  padding: 0.4rem 0.7rem;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 0.95rem;
  background: #fafbfc;
  margin-right: 0.2rem;
  flex: 1 1 90px;
}
.more-filters {
  background: #f5f5f7;
  border: none;
  border-radius: 6px;
  padding: 0.4rem 0.9rem;
  font-size: 0.95rem;
  color: #23272f;
  cursor: pointer;
  margin-left: 0.2rem;
}
.browser-request {
  background: #f8f9fa;
  border-radius: 10px;
  padding: 1rem;
  margin-top: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}
.browser-request strong {
  font-size: 1.05rem;
}
.create-request {
  background: #ffe066;
  border: none;
  border-radius: 6px;
  padding: 0.5rem 1.2rem;
  font-weight: 600;
  color: #23272f;
  cursor: pointer;
  transition: background 0.2s;
}
.create-request:hover {
  background: #ffd700;
}
.about-section {
  background: #f5f7fa;
  padding: 3rem 2rem 2rem 2rem;
  border-radius: 0 0 18px 18px;
  margin-bottom: 2rem;
  margin-top: -1.5rem;
}
.about-section h2 {
  font-size: 2rem;
  font-weight: 600;
  color: #23272f;
  margin-bottom: 1rem;
}
.about-section p {
  color: #6c757d;
  font-size: 1.1rem;
  max-width: 700px;
}
@media (max-width: 900px) {
  .hero-section {
    flex-direction: column;
    border-radius: 0;
  }
  .hero-content, .hero-image {
    padding: 2rem 1rem;
  }
  .about-section {
    border-radius: 0 0 18px 18px;
    margin-top: 0;
  }
}
</style>