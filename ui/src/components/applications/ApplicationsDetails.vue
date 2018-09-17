<template>
  <div>
   <h2>{{application}}</h2>
   <div v-if="!view.isLoaded" class="spinner spinner-lg view-spinner"></div>
   <iframe id="app-frame" class="iframe-embedded" :src="'/cockpit/@localhost/'+application+'/index.html'"></iframe>
   <div v-if="view.modalFake" class="fake-modal-backdrop"></div>
  </div>
</template>

<script>
export default {
  name: "Storage",
  mounted() {
    var context = this;
    $("#app-frame").on("load", function() {
      context.view.isLoaded = true;

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
      $(parent.document.getElementById("sidebar-menu").children[1]).addClass(
        "active"
      );
      $(parent.document.getElementById("sidebar-menu").children[0]).removeClass(
        "active"
      );
    }, 50);
  },
  data() {
    return {
      msg: "Welcome to Your NethServer Module",
      view: {
        isLoaded: false,
        modalFake: false
      },
      application: this.$route.params.name
    };
  }
};
</script>

<style>
#app-frame {
  margin-top: 8px;
  width: 100%;
  height: 100%;
  border-top: 1px solid #d1d1d1;
}
</style>
