<template>
  <div v-show="view.isAuth">
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
    next(vm => {
      vm.exec(
        ["system-authorization/read"],
        null,
        null,
        function(success) {
          try {
            success = JSON.parse(success);
          } catch (e) {
            console.error(e);
          }

          if (success.system.indexOf(to.path.substring(1)) == -1) {
            window.location.hash = "#/";
            vm.$router.push("/");
          }

          vm.view.isAuth = true;
          // Retrieve the object liElement from storage
          // and hide the index
          var liElement = vm.checkMenuPermission();

          // first show then hide
          $('#sidebar-menu', window.parent.document).show();
          $('#sidebar-menu li', window.parent.document).show();

          // hide the child of #sidebar-menu following permissions
          for (var i in liElement) {
              $('#sidebar-menu', window.parent.document).children().eq(i).hide();
          }
          $('#sidebar-tools', window.parent.document).show();
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
    $("#logs-frame").on("load", function() {
      context.view.isLoaded = true;

      // select the target node
      var target = document.querySelector("#logs-frame").contentDocument.body;

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
    $("#app").css("background", "");
    $("#app").css("color", "");
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
</style>
