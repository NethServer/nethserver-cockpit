<template>
  <div v-if="docAvailable">
    <a :id="id" href="#" class="info-general" data-toggle="popover" data-html="true" :data-placement="placement"
      data-close="true" data-trigger="focus" data-container="body" :title="title | capitalize" :data-content="content">
      <span class="pficon pficon-info"></span>
    </a>
  </div>
</template>
<script>
export default {
  name: "DocInfo",
  props: ["title", "chapter", "section", "placement"],
  mixins: [],
  data() {
    return {
      title: this.title || this.chapter,
      content: "",
      id: this.chapter + "-" + this.section,
      docAvailable: true
    };
  },
  mounted() {
    this.getDocumentation();
  },
  methods: {
    getDocumentation() {
      var context = this;
      context.exec(
        ["system-docs/read"],
        {
          chapter: this.chapter,
          section: this.section,
          language: this.$root.$options.currentLocale
        },
        null,
        function(success) {
          success = JSON.parse(success);

          var html = success.data.length > 0 ? atob(success.data) : null;
          if (html) {
            context.content = html;
            context.content += "<br/>";
          }

          context.content +=
            '<a target="_blank" href="' +
            success.link +
            '">' +
            context.$i18n.t("more_info") +
            "</a>";

          // init popovers
          $("#" + context.id)
            .popovers()
            .on("hidden.bs.popover", function(e) {
              $(e.target).data("bs.popover").inState.click = false;
            });
        },
        function(error) {
          console.error(error);
          context.docAvailable = false;
        }
      );
    }
  }
};
</script>
<style>
.info-general {
  font-size: 14px;
}
</style>