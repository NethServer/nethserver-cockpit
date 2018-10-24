<template>
  <div v-if="view.isAuth">
    <h2>{{$t('settings.title')}}</h2>
    <div v-if="!view.isLoaded" class="spinner spinner-lg"></div>
    <div v-if="view.isLoaded">

      <div v-if="hints.count > 0" class="alert alert-warning alert-dismissable">
        <span class="pficon pficon-warning-triangle-o"></span>
        <strong>{{$t('hints_suggested')}}:</strong>
        <li v-for="(m,t) in hints.details" v-bind:key="t"><strong>{{t}}</strong>: {{m}}</li>
        <span v-if="hints.message && hints.message.length > 0">
          {{hints.message && hints.message}}
        </span>
      </div>

      <h3>{{$t('settings.password')}}</h3>
      <form class="form-horizontal" v-on:submit.prevent="saveSettings('password')">
        <div v-if="!newUser.isRoot" :class="['form-group', errors.root_password.hasError ? 'has-error' : '']">
          <label class="col-sm-2 control-label" for="textInput-modal-markup">{{$t('settings.old_password')}}</label>
          <div class="col-sm-5">
            <input required :type="newUser.togglePass ? 'text' : 'password'" v-model="newUser.oldPassword" class="form-control">
            <span v-if="errors.root_password.hasError" class="help-block">{{errors.root_password.hasError.message}}</span>
          </div>
          <div class="col-sm-2">
            <button @click="togglePass()" type="button" class="btn btn-primary">
              <span :class="[!newUser.togglePass ? 'fa fa-eye' : 'fa fa-eye-slash']"></span>
            </button>
          </div>
        </div>
        <div :class="['form-group', errors.root_password.hasError ? 'has-error' : '']">
          <label class="col-sm-2 control-label" for="textInput-modal-markup">{{$t('settings.new_password')}}</label>
          <div class="col-sm-5">
            <input required :type="newUser.togglePass ? 'text' : 'password'" v-model="newUser.newPassword" class="form-control">
            <span v-if="errors.root_password.hasError" class="help-block">{{errors.root_password.hasError.message}}</span>
          </div>
          <div v-show="newUser.isRoot" class="col-sm-2">
            <button @click="togglePass()" type="button" class="btn btn-primary">
              <span :class="[!newUser.togglePass ? 'fa fa-eye' : 'fa fa-eye-slash']"></span>
            </button>
          </div>
        </div>
        <div class="form-group">
          <label class="col-sm-2 control-label" for="textInput-modal-markup">{{$t('settings.confirm_new_password')}}</label>
          <div class="col-sm-5">
            <password-meter></password-meter>
          </div>
        </div>
        <div class="form-group">
          <label class="col-sm-2 control-label" for="textInput-modal-markup">
            <div v-if="loaders.password" class="spinner spinner-sm form-spinner-loader adjust-top-loader"></div>
          </label>
          <div class="col-sm-5">
            <button :disabled="!newUser.passwordStrength" class="btn btn-primary" type="submit">{{$t('save')}}</button>
          </div>
        </div>
      </form>

      <div class="divider"></div>
      <h3>{{$t('settings.smart_host')}}</h3>
      <form class="form-horizontal" v-on:submit.prevent="saveSettings('smarthost')">
        <div :class="['form-group', errors.SmartHostStatus.hasError ? 'has-error' : '']">
          <label class="col-sm-2 control-label" for="textInput-modal-markup">{{$t('settings.use_smarthost')}}</label>
          <div class="col-sm-5">
            <toggle-button class="min-toggle" :width="40" :height="20" :color="{checked: '#0088ce', unchecked: '#bbbbbb'}"
              :value="settings.smarthost.SmartHostStatus" :sync="true" @change="toggleSettingsSmartHost()" />
            <span v-if="errors.SmartHostStatus.hasError" class="help-block">{{errors.SmartHostStatus.message}}</span>
          </div>
        </div>
        <div v-if="settings.smarthost.SmartHostStatus" :class="['form-group', errors.SmartHostName.hasError ? 'has-error' : '']">
          <label class="col-sm-2 control-label" for="textInput-modal-markup">{{$t('settings.smarthost_hostname')}}</label>
          <div class="col-sm-5">
            <input :required="settings.smarthost.SmartHostStatus" type="text" v-model="settings.smarthost.SmartHostName"
              class="form-control">
            <span v-if="errors.SmartHostName.hasError" class="help-block">{{errors.SmartHostName.message}}</span>
          </div>
        </div>
        <div v-if="settings.smarthost.SmartHostStatus" :class="['form-group', errors.SmartHostPort.hasError ? 'has-error' : '']">
          <label class="col-sm-2 control-label" for="textInput-modal-markup">{{$t('settings.smarthost_port')}}</label>
          <div class="col-sm-5">
            <input :required="settings.smarthost.SmartHostStatus" type="number" min="0" v-model="settings.smarthost.SmartHostPort"
              class="form-control">
            <span v-if="errors.SmartHostPort.hasError" class="help-block">{{errors.SmartHostPort.message}}</span>
          </div>
        </div>
        <div v-if="settings.smarthost.SmartHostStatus" :class="['form-group', errors.SmartHostUsername.hasError ? 'has-error' : '']">
          <label class="col-sm-2 control-label" for="textInput-modal-markup">{{$t('settings.smarthost_username')}}</label>
          <div class="col-sm-5">
            <input :required="settings.smarthost.SmartHostStatus" type="text" v-model="settings.smarthost.SmartHostUsername"
              class="form-control">
            <span v-if="errors.SmartHostUsername.hasError" class="help-block">{{errors.SmartHostUsername.message}}</span>
          </div>
        </div>
        <div v-if="settings.smarthost.SmartHostStatus" :class="['form-group', errors.SmartHostPassword.hasError ? 'has-error' : '']">
          <label class="col-sm-2 control-label" for="textInput-modal-markup">{{$t('settings.smarthost_password')}}</label>
          <div class="col-sm-5">
            <input :required="settings.smarthost.SmartHostStatus" type="password" v-model="settings.smarthost.SmartHostPassword"
              class="form-control">
            <span v-if="errors.SmartHostPassword.hasError" class="help-block">{{errors.SmartHostPassword.message}}</span>
          </div>
        </div>
        <div v-if="settings.smarthost.SmartHostStatus" :class="['form-group', errors.SmartHostTlsStatus.hasError ? 'has-error' : '']">
          <label class="col-sm-2 control-label" for="textInput-modal-markup">{{$t('settings.smarthost_encrypt')}}</label>
          <div class="col-sm-5">
            <input type="checkbox" v-model="settings.smarthost.SmartHostTlsStatus"
              class="form-control">
            <span v-if="errors.SmartHostTlsStatus.hasError" class="help-block">{{errors.SmartHostTlsStatus.message}}</span>
          </div>
        </div>
        <div class="form-group">
          <label class="col-sm-2 control-label" for="textInput-modal-markup">
            <div v-if="loaders.smarthost" class="spinner spinner-sm form-spinner-loader adjust-top-loader"></div>
          </label>
          <div class="col-sm-5">
            <button class="btn btn-primary" type="submit">{{$t('save')}}</button>
          </div>
        </div>
      </form>

      <div class="divider"></div>
      <h3>{{$t('settings.notifications')}}</h3>
      <form class="form-horizontal" v-on:submit.prevent="saveSettings('root')">
        <div :class="['form-group', errors.SenderAddress.hasError ? 'has-error' : '']">
          <label class="col-sm-2 control-label" for="textInput-modal-markup">{{$t('settings.notify_from')}}</label>
          <div class="col-sm-5">
            <input required type="email" v-model="settings.root.SenderAddress" class="form-control">
            <span v-if="errors.SenderAddress.hasError" class="help-block">{{errors.SenderAddress.message}}</span>
          </div>
        </div>
        <div v-for="(a, i) in settings.root.EmailAddress" v-bind:key="i" :class="['form-group', errors.EmailAddress.hasError ? 'has-error' : '']">
          <label class="col-sm-2 control-label" for="textInput-modal-markup">{{i == 0 ?
            $t('settings.notify_to') : ''}}</label>
          <div class="col-sm-5">
            <input required type="email" v-model="a.email" class="form-control">
            <span v-if="errors.EmailAddress.hasError" class="help-block">{{errors.EmailAddress.message}}</span>
          </div>
          <div class="col-sm-2">
            <button @click="removeEmail(a, i)" class="btn btn-default" type="button">
              <span class="fa fa-minus card-icon-def"></span>
            </button>
          </div>
        </div>
        <div class="form-group">
          <div class="col-sm-2 control-label"></div>
          <div class="col-sm-5">
            <button @click="addEmail()" class="btn btn-default" type="button">
              <span class="fa fa-plus card-icon-def"></span> {{$t('settings.add_email')}}
            </button>
          </div>
        </div>
        <div class="form-group">
          <label class="col-sm-2 control-label" for="textInput-modal-markup">
            <div v-if="loaders.root" class="spinner spinner-sm form-spinner-loader adjust-top-loader"></div>
          </label>
          <div class="col-sm-5">
            <button class="btn btn-primary" type="submit">{{$t('save')}}</button>
          </div>
        </div>
      </form>

      <div class="divider"></div>
      <h3>{{$t('settings.web_shell')}}</h3>
      <form class="form-horizontal" v-on:submit.prevent="saveSettings('cockpit')">
        <div :class="['form-group', errors.access.hasError ? 'has-error' : '']">
          <label class="col-sm-2 control-label" for="textInput-modal-markup">{{$t('settings.limit_access')}}</label>
          <div class="col-sm-5">
            <toggle-button class="min-toggle" :width="40" :height="20" :color="{checked: '#0088ce', unchecked: '#bbbbbb'}"
              :value="settings.cockpit.access" :sync="true" @change="toggleSettingsLimitAccess()" />
            <span v-if="errors.access.hasError" class="help-block">{{errors.access.message}}</span>
          </div>
        </div>
        <div v-if="settings.cockpit.access" :class="['form-group', errors.LimitAccess.hasError ? 'has-error' : '']">
          <label class="col-sm-2 control-label" for="textInput-modal-markup">{{$t('settings.allow_only')}}</label>
          <div class="col-sm-5">
            <textarea v-model="settings.cockpit.LimitAccess" class="form-control"></textarea>
            <span v-if="errors.LimitAccess.hasError" class="help-block">{{errors.LimitAccess.message}}</span>
          </div>
        </div>
        <div class="form-group">
          <label class="col-sm-2 control-label" for="textInput-modal-markup">
            <div v-if="loaders.cockpit" class="spinner spinner-sm form-spinner-loader adjust-top-loader"></div>
          </label>
          <div class="col-sm-5">
            <button class="btn btn-primary" type="submit">{{$t('save')}}</button>
          </div>
        </div>
      </form>

      <div class="divider"></div>
      <h3>{{$t('settings.hints')}}</h3>

      <form class="form-horizontal" v-on:submit.prevent="saveSettings('hints')">
        <div :class="['form-group', errors.ShowHints.hasError ? 'has-error' : '']">
          <label class="col-sm-2 control-label" for="textInput-modal-markup">{{$t('settings.show_hints')}}</label>
          <div class="col-sm-5">
            <toggle-button class="min-toggle" :width="40" :height="20" :color="{checked: '#0088ce', unchecked: '#bbbbbb'}"
              :value="settings.cockpit.ShowHints" :sync="true" @change="toggleSettingsHints()" />
            <span v-if="errors.ShowHints.hasError" class="help-block">{{errors.ShowHints.message}}</span>
          </div>
        </div>
        <div class="form-group">
          <label class="col-sm-2 control-label" for="textInput-modal-markup">
            <div v-if="loaders.hints" class="spinner spinner-sm form-spinner-loader adjust-top-loader"></div>
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
import PasswordMeter from "../../directives/PasswordMeter.vue";

