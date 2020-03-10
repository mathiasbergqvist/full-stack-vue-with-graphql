<template>
  <v-container>
    <h1>Home</h1>
    <ul v-for="post in getPosts" :key="post._id">
      <li>
        {{post.title}}
        {{post.imageUrl}}
        {{post.description}}
      </li>
    </ul>
  </v-container>
</template>

<script>
import gql from "graphql-tag";

export default {
  name: "Home",
  data() {
    return {
      posts: []
    };
  },
  apollo: {
    getPosts: {
      // Using smart query to retrieve posts
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
      `,
      result({ data, loading, networkStatus }) {
        if (!loading) {
          // Pass results to vue compoent
          this.posts = data.getPosts;
          console.log("network status", networkStatus);
        }
      }
    }
  }
};
</script>
