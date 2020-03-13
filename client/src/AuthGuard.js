import store from "./store";

export default (to, from, next) => {
  if (!store.getters.user) {
    // Redirect unauthenticated users to signin route
    next({ path: "/signin" });
  } else {
    next();
  }
};
