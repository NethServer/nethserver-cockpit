<template>
  <div>
    <h2>{{info.name || '-'}} {{info.release && info.release.version || ''}}</h2>
    <button
      v-if="view.isLoaded && info.editable == 1"
      @click="info.shortcut == 1 ? removeShortcut(application) : addShortcut(application)"
      :class="['btn', info.shortcut == 1 ? 'btn-danger' : 'btn-primary', 'shortcut']"
    >
      {{info.shortcut == 1
      ? $t('remove_shortcut') : $t('add_shortcut')}}
    </button>
    <div
      v-if="!view.isLoaded"
      class="spinner spinner-lg view-spinner spinner-inverse adjust-spinner-top"
    ></div>
    <iframe
      id="app-frame"
      class="iframe-embedded"
      :src="'/cockpit/@localhost/'+application+'/index.html'"
    ></iframe>
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
    $(".modal").modal("hide");
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
        try {
          success = JSON.parse(success);
        } catch (e) {
          console.error(e);
        }
        if (success.state == "success") {
          context.view.isLoaded = true;
          setTimeout(function() {
            context.initGraphics();
          }, 50);

          context.getAppInfo();
        } else {
          $("#app").css("background", "");
          $("#app").css("color", "");
          window.location.hash = "#/applications";
          context.$router.push("/applications");
        }
      },
      function(error) {
        console.error(error);
        $("#app").css("background", "");
        $("#app").css("color", "");
        window.location.hash = "#/applications";
        context.$router.push("/applications");
      },
      false
    );
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
          action: "info",
          name: context.application
        },
        null,
        function(success) {
          try {
            success = JSON.parse(success);
          } catch (e) {
            console.error(e);
          }
          context.info = success;
          context.view.isLoaded = true;
          context.initGraphics();
        },
        function(error) {
          console.error(error);
        },
        false
      );
    },
    addShortcut() {
      var context = this;

      context.view.isLoaded = false;
      context.exec(
        ["system-apps/update"],
        {
          action: "add-shortcut",
          name: context.application
        },
        null,
        function(success) {
          context.refresh();
        },
        function(error) {
          console.error(error);
        }
      );
    },
    removeShortcut() {
      var context = this;

      context.view.isLoaded = false;
      context.exec(
        ["system-apps/update"],
        {
          action: "remove-shortcut",
          name: context.application
        },
        null,
        function(success) {
          context.refresh();
        },
        function(error) {
          console.error(error);
        }
      );
    },
    refresh() {
      cockpit
        .dbus(null, {
          bus: "internal"
        })
        .call("/packages", "cockpit.Packages", "Reload", []);
      this.getAppInfo();
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
.adjust-spinner-top {
  margin-top: -30px;
}
</style>