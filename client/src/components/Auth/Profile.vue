<template>
  <v-container class="text-xs-center">
    <!-- User details card -->
    <v-flex sm6 offset-sm3>
      <v-card class="white--text" color="secondary">
        <div class="d-flex flex-no-wrap justify-space-between">
          <div>
            <v-card-title primary-title>
              <div>
                <div class="headline">{{user.username}}</div>
                <div>Joined: {{user.joinDate}}</div>
              </div>
            </v-card-title>
            <v-card-subtitle>
              <div class="hidden-xs-only white--text">{{user.favorites.length}} Favorites</div>
              <div class="hidden-xs-only white--text">{{userPosts.length}} posts added</div>
            </v-card-subtitle>
          </div>
          <v-avatar class="ma-3" size="125" tile>
            <v-img :src="user.avatar"></v-img>
          </v-avatar>
        </div>
      </v-card>
    </v-flex>

    <!-- Posts favorited by user -->
    <v-layout row wrap v-if="!user.favorites.length">
      <div class="d-flex xs-12">
        <h2>You have no favorites currently</h2>
      </div>
    </v-layout>
    <v-container class="mt-3" v-else>
      <div class="d-flex xs-12">
        <h2 class="font-weight-light">
          Favorited
          <span class="font-weight-regular">{{user.favorites.length}}</span>
        </h2>
      </div>
      <v-row dense>
        <v-col cols="6">
          <div class="d-flex sm-6 xs-12" v-for="favorite in user.favorites" :key="favorite._id">
            <v-card class="mt-3 ml-1 mr-2" hover>
              <v-img
                :src="favorite.imageUrl"
                class="white--text align-end"
                gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
                height="30vh"
              >
                <v-card-title v-text="favorite.title"></v-card-title>
              </v-img>
            </v-card>
          </div>
        </v-col>
      </v-row>
    </v-container>

    <!-- Post created by user -->
    <v-layout row wrap v-if="!userPosts.length">
      <div class="d-flex xs-12">
        <h2>You have no posts currently. Go and add some!</h2>
      </div>
    </v-layout>
    <v-container fluid class="mt-3" v-else>
      <div class="d-flex xs-12">
        <h2 class="font-weight-light">
          Your Posts
          <span class="font-weight-regular">{{userPosts.length}}</span>
        </h2>
      </div>
      <v-row dense>
        <v-col cols="12" sm="6" v-for="post in userPosts" :key="post._id">
          <div class="d-flex sm-6 xs-12">
            <v-card class="mt-3 ml-1 mr-2" hover>
              <v-card-actions>
                <v-btn color="info" floating fab small dark @click="loadPost(post)">
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
                <v-btn color="error" floating fab small dark @click="handleDeleteUserPost(post)">
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </v-card-actions>
              <v-img
                :src="post.imageUrl"
                class="white--text align-end"
                gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
                height="50vh"
              >
                <v-card-title v-text="post.title"></v-card-title>
              </v-img>
            </v-card>
          </div>
        </v-col>
      </v-row>
    </v-container>

    <!-- Edit Post dialog -->
    <v-dialog xs12 sm6 offset-sm3 persistent v-model="editPostDialog">
      <v-card>
        <v-card-title class="headline grey lighten-2">Update Post</v-card-title>
        <v-form
          v-model="isFormValid"
          @submit.prevent="handleUpdateUserPost"
          lazy-validation
          ref="form"
        >
          <!-- Title Input -->
          <v-row>
            <v-col cols="12">
              <v-text-field
                :rules="titleRules"
                v-model="title"
                label="Post Title"
                type="text"
                required
              ></v-text-field>
            </v-col>
          </v-row>
          <!-- Image Url Input -->
          <v-row>
            <v-col cols="12">
              <v-text-field
                :rules="imageRules"
                v-model="imageUrl"
                label="Image URL"
                type="text"
                required
              ></v-text-field>
            </v-col>
          </v-row>
          <!-- Image Preview -->
          <v-row>
            <v-col cols="12">
              <img :src="imageUrl" alt="Image preview" height="300px" />
            </v-col>
          </v-row>
          <!-- Categories Select -->
          <v-row>
            <v-col cols="12">
              <v-select
                v-model="categories"
                :items="imageCategories"
                :rules="categoriesRules"
                multiple
                label="Categories"
              ></v-select>
            </v-col>
          </v-row>
          <!-- Description Text Area -->
          <v-row>
            <v-col cols="12">
              <v-textarea v-model="description" :rules="descRules" label="Description"></v-textarea>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-divider></v-divider>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn :disabled="!isFormValid" type="submit" class="success--text">Update</v-btn>
                <v-btn class="error--text" @click="editPostDialog = false">Cancel</v-btn>
              </v-card-actions>
            </v-col>
          </v-row>
        </v-form>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "Profile",
  data() {
    return {
      editPostDialog: false,
      isFormValid: true,
      title: "",
      imageUrl: "",
      categories: [],
      description: "",
      titleRules: [
        title => !!title || "Title is required",
        title => title.length < 20 || "Title must have less than 20 characters"
      ],
      imageRules: [image => !!image || "Image is required"],
      categoriesRules: [
        categories =>
          categories.length >= 1 || "At least one category is required"
      ],
      descRules: [
        desc => !!desc || "Description",
        desc =>
          desc.length < 150 || "Description must have less than 150 characters"
      ]
    };
  },
  computed: {
    ...mapGetters(["user", "userPosts"]),
    imageCategories() {
      return ["Art", "Education", "Travel", "Technology"];
    }
  },
  created() {
    this.handleUserPosts();
  },
  methods: {
    handleUserPosts() {
      this.$store.dispatch("getUserPosts", {
        userId: this.user._id
      });
    },
    handleUpdateUserPost() {
      if (this.$refs.form.validate()) {
        // Update user posts action
        this.$store.dispatch("updateUserPost", {
          postId: this.postId,
          userId: this.user._id,
          title: this.title,
          imageUrl: this.imageUrl,
          categories: this.categories,
          description: this.description
        });
        this.editPostDialog = false;
      }
    },
    handleDeleteUserPost(post) {
      this.loadPost(post, false);
      const deletePost = window.confirm(
        "Are you sure you want to delete this post?"
      );
      if (deletePost) {
        this.$store.dispatch("deleteUserPost", {
          postId: post._id
        });
      }
    },
    loadPost(
      { _id, title, imageUrl, categories, description },
      editPostDialog = true
    ) {
      this.editPostDialog = editPostDialog;
      this.postId = _id;
      this.title = title;
      this.imageUrl = imageUrl;
      this.categories = categories;
      this.description = description;
    }
  }
};
</script>