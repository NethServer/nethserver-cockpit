<template>
  <div>
    <h2>{{$t('about.title')}}</h2>
    <div class="blank-slate-pf white-background" id="">
      <h1 class="logo">
        <img class="img" src="static/assets/logo.svg">
      </h1>
      <h2>
        {{$t('about.description_1')}}
      </h2>
      <p>
        {{$t('about.description_2')}}
      </p>
      <p>
        {{$t('about.visit_the')}} <a target="_blank" href="https://www.nethserver.org/">{{$t('about.official_site')}}</a>.
      </p>
      <p class="div-section"></p>
      <p>
        {{$t('about.description_3')}}
      </p>
      <div class="blank-slate-pf-main-action">
        <a target="_blank" href="https://community.nethserver.org/" class="btn btn-primary btn-lg">{{$t('about.community')}}</a>
      </div>
      <div class="blank-slate-pf-secondary-action">
        <a target="_blank" href="http://docs.nethserver.org" class="btn btn-default ">{{$t('about.documentation')}}</a>
        <a target="_blank" href="https://wiki.nethserver.org" class="btn btn-default ">{{$t('about.wiki')}}</a>
      </div>
      <p class="div-section"></p>
      <p>
        {{$t('about.description_4')}}
      </p>
      <div class="blank-slate-pf-main-action">
        <a target="_blank" href="https://my.nethserver.com/login" class="btn btn-primary btn-lg">{{$t('about.subscription')}}</a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "About",
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.exec(
        ["system-authorization/read"],
        null,
        null,
        function(success) {
          try {
            success = JSON.parse(success);
          } catch (e) {
            console.error(e);
          }

          // Retrieve the object liElement from storage
          // and hide the index
          var liElement = vm.checkMenuPermission();

          // first show then hide
          $('#sidebar-menu', window.parent.document).show();
          $('#sidebar-menu li', window.parent.document).show();

          // hide the child of #sidebar-menu following permissions
          for (var i in liElement) {
              $('#sidebar-menu', window.parent.document).children().eq(i).hide();
          }
          $('#sidebar-tools', window.parent.document).show();
        },
        function(error) {
          console.error(error);
        },
        false
      );
    });
  },
  mounted() {
    $("#app").css("background", "");
    $("#app").css("color", "");
  },
  data() {
    return {};
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

.div-section {
  border-top: 1px solid #d1d1d1;
  margin-top: 3%;
  margin-bottom: 3%;
}
</style>
