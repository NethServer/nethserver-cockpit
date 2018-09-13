<template>
  <div>
   <h2>{{$t('storage.title')}}</h2>
   <div v-if="!view.isLoaded" class="spinner spinner-lg view-spinner"></div>
   <iframe id="storage-frame" class="iframe-embedded" src="/cockpit/@localhost/storage/index.html"></iframe>
   <div v-if="view.modalFake" class="fake-modal-backdrop"></div>
  </div>
</template>

<script>
export default {
  name: "Storage",
  mounted() {
    var context = this;
    $("#storage-frame").on("load", function() {
      context.view.isLoaded = true;

      // select the target node
      var target = document.querySelector("#storage-frame").contentDocument
        .body;

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
#storage-frame {
  margin-top: -8px;
}
</style>
