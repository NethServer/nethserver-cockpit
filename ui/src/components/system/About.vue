<template>
  <div v-if="view.isAuth">
    <h2>{{$t('about.title')}}</h2>
    <div class="page-container">
    </div>
  </div>
</template>

<script>
export default {
  name: "About",
  data() {
    return {
    };
  }
};
</script>

<style>
</style>
