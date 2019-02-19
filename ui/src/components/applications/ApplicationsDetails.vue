<template>
  <div>
    <iframe
      id="app-frame"
      class="iframe-embedded"
      :src="'/cockpit/@localhost/'+application+'/index.html'"
    ></iframe>
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
    return {
      view: {
        isLoaded: false
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
          if (appName == context.application) {
            $(this).addClass("active");
          }
        });
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
    }
  }
};
</script>

<style>
#app-frame {
  width: 100%;
  height: 100%;
}
</style>