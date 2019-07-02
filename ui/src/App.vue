<template>
  <div id="app">
    <nav
      v-if="routesAvailable()"
      id="navbar-left"
      class="nav-pf-vertical nav-pf-vertical-with-sub-menus nav-pf-persistent-secondary"
    >
      <ul class="list-group panel">
        <li
          id="dashboard-item"
          v-bind:class="[getCurrentPath('') ? 'active' : '', 'list-group-item']"
        >
          <a href="#/">
            <span class="fa fa-cube"></span>
            <span class="list-group-item-value">{{$t('menu.dashboard')}}</span>
            <span
              v-if="hints.hostname.count > 0 || hints.upstreamDns.count > 0 || hints.company.count > 0"
              class="badge"
            >{{hints.hostname.count+hints.upstreamDns.count+hints.company.count}}</span>
          </a>
        </li>

        <li class="li-empty"></li>

        <li
          v-if="checkAuth('users-groups')"
          v-b-toggle.object-collapse
          v-bind:class="[getCurrentPath('users-groups') ? 'active' : '', 'list-group-item']"
        >
          <a href="#/users-groups">
            <span class="fa fa-users"></span>
            <span class="list-group-item-value">{{$t('menu.users_groups')}}</span>
            <span
              v-if="hints.users_groups.count > 0"
              class="badge badge-small"
            >{{hints.users_groups.count}}</span>
          </a>
        </li>

        <li v-if="checkAuth('users-groups')" class="li-empty"></li>

        <li
          v-if="checkAuth('network')"
          v-b-toggle.object-collapse
          v-bind:class="[getCurrentPath('network') ? 'active' : '', 'list-group-item']"
        >
          <a href="#/network">
            <span class="pficon pficon-topology"></span>
            <span class="list-group-item-value">{{$t('menu.network')}}</span>
            <span v-if="hints.network.count > 0" class="badge badge-small">{{hints.network.count}}</span>
          </a>
        </li>
        <li
          v-if="checkAuth('dns')"
          v-b-toggle.object-collapse
          v-bind:class="[getCurrentPath('dns') ? 'active' : '', 'list-group-item']"
        >
          <a href="#/dns">
            <span class="fa fa-database"></span>
            <span class="list-group-item-value">{{$t('menu.dns')}}</span>
            <span v-if="hints.dns.count > 0" class="badge badge-small">{{hints.dns.count}}</span>
          </a>
        </li>
        <li
          v-if="checkAuth('dhcp')"
          v-b-toggle.object-collapse
          v-bind:class="[getCurrentPath('dhcp') ? 'active' : '', 'list-group-item']"
        >
          <a href="#/dhcp">
            <span class="pficon pficon-network"></span>
            <span class="list-group-item-value">{{$t('menu.dhcp')}}</span>
            <span v-if="hints.dhcp.count > 0" class="badge badge-small">{{hints.dhcp.count}}</span>
          </a>
        </li>
        <li
          v-if="checkAuth('services')"
          v-b-toggle.object-collapse
          v-bind:class="[getCurrentPath('services') ? 'active' : '', 'list-group-item']"
        >
          <a href="#/services">
            <span class="fa fa-cogs"></span>
            <span class="list-group-item-value">{{$t('menu.services')}}</span>
            <span v-if="hints.services.count > 0" class="badge badge-small">{{hints.services.count}}</span>
          </a>
        </li>

        <li
          v-if="checkAuth('network') || checkAuth('dns') || checkAuth('dhcp') || checkAuth('services')"
          class="li-empty"
        ></li>

        <li
          v-if="checkAuth('backup')"
          v-b-toggle.object-collapse
          v-bind:class="[getCurrentPath('backup') ? 'active' : '', 'list-group-item']"
        >
          <a href="#/backup">
            <span class="pficon pficon-restart"></span>
            <span class="list-group-item-value">{{$t('menu.backup')}}</span>
            <span v-if="hints.backup.count > 0" class="badge badge-small">{{hints.backup.count}}</span>
          </a>
        </li>
        <li
          v-if="checkAuth('storage')"
          v-b-toggle.object-collapse
          v-bind:class="[getCurrentPath('storage') ? 'active' : '', 'list-group-item']"
        >
          <a href="#/storage">
            <span class="fa fa-hdd-o"></span>
            <span class="list-group-item-value">{{$t('menu.storage')}}</span>
            <span v-if="hints.storage.count > 0" class="badge badge-small">{{hints.storage.count}}</span>
          </a>
        </li>
        <li
          v-if="checkAuth('disk-usage')"
          v-b-toggle.object-collapse
          v-bind:class="[getCurrentPath('disk-usage') ? 'active' : '', 'list-group-item']"
        >
          <a href="#/disk-usage">
            <span class="fa fa-pie-chart"></span>
            <span class="list-group-item-value">{{$t('menu.disk_usage')}}</span>
            <span
              v-if="hints.disk_usage.count > 0"
              class="badge badge-small"
            >{{hints.disk_usage.count}}</span>
          </a>
        </li>

        <li
          v-if="checkAuth('backup') || checkAuth('storage') || checkAuth('disk-usage')"
          class="li-empty"
        ></li>

        <li
          v-if="checkAuth('certificates')"
          v-b-toggle.object-collapse
          v-bind:class="[getCurrentPath('certificates') ? 'active' : '', 'list-group-item']"
        >
          <a href="#/certificates">
            <span class="fa fa-key"></span>
            <span class="list-group-item-value">{{$t('menu.certificates')}}</span>
            <span
              v-if="hints.certificates.count > 0"
              class="badge badge-small"
            >{{hints.certificates.count}}</span>
          </a>
        </li>
        <li
          v-if="checkAuth('ssh')"
          v-b-toggle.object-collapse
          v-bind:class="[getCurrentPath('ssh') ? 'active' : '', 'list-group-item']"
        >
          <a href="#/ssh">
            <span class="fa fa-terminal"></span>
            <span class="list-group-item-value">{{$t('menu.ssh')}}</span>
            <span v-if="hints.ssh.count > 0" class="badge badge-small">{{hints.ssh.count}}</span>
          </a>
        </li>
        <li
          v-if="checkAuth('tls-policy')"
          v-b-toggle.object-collapse
          v-bind:class="[getCurrentPath('tls-policy') ? 'active' : '', 'list-group-item']"
        >
          <a href="#/tls-policy">
            <span class="fa fa-shield"></span>
            <span class="list-group-item-value">{{$t('menu.tls_policy')}}</span>
            <span
              v-if="hints.tls_policy.count > 0"
              class="badge badge-small"
            >{{hints.tls_policy.count}}</span>
          </a>
        </li>
        <li
          v-if="checkAuth('trusted-networks')"
          v-b-toggle.object-collapse
          v-bind:class="[getCurrentPath('trusted-networks') ? 'active' : '', 'list-group-item']"
        >
          <a href="#/trusted-networks">
            <span class="fa fa-certificate"></span>
            <span class="list-group-item-value">{{$t('menu.trusted_networks')}}</span>
            <span
              v-if="hints.trusted_networks.count > 0"
              class="badge badge-small"
            >{{hints.trusted_networks.count}}</span>
          </a>
        </li>

        <li
          v-if="checkAuth('certificates') || checkAuth('ssh') || checkAuth('tls-policy') || checkAuth('trusted-networks')"
          class="li-empty"
        ></li>

        <li v-bind:class="[getCurrentPath('settings') ? 'active' : '', 'list-group-item']">
          <a href="#/settings">
            <span class="fa fa-gear"></span>
            <span class="list-group-item-value">{{$t('menu.settings')}}</span>
            <span v-if="hints.settings.count > 0" class="badge badge-small">{{hints.settings.count}}</span>
          </a>
        </li>

        <li
          v-if="checkAuth('logs')"
          v-bind:class="[getCurrentPath('logs') ? 'active' : '', 'list-group-item']"
        >
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
    <div :class="['container-fluid', 'container-cards-pf'+ ( !routesAvailable() ? '-apps' : ''), 'handle-overflow']">
      <router-view></router-view>
    </div>

    <div
      v-if="notifications.success.show"
      :style="{ top: notifications.addMargin ? 72+'px' : 10+'px', minWidth: 390+'px', right: 10+'px', zIndex: 5, position: 'fixed'}"
      class="toast-pf toast-pf-max-width toast-pf-top-right alert alert-success alert-dismissable"
    >
      <span style="padding-top: 20px;" class="pficon fa fa-check"></span>
      <strong>{{$t('success')}}</strong>
      <p
        style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;"
      >{{notifications.success.message || '-'}}</p>
    </div>

    <div
      v-if="notifications.error.show"
      :style="{ top: notifications.addMargin ? notifications.success.show ? 142+'px' : 72+'px' : notifications.success.show ? 80+'px' : 10+'px', minWidth: 390+'px', right: 10+'px', zIndex: 5, position: 'fixed' }"
      class="toast-pf toast-pf-max-width toast-pf-top-right alert alert-danger alert-dismissable"
    >
      <button type="button" class="close" data-dismiss="alert" aria-hidden="true">
        <span class="fa fa-times"></span>
      </button>
      <div class="pull-right toast-pf-action" style="margin-top: 2px;">
        <a @click="notifications.error.action()">{{notifications.error.actionName}}</a>
      </div>
      <span style="padding-top: 20px;" class="pficon fa fa-times"></span>
      <strong>{{$t('error')}}</strong>
      <p
        style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;"
      >{{notifications.error.message || '-'}}</p>
      <span>
        {{$t('check')}}
        <code>API</code>
        {{$t('for_more_info')}}:
      </span>
      <br>
      <code>{{notifications.error.api}}</code>
      <button
        @click="copyCommand(notifications.error.command)"
        class="btn btn-primary copy-path"
        type="button"
      >{{$t('copy_command')}}</button>
      <span v-if="copied" class="fa fa-check green copy-ok"></span>
    </div>

    <div
      v-if="notifications.event.show"
      :style="{ top: notifications.addMargin ? (notifications.success.show && notifications.error.show) ? 330+'px' : (notifications.success.show ? 142+'px' : (notifications.error.show ? 260+'px' : 72 +'px')) : (notifications.success.show && notifications.error.show) ? 270+'px' : (notifications.success.show ? 80+'px' : (notifications.error.show ? 200+'px' : 10 +'px')), minWidth: 390+'px', right: 10+'px', zIndex: 5, position: 'fixed' }"
      class="toast-pf toast-pf-max-width toast-pf-top-right alert alert-warning alert-dismissable"
    >
      <span style="padding-top: 25px;" class="pficon fa fa-warning"></span>
      <strong>{{$t('event')}}:</strong>
      {{notifications.event.name || '-'}}
      <span v-if="notifications.event.message">
        (
        <strong>{{notifications.event.message}}</strong>)
      </span>

      <div style="margin-bottom:0px;" class="progress-description">
        <div class="spinner spinner-xs spinner-inline"></div>
        <strong v-if="notifications.event.steps != -1">{{notifications.event.progress}}%</strong>
      </div>
      <div
        :class="['progress progress-xs progress-label-top-right', notifications.event.steps == -1 ? 'progress-striped active' : '']"
      >
        <div
          class="progress-bar"
          role="progressbar"
          :aria-valuenow="notifications.event.progress"
          aria-valuemin="0"
          aria-valuemax="100"
          :style="{ width: notifications.event.progress+'%'}"
        ></div>
      </div>
    </div>

    <div v-if="taskInProgress && this.$route.path != '/terminal'" class="fake-modal-backdrop-event"></div>
  </div>
