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
  props: {
    title: {
      type: String,
      default: "More info"
    },
    chapter: {
      type: String,
      default: ""
    },
    section: {
      type: String,
      default: ""
    },
    placement: {
      type: String,
      default: ""
    },
    inline: {
      type: Boolean,
      default: false
    },
    lang: {
      type: String,
      default: "en"
    }
  },
  mixins: [],
  data() {
    return {
      content: "",
      id: this.chapter + "-" + this.section + (+new Date()).toString(),
      link: ""
    };
  },
  mounted() {
    this.getDocumentation();
  },
  methods: {
    getDocumentation() {
      var $ = window.jQuery;
      var context = this;

      if (!this.inline) {
        // eslint-disable-next-line
        nethserver.exec(
          ["system-docs/read"],
          {
            chapter: this.chapter,
            section: this.section,
            language: this.lang
          },
          null,
          function(success) {
            success = JSON.parse(success);

            context.link = success.link;
          },
          function(error) {
            // eslint-disable-next-line
            window.console.error(error);
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