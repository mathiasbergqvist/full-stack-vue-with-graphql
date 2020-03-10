<template>
  <v-container>
    <h1>Posts</h1>
    <ApolloQuery :query="getPostsQuery">
      <template slot-scope="{ result: {loading, error, data} }">
        <div v-if="loading">Loading...</div>
        <div v-else-if="error">Error!</div>
        <ul v-else v-for="post in data.getPosts" :key="post._id">
          <li>
            {{post.title}}
            {{post.imageUrl}}
            {{post.description}}
          </li>
        </ul>
      </template>
    </ApolloQuery>
  </v-container>
</template>

<script>
import gql from "graphql-tag";
export default {
  name: "Posts",
  data() {
    return {
      getPostsQuery: gql`
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
    };
  }
};
</script>