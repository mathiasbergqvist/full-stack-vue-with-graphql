<template>
  <v-app style="background: #fcfcfa">
    <!-- Side navbar -->
    <v-navigation-drawer app temporaray fixed v-model="sideNav">
      <v-toolbar color="accent" dark>
        <v-app-bar-nav-icon @click="toggleSideNav"></v-app-bar-nav-icon>
        <router-link to="/" tag="span" style="cursor: pointer">
          <h1 class="title pl-3">VueShare</h1>
        </router-link>
      </v-toolbar>
      <v-divider></v-divider>
      <!-- Side Navabar Links -->
      <v-list dense nav>
        <v-list-item v-for="item in sideNavItems" :key="item.title" :to="item.link" link>
          <v-list-item-icon>
            <v-icon>{{item.icon}}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{item.title}}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <!-- Signout list item -->
        <v-list-item v-if="user" @click="handleUserSignout">
          <v-list-item-icon>
            <v-icon>mdi-exit-to-app</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Singout</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-card color="primary" height="64px" tile>
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
        <v-text-field
          flex
          label="Search"
          color="accent"
          single-line
          hide-details
          v-model="searchTerm"
          @input="handleSearchPosts"
        ></v-text-field>

        <!-- Search result card -->
        <v-card color="accent" v-if="searchResults.length" id="search__card">
          <v-list>
            <v-list-item
              v-for="result in searchResults"
              :key="result._id"
              @click="goToSearchResult(result._id)"
            >
              <v-list-item-title>{{result.title}}</v-list-item-title>
              <v-list-item-subtitle class="font-weight-thin">{{result.description}}</v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </v-card>

        <v-spacer></v-spacer>

        <v-toolbar-items class="hidden-xs-only">
          <v-btn
            v-for="item in horizontalNavItem"
            :key="item.title"
            :to="item.link"
            style="width: 120px"
            icon
          >
            <v-icon left class="hidden-sm-only">{{item.icon}}</v-icon>
            {{item.title}}
          </v-btn>

          <!-- Profile button -->
          <v-btn to="/profile" v-if="user" style="width: 120px" icon>
            <v-icon class="hidden-sm-only" left>mdi-account-box</v-icon>
            <v-badge
              v-if="userFavorites.length"
              right
              color="blue darken-2"
              :class="{'bonce': badgeAnimated}"
            >
              <span slot="badge">{{userFavorites.length}}</span>
              Profile
            </v-badge>
            <span v-else>Profile</span>
          </v-btn>

          <!-- Signout button -->
          <v-btn to="/profile" v-if="user" style="width: 120px" @click="handleUserSignout" icon>
            <v-icon class="hidden-sm-only" left>mdi-exit-to-app</v-icon>Signout
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
    </v-card>
    <!-- App content -->
    <main>
      <v-container class="mt-4">
        <transition name="fade">
          <router-view />
        </transition>

        <!-- Auth snackbar -->
        <v-snackbar v-model="authSnackbar" :timeout="5000" color="success" bottom left>
          <v-icon class="mr-3">mdi-checkbox-marked-circle</v-icon>
          <h3>You are now signed in</h3>
          <v-btn dark @click="authSnackbar = false">Close</v-btn>
        </v-snackbar>

        <!-- Auth error snackbar -->
        <v-snackbar
          v-if="authError"
          v-model="authErrorSnackbar"
          :timeout="5000"
          color="info"
          bottom
          left
        >
          <v-icon class="mr-3">mdi-cancel</v-icon>
          <h3>{{authError.message}}</h3>
          <v-btn dark to="/signin">Singin</v-btn>
        </v-snackbar>
      </v-container>
    </main>
  </v-app>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "App",
  data() {
    return {
      authSnackbar: false,
      authErrorSnackbar: false,
      sideNav: false,
      badgeAnimated: false,
      searchTerm: ""
    };
  },
  watch: {
    user(newValue, oldValue) {
      // If we had no value from the user before, show snackbar
      if (oldValue === null) {
        this.authSnackbar = true;
      }
    },
    authError(value) {
      if (value !== null) {
        this.authErrorSnackbar = true;
      }
    },
    userFavorites(value) {
      // If user favorites value change at all
      if (value) {
        this.badgeAnimated = true;
        setTimeout(() => (this.badgeAnimated = false), 100);
      }
    }
  },
  computed: {
    ...mapGetters([
      "authError",
      "user",
      "userFavorites",
      "searchResults",
      "loading"
    ]),
    horizontalNavItem() {
      let items = [
        { icon: "mdi-chat", title: "Posts", link: "/posts" },
        { icon: "mdi-lock-open", title: "Sign In", link: "/signin" },
        { icon: "mdi-star", title: "Sign Up", link: "/signup" }
      ];
      if (this.user) {
        items = [{ icon: "mdi-chat", title: "Posts", link: "/posts" }];
      }
      return items;
    },
    sideNavItems() {
      let items = [
        { icon: "mdi-chat", title: "Posts", link: "/posts" },
        { icon: "mdi-lock-open", title: "Sign In", link: "/signin" },
        { icon: "mdi-star", title: "Sign Up", link: "/signup" }
      ];
      if (this.user) {
        items = [
          { icon: "mdi-chat", title: "Posts", link: "/posts" },
          { icon: "mdi-star", title: "Create Post", link: "/posts/add" },
          { icon: "mdi-account-box", title: "Profile", link: "/profile" }
        ];
      }
      return items;
    }
  },
  methods: {
    handleUserSignout() {
      this.$store.dispatch("signoutUser");
    },
    formatDescription(desc) {
      return desc.lenght > 10 ? `${desc.slice(0, 10)}...` : desc;
    },
    toggleSideNav() {
      this.sideNav = !this.sideNav;
    },
    handleSearchPosts() {
      this.$store.dispatch("searchPosts", {
        searchTerm: this.searchTerm
      });
    },
    goToSearchResult(resultId) {
      // Clear search term
      this.searchTerm = "";
      // Go to desired results
      this.$router.push(`/posts/${resultId}`);
      // Clear search results
      this.$store.commit("clearSearchResults");
    }
  }
};
</script>

<style>
h1 {
  font-weight: 400;
  font-size: 2.5rem;
}

h2 {
  font-weight: 400;
  font-size: 2rem;
}

.fade-enter-active,
.fade-leave-active {
  transition-property: all;
  transition-duration: 0.25s;
}

.fade-enter-active {
  transition-delay: 0.25s;
}

.fade-enter,
.fade-leave-active {
  transform: translateY(-25px);
  opacity: 0;
}
/* User favorite animation */
.bonce {
  animation: bounce 1s both;
}
@keyframes bounce {
  0%,
  20%,
  53%,
  80%,
  100% {
    transform: translate3d(0, 0, 0);
  }
  40%,
  43% {
    transform: translate3d(0, -20px, 0);
  }
  70% {
    transform: translate3d(0, -10px, 0);
  }
  90% {
    transform: translate3d(0, -4px, 0);
  }
}
#search__card {
  position: absolute;
  width: 100vw;
  z-index: 8;
  top: 100%;
  left: 0;
}
</style>
