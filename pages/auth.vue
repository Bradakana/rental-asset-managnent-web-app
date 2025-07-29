<template>
  <div class="auth-bg">
    <div class="auth-container">
      <!-- Left Section: Form -->
      <div class="auth-form-section">
        <h1 class="auth-title">Your Property & Vehicle Portal</h1>
        <p class="auth-subtitle">Welcome back! Please login to your account.</p>
        <form class="auth-form">
          <label class="auth-label" for="email">Email Address</label>
          <input class="auth-input" id="email" type="email" v-model="email" placeholder="Email Address" />
          <label class="auth-label" for="password">Password</label>
          <input class="auth-input" id="password" type="password" v-model="password" placeholder="Password" />
          <div class="auth-options">
            <label><input type="checkbox" v-model="rememberMe" /> Remember Me</label>
            <a href="#" class="auth-link">Forgot Password?</a>
          </div>
          <div class="auth-btns">
            <button type="button" class="auth-btn primary">Login</button>
            <button type="button" class="auth-btn outline">Sign Up</button>
          </div>
          <div class="auth-social">
            Or login with
            <a href="#" class="auth-social-link">Facebook</a>
            <a href="#" class="auth-social-link">LinkedIn</a>
            <a href="#" class="auth-social-link">Google</a>
          </div>
        </form>
      </div>
      <!-- Right Section: Illustration -->
      <div class="auth-illustration-section">
        <img src="/src/picture/2.jpg" alt="Illustration" class="auth-illustration" style="border-radius: 5%; width: 100%; height: 100%; object-fit: cover; object-position: center; background-repeat: no-repeat;" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AuthPageSimple",
  data() {
    return {
      email: "",
      password: "",
      rememberMe: false
    };
  }
};
</script>

<style scoped>
.auth-bg {
  background: #c4e3e7;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
.auth-container {
  display: flex;
  background: #fff;
  border-radius: 24px;
  box-shadow: 0 4px 32px rgba(29, 72, 87, 0.10);
  overflow: hidden;
  max-width: 1100px;
  width: 100%;
  min-height: 600px;
}
.auth-form-section {
  flex: 1.2;
  padding: 48px 48px 48px 64px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.auth-title {
  font-size: 2.2rem;
  font-weight: 700;
  color: #3a3afc;
  margin-bottom: 18px;
  line-height: 1.2;
}
.auth-subtitle {
  font-size: 1.1rem;
  color: #444;
  margin-bottom: 32px;
}
.auth-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.auth-label {
  font-size: 1rem;
  color: #3a3afc;
  font-weight: 600;
  margin-bottom: 4px;
}
.auth-input {
  border: 1.5px solid #3a3afc;
  border-radius: 6px;
  padding: 12px 16px;
  font-size: 1rem;
  margin-bottom: 8px;
  outline: none;
  color: #222;
}
.auth-input:focus {
  border-color: #232323;
}
.auth-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.98rem;
  color: #555;
  margin-bottom: 8px;
}
.auth-link {
  color: #232323;
  text-decoration: underline;
  cursor: pointer;
}
.auth-btns {
  display: flex;
  gap: 24px;
  margin: 24px 0 12px 0;
}
.auth-btn {
  padding: 12px 36px;
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(29, 72, 87, 0.08);
  transition: background 0.2s, color 0.2s, border 0.2s;
}
.auth-btn.primary {
  background: #3a3afc;
  color: #fff;
  border: 2px solid #3a3afc;
}
.auth-btn.primary:hover {
  background: #232323;
  border-color: #232323;
}
.auth-btn.outline {
  background: #fff;
  color: #3a3afc;
  border: 2px solid #3a3afc;
}
.auth-btn.outline:hover {
  background: #f2f2f2;
  color: #232323;
  border-color: #232323;
}
.auth-social {
  margin-top: 32px;
  font-size: 1rem;
  color: #444;
}
.auth-social-link {
  color: #3a3afc;
  font-weight: 600;
  margin-left: 18px;
  text-decoration: none;
  transition: color 0.2s;
}
.auth-social-link:hover {
  color: #232323;
}
.auth-illustration-section {
  flex: 1;
  background: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 340px;
}
.auth-illustration {
  max-width: 460px;
  width: 100%;
  height: auto;
  object-fit: contain;
}
@media (max-width: 900px) {
  .auth-container {
    flex-direction: column;
    min-height: 0;
  }
  .auth-form-section {
    padding: 32px 24px;
  }
  .auth-illustration-section {
    min-width: 0;
    padding: 24px 0;
  }
  .auth-illustration {
    max-width: 100%;
  }
}
</style>