<template>
  <div>
    <h2>{{$t('about.title')}}</h2>

    <div v-if="!view.isLoaded" class="spinner spinner-lg view-spinner"></div>

    <div v-if="view.isLoaded" class="blank-slate-pf white-background" id>
      <h1 class="logo">
        <img
          :class="['img', enterprise ? 'adjust-img' : '']"
          :src="enterprise ? 'assets/logo_ent.png' : 'assets/logo.svg'"
        />
      </h1>
      <h2>{{$t('about.description_1')}}</h2>
      <p>{{$t('about.description_2')}}</p>
      <p>
        {{$t('about.visit_the')}}
        <a
          target="_blank"
          :href="enterprise ? 'https://nethesis.it' : 'https://www.nethserver.org'"
        >{{$t('about.official_site')}}</a>.
      </p>
      <p class="div-section"></p>
      <p>{{enterprise ? $t('about.description_3_2') : $t('about.description_3_1')}}</p>
      <div class="blank-slate-pf-main-action">
        <a
          target="_blank"
          :href="enterprise ? 'http://helpdesk.nethesis.it' : 'https://community.nethserver.org/'"
          class="btn btn-primary btn-lg"
        >{{enterprise ? $t('about.helpdesk') : $t('about.community')}}</a>
      </div>
      <div class="blank-slate-pf-secondary-action">
        <a
          target="_blank"
          :href="enterprise ? 'https://docs.nethesis.it' : 'http://docs.nethserver.org'"
          class="btn btn-default"
        >{{$t('about.documentation')}}</a>
        <a
          v-if="!enterprise"
          target="_blank"
          href="https://wiki.nethserver.org"
          class="btn btn-default"
        >{{$t('about.wiki')}}</a>
      </div>
      <p v-if="!enterprise" class="div-section"></p>
      <p v-if="!enterprise">{{$t('about.description_4')}}</p>
      <div v-if="!enterprise" class="blank-slate-pf-main-action">
        <a
          target="_blank"
          href="https://my.nethserver.com/login"
          class="btn btn-primary btn-lg"
        >{{$t('about.subscription')}}</a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "About",
  mounted() {
    $("#app").css("background", "");
    $("#app").css("color", "");
    this.getInfo();
  },
  data() {
    return {
      view: {
        isLoaded: false
      },
      enterprise: false
    };
  },
  methods: {
    getInfo() {
      var context = this;
      nethserver.exec(
        ["system-subscription/read"],
        null,
        null,
        function(success) {
          try {
            success = JSON.parse(success);
            context.view.isLoaded = true;
            context.enterprise =
              success.configuration.PortalURL.indexOf("nethesis") > -1;
          } catch (e) {
            console.error(e);
            context.view.isLoaded = true;
          }
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
.logo {
  margin-top: -25%;
  margin-bottom: -15%;
}

.img {
  width: 90%;
}

.adjust-img {
  margin-top: 22%;
  margin-bottom: 19%;
  width: 40% !important;
}

.div-section {
  border-top: 1px solid #d1d1d1;
  margin-top: 3%;
  margin-bottom: 3%;
}
</style>
