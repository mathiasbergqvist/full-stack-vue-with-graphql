<template>
  <v-app style="background: #fcfcfa">
    <!-- Side navbar -->
    <v-navigation-drawer app temporaray fixed v-model="sideNav">
      <v-toolbar color="accent" dark flat>
        <v-app-bar-nav-icon @click="toggleSideNav"></v-app-bar-nav-icon>
        <roter-link to="/" tag="span" style="cursor: pointer">
          <h1 class="title pl-3">VueShare</h1>
        </roter-link>
      </v-toolbar>
      <v-divider></v-divider>
      <!-- Side Navabar Links -->
      <v-list dense nav>
        <v-list-item v-for="item in sideNavItems" :key="item.title" :to="item.link" link>
          <v-list-item-icon>
            <v-icon>{{item.icon}}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>
              {{item.title}}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-card color="primary" flat height="64px" tile>
      <v-toolbar color="primary" dark>
        <!-- App title  -->
        <v-app-bar-nav-icon @click="toggleSideNav"></v-app-bar-nav-icon>
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
  data() {
    return {
      sideNav: false
    }
  },
  computed: {
    horizontalNavItem() {
      return [
        { icon: "mdi-chat", title: "Posts", link: "/posts" },
        { icon: "mdi-lock-open", title: "Sign In", link: "/signin" },
        { icon: "mdi-star", title: "Sign Up", link: "/signup" }
      ];
    },
    sideNavItems() {
      return [
        { icon: "mdi-chat", title: "Posts", link: "/posts" },
        { icon: "mdi-lock-open", title: "Sign In", link: "/signin" },
        { icon: "mdi-star", title: "Sign Up", link: "/signup" }
      ];
    }
  },
  methods: {
    toggleSideNav() {
      this.sideNav = !this.sideNav;
    }
  }
};
</script>
