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
  apollo: {
    getPosts: gql`
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
  }
};
</script>
