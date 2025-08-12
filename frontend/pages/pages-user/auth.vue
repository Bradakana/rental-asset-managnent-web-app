<template>
  <div class="auth-bg">
    <div class="auth-container">
      <!-- Left Section: Form -->
      <div class="auth-form-section">
        <!-- User Type Selection -->
        <div class="user-type-selection">
          <h2 class="selection-title">{{ $t('auth.pleaseLogin') }}</h2>
          <div class="type-buttons">
            <button 
              type="button" 
              class="type-btn" 
              :class="{ active: selectedType === 'user' }"
              @click="selectedType = 'user'"
            >
              <div class="type-icon">👤</div>
              <div class="type-text">
                <h3>User Login</h3>
                <p>Browse cars & properties</p>
              </div>
            </button>
            <button 
              type="button" 
              class="type-btn" 
              :class="{ active: selectedType === 'admin' }"
              @click="goToAdminAuth"
            >
              <div class="type-icon">🛡️</div>
              <div class="type-text">
                <h3>Admin Login</h3>
                <p>Manage business</p>
              </div>
            </button>
          </div>
        </div>
        
        <!-- User Auth Form -->
        <div v-if="selectedType === 'user'" class="user-auth-form">
          <h1 class="auth-title">Your Property & Vehicle Portal</h1>
          <p class="auth-subtitle">
            <span v-if="isLogin">Welcome back! Please login to your account.</span>
            <span v-else>Register a new account to get started.</span>
          </p>
        <form class="auth-form" @submit.prevent="isLogin ? handleLogin() : handleRegister()">
          <label class="auth-label" for="email">{{ $t('auth.email') }}</label>
          <input class="auth-input" id="email" type="email" v-model="email" :placeholder="$t('auth.email')" />
          <span v-if="errors.email" class="auth-error">{{ errors.email }}</span>
          <label class="auth-label" for="password">Password</label>
          <input class="auth-input" id="password" type="password" v-model="password" placeholder="Password" />
          <span v-if="errors.password" class="auth-error">{{ errors.password }}</span>
          <div v-if="!isLogin" class="auth-extra">
            <label class="auth-label" for="firstName">First Name</label>
            <input class="auth-input" id="firstName" type="text" v-model="firstName" placeholder="First Name" />
            <span v-if="errors.firstName" class="auth-error">{{ errors.firstName }}</span>
            
            <label class="auth-label" for="lastName">Last Name</label>
            <input class="auth-input" id="lastName" type="text" v-model="lastName" placeholder="Last Name" />
            <span v-if="errors.lastName" class="auth-error">{{ errors.lastName }}</span>
            
            <label class="auth-label" for="username">Username</label>
            <input class="auth-input" id="username" type="text" v-model="username" placeholder="Username" />
            <span v-if="errors.username" class="auth-error">{{ errors.username }}</span>
            
            <label class="auth-label" for="confirmPassword">Confirm Password</label>
            <input class="auth-input" id="confirmPassword" type="password" v-model="confirmPassword" placeholder="Confirm Password" />
            <span v-if="errors.confirmPassword" class="auth-error">{{ errors.confirmPassword }}</span>
          </div>
          <div class="auth-options">
            <label><input type="checkbox" v-model="rememberMe" /> Remember Me</label>
            <a href="#" class="auth-link" v-if="isLogin">{{ $t('auth.forgotPassword') }}</a>
          </div>
          <div class="auth-btns">
            <button type="submit" class="auth-btn primary">{{ isLogin ? $t('auth.login') : $t('auth.register') }}</button>
            <button type="button" class="auth-btn outline" @click="toggleForm">
              {{ isLogin ? $t('auth.signUp') : $t('auth.login') }}
            </button>
          </div>
          <div class="auth-social">
            Or login with
            <a href="#" class="auth-social-link">Facebook</a>
            <a href="#" class="auth-social-link">LinkedIn</a>
            <a href="#" class="auth-social-link">Google</a>
          </div>
        </form>
        </div>
      </div>
      <!-- Right Section: Illustration -->
      <div class="auth-illustration-section">
        <img src="/src/picture/2.jpg" alt="Illustration" class="auth-illustration" style="border-radius: 5%; width: 100%; height: 100%; object-fit: cover; object-position: center; background-repeat: no-repeat;" />
      </div>
    </div>
  </div>
</template>

<script setup>
// User layout ашиглах, middleware зорилтот хэрэглэгчдэд зориулж auth хуудас
definePageMeta({
  layout: 'user'
})
</script>

