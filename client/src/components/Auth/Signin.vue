<template>
  <v-container mt-5 pt-5>
    <!-- Signin Title -->
    <v-layout class="signin-title" row wrap>
      <v-flex xs12 sm6 offset-sm3>
        <h1>Welcome back!</h1>
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
        <v-card class="form-container" color="secondary" dark>
          <v-form
            v-model="isFormValid"
            @submit.prevent="handleSinginUser"
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
                <v-btn
                  :loading="loading"
                  class="singup-submit"
                  color="accent"
                  type="submit"
                  :disabled="!isFormValid || loading"
                >
                  <template v-slot:loader>
                    <span class="custom-loader">
                      <v-icon light>mdi-cached</v-icon>
                    </span>
                  </template>
                  Signin
                </v-btn>
                <h3>
                  <span>Don't have an account yet?&#32;</span>
                  <router-link to="/signup">Signup</router-link>
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
  name: "Signin",
  data() {
    return {
      isFormValid: true,
      username: "",
      password: "",
      usernameRules: [
        // Check if username in input
        username => !!username || "Username is required",
        // Make sure username is less than 10 characters
        username =>
          username.length < 10 || "Username must be less than 10 characters"
      ],
      passwordRules: [
        // Check if password in input
        password => !!password || "Password is required",
        // Make sure password is less than 7 characters
        password =>
          password.length >= 6 || "Password must be at least 6 characters"
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
    handleSinginUser() {
      if (this.$refs.form.validate()) {
        this.$store.dispatch("signinUser", {
          username: this.username,
          password: this.password
        });
      }
    },
    isButtonDisabled() {
      return !this.$refs.form.validate();
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
@-moz-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-webkit-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-o-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>