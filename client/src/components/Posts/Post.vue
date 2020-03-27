<template>
  <v-content>
    <v-container class="fill-height" v-if="getPost" fluid>
      <v-row align="center" justify="center">
        <!-- Post Card -->
        <v-card hover>
          <v-card-title>
            <h1>{{getPost.title}}</h1>
            <v-btn icon large v-if="user">
              <v-icon large color="grey">mdi-heart</v-icon>
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
    </v-container>
  </v-content>
</template>

<script>
import { GET_POST } from "../../queries";
import { mapGetters } from "vuex";

export default {
  name: "Post",
  props: ["postId"],
  data() {
    return {
      dialog: false
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
    ...mapGetters(["user"])
  },
  methods: {
    goToPreviousPage() {
      this.$router.go(-1);
    },
    toggleImageDialog() {
      if (window.innerWidth > 500) {
        this.dialog = !this.dialog;
      }
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