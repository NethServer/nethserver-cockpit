<template>
  <div>
    <h2>{{$t('about.title')}}</h2>
    <div class="page-container">
    </div>
  </div>
</template>

<script>
export default {
  name: "About",
  beforeRouteEnter(to, from, next) {
    var auths = JSON.parse(localStorage.getItem("auths"));
    if (auths.indexOf("about") != -1) {
      next();
    } else {
      next("/");
    }
  },
  data() {
    return {
      msg: "Welcome to Your NethServer Module"
    };
  }
};
</script>

<style>
</style>
