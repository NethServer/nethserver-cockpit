<template>
  <div>
    <h2 v-if="!view.isLoaded"></h2>
    <div v-if="!view.isLoaded" class="spinner spinner-lg view-spinner loader-frame"></div>
    <iframe v-show="view.isLoaded" id="app-frame" class="iframe-embedded" :src="iframeSrc"></iframe>
  </div>
</template>

<script>
export default {
  name: "ApplicationsDetails",
  beforeRouteLeave(to, from, next) {
    $(".modal").modal("hide");
    next();
  },
  mounted() {
    var context = this;

    $("#app-frame").on("load", function() {
      $("#app-frame")
        .contents()
        .find("#topnav")
        .hide();
      $("#app-frame")
        .contents()
        .find("#multi-dashboard")
        .hide();
      $("#app-frame")
        .contents()
        .find("#host-nav")
        .hide();

      context.view.isLoaded = true;
      setTimeout(function() {
        context.initGraphics();
      }, 500);
    });

    context.exec(
      ["system-authorization/validate"],
      {
        action: "check-app",
        name: this.$route.params.name
      },
      null,
      function(success) {
        try {
          success = JSON.parse(success);
        } catch (e) {
          console.error(e);
        }
        if (success.state == "success") {
          setTimeout(function() {
            context.initGraphics();
          }, 50);

          context.getAppInfo();
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
  },
  watch: {
    $route(to, from) {
      window.location.reload();
    }
  },
  data() {
    var application = this.$route.params.name;
    var location =
      window.parent.location.pathname.indexOf("@") > -1
        ? window.parent.location.pathname.split("@")[1].split("/")[0]
        : "localhost";
    var iframeSrc = "/cockpit/@" + location + "/" + application + "/index.html";

    if (location != "localhost") {
      iframeSrc = window.location.origin + "/@" + location + "/" + application;
    }

    return {
      view: {
        isLoaded: false
      },
      application: application,
      iframeSrc: iframeSrc,
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

      this.$parent.getHints("system-subscription", "subscription");

      var context = this;
      $("#sidebar-menu", window.parent.document)
        .children("li")
        .each(function() {
          $(this).removeClass("active");
        });

      $("#sidebar-tools", window.parent.document)
        .children("li")
        .each(function() {
          $(this).removeClass("active");

          var href = $(this)
            .children()
            .first()
            .attr("href");

          var appName = href.substr(href.lastIndexOf("/") + 1);
          if (appName == context.$route.params.name) {
            $(this).addClass("active");
          }
        });
    },
    getAppInfo() {
      var context = this;

      context.exec(
        ["system-apps/read"],
        {
          action: "info",
          name: this.$route.params.name
        },
        null,
        function(success) {
          try {
            success = JSON.parse(success);
          } catch (e) {
            console.error(e);
          }
          context.info = success;
          context.initGraphics();
        },
        function(error) {
          console.error(error);
        },
        false
      );
    }
  }
};
</script>

<style>
#app-frame {
  width: 100%;
  height: 100%;
}
#loader-frame {
  margin-top: 50px;
}
</style>