</template>

<script>
export default {
  name: "App",
  mounted() {
    console.clear();
    console.log("%c" + this.msg, "background: #39a5dc; color: white;");

    // get authorization for routes
    this.getAuths();

    // check for running tasks
    this.checkSystemTasks();

    // get hints
    this.checkHints();
  },
  watch: {
    $route(to, from) {
      this.notifications.success.show = false;
      this.notifications.error.show = false;
      this.notifications.event.show = false;
      this.notifications.addMargin = false;

      this.checkSystemTasks();
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
      notifications: {
        success: {
          message: "",
          show: false
        },
        error: {
          api: "",
          command: "",
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
        addMargin: false
      },
      auths: [],
      taskInProgress: false,
      copied: false,
      hints: this.initHints(),
      systemRoutes: [
        "/",
        "/storage",
        "/disk-usage",
        "/certificates",
        "/dns",
        "/dhcp",
        "/backup",
        "/services",
        "/users-groups",
        "/network",
        "/ssh",
        "/tls-policy",
        "/trusted-networks",
        "/logs",
        "/about",
        "/settings"
      ]
    };
  },
  methods: {
    routesAvailable() {
      var path = this.$route.path;
      return this.systemRoutes.indexOf(path) >= 0;
    },
    copyCommand(cmd) {
      var context = this;
      context.$copyText(cmd).then(
        function(e) {
          context.copied = true;
          setTimeout(function() {
            context.copied = false;
          }, 2000);
        },
        function(e) {
          context.copied = false;
        }
      );
    },
    getCurrentPath(route, offset) {
      if (offset) {
        return this.$route.path.split("/")[offset] === route;
      } else {
        return this.$route.path.split("/")[1] === route;
      }
    },
    checkSystemTasks() {
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
          try {
            success = JSON.parse(success);
          } catch (e) {
            console.error(e);
          }
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
    },
    initHints() {
      return {
        available: false,
        hostname: {
          count: 0
        },
        upstreamDns: {
          count: 0
        },
        company: {
          count: 0
        },
        users_groups: {
          count: 0
        },
        network: {
          count: 0
        },
        dns: {
          count: 0
        },
        dhcp: {
          count: 0
        },
        services: {
          count: 0
        },
        backup: {
          count: 0
        },
        storage: {
          count: 0
        },
        disk_usage: {
          count: 0
        },
        certificates: {
          count: 0
        },
        ssh: {
          count: 0
        },
        tls_policy: {
          count: 0
        },
        trusted_networks: {
          count: 0
        },
        settings: {
          count: 0
        },
        subscription: {
          count: 0
        }
      };
    },
    checkHints(callback) {
      var context = this;

      context.exec(
        ["system-settings/read"],
        {
          action: "hints"
        },
        null,
        function(success) {
          try {
            success = JSON.parse(success);
          } catch (e) {
            console.error(e);
          }
          context.hints.available = success.hints == "enabled";

          if (context.hints.available) {
            context.getGroupHints();
          } else {
            context.hints = context.initHints();
          }

          callback ? callback(context.hints.available) : null;
        },
        function(error) {
          console.error(error);
        }
      );
    },
    getHints(type, prop) {
      var context = this;
      context.execHints(
        type,
        function(success) {
          context.hints[prop].count = success.count;

          if (prop == "subscription" && success.count > 0) {
            $(
              "#sidebar-menu>.list-group-item:nth-last-child(2)",
              window.parent.document
            ).css("border-left", "3px solid #f0ab00");

            $("#topnav", window.parent.document).css(
              "border-top",
              "2px solid #f0ab00"
            );
          }
          if (prop == "subscription" && success.count == 0) {
            $(
              "#sidebar-menu>.list-group-item:nth-last-child(2)",
              window.parent.document
            ).css("border-left", "");

            $("#topnav", window.parent.document).css(
              "border-top",
              "2px solid #39a5dc"
            );
          }
        },
        function(error) {
          console.error(error);
        }
      );
    },
    getGroupHints() {
      this.getHints("system-hostname", "hostname");
      this.getHints("system-dns", "upstreamDns");
      this.getHints("system-company", "company");
      this.getHints("system-services", "services");
      this.getHints("system-backup", "backup");
      this.getHints("system-openssh", "ssh");
      this.getHints("system-tls-policy", "tls_policy");
      this.getHints("system-settings", "settings");
      this.getHints("system-subscription", "subscription");
    }
  }
};
</script>

<style src="./styles/main.css">
</style>
