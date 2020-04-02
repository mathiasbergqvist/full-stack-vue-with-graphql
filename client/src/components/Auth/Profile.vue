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
              <div class="hidden-xs-only white--text">2 posts added</div>
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
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "Profile",
  computed: {
    ...mapGetters(["user"])
  }
};
</script>