<script>
export default {
  name: "AuthPageSimple",
  data() {
    return {
      selectedType: 'user', // default user сонголт
      isLogin: true,
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
      username: "",
      rememberMe: false,
      errors: {
        email: "",
        password: "",
        confirmPassword: "",
        firstName: "",
        lastName: "",
        username: ""
      }
    };
  },
  methods: {
    toggleForm() {
      this.isLogin = !this.isLogin;
      this.errors = { 
        email: "", 
        password: "", 
        confirmPassword: "",
        firstName: "",
        lastName: "",
        username: ""
      };
      this.password = "";
      this.confirmPassword = "";
      this.firstName = "";
      this.lastName = "";
      this.username = "";
    },
    goToAdminAuth() {
      // Admin login хуудас руу шилжих
      this.$router.push('/auth');
    },
    validateEmail(email) {
      if (!email.trim()) return "Email is required.";
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!re.test(email)) return "Invalid email format.";
      return "";
    },
    validatePassword(password) {
      if (!password) return "Password is required.";
      if (password.length < 8) return "Password must be at least 8 characters.";
      return "";
    },
    validateConfirmPassword(password, confirmPassword) {
      if (!confirmPassword) return "Please confirm your password.";
      if (password !== confirmPassword) return "Passwords do not match.";
      return "";
    },
    validateFirstName(firstName) {
      if (!firstName.trim()) return "First name is required.";
      if (firstName.length < 2) return "First name must be at least 2 characters.";
      return "";
    },
    validateLastName(lastName) {
      if (!lastName.trim()) return "Last name is required.";
      if (lastName.length < 2) return "Last name must be at least 2 characters.";
      return "";
    },
    validateUsername(username) {
      if (!username.trim()) return "Username is required.";
      if (username.length < 3) return "Username must be at least 3 characters.";
      if (username.length > 20) return "Username must be less than 20 characters.";
      if (!/^[a-zA-Z0-9_]+$/.test(username)) return "Username can only contain letters, numbers, and underscores.";
      return "";
    },
    async handleLogin() {
      this.errors.email = this.validateEmail(this.email);
      this.errors.password = this.validatePassword(this.password);
      if (!this.errors.email && !this.errors.password) {
        try {
          const { useAuthStore } = await import('~/stores/auth');
          const authStore = useAuthStore();
          
          const result = await authStore.login({
            email: this.email,
            password: this.password
          });
          
          if (result.success) {
            if (this.rememberMe) {
              localStorage.setItem("rememberedEmail", this.email);
            } else {
              localStorage.removeItem("rememberedEmail");
            }
            // Redirect to user dashboard
            this.$router.push('/pages-user');
          } else {
            this.errors.email = result.error || "Login failed";
          }
        } catch (error) {
          this.errors.email = "Network error. Please try again.";
        }
      }
    },  
    async handleRegister() {
      this.errors.email = this.validateEmail(this.email);
      this.errors.password = this.validatePassword(this.password);
      this.errors.confirmPassword = this.validateConfirmPassword(this.password, this.confirmPassword);
      this.errors.firstName = this.validateFirstName(this.firstName);
      this.errors.lastName = this.validateLastName(this.lastName);
      this.errors.username = this.validateUsername(this.username);
      
      console.log('Validation errors:', this.errors);
      const hasErrors = !!(this.errors.email || this.errors.password || this.errors.confirmPassword || 
          this.errors.firstName || this.errors.lastName || this.errors.username);
      
      console.log('Has validation errors:', hasErrors);
      
      if (!hasErrors) {
        try {
          console.log('Starting registration process...');
          const { useAuthStore } = await import('~/stores/auth');
          const authStore = useAuthStore();
          
          const userData = {
            firstName: this.firstName,
            lastName: this.lastName,
            email: this.email,
            username: this.username,
            password: this.password
          };
          
          console.log('Calling registerUser with:', userData);
          const result = await authStore.registerUser(userData);
          console.log('Registration result:', result);
          
          if (result.success) {
            alert("Registration successful!");
            this.isLogin = true;
            this.password = "";
            this.confirmPassword = "";
            this.firstName = "";
            this.lastName = "";
            this.username = "";
            // Redirect to user dashboard
            this.$router.push('/pages-user');
          } else {
            console.error('Registration failed:', result.error);
            this.errors.email = result.error || "Registration failed";
          }
        } catch (error) {
          console.error('Registration error in component:', error);
          this.errors.email = "Network error. Please try again.";
        }
      }
    }
  },
  mounted() {
    const remembered = localStorage.getItem("rememberedEmail");
    if (remembered) {
      this.email = remembered;
      this.rememberMe = true;
    }
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
.auth-error {
  color: #d32f2f;
  font-size: 0.97rem;
  margin-bottom: 8px;
  margin-top: -8px;
  display: block;
}
.auth-form label,
.auth-form input,
.auth-form span.auth-error {
  display: block;
  width: 100%;
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

/* User Type Selection Styles */
.user-type-selection {
  margin-bottom: 2rem;
  text-align: center;
}

.selection-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1d4857;
  margin-bottom: 1.5rem;
}

.type-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 2rem;
}

.type-btn {
  background: #fff;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 1rem;
  min-width: 200px;
  text-align: left;
}

.type-btn:hover {
  border-color: #1d4857;
  box-shadow: 0 4px 12px rgba(29, 72, 87, 0.1);
}

.type-btn.active {
  border-color: #1d4857;
  background: #f8f9fa;
  box-shadow: 0 4px 12px rgba(29, 72, 87, 0.15);
}

.type-icon {
  font-size: 2rem;
  min-width: 40px;
}

.type-text h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #1d4857;
}

.type-text p {
  margin: 0;
  font-size: 0.9rem;
  color: #666;
}

.user-auth-form {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .type-buttons {
    flex-direction: column;
    align-items: center;
  }
  
  .type-btn {
    min-width: 280px;
  }
}
</style>