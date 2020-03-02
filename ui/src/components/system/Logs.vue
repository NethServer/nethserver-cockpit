<template>
  <div v-show="view.isAuth">
    <h2>{{$t('logs.title')}}</h2>
    <div v-if="!view.isLoaded" class="spinner spinner-lg view-spinner loader-frame"></div>
    <iframe v-show="view.isLoaded" id="logs-frame" class="iframe-embedded" :src="iframeSrc"></iframe>
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

          if (!success.status.isRoot) {
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
    $("#logs-frame").on("load", function() {
      $("#logs-frame")
        .contents()
        .find("#topnav")
        .hide();
      $("#logs-frame")
        .contents()
        .find("#multi-dashboard")
        .hide();
      $("#logs-frame")
        .contents()
        .find("#host-nav")
        .hide();
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
    var application = "system";
    var location =
      window.parent.location.pathname.indexOf("@") > -1
        ? window.parent.location.pathname.split("@")[1].split("/")[0]
        : "localhost";
    var iframeSrc = "/cockpit/@" + location + "/" + application + "/logs.html";

    if (location != "localhost") {
      iframeSrc =
        window.location.origin + "/@" + location + "/" + application + "/logs";
    }

    return {
      view: {
        isLoaded: false,
        isAuth: false,
        modalFake: false
      },
      application: application,
      iframeSrc: iframeSrc
    };
  }
};
</script>

<style>
#loader-frame {
  margin-top: 50px;
}
</style>
