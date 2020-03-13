import Vue from "vue";
import Vuex from "vuex";
import { apolloClient } from "./main";
import { GET_POSTS, SIGNIN_USER, GET_CURRENT_USER } from "./queries";
import router from "./router";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    posts: [],
    user: null,
    loading: false
  },
  // Mutations to the store - update our state
  mutations: {
    setPosts: (state, payload) => {
      state.posts = payload;
    },
    setUser: (state, payload) => {
      state.user = payload;
    },
    setLoading: (state, payload) => {
      state.loading = payload;
    },
    clearUser: state => (state.user = null)
  },
  actions: {
    getCurrentUser: ({ commit }) => {
      console.log("getCurrentUser");
      commit("setLoading", true);
      apolloClient
        .query({
          query: GET_CURRENT_USER
        })
        .then(({ data }) => {
          commit("setLoading", false);
          // Add current user data to state
          commit("setUser", data.getCurrentUser);
        })
        .catch(err => {
          console.error("getCurrentUser", err);
          commit("setLoading", false);
        });
    },
    getPosts: ({ commit }) => {
      commit("setLoading", true);
      // Use ApolloClient to fire getPosts query
      apolloClient
        .query({
          query: GET_POSTS
        })
        .then(({ data }) => {
          // Get data from actions to state via mutations
          // commit passes data from actions to along to mutation funcitons
          commit("setLoading", false);
          commit("setPosts", data.getPosts);
        })
        .catch(err => {
          commit("setLoading", false);
        });
    },
    signinUser: ({ commit }, payload) => {
      // Clear local storage before signing in (in case token is malformatted)
      localStorage.setItem("token", "");
      apolloClient
        .mutate({
          mutation: SIGNIN_USER,
          variables: payload
        })
        .then(({ data }) => {
          // Set token in local storage
          localStorage.setItem("token", data.signinUser.token);
          // To make sure method is run in main.js (we run getCurrentUser), reload the page
          router.go();
        })
        .catch(err => {
          console.error(err);
        });
    },
    signoutUser: async ({ commit }) => {
      // Clear user in state
      commit("clearUser");
      // Remove the token in local storage
      localStorage.setItem("token", "");
      // End the session
      await apolloClient.resetStore();
      // Redirect home - kick users out of private pages
      router.push("/");
    }
  },
  // Getters for store
  getters: {
    posts: state => state.posts,
    user: state => state.user,
    loading: state => state.loading
  }
});
