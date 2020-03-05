<template>
  <v-app>
    <v-card color="primary" flat height="64px" tile>
      <v-toolbar color="primary" dark>
        <!-- App title  -->
        <v-app-bar-nav-icon></v-app-bar-nav-icon>
        <v-toolbar-title class="hidden-xs-only">
          <router-link to="/" tag="span" style="cursor: pointer">VueShare</router-link>
        </v-toolbar-title>

        <v-spacer></v-spacer>

        <!-- Search input -->
        <v-btn icon>
          <v-icon>mdi-magnify</v-icon>
        </v-btn>
        <v-text-field flex label="Search" color="accent" single-line hide-details></v-text-field>

        <v-spacer></v-spacer>

        <v-toolbar-items class="hidden-xs-only">
          <v-btn
            v-for="item in horizontalNavItem"
            :key="item.title"
            :to="item.link"
            style="width: 100px"
            icon
            flat
          >
            <v-icon left class="hidden-sm-only">{{item.icon}}</v-icon>
            {{item.title}}
          </v-btn>
        </v-toolbar-items>
        <!-- <v-toolbar-items>
          <v-btn flat color="primary">POSTS</v-btn>
        </v-toolbar-items>-->
      </v-toolbar>
    </v-card>
    <!-- App content -->
    <main>
      <v-container class="mt-4">
        <router-view />
      </v-container>
    </main>
  </v-app>
</template>

<script>
export default {
  name: "App",
  computed: {
    horizontalNavItem() {
      return [
        { icon: "mdi-chat", title: "Posts", link: "/posts" },
        { icon: "mdi-lock-open", title: "Sign In", link: "/signin" },
        { icon: "mdi-star", title: "Sign Up", link: "/signup" }
      ];
    }
  }
};
</script>
