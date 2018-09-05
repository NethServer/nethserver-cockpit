<template>
  <div id="app">
    <nav id="navbar-left" class="nav-pf-vertical nav-pf-vertical-with-sub-menus nav-pf-persistent-secondary">
      <ul v-if="!wizardDone" class="list-group panel">
        <li id="dashboard-item" v-bind:class="[getCurrentPath('') ? 'active' : '', 'list-group-item']">
          <a href="#/wizard">
            <span class="fa fa-magic"></span>
            <span class="list-group-item-value">{{$t('menu.wizard')}}</span>
          </a>
        </li>
      </ul>

      <ul v-if="wizardDone" class="list-group panel">

        <li id="dashboard-item" v-bind:class="[getCurrentPath('') ? 'active' : '', 'list-group-item']">
          <a href="#/">
            <span class="fa fa-cube"></span>
            <span class="list-group-item-value">{{$t('menu.dashboard')}}</span>
          </a>
        </li>

        <li class="li-empty"></li>

        <li v-b-toggle.object-collapse v-bind:class="[getCurrentPath('storage') ? 'active' : '', 'list-group-item']">
          <a href="#/storage">
            <span class="fa fa-hdd-o"></span>
            <span class="list-group-item-value">{{$t('menu.storage')}}</span>
          </a>
        </li>
        <li v-b-toggle.object-collapse v-bind:class="[getCurrentPath('disk-usage') ? 'active' : '', 'list-group-item']">
          <a href="#/disk-usage">
            <span class="fa fa-pie-chart"></span>
            <span class="list-group-item-value">{{$t('menu.disk_usage')}}</span>
          </a>
        </li>

        <li class="li-empty"></li>

        <li v-b-toggle.object-collapse v-bind:class="[getCurrentPath('certificates') ? 'active' : '', 'list-group-item']">
          <a href="#/certificates">
            <span class="fa fa-key"></span>
            <span class="list-group-item-value">{{$t('menu.certificates')}}</span>
          </a>
        </li>
        <li v-b-toggle.object-collapse v-bind:class="[getCurrentPath('dns') ? 'active' : '', 'list-group-item']">
          <a href="#/dns">
            <span class="fa fa-database"></span>
            <span class="list-group-item-value">{{$t('menu.dns')}}</span>
          </a>
        </li>
        <li v-b-toggle.object-collapse v-bind:class="[getCurrentPath('services') ? 'active' : '', 'list-group-item']">
          <a href="#/services">
            <span class="fa fa-fighter-jet"></span>
            <span class="list-group-item-value">{{$t('menu.services')}}</span>
          </a>
        </li>
        <li v-b-toggle.object-collapse v-bind:class="[getCurrentPath('users-groups') ? 'active' : '', 'list-group-item']">
          <a href="#/users-groups">
            <span class="fa fa-users"></span>
            <span class="list-group-item-value">{{$t('menu.users_groups')}}</span>
          </a>
        </li>

        <li class="li-empty"></li>

        <li v-b-toggle.object-collapse v-bind:class="[getCurrentPath('network') ? 'active' : '', 'list-group-item']">
          <a href="#/network">
            <span class="fa fa-plug"></span>
            <span class="list-group-item-value">{{$t('menu.network')}}</span>
          </a>
        </li>
        <li v-b-toggle.object-collapse v-bind:class="[getCurrentPath('ssh') ? 'active' : '', 'list-group-item']">
          <a href="#/ssh">
            <span class="fa fa-terminal"></span>
            <span class="list-group-item-value">{{$t('menu.ssh')}}</span>
          </a>
        </li>
        <li v-b-toggle.object-collapse v-bind:class="[getCurrentPath('tls-policy') ? 'active' : '', 'list-group-item']">
          <a href="#/tls-policy">
            <span class="fa fa-shield"></span>
            <span class="list-group-item-value">{{$t('menu.tls_policy')}}</span>
          </a>
        </li>
        <li v-b-toggle.object-collapse v-bind:class="[getCurrentPath('trusted-networks') ? 'active' : '', 'list-group-item']">
          <a href="#/trusted-networks">
            <span class="fa fa-certificate"></span>
            <span class="list-group-item-value">{{$t('menu.trusted_networks')}}</span>
          </a>
        </li>

        <li class="li-empty"></li>

        <li v-bind:class="[getCurrentPath('logs') ? 'active' : '', 'list-group-item']">
          <a href="#/logs">
            <span class="fa fa-list"></span>
            <span class="list-group-item-value">{{$t('menu.logs')}}</span>
          </a>
        </li>

        <li class="li-empty"></li>

        <li v-bind:class="[getCurrentPath('about') ? 'active' : '', 'list-group-item']">
          <a href="#/about">
            <span class="fa fa-info"></span>
            <span class="list-group-item-value">{{$t('menu.about')}}</span>
          </a>
        </li>

      </ul>
    </nav>
    <div class="container-fluid container-cards-pf">
      <router-view></router-view>
    </div>

    <!--  <div style="min-width: 390px;" class="toast-pf toast-pf-max-width toast-pf-top-right alert alert-success alert-dismissable">
      <button type="button" class="close" data-dismiss="alert" aria-hidden="true">
        <span class="fa fa-times"></span>
      </button>
      <span style="padding-top: 20px;" class="pficon fa fa-check"></span>
      <strong>Success</strong>
      <p style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">has been added to main server group.</p>
    </div>

    <div style="margin-top: 70px;min-width: 390px;" class="toast-pf toast-pf-max-width toast-pf-top-right alert alert-danger alert-dismissable">
      <button type="button" class="close" data-dismiss="alert" aria-hidden="true">
        <span class="fa fa-times"></span>
      </button>
      <div class="pull-right toast-pf-action">
        <a href="#">Start Server</a>
      </div>
      <span style="padding-top: 20px;" class="pficon fa fa-times"></span>
      <strong>Error</strong>
      <p style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">has been added to main server group.</p>
    </div>

    <div style="margin-top: 140px;min-width: 390px;" class="toast-pf toast-pf-max-width toast-pf-top-right alert alert-warning alert-dismissable">
      <span style="padding-top: 25px;" class="pficon fa fa-warning"></span>
      <strong>Event</strong>

      <div style="margin-bottom:0px;" class="progress-description">
        <div class="spinner spinner-xs spinner-inline"></div>
        <strong>50%</strong>
      </div>
      <div class="progress progress-xs progress-label-top-right">
        <div class="progress-bar" role="progressbar" aria-valuenow="42.7" aria-valuemin="0" aria-valuemax="100" style="width: 42.7%;">
        </div>
      </div>

    </div> -->

  </div>
