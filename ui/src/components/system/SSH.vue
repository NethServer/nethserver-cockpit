<template>
  <div>
    <h2>{{$t('ssh.title')}}</h2>
    <div v-if="!view.isLoaded" class="spinner spinner-lg"></div>
    <div v-if="view.isLoaded">
      <h3>{{$t('stats')}}</h3>
      <div class="stats-container card-pf-utilization-details">
        <span class="card-pf-utilization-card-details-count">{{stats.connections}}</span>
        <span class="card-pf-utilization-card-details-description">
          <span class="card-pf-utilization-card-details-line-2 stats-text">{{stats.connections == 1 ? $t('ssh.connection') : $t('ssh.connections')}}</span>
        </span>
      </div>
      <div class="stats-container card-pf-utilization-details">
        <span class="card-pf-utilization-card-details-count">{{stats.peers}}</span>
        <span class="card-pf-utilization-card-details-description">
          <span class="card-pf-utilization-card-details-line-2 stats-text">{{stats.peers == 1 ? $t('ssh.peer') : $t('ssh.peers')}}</span>
        </span>
      </div>
      <h3>{{$t('config')}}</h3>
      <form class="form-horizontal" v-on:submit.prevent="saveSSH(SSHConfig)">
        <div :class="['form-group', SSHConfig.errors.TCPPort.hasError ? 'has-error' : '']">
          <label class="col-sm-2 control-label" for="textInput-modal-markup">{{$t('ssh.tcp_port')}}</label>
          <div class="col-sm-5">
            <input required type="number" v-model="SSHConfig.TCPPort" class="form-control">
            <span v-if="SSHConfig.errors.TCPPort.hasError" class="help-block">{{SSHConfig.errors.TCPPort.message}}</span>
          </div>
        </div>
        <div :class="['form-group', SSHConfig.errors.PermitRootLogin.hasError ? 'has-error' : '']">
          <label class="col-sm-2 control-label" for="textInput-modal-markup">{{$t('ssh.allow_root_login')}}</label>
          <div class="col-sm-5">
            <input type="checkbox" :value="SSHConfig.PermitRootLogin == 'yes'" v-model="SSHConfig.PermitRootLogin"
              class="form-control">
            <span v-if="SSHConfig.errors.PermitRootLogin.hasError" class="help-block">{{SSHConfig.errors.PermitRootLogin.message}}</span>
          </div>
        </div>
        <div :class="['form-group', SSHConfig.errors.PasswordAuthentication.hasError ? 'has-error' : '']">
          <label class="col-sm-2 control-label" for="textInput-modal-markup">{{$t('ssh.allow_password_auth')}}</label>
          <div class="col-sm-5">
            <input type="checkbox" :value="SSHConfig.PasswordAuthentication == 'yes'" v-model="SSHConfig.PasswordAuthentication"
              class="form-control">
            <span v-if="SSHConfig.errors.PasswordAuthentication.hasError" class="help-block">{{SSHConfig.errors.PasswordAuthentication.message}}</span>
          </div>
        </div>

        <div class="form-group">
          <label class="col-sm-2 control-label" for="textInput-modal-markup">
            <div v-if="SSHConfig.isLoading" class="spinner spinner-sm form-spinner-loader adjust-top-loader"></div>
          </label>
          <div class="col-sm-5">
            <button class="btn btn-primary" type="submit">{{$t('save')}}</button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: "SSH",
  mounted() {
    this.getSSHConfig();
  },
  data() {
    return {
      view: {
        isLoaded: false
      },
      SSHConfig: {
        isLoading: false,
        errors: {
          TCPPort: {
            hasError: false,
            message: ""
          },
          PermitRootLogin: {
            hasError: false,
            message: ""
          },
          PasswordAuthentication: {
            hasError: false,
            message: ""
          }
        },
        TCPPort: 0,
        PermitRootLogin: false,
        PasswordAuthentication: false
      },
      stats: {
        connections: 0,
        peers: 0
      }
    };
  },
  methods: {
    getSSHConfig() {
      var context = this;
      context.exec(
        ["system-openssh/read"],
        null,
        null,
        function(success) {
          success = JSON.parse(success);
          context.view.isLoaded = true;
          context.SSHConfig.TCPPort = success.configuration.props.TCPPort;
          context.SSHConfig.PasswordAuthentication =
            success.configuration.props.PasswordAuthentication == "yes"
              ? true
              : false;
          context.SSHConfig.PermitRootLogin =
            success.configuration.props.PermitRootLogin == "yes" ? true : false;

          context.stats.connections = success.status.connections.length;
          var peers = [];
          for (var c in success.status.connections) {
            var peer = success.status.connections[c].peer.split(':')[0];
            if (peers.indexOf(peer) == -1) {
              peers.push(peer);
            }
          }
          context.stats.peers = peers.length;
        },
        function(error) {
          console.error(error);
        }
      );
    },
    saveSSH(obj) {
      var context = this;

      var sshObj = {
        name: "sshd",
        props: {
          PasswordAuthentication: obj.PasswordAuthentication ? "yes" : "0",
          PermitRootLogin: obj.PermitRootLogin ? "yes" : "0",
          TCPPort: obj.TCPPort
        },
        type: "service"
      };
      context.SSHConfig.isLoading = true;
      context.exec(
        ["system-openssh/validate"],
        sshObj,
        null,
        function(success) {
          context.SSHConfig.isLoading = false;

          // update values
          context.exec(
            ["system-openssh/update"],
            sshObj,
            function(stream) {
              console.info("openssh", stream);
            },
            function(success) {
              // notification
              context.$parent.notifications.success.message = context.$i18n.t(
                "ssh.ssh_edit_ok"
              );

              // get openssh
              context.getSSHConfig();
            },
            function(error, data) {
              // notification
              context.$parent.notifications.error.message = context.$i18n.t(
                "ssh.ssh_edit_error"
              );
            }
          );
        },
        function(error, data) {
          var errorData = JSON.parse(data);
          context.SSHConfig.isLoading = false;
          context.SSHConfig.errors.TCPPort.hasError = false;
          context.SSHConfig.errors.PermitRootLogin.hasError = false;
          context.SSHConfig.errors.PasswordAuthentication.hasError = false;

          for (var e in errorData.attributes) {
            var attr = errorData.attributes[e];
            context.SSHConfig.errors[attr.parameter].hasError = true;
            context.SSHConfig.errors[attr.parameter].message =
              "[" + errorData.message + "]: " + attr.error;
          }
        }
      );
    }
  }
};
</script>

<style>
</style>