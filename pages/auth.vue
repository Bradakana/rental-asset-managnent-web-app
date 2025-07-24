<template>
  <v-container fluid class="auth-bg">
    <v-row justify="center" align="center" class="fill-height">
      <v-col cols="12" md="10" lg="8">
        <v-card class="auth-card" elevation="8">
          <v-row>
            <!-- Left Info Section -->
            <v-col cols="12" md="5" class="info-section">
              <h2 class="font-weight-bold mb-4">Start your 30-day free trial</h2>
              <p class="mb-4"><v-icon class="mr-2">mdi-credit-card-off</v-icon>No credit card required</p>
              <div class="mb-4">
                <v-icon class="mr-2">mdi-account-multiple</v-icon>
                <span>Invite unlimited colleagues</span>
              </div>
              <div class="mb-4">
                <v-icon class="mr-2">mdi-shield-check</v-icon>
                <span>Ensure compliance</span>
              </div>
              <div>
                <v-icon class="mr-2">mdi-lock</v-icon>
                <span>Built-in security</span>
              </div>
              <div class="mt-10 text-caption">
                Terms • Privacy • Docs • Help
                <v-icon class="mx-2">mdi-earth</v-icon> English
              </div>
            </v-col>
            <!-- Right Auth Section -->
            <v-col cols="12" md="7">
              <v-card class="pa-8" elevation="0" color="rgba(30,30,30,0.7)">
                <h3 class="mb-4">Register with:</h3>
                <v-btn-group class="mb-4">
                  <v-btn color="grey-darken-3" class="mr-2" prepend-icon="mdi-google">Google</v-btn>
                  <v-btn color="grey-darken-3" class="mr-2" prepend-icon="mdi-github">Github</v-btn>
                  <v-btn color="grey-darken-3" prepend-icon="mdi-gitlab">Gitlab</v-btn>
                </v-btn-group>
                <div class="my-4 text-center">Or</div>
                <v-row>
                  <v-col cols="12" md="6">
                    <v-text-field label="First Name" prepend-inner-icon="mdi-account" />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field label="Last Name" prepend-inner-icon="mdi-account" />
                  </v-col>
                </v-row>
                <v-text-field label="Username" prepend-inner-icon="mdi-account-outline" class="mb-2" />
                <v-text-field label="Email" prepend-inner-icon="mdi-email-outline" class="mb-2" />
                <v-text-field
                  label="Password"
                  type="password"
                  prepend-inner-icon="mdi-lock-outline"
                  append-inner-icon="mdi-eye-off"
                  class="mb-2"
                  hint="Minimum length is 8 characters."
                  persistent-hint
                />
                <v-btn color="yellow" block class="mt-4 font-weight-bold">Sign Up</v-btn>
                <div class="mt-2 text-caption">
                  By creating an account, you agree to the <a href="#">Terms of Service</a>.
                  We’ll occasionally send you account-related emails.
                </div>
                <div class="mt-4 text-center">
                  Already have an account?
                  <a href="#" class="text-yellow-darken-2 font-weight-bold">Login</a>
                </div>
              </v-card>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "AuthPage"
};
</script>

<style scoped>
.auth-bg {
  background: linear-gradient(135deg, #232323 0%, #222a2a 100%);
  min-height: 100vh;
}
.auth-card {
  border-radius: 24px;
  overflow: hidden;
  background: rgba(30,30,30,0.95);
}
.info-section {
  color: #fff;
  background: none;
  padding: 48px 32px;
}
a {
  text-decoration: underline;
}
</style>