</template>

<script>
export default {
  name: "App",
  mounted() {
    console.clear();
    console.log(this.msg);
    // check for first configuration wizard
    var context = this;
    this.wizardIsDone(function(done) {
      if (!done) {
        context.$router.push("/wizard");
        context.wizardDone = false;
      } else {
        context.wizardDone = true;
      }
    });
  },
  data() {
    return {
      msg: [
        "##    ## ######## ######## ##     ##  ######  ######## ########  ##     ## ######## ########  ",
        "####  ## ##          ##    ##     ## ##       ##       ##     ## ##     ## ##       ##     ## ",
        "## ## ## ######      ##    #########  ######  ######   ########  ##     ## ######   ########  ",
        "##  #### ##          ##    ##     ##       ## ##       ##   ##    ##   ##  ##       ##   ##   ",
        "##    ## ########    ##    ##     ##  ######  ######## ##     ##    ###    ######## ##     ## "
      ].join("\n"),
      wizardDone: false
    };
  },
  methods: {
    getCurrentPath(route, offset) {
      if (offset) {
        return this.$route.path.split("/")[offset] === route;
      } else {
        return this.$route.path.split("/")[1] === route;
      }
    },
    wizardIsDone(callback) {
      callback(true);
    }
  }
};
</script>

<style src="./styles/main.css">
</style>
