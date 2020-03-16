<template>
  <v-alert type="error" v-model="alert" transition="scale-transition" dismissible>
    <h3>{{message}}</h3>
  </v-alert>
</template>     

<script>
export default {
  props: ["message"],
  data() {
    return {
      alert: true
    };
  }
};
</script>