export default {
  name: "Settings",
  components: {
    PasswordMeter
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.exec(
        ["system-authorization/read"],
        null,
        null,
        function(success) {
          success = JSON.parse(success);

          if (success.system.indexOf(to.path.substring(1)) == -1) {
            window.location.hash = "#/";
            vm.$router.push("/");
          }

          vm.view.isAuth = true;
        },
        function(error) {
          console.error(error);
        },
        false
      );
    });
  },
  mounted() {
    this.getSettings();
    this.getHints();
  },
  data() {
    return {
      view: {
        isLoaded: false,
        isAuth: false
      },
      hints: {},
      settings: {
        smarthost: {
          SmartHostStatus: false,
          SmartHostTlsStatus: "",
          SmartHostName: "",
          SmartHostPort: 25,
          SmartHostUsername: "",
          SmartHostPassword: ""
        },
        root: {
          EmailAddress: [{}],
          SenderAddress: ""
        },
        cockpit: {
          LimitAccess: "",
          ShowHints: true,
          access: false
        }
      },
      loaders: {
        password: false,
        smarthost: false,
        root: false,
        cockpit: false,
        hints: false
      },
      errors: this.initErrors(),
      newUser: {
        newPassword: "",
        oldPassword: "",
        confirmNewPassword: "",
        passwordStrength: false,
        togglePass: false,
        isRoot: true
      }
    };
  },
  methods: {
    initErrors() {
      return {
        ShowHints: {
          hasError: false,
          message: ""
        },
        access: {
          hasError: false,
          message: ""
        },
        LimitAccess: {
          hasError: false,
          message: ""
        },
        root_password: {
          hasError: false,
          message: ""
        },
        SmartHostStatus: {
          hasError: false,
          message: ""
        },
        SmartHostName: {
          hasError: false,
          message: ""
        },
        SmartHostPort: {
          hasError: false,
          message: ""
        },
        SmartHostUsername: {
          hasError: false,
          message: ""
        },
        SmartHostPassword: {
          hasError: false,
          message: ""
        },
        SmartHostTlsStatus: {
          hasError: false,
          message: ""
        },
        SenderAddress: {
          hasError: false,
          message: ""
        },
        EmailAddress: {
          hasError: false,
          message: ""
        }
      };
    },
    addEmail() {
      this.settings.root.EmailAddress.push({
        isNew: true
      });
    },
    removeEmail(alias, index) {
      this.settings.root.EmailAddress.splice(index, 1);
    },
    getHints(callback) {
      var context = this;
      if (context.$parent.hints.available) {
        context.execHints(
          "system-settings",
          function(success) {
            context.hints = success;
            callback ? callback() : null;
          },
          function(error) {
            console.error(error);
          }
        );
      } else {
        context.hints = {};
        context.hints.count = 0;
        callback ? callback() : null;
      }
    },
    getSettings() {
      var context = this;

      context.view.isLoaded = true;
      context.exec(
        ["system-settings/read"],
        { action: "settings" },
        null,
        function(success) {
          success = JSON.parse(success);
          context.settings = success.configuration;

          context.newUser.isRoot = success.status.isRoot == 1;

          // root
          var emails = [{}];
          for (var s in context.settings) {
            if (s == "root") {
              emails = context.settings[s].EmailAddress.map(function(i) {
                return {
                  email: i
                };
              });
            }
          }
          context.settings.root.EmailAddress = emails;

          //smarthost
          context.settings.smarthost.SmartHostStatus =
            context.settings.smarthost.SmartHostStatus == "enabled";
          context.settings.smarthost.SmartHostTlsStatus =
            context.settings.smarthost.SmartHostTlsStatus == "enabled";

          // cockpit
          context.settings.cockpit.access =
            context.settings.cockpit.access.indexOf("red") != -1;
          context.settings.cockpit.LimitAccess = context.settings.cockpit.LimitAccess.split(
            ","
          ).join("\n");
          context.settings.cockpit.ShowHints =
            context.settings.cockpit.ShowHints == "enabled";

          context.getHints(function() {
            context.$parent.hints.settings.count = context.hints.count;
          });
          context.view.isLoaded = true;
        },
        function(error) {
          console.error(error);
        }
      );
    },
    toggleSettingsHints() {
      this.settings.cockpit.ShowHints = !this.settings.cockpit.ShowHints;
    },
    toggleSettingsSmartHost() {
      this.settings.smarthost.SmartHostStatus = !this.settings.smarthost
        .SmartHostStatus;
    },
    toggleSettingsLimitAccess() {
      this.settings.cockpit.access = !this.settings.cockpit.access;
    },
    togglePass() {
      this.newUser.togglePass = !this.newUser.togglePass;
    },
    saveSettings(type) {
      var context = this;
      var settingsObj = {};

      switch (type) {
        case "password":
          settingsObj = {
            action: "password",
            ConfirmPassword: this.newUser.confirmNewPassword,
            NewPassword: this.newUser.newPassword,
            CurrentPassword: this.newUser.oldPassword
          };
          break;
        case "smarthost":
          settingsObj = {
            action: "smarthost",
            SmartHostPassword: context.settings.smarthost.SmartHostPassword,
            SmartHostPort: context.settings.smarthost.SmartHostPort,
            SmartHostTlsStatus: context.settings.smarthost.SmartHostTlsStatus
              ? "enabled"
              : "disabled",
            SmartHostUsername: context.settings.smarthost.SmartHostUsername,
            SmartHostName: context.settings.smarthost.SmartHostName,
            SmartHostStatus: context.settings.smarthost.SmartHostStatus
              ? "enabled"
              : "disabled"
          };
          break;

        case "root":
          settingsObj = {
            action: "root",
            SenderAddress: context.settings.root.SenderAddress,
            KeepMessageCopy: "yes",
            EmailAddress: context.settings.root.EmailAddress.map(function(e) {
              return e.email;
            })
          };
          break;

        case "cockpit":
          settingsObj = {
            action: "cockpit",
            access: context.settings.cockpit.access ? "green,red" : "green",
            LimitAccess:
              context.settings.cockpit.LimitAccess.length > 0
                ? context.settings.cockpit.LimitAccess.split("\n")
                : []
          };
          break;

        case "hints":
          settingsObj = {
            action: "hints",
            ShowHints: context.settings.cockpit.ShowHints
              ? "enabled"
              : "disabled"
          };
          break;
      }

      context.loaders[type] = true;
      context.exec(
        ["system-settings/validate"],
        settingsObj,
        null,
        function(success) {
          context.loaders[type] = false;

          // update values
          context.exec(
            ["system-settings/update"],
            settingsObj,
            function(stream) {
              console.info("settings-" + type, stream);
            },
            function(success) {
              // notification
              context.$parent.notifications.success.message = context.$i18n.t(
                "settings.settings_updated_ok"
              );

              // get settings
              context.$parent.checkHints(function() {
                context.getSettings();
              });

              // reset passwords
              context.newUser.newPassword = "";
              context.newUser.oldPassword = "";
              context.newUser.confirmNewPassword = "";
              context.newUser.passwordStrength = false;
              context.newUser.togglePass = false;
              $("#pass-meter-input").val("");
            },
            function(error, data) {
              // notification
              context.$parent.notifications.error.message = context.$i18n.t(
                "settings.settings_updated_error"
              );
            },
            false
          );
        },
        function(error, data) {
          var errorData = JSON.parse(data);
          /* context.newReservation.isLoading = false;
          context.newReservation.errors.name.hasError = false;
          context.newReservation.errors.IpAddress.hasError = false;
          context.newReservation.errors.MacAddress.hasError = false;
          context.newReservation.errors.Description.hasError = false;

          for (var e in errorData.attributes) {
            var attr = errorData.attributes[e];
            context.newReservation.errors[attr.parameter].hasError = true;
            context.newReservation.errors[attr.parameter].message =
              "[" + errorData.message + "]: " + attr.error;
          } */
        }
      );
    }
  }
};
</script>

<style>
</style>