<template>
  <div class="welcome-bg">
    <div class="welcome-content">
      <h1 class="welcome-title">
        <span class="gradient-text">A Fast Blockchain.</span><br />
        <span>Scalable AI.</span>
      </h1>
      <p class="welcome-desc">
        Our technology performing fast blockchain (120K TPS) and it has guaranteed<br>
        AI-based data security. Proof of Stake, its consensus algorithm enables unlimited speeds.
      </p>
      <div class="welcome-actions">
        <button class="welcome-btn gradient-border" @click="goApp">Get started</button>
        <button class="welcome-btn outline" @click="goAuth">Login</button>
      </div>
      <img class="welcome-img" src="https://assets-global.website-files.com/63f5e6b6b6b6b6b6b6b6b6b6/63f5e6b6b6b6b6b6b6b6b6b6_ai-illustration.png" alt="AI Illustration" />
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
const router = useRouter();
function goApp() {
  router.push('/app');
}
function goAuth() {
  router.push('/auth');
}
</script>

<style scoped>
.welcome-bg {
  min-height: 100vh;
  background: #0a0a0a;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}
.welcome-content {
  text-align: center;
  width: 100%;
  max-width: 700px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
  padding-top: 60px;
}
.welcome-title {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1.2rem;
  line-height: 1.1;
  color: #fff;
}
.gradient-text {
  background: linear-gradient(90deg, #e040fb 0%, #8f4afc 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.welcome-desc {
  color: #e0e0e0;
  font-size: 1.15rem;
  margin-bottom: 2.2rem;
  line-height: 1.7;
}
.welcome-actions {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  margin-bottom: 2.5rem;
}
.welcome-btn {
  font-size: 1.1rem;
  font-weight: 600;
  padding: 0.8rem 2.2rem;
  border-radius: 32px;
  border: none;
  cursor: pointer;
  transition: background 0.2s, color 0.2s, border 0.2s;
  background: #181818;
  color: #fff;
  box-shadow: 0 2px 16px rgba(140,64,251,0.10);
}
.gradient-border {
  border: 2px solid;
  border-image: linear-gradient(90deg, #e040fb 0%, #8f4afc 100%);
  border-image-slice: 1;
  background: #181818;
}
.gradient-border:hover {
  background: linear-gradient(90deg, #e040fb 0%, #8f4afc 100%);
  color: #fff;
}
.outline {
  border: 2px solid #fff;
  background: #181818;
  color: #fff;
}
.outline:hover {
  background: #fff;
  color: #181818;
}
.welcome-img {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  margin-top: 2rem;
  display: block;
  filter: drop-shadow(0 8px 32px #8f4afc88);
}
@media (max-width: 900px) {
  .welcome-title {
    font-size: 2.1rem;
  }
  .welcome-content {
    padding-top: 30px;
  }
  .welcome-img {
    max-width: 350px;
  }
}
</style>