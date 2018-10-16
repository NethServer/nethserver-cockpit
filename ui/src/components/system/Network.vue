<template>
  <div v-show="view.isAuth">
   <h2>{{$t('network.title')}}</h2>
   <div v-if="!view.isLoaded" class="spinner spinner-lg view-spinner"></div>
   <iframe id="network-frame" class="iframe-embedded" src="/cockpit/@localhost/network/index.html"></iframe>
   <div v-if="view.modalFake" class="fake-modal-backdrop"></div>
  </div>
</template>

<script>
export default {
  name: "Network",
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.exec(
        ["system-authorization/read"],
        null,
        null,
        function(success) {
          success = JSON.parse(success);

          if (success.system.indexOf(to.path.substring(1)) == -1) {
            window.location.hash = "#/";
            vm.$router.push("/");
          }

          vm.view.isAuth = true;
        },
        function(error) {
          console.error(error);
        },
        false
      );
    });
  },
  mounted() {
    var context = this;
    $("#network-frame").on("load", function() {
      context.view.isLoaded = true;

      // select the target node
      var target = document.querySelector("#network-frame").contentDocument
        .body;

      // create an observer instance
      var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
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
      };

      // pass in the target node, as well as the observer options
      observer.observe(target, config);
    });
  },
  data() {
    return {
      view: {
        isLoaded: false,
        isAuth: false,
        modalFake: false
      }
    };
  }
};
</script>

<style>
#network-frame {
  margin-top: -8px;
}
</style>
