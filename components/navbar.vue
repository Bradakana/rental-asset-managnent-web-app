<script setup>
import { ref } from 'vue';

let mobileNav = ref(false);

let toggleMobileNav = () => {
  mobileNav.value = !mobileNav.value;
};
</script>

<template>
  <nav class="navbar">
    <div class="navbar-container">
      <div class="navbar-logo">
        <a href="/" class="navbar-title">
          <img src="https://img.icons8.com/ios-filled/50/1d4857/home.png" alt="Logo" class="navbar-logo-img" />
          <span class="brand">REAL ESTATE COMPANY.</span>
        </a>
      </div>
      <!-- Desktop Menu -->
      <ul class="navbar-links">
        <li><a href="/estate" class="navbar-link active">Real estate</a></li>
        <li><a href="#" class="navbar-link">Find Cars</a></li>
        <li><a href="#" class="navbar-link">Developers</a></li>
        <li><a href="#" class="navbar-link">Real estate agencies</a></li>
        <li><a href="#" class="navbar-link">Other services</a></li>
      </ul>
      <div class="navbar-actions">
        <button class="create-request-btn">Create your request</button>
        <select class="lang-select">
          <option>Eng</option>
          <option>Pl</option>
        </select>
        <button class="icon-btn" title="Favorites">
          <svg width="22" height="22" fill="none" stroke="#1d4857" stroke-width="2" viewBox="0 0 24 24">
            <path d="M12 21s-6.5-5.2-9-8.4C.7 10.1 1.6 7.2 4.1 6.2c1.6-.6 3.3.1 4.3 1.3C9.9 8.4 12 10.5 12 10.5s2.1-2.1 3.6-3c1-.8 2.7-1.5 4.3-1.3 2.5 1 3.4 3.9 1.1 6.4C18.5 15.8 12 21 12 21z"/>
          </svg>
        </button>
        <button class="login-btn">Login</button>
      </div>
      <!-- Mobile Menu Button -->
      <button @click="toggleMobileNav()" type="button" class="navbar-toggle">
        <svg viewBox="0 0 24 24" class="h-7 w-7 fill-current" style="color:#1d4857;">
          <path fill-rule="evenodd" d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z"></path>
        </svg>
      </button>
    </div>
    <!-- Mobile Menu -->
    <div v-show="mobileNav" class="navbar-mobile-menu">
      <button @click="toggleMobileNav()" type="button" class="navbar-mobile-close">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#1d4857" viewBox="0 0 16 16">
          <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
        </svg>
      </button>
      <ul class="navbar-mobile-links">
        <li><a @click="toggleMobileNav()" href="/estate" class="navbar-link active">Real estate</a></li>
        <li><a @click="toggleMobileNav()" href="#" class="navbar-link">Find neighbors</a></li>
        <li><a @click="toggleMobileNav()" href="#" class="navbar-link">Developers</a></li>
        <li><a @click="toggleMobileNav()" href="#" class="navbar-link">Real estate agencies</a></li>
        <li><a @click="toggleMobileNav()" href="#" class="navbar-link">Other services</a></li>
        <li><button class="create-request-btn mt-2">Create your request</button></li>
        <li>
          <select class="lang-select mt-2">
            <option>Eng</option>
            <option>Pl</option>
          </select>
        </li>
        <li><button class="login-btn mt-2">Login</button></li>
      </ul>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  width: 100%;
  background: #fff;
  color: #1d4857;
  position: relative;
  z-index: 50;
  box-shadow: 0 2px 8px rgba(29, 72, 87, 0.08);
  border-bottom: 1.5px solid #f2f2f2;
}
.navbar-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  align-items: center;
  height: 64px;
  justify-content: space-between;
  gap: 1.5rem;
}
.navbar-logo {
  display: flex;
  align-items: center;
}
.navbar-logo-img {
  width: 32px;
  height: 32px;
  margin-right: 8px;
}
.brand {
  font-size: 1.3rem;
  font-weight: 700;
  color: #1d4857;
  letter-spacing: 1px;
}
.navbar-links {
  display: flex;
  gap: 1.5rem;
  list-style: none;
  align-items: center;
  margin: 0;
  padding: 0;
}
.navbar-link {
  color: #1d4857;
  text-decoration: none;
  font-weight: 500;
  font-size: 1rem;
  transition: color 0.2s;
  padding: 2px 0;
  border-bottom: 2px solid transparent;
}
.navbar-link.active,
.navbar-link:hover {
  color: #1d4857;
  border-bottom: 2px solid #1d4857;
  font-weight: 600;
}
.navbar-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.create-request-btn {
  background: #ffe066;
  border: none;
  border-radius: 6px;
  padding: 0.5rem 1.2rem;
  font-weight: 600;
  color: #1d4857;
  cursor: pointer;
  transition: background 0.2s;
  margin-right: 0.5rem;
}
.create-request-btn:hover {
  background: #ffd700;
}
.lang-select {
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  padding: 0.3rem 0.7rem;
  font-size: 1rem;
  color: #1d4857;
  background: #fff;
  margin-right: 0.5rem;
}
.icon-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.3rem;
  margin-right: 0.5rem;
  border-radius: 50%;
  transition: background 0.2s;
}
.icon-btn:hover {
  background: #f2f2f2;
}
.login-btn {
  background: none;
  border: 1.5px solid #1d4857;
  border-radius: 6px;
  padding: 0.4rem 1.1rem;
  font-weight: 600;
  color: #1d4857;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}
.login-btn:hover {
  background: #1d4857;
  color: #fff;
}
.navbar-toggle {
  background: none;
  border: none;
  outline: none;
  cursor: pointer;
  padding: 0.5rem;
  display: none;
}
@media (max-width: 1024px) {
  .navbar-links,
  .navbar-actions {
    display: none;
  }
  .navbar-toggle {
    display: block;
  }
}
.navbar-mobile-menu {
  position: absolute;
  top: 64px;
  left: 0;
  width: 100%;
  background: #fff;
  padding: 2rem 1.5rem 1.5rem 1.5rem;
  z-index: 100;
  min-height: 220px;
  box-shadow: 0 4px 16px rgba(29, 72, 87, 0.10);
  animation: fadeIn 0.2s;
}
.navbar-mobile-close {
  background: none;
  border: none;
  outline: none;
  float: right;
  margin-bottom: 1.5rem;
  cursor: pointer;
}
.navbar-mobile-links {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}
.mt-2 {
  margin-top: 0.7rem;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-16px);}
  to { opacity: 1; transform: translateY(0);}
}
</style>