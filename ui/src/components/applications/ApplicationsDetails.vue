<template>
  <div>
    <h2>{{info.name}} {{info.release && info.release.version || ''}}</h2>
    <button v-if="view.isLoaded" @click="isShortcut ? removeShortcut(application,info.name) : addShortcut(application, info.name)" :class="['btn', isShortcut ? 'btn-danger' : 'btn-primary', 'shortcut']">{{isShortcut
      ? $t('remove_shortcut') : $t('add_shortcut')}}</button>
    <div v-if="!view.isLoaded" class="spinner spinner-lg view-spinner spinner-inverse"></div>
    <iframe id="app-frame" class="iframe-embedded" :src="'/cockpit/@localhost/'+application+'/index.html'"></iframe>
    <div v-if="view.modalFake" class="fake-modal-backdrop"></div>
  </div>
</template>

<script>
export default {
  name: "ApplicationsDetails",
  beforeRouteEnter(to, from, next) {
    $("#app").css("background", "#393f43");
    $("#app").css("color", "white");
    $("#app-frame").css("border-top", "1px solid #4d5258;");
    next();
  },
  beforeRouteLeave(to, from, next) {
    $("#app").css("background", "");
    $("#app").css("color", "");
    next();
  },
  mounted() {
    var context = this;

    context.exec(
      ["system-authorization/validate"],
      {
        action: "check-app",
        name: context.application
      },
      null,
      function(success) {
        var success = JSON.parse(success);
        if (success.state == "success") {
          context.view.isLoaded = true;
        } else {
          window.location.hash = "#/applications";
          context.$router.push("/applications");
        }
      },
      function(error) {
        console.error(error);
        window.location.hash = "#/applications";
        context.$router.push("/applications");
      },
      false
    );

    $("#app-frame").on("load", function() {
      // select the target node
      var target = document.querySelector("#app-frame").contentDocument.body;

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
      context.initGraphics();
    }, 50);

    context.getAppInfo();
  },
  watch: {
    $route(to, from) {
      window.location.reload();
    }
  },
  data() {
    return {
      view: {
        isLoaded: false,
        modalFake: false
      },
      application: this.$route.params.name,
      isShortcut: false,
      info: {}
    };
  },
  methods: {
    initGraphics() {
      $(parent.document.getElementById("sidebar-menu").children[1]).addClass(
        "active"
      );
      $(parent.document.getElementById("sidebar-menu").children[0]).removeClass(
        "active"
      );
      $("#app").css("background", "#393f43");
      $("#app").css("color", "white");
      $("#app-frame").css("border-top", "1px solid #4d5258;");
    },
    getAppInfo() {
      var context = this;

      context.view.isLoaded = false;
      context.exec(
        ["system-apps/read"],
        {
          name: context.application
        },
        null,
        function(success) {
          success = JSON.parse(success);
          context.info = success;
          context.view.isLoaded = true;
          context.initGraphics();
        },
        function(error) {
          console.error(error);
        }
      );
    }
  }
};
</script>

<style>
#app-frame {
  margin-top: 8px;
  width: 100%;
  height: calc(100% - 62px);
  border-top: 1px solid #4d5258;
}
.shortcut {
  margin-top: -36px;
  float: right;
}
</style>