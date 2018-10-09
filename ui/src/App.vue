<template>
  <div id="app">
    <nav v-if="!getCurrentPath('applications')" id="navbar-left" class="nav-pf-vertical nav-pf-vertical-with-sub-menus nav-pf-persistent-secondary">
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

        <li v-if="checkAuth('storage')" v-b-toggle.object-collapse v-bind:class="[getCurrentPath('storage') ? 'active' : '', 'list-group-item']">
          <a href="#/storage">
            <span class="fa fa-hdd-o"></span>
            <span class="list-group-item-value">{{$t('menu.storage')}}</span>
          </a>
        </li>
        <li v-if="checkAuth('disk-usage')" v-b-toggle.object-collapse v-bind:class="[getCurrentPath('disk-usage') ? 'active' : '', 'list-group-item']">
          <a href="#/disk-usage">
            <span class="fa fa-pie-chart"></span>
            <span class="list-group-item-value">{{$t('menu.disk_usage')}}</span>
          </a>
        </li>

        <li v-if="checkAuth('storage') || checkAuth('disk-usage')" class="li-empty"></li>

        <li v-if="checkAuth('certificates')" v-b-toggle.object-collapse v-bind:class="[getCurrentPath('certificates') ? 'active' : '', 'list-group-item']">
          <a href="#/certificates">
            <span class="fa fa-key"></span>
            <span class="list-group-item-value">{{$t('menu.certificates')}}</span>
          </a>
        </li>
        <li v-if="checkAuth('dns')" v-b-toggle.object-collapse v-bind:class="[getCurrentPath('dns') ? 'active' : '', 'list-group-item']">
          <a href="#/dns">
            <span class="fa fa-database"></span>
            <span class="list-group-item-value">{{$t('menu.dns')}}</span>
          </a>
        </li>
        <li v-if="checkAuth('dhcp')" v-b-toggle.object-collapse v-bind:class="[getCurrentPath('dhcp') ? 'active' : '', 'list-group-item']">
          <a href="#/dhcp">
            <span class="pficon pficon-network"></span>
            <span class="list-group-item-value">{{$t('menu.dhcp')}}</span>
          </a>
        </li>
        <li v-if="checkAuth('services')" v-b-toggle.object-collapse v-bind:class="[getCurrentPath('services') ? 'active' : '', 'list-group-item']">
          <a href="#/services">
            <span class="fa fa-fighter-jet"></span>
            <span class="list-group-item-value">{{$t('menu.services')}}</span>
          </a>
        </li>
        <li v-if="checkAuth('users-groups')" v-b-toggle.object-collapse v-bind:class="[getCurrentPath('users-groups') ? 'active' : '', 'list-group-item']">
          <a href="#/users-groups">
            <span class="fa fa-users"></span>
            <span class="list-group-item-value">{{$t('menu.users_groups')}}</span>
          </a>
        </li>

        <li v-if="checkAuth('certificates') || checkAuth('dns') || checkAuth('dhcp') || checkAuth('services') || checkAuth('users-groups')" class="li-empty"></li>

        <li v-if="checkAuth('network')" v-b-toggle.object-collapse v-bind:class="[getCurrentPath('network') ? 'active' : '', 'list-group-item']">
          <a href="#/network">
            <span class="fa fa-plug"></span>
            <span class="list-group-item-value">{{$t('menu.network')}}</span>
          </a>
        </li>
        <li v-if="checkAuth('ssh')" v-b-toggle.object-collapse v-bind:class="[getCurrentPath('ssh') ? 'active' : '', 'list-group-item']">
          <a href="#/ssh">
            <span class="fa fa-terminal"></span>
            <span class="list-group-item-value">{{$t('menu.ssh')}}</span>
          </a>
        </li>
        <li v-if="checkAuth('tls-policy')" v-b-toggle.object-collapse v-bind:class="[getCurrentPath('tls-policy') ? 'active' : '', 'list-group-item']">
          <a href="#/tls-policy">
            <span class="fa fa-shield"></span>
            <span class="list-group-item-value">{{$t('menu.tls_policy')}}</span>
          </a>
        </li>
        <li v-if="checkAuth('trusted-networks')" v-b-toggle.object-collapse v-bind:class="[getCurrentPath('trusted-networks') ? 'active' : '', 'list-group-item']">
          <a href="#/trusted-networks">
            <span class="fa fa-certificate"></span>
            <span class="list-group-item-value">{{$t('menu.trusted_networks')}}</span>
          </a>
        </li>

        <li v-if="checkAuth('network') || checkAuth('ssh') || checkAuth('tls-policy') || checkAuth('trusted-networks')" class="li-empty"></li>

        <li v-if="checkAuth('logs')" v-bind:class="[getCurrentPath('logs') ? 'active' : '', 'list-group-item']">
          <a href="#/logs">
            <span class="fa fa-list"></span>
            <span class="list-group-item-value">{{$t('menu.logs')}}</span>
          </a>
        </li>

        <li v-if="checkAuth('logs')" class="li-empty"></li>

        <li v-bind:class="[getCurrentPath('about') ? 'active' : '', 'list-group-item']">
          <a href="#/about">
            <span class="fa fa-info"></span>
            <span class="list-group-item-value">{{$t('menu.about')}}</span>
          </a>
        </li>

      </ul>
    </nav>
    <div :class="['container-fluid', 'container-cards-pf'+ (getCurrentPath('applications') ? '-apps' : '')]">
      <router-view></router-view>
    </div>

    <div v-if="notifications.success.show" :style="{ top: notifications.addMargin ? 72+'px' : 10+'px', minWidth: 390+'px', right: 10+'px', zIndex: 5, position: 'fixed'}" class="toast-pf toast-pf-max-width toast-pf-top-right alert alert-success alert-dismissable">
      <span style="padding-top: 20px;" class="pficon fa fa-check"></span>
      <strong>{{$t('success')}}</strong>
      <p style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">{{notifications.success.message || '-'}}</p>
    </div>

    <div v-if="notifications.error.show" :style="{ top: notifications.addMargin ? notifications.success.show ? 142+'px' : 72+'px' : notifications.success.show ? 80+'px' : 10+'px', minWidth: 390+'px', right: 10+'px', zIndex: 5, position: 'fixed' }"
      class="toast-pf toast-pf-max-width toast-pf-top-right alert alert-danger alert-dismissable">
      <button type="button" class="close" data-dismiss="alert" aria-hidden="true">
        <span class="fa fa-times"></span>
      </button>
      <div class="pull-right toast-pf-action" style="margin-top: 2px;">
        <a @click="notifications.error.action()">{{notifications.error.actionName}}</a>
      </div>
      <span style="padding-top: 20px;" class="pficon fa fa-times"></span>
      <strong>{{$t('error')}}</strong>
      <p style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">{{notifications.error.message || '-'}}</p>
      <p>{{$t('check')}} <pre class="pre-inline">logs</pre> {{$t('for_more_info')}}.</p>
      <pre>less /var/log/messages</pre>
    </div>

    <div v-if="notifications.event.show" :style="{ top: notifications.addMargin ? (notifications.success.show && notifications.error.show) ? 300+'px' : (notifications.success.show ? 142+'px' : (notifications.error.show ? 230+'px' : 72 +'px')) : (notifications.success.show && notifications.error.show) ? 238+'px' : (notifications.success.show ? 80+'px' : (notifications.error.show ? 168+'px' : 10 +'px')), minWidth: 390+'px', right: 10+'px', zIndex: 5, position: 'fixed' }"
      class="toast-pf toast-pf-max-width toast-pf-top-right alert alert-warning alert-dismissable">
      <span style="padding-top: 25px;" class="pficon fa fa-warning"></span>
      <strong>{{$t('event')}}: </strong>{{notifications.event.name || '-'}} <span v-if="notifications.event.message">(<strong>{{notifications.event.message}}</strong>)</span>

      <div style="margin-bottom:0px;" class="progress-description">
        <div class="spinner spinner-xs spinner-inline"></div>
        <strong v-if="notifications.event.steps != -1">{{notifications.event.progress}}%</strong>
      </div>
      <div :class="['progress progress-xs progress-label-top-right', notifications.event.steps == -1 ? 'progress-striped active' : '']">
        <div class="progress-bar" role="progressbar" :aria-valuenow="notifications.event.progress" aria-valuemin="0"
          aria-valuemax="100" :style="{ width: notifications.event.progress+'%'}">
        </div>
      </div>
    </div>

    <div v-if="taskInProgress" class="fake-modal-backdrop-event"></div>

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

    // get authorization for routes
    this.getAuths();

    // check for running tasks
    this.checkSystemTaks();
  },
  watch: {
    $route(to, from) {
      this.notifications.success.show = false;
      this.notifications.error.show = false;
      this.notifications.event.show = false;
      this.notifications.addMargin =
        to.path.indexOf("/applications/") < 0 ? false : true;

      this.checkSystemTaks();
    }
  },
  data() {
    return {
      msg: [
        "███╗   ██╗███████╗████████╗██╗  ██╗███████╗███████╗██████╗ ██╗   ██╗███████╗██████╗ ",
        "████╗  ██║██╔════╝╚══██╔══╝██║  ██║██╔════╝██╔════╝██╔══██╗██║   ██║██╔════╝██╔══██╗",
        "██╔██╗ ██║█████╗     ██║   ███████║███████╗█████╗  ██████╔╝██║   ██║█████╗  ██████╔╝",
        "██║╚██╗██║██╔══╝     ██║   ██╔══██║╚════██║██╔══╝  ██╔══██╗╚██╗ ██╔╝██╔══╝  ██╔══██╗",
        "██║ ╚████║███████╗   ██║   ██║  ██║███████║███████╗██║  ██║ ╚████╔╝ ███████╗██║  ██║",
        "╚═╝  ╚═══╝╚══════╝   ╚═╝   ╚═╝  ╚═╝╚══════╝╚══════╝╚═╝  ╚═╝  ╚═══╝  ╚══════╝╚═╝  ╚═╝"
      ].join("\n"),
      wizardDone: false,
      notifications: {
        success: {
          message: "",
          show: false
        },
        error: {
          message: "",
          action: undefined,
          actionName: "",
          show: false
        },
        event: {
          message: "",
          name: "",
          progress: 0,
          show: false,
          steps: 0
        },
        addMargin: this.$route.path.indexOf("/applications/") < 0 ? false : true
      },
      auths: [],
      taskInProgress: false
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
    },
    checkSystemTaks() {
      var context = this;
      context.exec(
        ["system-task/read"],
        null,
        function(stream) {
          context.taskInProgress = true;
          console.info("tasks", stream);
        },
        function(success) {
          context.taskInProgress = false;
        },
        function(error) {
          context.taskInProgress = false;
          console.error(error);
        }
      );
    },
    getAuths() {
      var context = this;
      context.exec(
        ["system-authorization/read"],
        null,
        null,
        function(success) {
          success = JSON.parse(success);
          context.auths = success.system || [];
        },
        function(error) {
          console.error(error);
        },
        false
      );
    },
    checkAuth(route) {
      return this.auths.indexOf(route) != -1;
    }
  }
};
</script>

<style src="./styles/main.css">
</style>