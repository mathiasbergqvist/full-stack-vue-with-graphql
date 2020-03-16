<template>
  <v-container mt-5 pt-5>
    <!-- Signup Title -->
    <v-layout class="signin-title" row wrap>
      <v-flex xs12 sm6 offset-sm3>
        <h1>Get started here</h1>
      </v-flex>
    </v-layout>
    <!-- Error Alert -->
    <v-layout v-if="error" row wrap>
      <v-flex xs12 sm6 offset-sm3>
        <form-alert :message="error.message"></form-alert>
      </v-flex>
    </v-layout>

    <!-- Signin form -->
    <v-layout row wrap>
      <v-flex xs12 sm6 offset-sm3>
        <v-card class="form-container" color="accent" dark>
          <v-form
            v-model="isFormValid"
            @submit.prevent="handleSingupUser"
            lazy-validation
            ref="form"
          >
            <v-row>
              <v-col cols="12">
                <v-text-field
                  prepend-icon="mdi-face"
                  :rules="usernameRules"
                  v-model="username"
                  label="Username"
                  type="text"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  prepend-icon="mdi-email"
                  :rules="emailRules"
                  v-model="email"
                  label="Email"
                  type="email"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  prepend-icon="mdi-grain"
                  :rules="passwordRules"
                  v-model="password"
                  label="Password"
                  type="password"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  prepend-icon="mdi-gavel"
                  :rules="passwordRules"
                  v-model="passwordConfirmation"
                  label="Confirm Password"
                  type="password"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-btn
                  :loading="loading"
                  class="singup-submit"
                  color="info"
                  type="submit"
                  :disabled="!isFormValid || loading"
                >
                  <template v-slot:loader>
                    <span class="custom-loader">
                      <v-icon light>mdi-cached</v-icon>
                    </span>
                  </template>
                  Signup
                </v-btn>
                <h3>
                  <span>Already have an account?&#32;</span>
                  <router-link to="/signin">Signin</router-link>
                </h3>
              </v-col>
            </v-row>
          </v-form>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "Signup",
  data() {
    return {
      isFormValid: true,
      username: "",
      email: "",
      password: "",
      passwordConfirmation: "",
      usernameRules: [
        username => !!username || "Username is required",
        username =>
          username.length < 10 || "Usernane cannot be more than 10 characters"
      ],
      emailRules: [
        email => !!email || "Email is required",
        email => /.@+./.test(email) || "Email must be vaild"
      ],
      passwordRules: [
        password => !!password || "Password is required",
        password =>
          password.length >= 4 || "Password must be at least 4 characters",
        confirmation => confirmation === this.password || "Passwords must match"
      ]
    };
  },
  computed: {
    ...mapGetters(["loading", "error", "user"])
  },
  watch: {
    user(value) {
      // If user value changes, redirect to home page
      if (value) {
        this.$router.push("/");
      }
    }
  },
  methods: {
    handleSingupUser() {
      if (this.$refs.form.validate()) {
        // Singup user action
        this.$store.dispatch("signupUser", {
          username: this.username,
          email: this.email,
          password: this.password
        });
      }
    }
  }
};
</script>
<style scoped>
.signin-title {
  text-align: center;
}
.form-container {
  padding: 20px;
  text-align: center;
}
.singup-submit {
  margin-bottom: 15px;
}
.custom-loader {
  animation: loader 1s infinite;
  display: flex;
}
</style>