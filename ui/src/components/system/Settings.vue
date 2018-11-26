<template>
  <div>
    <h2>{{$t('settings.title')}}</h2>
    <div v-if="!view.isLoaded" class="spinner spinner-lg"></div>
    <div v-if="view.isLoaded">

      <div v-if="hints.count > 0" class="alert alert-warning alert-dismissable">
        <span class="pficon pficon-warning-triangle-o"></span>
        <strong>{{$t('hints_suggested')}}:</strong>
        <li v-for="(m,t) in hints.details" v-bind:key="t"><strong>{{$t('hints.'+t)}}</strong>: {{$t('hints.'+m)}}</li>
        <span v-if="hints.message && hints.message.length > 0">
          {{hints.message && $t('hints.'+hints.message)}}
        </span>
      </div>

      <h3>{{$t('settings.password')}}</h3>
      <div v-if="!newUser.canChangePassword" class="alert alert-info alert-dismissable">
        <span class="pficon pficon-info"></span>
        <strong>{{$t('settings.cannot_change_password')}}.</strong> {{$t('settings.remote_account_provider_password')}}.
      </div>
      <form class="form-horizontal" v-on:submit.prevent="saveSettings('password')">
        <div v-if="!view.isRoot" class="form-group">
          <label class="col-sm-2 control-label" for="textInput-modal-markup">{{$t('settings.old_password')}}</label>
          <div class="col-sm-5">
            <input :disabled="!newUser.canChangePassword" required :type="newUser.togglePass ? 'text' : 'password'" v-model="newUser.oldPassword"
              class="form-control">
          </div>
          <div class="col-sm-2">
            <button @click="togglePass()" type="button" class="btn btn-primary adjust-top-min">
              <span :class="[!newUser.togglePass ? 'fa fa-eye' : 'fa fa-eye-slash']"></span>
            </button>
          </div>
        </div>
        <div :class="['form-group', errors.newPassword.hasError ? 'has-error' : '']">
          <label class="col-sm-2 control-label" for="textInput-modal-markup">{{$t('settings.new_password')}}</label>
          <div class="col-sm-5">
            <input :disabled="!newUser.canChangePassword" required :type="newUser.togglePass ? 'text' : 'password'" v-model="newUser.newPassword"
              class="form-control">
            <span v-if="errors.newPassword.hasError" class="help-block">{{$t('validation.validation_failed')}}:
              {{$t('validation.'+errors.newPassword.message)}}</span>
          </div>
          <div v-show="view.isRoot" class="col-sm-2">
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
            <button :disabled="!newUser.passwordStrength || !newUser.canChangePassword" class="btn btn-primary" type="submit">{{$t('save')}}</button>
          </div>
        </div>
      </form>

      <div v-if="view.isRoot" class="divider"></div>
      <h3 v-if="view.isRoot">{{$t('settings.smart_host')}}</h3>
      <form v-if="view.isRoot" class="form-horizontal" v-on:submit.prevent="saveSettings('smarthost')">
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
            <input type="checkbox" v-model="settings.smarthost.SmartHostTlsStatus" class="form-control">
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

      <div v-if="view.isRoot" class="divider"></div>
      <h3 v-if="view.isRoot">{{$t('settings.notifications')}}</h3>
      <form v-if="view.isRoot" class="form-horizontal" v-on:submit.prevent="saveSettings('root')">
        <div :class="['form-group', errors.SenderAddress.hasError ? 'has-error' : '']">
          <label class="col-sm-2 control-label" for="textInput-modal-markup">{{$t('settings.notify_from')}}</label>
          <div class="col-sm-5">
            <input required type="email" v-model="settings.root.SenderAddress" class="form-control">
            <span v-if="errors.SenderAddress.hasError" class="help-block">{{$t('validation.validation_failed')}}:
              {{$t('validation.'+errors.SenderAddress.message)}}</span>
          </div>
        </div>
        <div v-for="(a, i) in settings.root.EmailAddress" v-bind:key="i" :class="['form-group', errors.EmailAddress.hasError ? 'has-error' : '']">
          <label class="col-sm-2 control-label" for="textInput-modal-markup">{{i == 0 ?
            $t('settings.notify_to') : ''}}</label>
          <div class="col-sm-5">
            <input required type="email" v-model="a.email" class="form-control">
            <span v-if="errors.EmailAddress.hasError" class="help-block">{{$t('validation.validation_failed')}}:
              {{$t('validation.'+errors.EmailAddress.message)}}</span>
          </div>
          <div v-if="i > 0" class="col-sm-2">
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

      <div v-if="view.isRoot" class="divider"></div>
      <h3 v-if="view.isRoot">{{$t('settings.web_shell')}}</h3>
      <form v-if="view.isRoot" class="form-horizontal" v-on:submit.prevent="saveSettings('cockpit')">
        <div :class="['form-group', errors.access.hasError ? 'has-error' : '']">
          <label class="col-sm-2 control-label" for="textInput-modal-markup">{{$t('settings.limit_access')}}</label>
          <div class="col-sm-5">
            <toggle-button class="min-toggle" :width="40" :height="20" :color="{checked: '#0088ce', unchecked: '#bbbbbb'}"
              :value="settings.cockpit.access" :sync="true" @change="toggleSettingsLimitAccess()" />
            <span v-if="errors.access.hasError" class="help-block">{{$t('validation.validation_failed')}}:
              {{$t('validation.'+errors.access.message)}}</span>
          </div>
        </div>
        <div v-if="settings.cockpit.access" :class="['form-group', errors.LimitAccess.hasError ? 'has-error' : '']">
          <label class="col-sm-2 control-label" for="textInput-modal-markup">{{$t('settings.allow_only')}}</label>
          <div class="col-sm-5">
            <textarea v-model="settings.cockpit.LimitAccess" class="form-control"></textarea>
            <span v-if="errors.LimitAccess.hasError" class="help-block">{{$t('validation.validation_failed')}}:
              {{$t('validation.'+errors.LimitAccess.message)}}</span>
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

      <div v-if="view.isRoot" class="divider"></div>
      <h3 v-if="view.isRoot">{{$t('settings.logrotate')}}</h3>
      <form v-if="view.isRoot" class="form-horizontal" v-on:submit.prevent="saveSettings('logrotate')">
        <div :class="['form-group', errors.Times.hasError ? 'has-error' : '']">
          <label class="col-sm-2 control-label" for="textInput-modal-markup">{{$t('settings.log_times')}}</label>
          <div class="col-sm-5">
            <input required type="number" v-model="settings.logrotate.Times" class="form-control">
            <span v-if="errors.Times.hasError" class="help-block">{{$t('validation.validation_failed')}}: {{$t('validation.'+errors.Times.message)}}</span>
          </div>
        </div>

          <div :class="['form-group', errors.Rotate.hasError ? 'has-error' : '']">
            <label class="col-sm-2 control-label" for="textInput-modal-markup">{{$t('settings.log_rotate')}}</label>
            <div class="col-sm-5">
              <select required type="text" v-model="settings.logrotate.Rotate" class="combobox form-control">
                            <option value="daily">{{$t('settings.rotation_daily')}}</option>
                            <option value="weekly">{{$t('settings.rotation_weekly')}}</option>
                            <option value="monthly">{{$t('settings.rotation_monthly')}}</option>
              </select>
              <span v-if="errors.Rotate.hasError" class="help-block">{{$t('validation.validation_failed')}}: {{$t('validation.'+errors.Rotate.message)}}</span>
            </div>
          </div>

          <div :class="['form-group', errors.Compression.hasError ? 'has-error' : '']">
            <label class="col-sm-2 control-label" for="textInput-modal-markup">{{$t('settings.log_compression')}}</label>
            <div class="col-sm-5">
              <input type="checkbox" :value="settings.logrotate.Compression == 'enabled'" v-model="settings.logrotate.Compression"
                class="form-control">
              <span v-if="errors.Compression.hasError" class="help-block">{{$t('validation.validation_failed')}}: {{$t('validation.'+errors.Compression.message)}}</span>
            </div>
          </div>


        <div class="form-group">
          <label class="col-sm-2 control-label" for="textInput-modal-markup">
            <div v-if="loaders.logrotate" class="spinner spinner-sm form-spinner-loader adjust-top-loader"></div>
          </label>
          <div class="col-sm-5">
            <button class="btn btn-primary" type="submit">{{$t('save')}}</button>
          </div>
        </div>
      </form>

      <div v-if="view.isRoot" class="divider"></div>
      <h3 v-if="view.isRoot">{{$t('settings.hints')}}</h3>
      <form v-if="view.isRoot" class="form-horizontal" v-on:submit.prevent="saveSettings('hints')">
        <div :class="['form-group', errors.ShowHints.hasError ? 'has-error' : '']">
          <label class="col-sm-2 control-label" for="textInput-modal-markup">{{$t('settings.show_hints')}}</label>
          <div class="col-sm-5">
            <toggle-button class="min-toggle" :width="40" :height="20" :color="{checked: '#0088ce', unchecked: '#bbbbbb'}"
              :value="settings.cockpit.ShowHints" :sync="true" @change="toggleSettingsHints()" />
            <span v-if="errors.ShowHints.hasError" class="help-block">{{$t('validation.validation_failed')}}:
              {{$t('validation.'+errors.ShowHints.message)}}</span>
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
  mounted() {
    this.initGraphics();
    this.getSettings();
    this.getHints();
  },
  data() {
    return {
      view: {
        isLoaded: false,
        isRoot: false
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
        },
        logrotate: {
          Times: 4,
          Rotate: "weekly",
          Compression: "disabled"
        }
      },
      loaders: {
        password: false,
        smarthost: false,
        root: false,
        cockpit: false,
        hints: false,
        logrotate: false
      },
      errors: this.initErrors(),
      newUser: {
        newPassword: "",
        oldPassword: "",
        confirmNewPassword: "",
        passwordStrength: false,
        togglePass: false,
        canChangePassword: false
      }
    };
  },
  methods: {
    initGraphics() {
      $("#app").css("background", "");
      $("#app").css("color", "");
    },
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
        newPassword: {
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
        },
        Times: {
          hasError: false,
          message: ""
        },
        Compression: {
          hasError: false,
          message: ""
        },
        Rotate: {
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
    },
    getSettings() {
      var context = this;

      context.view.isLoaded = false;
      context.exec(
        ["system-settings/read"],
        {
          action: "settings"
        },
        null,
        function(success) {
          try {
            success = JSON.parse(success);
          } catch (e) {
            console.error(e);
          }
          context.settings = success.configuration;

          context.view.isRoot = success.status.isRoot == 1;
          context.newUser.canChangePassword =
            success.status.canChangePassword == 1;

          if (context.view.isRoot) {
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
            context.settings.root.EmailAddress =
              emails.length == 0 ? [{}] : emails;

            //smarthost
            context.settings.smarthost.SmartHostStatus =
              context.settings.smarthost.SmartHostStatus == "enabled";
            context.settings.smarthost.SmartHostTlsStatus =
              context.settings.smarthost.SmartHostTlsStatus == "enabled";

            //logrotate
            context.settings.logrotate.Compression =
              context.settings.logrotate.Compression == "enabled";

            // cockpit
            context.settings.cockpit.access =
              context.settings.cockpit.access.indexOf("red") != -1;
            context.settings.cockpit.LimitAccess = context.settings.cockpit.LimitAccess.split(
              ","
            ).join("\n");
            context.settings.cockpit.ShowHints =
              context.settings.cockpit.ShowHints == "enabled";
          }

          context.getHints(function() {
            context.$parent.hints.settings.count = context.hints.count;
          });
          context.view.isLoaded = true;
        },
        function(error) {
          console.error(error);
        },
        false
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
      var endpoint = "settings";

      switch (type) {
        case "password":
          settingsObj = {
            action: "password",
            confirmNewPassword: this.newUser.confirmNewPassword,
            newPassword: this.newUser.newPassword,
            currentPassword: this.newUser.oldPassword
          };
          endpoint = "password";
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

        case "logrotate":
          settingsObj = {
            action: "logrotate",
            Rotate: context.settings.logrotate.Rotate,
            Times: context.settings.logrotate.Times,
            Compression: context.settings.logrotate.Compression
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
      context.errors = context.initErrors();
      context.exec(
        ["system-" + endpoint + "/validate"],
        settingsObj,
        null,
        function(success) {
          context.loaders[type] = false;

          // update values
          context.exec(
            ["system-" + endpoint + "/update"],
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
          var errorData = {};
          context.loaders[type] = false;
          context.errors = context.initErrors();

          try {
            errorData = JSON.parse(data);
            for (var e in errorData.attributes) {
              var attr = errorData.attributes[e];
              context.errors[attr.parameter].hasError = true;
              context.errors[attr.parameter].message = attr.error;
            }
          } catch (e) {
            console.error(e);
          }
        },
        false
      );
    }
  }
};
</script>

<style>
</style>
