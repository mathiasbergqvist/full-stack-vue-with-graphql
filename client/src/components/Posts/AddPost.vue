<template>
  <v-container mt-5 pt-5>
    <!-- Add Post Title -->
    <v-layout class="signin-title" row wrap>
      <v-flex xs12 sm6 offset-sm3>
        <h1 class="primary--text">Add post</h1>
      </v-flex>
    </v-layout>

    <!-- Add post form -->
    <v-layout row wrap>
      <v-flex xs12 sm6 offset-sm3>
        <v-form v-model="isFormValid" @submit.prevent="handleAddPost" lazy-validation ref="form">
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
              <v-textarea v-model="desc" :rules="descRules" label="Description"></v-textarea>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-btn
                :loading="loading"
                class="singup-submit"
                color="info"
                type="submit"
                :disabled="!isFormValid || loading"
              >
                <template v-slot:loader>
                  <span class="custom-loader">
                    <v-icon light>mdi-cached</v-icon>
                  </span>
                </template>
                Submit
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  name: "AddPost",
  data() {
    return {
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
          catiegories.length >= 1 || "At least one category is required"
      ],
      descRules: [
        desc => !!desc || "Description",
        desc =>
          desc.length < 150 || "Description must have less than 150 characters"
      ]
    };
  },
  computed: {
    imageCategories() {
      return ["Art", "Education", "Travel", "Technology"];
    }
  }
};
</script>