<template>
  <div>
    <h2>{{$t('logs.title')}}</h2>
    <div v-if="!view.isLoaded" class="spinner spinner-lg view-spinner"></div>
    <iframe id="logs-frame" class="iframe-embedded" src="/cockpit/@localhost/system/logs.html"></iframe>
    <div v-if="view.modalFake" class="fake-modal-backdrop"></div>
  </div>
</template>

<script>
  export default {
    name: "Logs",
    beforeRouteEnter(to, from, next) {
    var auths = JSON.parse(localStorage.getItem("auths"));
    if (auths.indexOf("logs") != -1) {
      next();
    } else {
      next("/");
    }
  },
    mounted() {
      var context = this
      $('#logs-frame').on('load', function () {
        context.view.isLoaded = true;

        // select the target node
        var target = document.querySelector('#logs-frame').contentDocument.body;

        // create an observer instance
        var observer = new MutationObserver(function (mutations) {
          mutations.forEach(function (mutation) {
            if ($(mutation.target).hasClass("modal-open")) {
              context.view.modalFake = true;
            } else {
              context.view.modalFake = false;
            }
          });
        });

        // configuration of the observer:
        var config = {
          attributes: true,
          childList: true,
          characterData: true
        }

        // pass in the target node, as well as the observer options
        observer.observe(target, config);
      });
    },
    data() {
      return {
        msg: "Welcome to Your NethServer Module",
        view: {
          isLoaded: false,
          modalFake: false
        }
      };
    }
  };

</script>

<style>


</style>
