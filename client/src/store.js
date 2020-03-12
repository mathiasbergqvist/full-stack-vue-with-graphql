import Vue from "vue";
import Vuex from "vuex";
import { apolloClient } from "./main";
import { GET_POSTS, SIGNIN_USER } from "./queries";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    posts: [],
    loading: false
  },
  // Mutations to the store - update our state
  mutations: {
    setPosts: (state, payload) => {
      state.posts = payload;
    },
    setLoading: (state, payload) => {
      state.loading = payload;
    }
  },
  actions: {
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
          commit("setPosts", data.getPosts);
          commit("setLoading", false);
        })
        .catch(err => {
          commit("setLoading", false);
        });
    },
    signinUser: ({ commit }, payload) => {
      apolloClient
        .mutate({
          mutation: SIGNIN_USER,
          variables: payload
        })
        .then(({ data }) => {
          console.log(data.signinUser);
        })
        .catch(err => {
          console.error(err);
        });
    }
  },
  // Getters for store
  getters: {
    posts: state => state.posts,
    loading: state => state.loading
  }
});
