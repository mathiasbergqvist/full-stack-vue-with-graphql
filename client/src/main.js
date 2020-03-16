import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import ApolloClient from "apollo-boost";
import VueApollo from "vue-apollo";

import FormAlert from "./components/Shared/FormAlert";

// Register global component
Vue.component("form-alert", FormAlert);

Vue.use(VueApollo);

// Setup Apollo Client
export const apolloClient = new ApolloClient({
  uri: "http://localhost:4000/graphql",
  // Include auth token with requests made to backend
  fetchOptions: {
    credentials: "include"
  },
  request: operation => {
    // If no token in storage, add a blank one
    if (!localStorage.getItem("token")) {
      localStorage.setItem("token", "");
    }

    // Operation adds the token to an authorization header, which is sent to the backend
    operation.setContext({
      headers: {
        authorization: localStorage.getItem("token")
      }
    });
  },
  onError: ({ graphQLErrors, networkError }) => {
    if (networkError) {
      console.error("[NETOWRK ERROR]", networkError);
    }

    if (graphQLErrors) {
      for (let error of graphQLErrors) {
        console.dir(graphQLErrors);
        if (error.name === "AuthenticationError") {
          // Set auth error in state (to show in snackbar)
          store.commit("setAuthError", error);
          // Singout user (clear token)
          store.dispatch("signoutUser");
        }
      }
    }
  }
});

const apolloProvider = new VueApollo({ defaultClient: apolloClient });

Vue.config.productionTip = false;

new Vue({
  apolloProvider,
  router,
  store,
  vuetify,
  render: h => h(App),
  // Lifecycle method that runs when the application is created
  created() {
    // execute getCurrentUser query
    this.$store.dispatch("getCurrentUser");
  }
}).$mount("#app");
