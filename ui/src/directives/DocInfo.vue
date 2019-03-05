<template>
  <div :class="inline ? 'reset-padding' : ''">
    <a
      :id="id"
      href="#"
      class="info-general"
      data-toggle="popover"
      data-html="true"
      :data-placement="placement"
      data-close="true"
      data-trigger="focus"
      data-container="body"
      :title="title | capitalize"
      :data-content="content"
      v-if="inline"
    >
      <span class="pficon pficon-info"></span>
    </a>
    <span v-if="!inline">
      {{$t('docs.more_info_about')}}
      <a target="_blank" :href="link">{{title}}</a>.
    </span>
  </div>
</template>
<script>
export default {
  name: "DocInfo",
  props: ["title", "chapter", "section", "placement", "inline"],
  mixins: [],
  data() {
    return {
      title: this.title || this.chapter,
      content: "",
      id: this.chapter + "-" + this.section + (+new Date()).toString(),
      inline: this.inline,
      link: ""
    };
  },
  mounted() {
    this.getDocumentation();
  },
  methods: {
    getDocumentation() {
      var context = this;

      if (!this.inline) {
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

            context.link = success.link;
          },
          function(error) {
            console.error(error);
          }
        );
      } else {
        this.content = this.$i18n.t("docs." + this.chapter);
        // init popovers
        $("#" + context.id)
          .popovers()
          .on("hidden.bs.popover", function(e) {
            $(e.target).data("bs.popover").inState.click = false;
          });
      }
    }
  }
};
</script>
<style>
.info-general {
  font-size: 14px;
}

.reset-padding {
  padding-left: 0px !important;
  padding-right: 0px !important;
  display: inline-block !important;
  margin-left: 5px !important;
}
</style>