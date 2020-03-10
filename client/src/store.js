import gql from "graphql-tag";
import Vue from "vue";
import Vuex from "vuex";
import { apolloClient } from "./main";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {
    getPosts: () => {
      // Use ApolloClient to fire getPosts query
      apolloClient
        .query({
          query: gql`
            query {
              getPosts {
                _id
                title
                imageUrl
                description
                likes
              }
            }
          `
        })
        .then(data => {
          console.log("getPosts data", data);
        })
        .catch(err => {
          console.error("getPosts error", err);
        });
    }
  }
});
