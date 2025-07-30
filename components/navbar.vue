<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

let mobileNav = ref(false);
const router = useRouter();

let toggleMobileNav = () => {
  mobileNav.value = !mobileNav.value;
};

function goToAuth() {
  router.push('/auth');
}
</script>

<template>
  <nav class="navbar">
    <div class="navbar-container">
      <div class="navbar-logo clean-logo">
        <a href="/app" class="navbar-title">
          <img src="https://img.icons8.com/ios-filled/32/1d4857/home.png" alt="Logo" class="navbar-logo-img" />
          <span class="brand">RENTING COMPANY</span>
        </a>
      </div>
      <!-- Desktop Menu -->
      <ul class="navbar-links">
        <li>
          <a href="/estate" class="navbar-link" :class="{ active: $route.path === '/estate' }">Real estate</a>
        </li>
        <li class="dropdown">
          <a href="/cars" class="navbar-link" :class="{ active: $route.path.startsWith('/cars') }">Find Cars</a>
          <ul class="dropdown-menu">
            <li><a href="/cars?type=sedan" class="navbar-link">Sedan</a></li>
            <li><a href="/cars?type=suv" class="navbar-link">SUV</a></li>
            <li><a href="/cars?type=van" class="navbar-link">Van</a></li>
          </ul>
        </li>
        <li>
          <a href="/about" class="navbar-link" :class="{ active: $route.path === '/about' }">About us</a>
        </li>
        <li>
          <a href="#" class="navbar-link" :class="{ active: $route.path === '/agencies' }">Real estate agencies</a>
        </li>
        <li>
          <a href="#" class="navbar-link" :class="{ active: $route.path === '/services' }">Other services</a>
        </li>
      </ul>
      <div class="navbar-actions">
        <button class="create-request-btn">Create your request</button>
        <select class="lang-select">
          <option>Eng</option>
          <option>Mgl</option>
        </select>
        <button class="icon-btn" title="Favorites">
          <svg width="22" height="22" fill="none" stroke="#1d4857" stroke-width="2" viewBox="0 0 24 24">
            <path d="M12 21s-6.5-5.2-9-8.4C.7 10.1 1.6 7.2 4.1 6.2c1.6-.6 3.3.1 4.3 1.3C9.9 8.4 12 10.5 12 10.5s2.1-2.1 3.6-3c1-.8 2.7-1.5 4.3-1.3 2.5 1 3.4 3.9 1.1 6.4C18.5 15.8 12 21 12 21z"/>
          </svg>
        </button>
        <button @click="goToAuth()" class="login-btn">Login</button>
      </div>
      <!-- Mobile Menu Button -->
      <button @click="toggleMobileNav()" type="button" class="navbar-toggle" aria-label="Toggle navigation">
        <!-- 3 line hamburger icon -->
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <rect y="7" width="32" height="3" rx="1.5" fill="#fff"/>
          <rect y="14" width="32" height="3" rx="1.5" fill="#fff"/>
          <rect y="21" width="32" height="3" rx="1.5" fill="#fff"/>
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
        <li>
          <a @click="toggleMobileNav()" href="/estate" class="navbar-link" :class="{ active: $route.path === '/estate' }">Real estate</a>
        </li>
        <li class="dropdown">
          <a href="#" class="navbar-link" :class="{ active: $route.path.startsWith('/cars') }">Find Cars</a>
          <ul class="dropdown-menu">
            <li><a @click="toggleMobileNav()" href="/cars?type=sedan" class="navbar-link">Sedan</a></li>
            <li><a @click="toggleMobileNav()" href="/cars?type=suv" class="navbar-link">SUV</a></li>
            <li><a @click="toggleMobileNav()" href="/cars?type=van" class="navbar-link">Van</a></li>
          </ul>
        </li>
        <li>
          <a @click="toggleMobileNav()" href="/about" class="navbar-link" :class="{ active: $route.path === '/about' }">About us</a>
        </li>
        <li>
          <a @click="toggleMobileNav()" href="#" class="navbar-link" :class="{ active: $route.path === '/agencies' }">Real estate agencies</a>
        </li>
        <li>
          <a @click="toggleMobileNav()" href="#" class="navbar-link" :class="{ active: $route.path === '/services' }">Other services</a>
        </li>
        <li><button class="create-request-btn mt-2">Create your request</button></li>
        <li>
          <select class="lang-select mt-2">
            <option>Eng</option>
            <option>Mn</option>
          </select>
        </li>
        <li><button @click="goToAuth()" class="login-btn mt-2">Login</button></li>
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
  background: #1d4857;
  border: none;
  outline: none;
  cursor: pointer;
  padding: 0.5rem;
  display: none;
  border-radius: 8px;
}
.navbar-toggle svg {
  display: block;
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
.dropdown {
  position: relative;
}
.dropdown-menu {
  display: none;
  position: absolute;
  left: 0;
  top: 100%;
  background: #fff;
  box-shadow: 0 2px 8px rgba(29, 72, 87, 0.08);
  border-radius: 8px;
  min-width: 140px;
  z-index: 10;
  padding: 0.5rem 0;
}
.dropdown:hover .dropdown-menu,
.dropdown:focus-within .dropdown-menu {
  display: block;
}
.dropdown-menu li {
  padding: 0.5rem 1.2rem;
}
.dropdown-menu li a {
  color: #1d4857;
  text-decoration: none;
  font-size: 1rem;
  display: block;
}
.dropdown-menu li a:hover {
  background: #f2f2f2;
}
@media (max-width: 1024px) {
  .navbar-links,
  .navbar-actions {
    display: none;
  }
  .navbar-toggle {
    display: block;
  }
  .navbar-mobile-links .dropdown-menu {
    position: static;
    box-shadow: none;
    border-radius: 0;
    min-width: 0;
    padding: 0;
    display: block;
  }
  .navbar-mobile-links .dropdown > .navbar-link {
    font-weight: 500;
    padding: 0.5rem 1.2rem;
    border-bottom: 1px solid #e0e0e0;
  }
}
.clean-logo {
  display: flex;
  align-items: center;
  padding: 0;
  margin: 0;
}
.clean-logo .navbar-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.3rem;
  font-weight: 700;
  color: #1d4857;
  text-decoration: none;
}
.clean-logo .navbar-logo-img {
  width: 32px;
  height: 32px;
  margin: 0;
  padding: 0;
}
</style>