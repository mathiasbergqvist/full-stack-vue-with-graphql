<template>
  <v-content>
    <v-container class="fill-height" v-if="getPost" fluid>
      <v-row align="center" justify="center">
        <!-- Post Card -->
        <v-card hover>
          <v-card-title>
            <h1>{{getPost.title}}</h1>
            <v-btn icon large v-if="user" @click="handleToggleLike">
              <v-icon large :color="checkIfPostLiked(getPost._id) ? 'red' : 'gray'">mdi-heart</v-icon>
            </v-btn>
            <h3 class="ml-3 font-weight-thin">{{getPost.likes}} LIKES</h3>
            <v-spacer></v-spacer>
            <v-icon color="info" large @click="goToPreviousPage()">mdi-arrow-left</v-icon>
          </v-card-title>
          <v-tooltip right>
            <template v-slot:activator="{ on }">
              <v-img
                class="post__image"
                :src="getPost.imageUrl"
                v-on="on"
                @click="toggleImageDialog()"
              ></v-img>
            </template>
            <span>Click to enlarge image</span>
          </v-tooltip>

          <!-- Enlarged post image -->
          <v-dialog v-model="dialog">
            <v-card>
              <v-img class="post__image__dialog" :src="getPost.imageUrl"></v-img>
            </v-card>
          </v-dialog>

          <v-card-text>
            <span v-for="(category, index) in getPost.categories" :key="index">
              <v-chip class="mb-3" color="accent" text-color="white">{{category}}</v-chip>
            </span>
            <h3>{{getPost.description}}</h3>
          </v-card-text>
        </v-card>
      </v-row>
      <!-- Messages section -->
      <v-row align="center" justify="center">
        <div class="mt-3" style="width: 80%">
          <v-layout class="mb-3" v-if="user">
            <v-flex xs12>
              <v-form
                v-model="isFormValid"
                lazy-validation
                ref="form"
                @submit.prevent="handleAddPostMessage"
              >
                <v-row>
                  <v-flex xs12>
                    <v-text-field
                      v-model="messageBody"
                      clearable
                      :append-outer-icon="messageBody && 'mdi-send'"
                      :rules="messageRules"
                      prepend-icon="mdi-email"
                      label="Add message"
                      type="text"
                      @click:append-outer="handleAddPostMessage"
                      reqired
                    ></v-text-field>
                  </v-flex>
                </v-row>
              </v-form>
            </v-flex>
          </v-layout>
          <v-layout wrap>
            <v-row>
              <v-flex xs12>
                <v-list subheader two-line>
                  <v-subheader>Messages ({{getPost.messages.length}})</v-subheader>
                  <template v-for="message in getPost.messages">
                    <v-divider :key="message._id"></v-divider>
                    <v-list-item :key="message.title">
                      <v-list-item-avatar>
                        <v-img :src="message.messageUser.avatar"></v-img>
                      </v-list-item-avatar>
                      <v-list-item-content>
                        <v-list-item-title v-text="message.messageBody"></v-list-item-title>
                        <v-list-item-subtitle v-text="message.messageUser.username"></v-list-item-subtitle>
                        <span
                          class="grey--text text--lighten-1 hidden-xs-only"
                        >{{getTimeFromNow(message.messageDate)}}</span>
                      </v-list-item-content>
                      <v-list-item-action>
                        <v-btn icon>
                          <v-icon
                            :color="checkIfOwnMessage(message) ? 'accent' : 'grey lighten-1'"
                          >mdi-chat</v-icon>
                        </v-btn>
                      </v-list-item-action>
                    </v-list-item>
                  </template>
                </v-list>
              </v-flex>
            </v-row>
          </v-layout>
        </div>
      </v-row>
    </v-container>
  </v-content>
</template>

<script>
import {
  GET_POST,
  ADD_POST_MESSAGE,
  LIKE_POST,
  UNLIKE_POST
} from "../../queries";
import { mapGetters } from "vuex";
import moment from "moment";

export default {
  name: "Post",
  props: ["postId"],
  data() {
    return {
      postLiked: false,
      dialog: false,
      messageBody: "",
      isFormValid: true,
      messageRules: [
        message => !!message || "Message is required",
        message =>
          message.length < 50 || "Message must be less than 50 characters"
      ]
    };
  },
  apollo: {
    getPost: {
      query: GET_POST,
      variables() {
        return {
          postId: this.postId
        };
      }
    }
  },
  computed: {
    ...mapGetters(["user", "userFavorites"])
  },
  methods: {
    checkIfPostLiked(postId) {
      // Check if user favorites includes post with id of 'postId'
      if (
        this.userFavorites &&
        this.userFavorites.some(fave => fave._id === postId)
      ) {
        this.postLiked = true;
        return true;
      } else {
        this.postLiked = false;
        return false;
      }
    },
    handleAddPostMessage() {
      if (this.$refs.form.validate()) {
        const variables = {
          messageBody: this.messageBody,
          userId: this.user._id,
          postId: this.postId
        };
        this.$apollo
          .mutate({
            mutation: ADD_POST_MESSAGE,
            variables,
            update: (cache, { data: { addPostMessage } }) => {
              const data = cache.readQuery({
                query: GET_POST,
                variables: { postId: this.postId }
              });
              data.getPost.messages.unshift(addPostMessage);
              cache.writeQuery({
                query: GET_POST,
                variables: { postId: this.postId },
                data
              });
            }
          })
          .then(({ data }) => {
            this.$refs.form.reset();
          })
          .catch(err => console.error(err));
      }
    },
    handleToggleLike() {
      if (this.postLiked) {
        this.handleUnlikePost();
      } else {
        this.handleLikePost();
      }
    },
    handleLikePost() {
      this.$apollo
        .mutate({
          mutation: LIKE_POST,
          variables: {
            postId: this.postId,
            username: this.user.username
          },
          update: (cache, { data: { likePost } }) => {
            const data = cache.readQuery({
              query: GET_POST,
              variables: { postId: this.postId }
            });
            data.getPost.likes += 1;
            cache.writeQuery({
              query: GET_POST,
              variables: { postId: this.postId },
              data
            });
          }
        })
        .then(({ data }) => {
          const updatedUser = {
            ...this.user,
            favorites: data.likePost.favorites
          };
          this.$store.commit("setUser", updatedUser);
        })
        .catch(err => console.error(err));
    },
    handleUnlikePost() {
      this.$apollo
        .mutate({
          mutation: UNLIKE_POST,
          variables: {
            postId: this.postId,
            username: this.user.username
          },
          update: (cache, { data: { likePost } }) => {
            const data = cache.readQuery({
              query: GET_POST,
              variables: { postId: this.postId }
            });
            data.getPost.likes -= 1;
            cache.writeQuery({
              query: GET_POST,
              variables: { postId: this.postId },
              data
            });
          }
        })
        .then(({ data }) => {
          const updatedUser = {
            ...this.user,
            favorites: data.likePost.favorites
          };
          this.$store.commit("setUser", updatedUser);
        })
        .catch(err => console.error(err));
    },
    goToPreviousPage() {
      this.$router.go(-1);
    },
    toggleImageDialog() {
      if (window.innerWidth > 500) {
        this.dialog = !this.dialog;
      }
    },
    checkIfOwnMessage(message) {
      return this.user && this.user._id === message.messageUser._id;
    },
    getTimeFromNow(time) {
      return moment(new Date(time)).fromNow();
    }
  }
};
</script>  
<style scoped>
.post__image {
  height: 400px !important;
}
.post__image__dialog {
  height: 80vh !important;
}
</style>