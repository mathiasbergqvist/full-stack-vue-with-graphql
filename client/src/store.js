import Vue from "vue";
import Vuex from "vuex";
import { apolloClient } from "./main";
import {
  GET_POSTS,
  GET_USER_POST,
  SIGNIN_USER,
  SIGNUP_USER,
  GET_CURRENT_USER,
  ADD_POST,
  SEARCH_POST,
  UPDATE_USER_POST,
  DELETE_USER_POST,
  INFINITE_SCROLL_POSTS,
} from "./queries";
import router from "./router";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    posts: [],
    userPosts: [],
    searchResults: [],
    user: null,
    loading: false,
    error: null,
    authError: null,
  },
  // Mutations to the store - update our state
  mutations: {
    setPosts: (state, payload) => {
      state.posts = payload;
    },
    setUser: (state, payload) => {
      state.user = payload;
    },
    setUserPosts: (state, payload) => {
      state.userPosts = payload;
    },
    setLoading: (state, payload) => {
      state.loading = payload;
    },
    setError: (state, payload) => {
      state.error = payload;
    },
    setSearchResults: (state, payload) => {
      if (payload !== null) {
        state.searchResults = payload;
      }
    },
    clearError: (state) => (state.error = null),
    clearUser: (state) => (state.user = null),
    clearSearchResults: (state) => (state.searchResults = []),
    setAuthError: (state, payload) => {
      state.authError = payload;
    },
  },
  actions: {
    getCurrentUser: ({ commit }) => {
      console.log("getCurrentUser");
      commit("setLoading", true);
      apolloClient
        .query({
          query: GET_CURRENT_USER,
        })
        .then(({ data }) => {
          commit("setLoading", false);
          // Add current user data to state
          commit("setUser", data.getCurrentUser);
        })
        .catch((err) => {
          console.error("getCurrentUser", err);
          commit("setLoading", false);
        });
    },
    getPosts: ({ commit }) => {
      commit("setLoading", true);
      // Use ApolloClient to fire getPosts query
      apolloClient
        .query({
          query: GET_POSTS,
        })
        .then(({ data }) => {
          // Get data from actions to state via mutations
          // commit passes data from actions to along to mutation funcitons
          commit("setLoading", false);
          commit("setPosts", data.getPosts);
        })
        .catch((err) => {
          commit("setLoading", false);
        });
    },
    getUserPosts: ({ commit }, payload) => {
      commit("setLoading", true);
      apolloClient
        .query({
          query: GET_USER_POST,
          variables: payload,
        })
        .then(({ data }) => {
          console.log("DATA", data.getUserPosts);
          commit("setUserPosts", data.getUserPosts);
        })
        .catch((err) => {
          console.error(err);
        });
    },
    addPost: ({ commit }, payload) => {
      apolloClient
        .mutate({
          mutation: ADD_POST,
          variables: payload,
          update: (cache, { data: { addPost } }) => {
            // First, read the query that you want to update
            const data = cache.readQuery({ query: GET_POSTS });
            // Create update data
            data.getPosts.unshift(addPost);
            // Write the updated data back to the query
            cache.writeQuery({
              query: GET_POSTS,
              data,
            });
          },
          // Optimistic response ensures data is added immediately as we specify for the update function
          optimisticResponse: {
            __typename: "Mutation",
            addPost: {
              __typename: "Post",
              _id: -1,
              ...payload,
            },
          },
          // Rerun spesific queries after performing the mutation in order to get fresh data
          refetchQueries: [
            {
              query: INFINITE_SCROLL_POSTS,
              variables: {
                pageNum: 1,
                pageSize: 2,
              },
            },
          ],
        })
        .then((cache, { data }) => {
          console.log("DATA", data);
        })
        .catch((err) => console.error(err));
    },
    searchPosts: ({ commit }, payload) => {
      console.log("Store search", payload);
      apolloClient
        .query({
          query: SEARCH_POST,
          variables: payload,
        })
        .then(({ data }) => {
          commit("setSearchResults", data.searchPosts);
        })
        .catch((err) => console.error(err));
    },
    updateUserPost: ({ commit }, payload) => {
      apolloClient
        .mutate({
          mutation: UPDATE_USER_POST,
          variables: payload,
        })
        .then(({ data }) => {
          const index = state.userPost.findIndex(
            (post) => post._id === data.updateUserPost._id
          );
          const userPosts = [
            ...state.userPosts.slice(0, index),
            data.updateUserPost,
            ...state.userPost.slice(index + 1),
          ];
          commit("setUserPost", userPosts);
        })
        .catch((err) => console.error(err));
    },
    deleteUserPost: ({ state, commit }, payload) => {
      apolloClient
        .mutate({
          mutation: DELETE_USER_POST,
          variables: payload,
        })
        .then((data) => {
          const index = state.userPosts.findIndex(
            (post) => post._id === data.deleteUserPost._id
          );
          const userPosts = [
            ...state.userPosts.slice(0, index),
            ...state.userPost.slice(index + 1),
          ];
          commit("setUserPost", userPosts);
        })
        .catch((err) => console.error(err));
    },
    signinUser: ({ commit }, payload) => {
      // Clear errors upon login
      commit("clearError");
      commit("setLoading", true);
      apolloClient
        .mutate({
          mutation: SIGNIN_USER,
          variables: payload,
        })
        .then(({ data }) => {
          commit("setLoading", false);
          // Set token in local storage
          localStorage.setItem("token", data.signinUser.token);
          // To make sure method is run in main.js (we run getCurrentUser), reload the page
          router.go();
        })
        .catch((err) => {
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
          variables: payload,
        })
        .then(({ data }) => {
          commit("setLoading", false);
          // Set token in local storage
          localStorage.setItem("token", data.signupUser.token);
          // To make sure method is run in main.js (we run getCurrentUser), reload the page
          router.go();
        })
        .catch((err) => {
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
    },
  },
  // Getters for store
  getters: {
    posts: (state) => state.posts,
    userPosts: (state) => state.userPosts,
    searchResults: (state) => state.searchResults,
    user: (state) => state.user,
    userFavorites: (state) => state.user && state.user.favorites,
    loading: (state) => state.loading,
    error: (state) => state.error,
    authError: (state) => state.authError,
  },
});
