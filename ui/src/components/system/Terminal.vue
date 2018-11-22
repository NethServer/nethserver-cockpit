<template>
  <div v-show="view.isAuth">
   <h2>{{$t('terminal.title')}}</h2>
   <div v-if="!view.isLoaded" class="spinner spinner-lg view-spinner"></div>
   <iframe id="terminal-frame" class="iframe-embedded" src="/cockpit/@localhost/system/terminal.html"></iframe>
   <div v-if="view.modalFake" class="fake-modal-backdrop"></div>
  </div>
</template>

<script>
export default {
  name: "Terminal",
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
            $("#error-popup", window.parent.document).modal("show");
          }

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
    $("#terminal-frame").on("load", function() {
      context.view.isLoaded = true;

      // select the target node
      var target = document.querySelector("#terminal-frame").contentDocument
        .body;

      // black background
      $("#terminal-frame")
        .contents()
        .find("#terminal")
        .css("background-color", "black");

      // create an observer instance
      var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
          if ($(mutation.target).hasClass("modal-open")) {
            context.view.modalFake = true;
          } else if (
            $(mutation.target)[0].children[
              $(mutation.target)[0].children.length - 1
            ].id == "cockpit_modal_dialog"
          ) {
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

    setTimeout(function() {
      $(parent.document.getElementById("sidebar-menu").children[3]).addClass(
        "active"
      );
      $(parent.document.getElementById("sidebar-menu").children[0]).removeClass(
        "active"
      );
    }, 150);
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
#terminal-frame {
  margin-top: 0px;
  width: 100%;
  height: 94.1%;
}
</style>
