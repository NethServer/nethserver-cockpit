<template>
    <div id="app">
      <div class="container-fluid">
        <router-view></router-view>
      </div>
  </div>
</template>

<script>
export default {
  name: "App",
  methods: {
    getCurrentPath(route, offset) {
      if (offset) {
        return this.$route.path.split("/")[offset] === route;
      } else {
        return this.$route.path.split("/")[1] === route;
      }
    }
  }
};
</script>

<style src="./styles/main.css">

</style>
