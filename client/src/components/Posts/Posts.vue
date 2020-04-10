<template>
  <v-container v-if="infiniteScrollPosts" fluid>
    <v-row dense>
      <v-col v-for="post in infiniteScrollPosts.posts" :key="post._id" cols="12" sm="6">
        <v-card hover @click.native="goToPost(post._id)">
          <v-img
            :src="post.imageUrl"
            class="white--text align-end"
            gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
            height="250px"
            lazy
          >
            <v-card-title v-text="post.title"></v-card-title>
          </v-img>
          <v-card-actions>
            <v-spacer></v-spacer>
            <div>
              <span class="grey--text">{{post.likes}} likes - {{post.messages.length}} comments</span>
            </div>
            <v-spacer></v-spacer>
            <v-btn @click="showPostCreator = !showPostCreator" icon>
              <v-icon v-if="showPostCreator">mdi-chevron-up</v-icon>
              <v-icon v-else>mdi-chevron-down</v-icon>
            </v-btn>
          </v-card-actions>
          <!-- Post creator title -->
          <v-slide-y-transition>
            <v-card-text v-show="showPostCreator" class="grey lighten-4">
              <v-list-item>
                <v-list-item-icon>
                  <v-icon color="secondary">mdi-information</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title v-text="post.createdBy.username"></v-list-item-title>
                  <v-list-item-subtitle v-text="formatCreatedDate(post.createdDate)"></v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-avatar>
                  <v-img :src="post.createdBy.avatar"></v-img>
                </v-list-item-avatar>
              </v-list-item>
            </v-card-text>
          </v-slide-y-transition>
        </v-card>
      </v-col>
    </v-row>

    <!-- Show more button -->
    <v-layout v-if="showMoreEnabled" column>
      <div class="text-center">
        <v-btn color="info" @click="showMorePosts" style="margin-top: 30px">Fetch More</v-btn>
      </div>
    </v-layout>
  </v-container>
</template>

<script>
import gql from "graphql-tag";
import { INFINITE_SCROLL_POSTS } from "../../queries";
import moment from "moment";

const pageSize = 2;

export default {
  name: "Posts",
  data() {
    return {
      pageNum: 1,
      showMoreEnabled: true,
      showPostCreator: false
    };
  },
  apollo: {
    infiniteScrollPosts: {
      query: INFINITE_SCROLL_POSTS,
      variables: {
        pageNum: 1,
        pageSize
      }
    }
  },
  methods: {
    goToPost(postId) {
      this.$router.push(`/posts/${postId}`);
    },
    showMorePosts() {
      this.pageNum += 1;
      // Fetch more data and transform the original result
      this.$apollo.queries.infiniteScrollPosts.fetchMore({
        variables: {
          pageNum: this.pageNum,
          pageSize
        },
        updateQuery: (prevResult, { fetchMoreResult }) => {
          const newPosts = fetchMoreResult.infiniteScrollPosts.posts;
          const hasMore = fetchMoreResult.infiniteScrollPosts.hasMore;
          this.showMoreEnabled = hasMore;

          return {
            infiniteScrollPosts: {
              __typename: prevResult.infiniteScrollPosts.__typename,
              // Merge previous posts and new posts
              posts: [...prevResult.infiniteScrollPosts.posts, ...newPosts],
              hasMore
            }
          };
        }
      });
    },
    formatCreatedDate(date) {
      return moment(new Date(date)).format("ll");
    }
  }
};
</script>