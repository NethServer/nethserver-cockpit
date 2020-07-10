<template>
  <div>
    <h2>{{$t('about.title')}}</h2>

    <div v-if="!view.isLoaded" class="spinner spinner-lg view-spinner"></div>

    <div v-if="view.isLoaded" class="blank-slate-pf white-background" id>
      <h1 v-if="!(enterprise && branded)" class="logo">
        <img
          v-if="!enterprise"
          class="img"
          src="assets/logo.svg"
        />
        <img
          v-if="enterprise && !branded"
          class="img adjust-img"
          src="assets/logo_ent.png"
        />
      </h1>
      <span v-if="enterprise && branded" id="badge"></span>
      <h2>{{branded ? productName : $t('about.description_1')}}</h2>
      <p v-if="!branded">{{$t('about.description_2')}}</p>
      <p>
        {{$t('about.visit_the')}}
        <a
          target="_blank"
          :href="subscription.SiteUrl"
        >{{$t('about.official_site')}}</a>.
      </p>
      <p class="div-section"></p>
      <div v-if="subscription.HelpdeskUrl">
        <p>{{enterprise ? $t('about.description_3_2') : $t('about.description_3_1')}}</p>
        <div class="blank-slate-pf-main-action">
          <a
            target="_blank"
            :href="subscription.HelpdeskUrl"
            class="btn btn-primary btn-lg"
          >{{enterprise? $t('about.helpdesk') : $t('about.community')}}</a>
        </div>
      </div>
      <div class="blank-slate-pf-secondary-action">
        <a
          target="_blank"
          :href="subscription.DocsUrl"
          class="btn btn-default"
        >{{$t('about.documentation')}}</a>
        <!-- wiki -->
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
      <div v-if="!enterprise">
        <p class="div-section"></p>
        <p>{{$t('about.phonehome')}}</p>
        <div class="blank-slate-pf-secondary-action">
          <a
            target="_blank"
            href="http://docs.nethserver.org/en/v7/phone_home.html"
            class="btn btn-default"
          >{{$t('about.documentation')}}</a>
          <a
            target="_blank"
            href="https://www.nethserver.org/phone-home/widget_map.html"
            class="btn btn-default"
          >{{$t('about.map')}}</a>
        </div>
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
      subscription: {},
      branded: false,
      enterprise: false,
      productName: ""
    };
  },
  methods: {
    getInfo() {
      var context = this;
      context.exec(
        ["system-subscription/read"],
        null,
        null,
        function(success) {
          try {
            success = JSON.parse(success);
            context.view.isLoaded = true;
            context.subscription = success.configuration;
            context.enterprise =
              success.configuration.PortalURL.indexOf("nethesis") > -1;
            context.productName = success.product_name;
            context.branded = context.enterprise && context.productName != "NethServer Enterprise";
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

#badge {
  display: block;
  margin: auto;
}
</style>
