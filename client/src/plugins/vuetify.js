import Vue from "vue";
import Vuetify from "vuetify/lib";

Vue.use(Vuetify);

export default new Vuetify({
  icons: {
    iconfont: "mdiSvg"
  },
  theme: {
    themes: {
      light: {
        primary: "#bac7be",
        secondary: "#c2e1c2",
        accent: "#7dcd85",
        anchor: "#778472",
        error: "#f44336",
        warning: "#ffeb3b",
        info: "#2196f3",
        success: "#8bc34a"
      }
    }
  }
});
