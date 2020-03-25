import Vue from "vue";
import Vuex from "vuex";
import { apolloClient } from "./main";
import {
  GET_POSTS,
  SIGNIN_USER,
  SIGNUP_USER,
  GET_CURRENT_USER,
  ADD_POST
} from "./queries";
import router from "./router";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    posts: [],
    user: null,
    loading: false,
    error: null,
    authError: null
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
    setError: (state, payload) => {
      state.error = payload;
    },
    clearError: state => (state.error = null),
    clearUser: state => (state.user = null),
    setAuthError: (state, payload) => {
      state.authError = payload;
    }
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
    addPost: ({ commit }, payload) => {
      apolloClient
        .mutate({
          mutation: ADD_POST,
          variables: payload
        })
        .then(({ data }) => {
          console.log(data.addPost);
        })
        .catch(err => console.error(err));
    },
    signinUser: ({ commit }, payload) => {
      // Clear errors upon login
      commit("clearError");
      commit("setLoading", true);
      apolloClient
        .mutate({
          mutation: SIGNIN_USER,
          variables: payload
        })
        .then(({ data }) => {
          commit("setLoading", false);
          // Set token in local storage
          localStorage.setItem("token", data.signinUser.token);
          // To make sure method is run in main.js (we run getCurrentUser), reload the page
          router.go();
        })
        .catch(err => {
          commit("setLoading", false);
          commit("setError", err);
        });
    },
    signupUser: ({ commit }, payload) => {
      // Clear errors upon login
      commit("clearError");
      commit("setLoading", true);
      apolloClient
        .mutate({
          mutation: SIGNUP_USER,
          variables: payload
        })
        .then(({ data }) => {
          commit("setLoading", false);
          // Set token in local storage
          localStorage.setItem("token", data.signupUser.token);
          // To make sure method is run in main.js (we run getCurrentUser), reload the page
          router.go();
        })
        .catch(err => {
          commit("setLoading", false);
          commit("setError", err);
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
    loading: state => state.loading,
    error: state => state.error,
    authError: state => state.authError
  }
});
