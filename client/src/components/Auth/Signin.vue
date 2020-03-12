<template>
  <v-container mt-5 pt-5>
    <!-- Signin Title -->
    <v-layout class="signin-title" row wrap>
      <v-flex xs12 sm6 offset-sm3>
        <h1>Welcome back!</h1>
      </v-flex>
    </v-layout>

    <v-layout row wrap>
      <v-flex xs12 sm6 offset-sm3>
        <v-card class="form-container" color="secondary" dark>
          <v-form @submit.prevent="handleSinginUser">
            <v-row>
              <v-col cols="12">
                <v-text-field v-model="username" label="Username" required></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-text-field v-model="password" label="Password" type="password" required></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-btn class="singup-submit" color="accent" type="submit">Sing in</v-btn>
                <h3>
                  <span>Don't have an account yet?&#32;</span>
                  <router-link to="/signup">Singup</router-link>
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
export default {
  name: "Signin",
  data() {
    return {
      username: "",
      password: ""
    };
  },
  methods: {
    handleSinginUser() {
      this.$store.dispatch("signinUser", {
        username: this.username,
        password: this.password
      });
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
</style>