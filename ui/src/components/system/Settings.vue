<template>
  <div>
    <!-- password change notification error -->
    <div
      v-if="showChangePasswordError"
      :style="{ top: 10+'px', minWidth: 390+'px', right: 10+'px', zIndex: 5, position: 'fixed' }"
      class="toast-pf toast-pf-max-width toast-pf-top-right alert alert-danger alert-dismissable"
    >
      <button type="button" class="close" @click="closeChangePasswordError()" aria-hidden="true">
        <span class="fa fa-times"></span>
      </button>
      <span style="padding-top: 20px;" class="pficon fa fa-times"></span>
      <strong>{{$t('error')}}</strong>
      <p>
        {{$t('settings.password_updated_error_1')}}
        <strong>{{$t('settings.password_updated_error_2')}}</strong>
        {{$t('settings.password_updated_error_3')}}
      </p>
    </div>

    <div v-show="accessUserSettings && loggedUser">
      <h3 class="logged-user right">{{ loggedUser.full_name }}</h3>
      <button
        tabindex="-1"
        @click="logout()"
        type="button"
        class="btn btn-danger logout-button"
      >{{$t('settings.logout')}}</button>
    </div>
    <h2>{{ $t('settings.title') }}</h2>
    <div v-if="!view.isLoaded" class="spinner spinner-lg"></div>
    <div v-if="view.isLoaded">
      <div v-if="hints.count > 0 && view.isAdmin && !accessUserSettings" class="alert alert-warning alert-dismissable clear">
        <span class="pficon pficon-warning-triangle-o"></span>
        <strong>{{$t('hints_suggested')}}:</strong>
        <li v-for="(m,t) in hints.details" v-bind:key="t">
          <strong>{{$t('hints.'+t)}}</strong>
          : {{$t('hints.'+m)}}
        </li>
        <span
          v-if="hints.message && hints.message.length > 0"
        >{{hints.message && $t('hints.'+hints.message)}}</span>
      </div>

      <div  class="divider clear"></div>
      <h3>{{$t('settings.password')}}</h3>
      <div v-if="!newUser.canChangePassword" class="alert alert-info alert-dismissable">
        <span class="pficon pficon-info"></span>
        <strong>{{$t('settings.cannot_change_password')}}.</strong>
        {{$t('settings.remote_account_provider_password')}}.
      </div>
      <form class="form-horizontal" v-on:submit.prevent="saveSettings('password')">
        <div v-if="!view.isRoot" class="form-group">
          <label
            class="col-sm-2 control-label"
            for="textInput-modal-markup"
          >{{$t('settings.old_password')}}</label>
          <div class="col-sm-5">
            <input
              tabindex="0"
              :disabled="!newUser.canChangePassword"
              required
              :type="newUser.togglePass ? 'text' : 'password'"
              v-model="newUser.oldPassword"
              class="form-control"
            >
          </div>
          <div class="col-sm-2">
            <button
              tabindex="-1"
              @click="togglePass()"
              type="button"
              class="btn btn-primary adjust-top-min"
            >
              <span :class="[!newUser.togglePass ? 'fa fa-eye' : 'fa fa-eye-slash']"></span>
            </button>
          </div>
        </div>
        <div :class="['form-group', errors.newPassword.hasError ? 'has-error' : '']">
          <label
            class="col-sm-2 control-label"
            for="textInput-modal-markup"
          >{{$t('settings.new_password')}}</label>
          <div class="col-sm-5">
            <input
              tabindex="0"
              :disabled="!newUser.canChangePassword"
              required
              :type="newUser.togglePass ? 'text' : 'password'"
              v-model="newUser.newPassword"
              class="form-control"
            >
            <span v-if="errors.newPassword.hasError" class="help-block">
              {{$t('validation.validation_failed')}}:
              {{$t('validation.'+errors.newPassword.message)}}
            </span>
          </div>
          <div v-show="view.isRoot" class="col-sm-2 adjust-index">
            <button tabindex="-1" @click="togglePass()" type="button" class="btn btn-primary">
              <span :class="[!newUser.togglePass ? 'fa fa-eye' : 'fa fa-eye-slash']"></span>
            </button>
          </div>
        </div>
        <div class="form-group mg-top-20">
          <label
            class="col-sm-2 control-label"
            for="textInput-modal-markup"
          >{{$t('settings.confirm_new_password')}}</label>
          <div class="col-sm-5">
            <password-meter></password-meter>
          </div>
        </div>
        <div class="form-group">
          <label class="col-sm-2 control-label" for="textInput-modal-markup">
            <div
              v-if="loaders.password"
              class="spinner spinner-sm form-spinner-loader adjust-top-loader"
            ></div>
          </label>
          <div class="col-sm-5">
            <button
              :disabled="!newUser.passwordStrength || !newUser.canChangePassword"
              class="btn btn-primary"
              type="submit"
            >{{$t('save')}}</button>
          </div>
        </div>
      </form>
      <div  class="divider"></div>
      <h3 >{{$t('settings.otp')}}</h3>
      <form class="form-horizontal" v-on:submit.prevent="saveSettings('otp')">
        <div :class="['form-group', errors.otp.hasError ? 'has-error' : '']">
          <label
            class="col-sm-2 control-label"
            for="textInput-modal-markup"
          >{{$t('settings.otp_enable',{name: this.otp.username})}}
          <doc-info
            :placement="'top'"
            :title="$t('settings.otp_enable',{name: this.otp.username})"
            :chapter="'otp_enable'"
            :inline="true"
          ></doc-info>
          </label>
          <div class="col-sm-5">
            <toggle-button
              class="min-toggle"
              :width="40"
              :height="20"
              :color="{checked: '#0088ce', unchecked: '#bbbbbb'}"
              :value="otp.OtpStatus"
              :sync="true"
              @change="toggleSettingsOtp()"
            />
            <span v-if="errors.otp.hasError" class="help-block">
              {{$t('validation.validation_failed')}}:
              {{$t('validation.'+errors.otp.message)}}
            </span>
          </div>
        </div>
        <legend  v-if="view.otpIsLoaded && otp.OtpStatus" class="fields-section-header-pf" aria-expanded="true">
          <span
            :class="['fa fa-angle-right field-section-toggle-pf', otp.secrety ? 'fa-angle-down' : '']"
          ></span>
          <a
            class="field-section-toggle-pf"
            @click="toggleOtpSecretyMode()"
            >{{$t('settings.otp_toggle_secrety_mode')}}
          </a>
        </legend>
        <div  v-if="view.otpIsLoaded && otp.OtpStatus && otp.secrety">
          <div >
            <label
              >{{$t('settings.otp_Step1_Download_FreeOTP')}}
            </label>
          </div>
          <div >
              <label
                >{{$t('settings.otp_Step2_scan_with_FreeOTP')}}
              </label>
          </div>
        </div>
        <div v-if="view.otpIsLoaded && otp.OtpStatus && otp.secrety" class="form-group row" >
          <label
            class="col-sm-2 control-label"
            for="textInput-modal-markup"
            >{{$t('settings.otp_Scan_QRcode')}}
            <doc-info
              :placement="'top'"
              :title="$t('settings.otp_Scan_QRcode')"
              :chapter="'otp_Scan_QRcode'"
              :inline="true"
            ></doc-info>
          </label>
          <div class="col-sm-2" >
            <qrcode-vue :value="otp.Token" :size="otp.size" level="H"></qrcode-vue>
          </div>
          <div v-if="view.otpIsLoaded && otp.OtpStatus && otp.secrety">
              <label
                class="col-sm-2 control-label"
                for="textInput-modal-markup"
                >{{$t('settings.otp_code_for_single_use')}}
                <doc-info
                  :placement="'top'"
                  :title="$t('settings.otp_code_for_single_use')"
                  :chapter="'otp_code_for_single_use'"
                  :inline="true"
                ></doc-info>
              </label>
              <div class="col-sm-2">
                <div v-for="c in otp.Code">
                  <span  >{{ c }}</span>
                  <br />
                </div>
              </div>
          </div>
        </div>
        <div  v-if="view.otpIsLoaded && otp.OtpStatus && otp.secrety">
          <div >
            <label
              >{{$t('settings.otp_Step3_Validate_the_X-digit_code')}}
            </label>
          </div>
        </div>
        <div  v-if="view.otpIsLoaded && otp.OtpStatus && otp.secrety"
          :class="['form-group', otp.TokenValidationError ? 'has-error' : '']"
        >
          <label class="col-sm-2 control-label" for="textInput-modal-markup">
            {{$t('settings.validate_the_QRcode_token')}}
          </label>
          <form v-on:submit.prevent="testToken(otp.TokenValidation)">
            <div class="col-sm-3">
              <input 
                type="number" min="0" max="999999" placeholder="000000" 
                v-model="otp.TokenValidation" class="form-control noArrows" 
              />
              <span v-if="otp.TokenValidationError && otp.testTokenDone" class="help-block">
                {{$t('validation.validation_failed')}}:
                {{$t('validation.TokenValidationError')}}
              </span>
              <span v-if="otp.TokenIsValid && otp.testTokenDone" >
                {{$t('validation.TokenValidationOK')}}
                <span class="fa fa-check green copy-ok"></span>
              </span>
            </div>
            <div class="col-sm-2">
              <button class="btn btn-default" type="submit">{{$t('settings.test_token')}}</button>
            </div>
          </form>
        </div>
        <h4 v-if="view.otpIsLoaded && otp.OtpStatus" >{{$t('settings.Applications')}}</h4>
        <div
          v-if="view.otpIsLoaded && otp.OtpStatus"
          :class="['form-group', errors.OtpCockpit.hasError ? 'has-error' : '']"
        >
          <label
            class="col-sm-2 control-label"
            for="textInput-modal-markup"
          >{{$t('settings.OtpCockpit_status')}}</label>
          <div class="col-sm-5">
            <input
              type="checkbox"
              true-value="enabled"
              false-value="disabled"
              id="OtpCockpit"
              v-model="otp.OtpCockpit"
              class="form-control"
            >
            <span
              v-if="errors.OtpCockpit.hasError"
              class="help-block"
            >{{errors.OtpCockpit.message}}</span>
          </div>
        </div>
        <div
          v-if="view.otpIsLoaded && otp.OtpStatus"
          :class="['form-group', errors.OtpSshd.hasError ? 'has-error' : '']"
        >
          <label
            class="col-sm-2 control-label"
            for="textInput-modal-markup"
          >{{$t('settings.OtpSshd_status')}}
          <doc-info
            :placement="'top'"
            :title="$t('settings.OtpSshd_status')"
            :chapter="'OtpSshd_Only_Password_Auth'"
            :inline="true"
          ></doc-info>
          </label>
          <div class="col-sm-5">
            <input
              type="checkbox"
              true-value="enabled"
              false-value="disabled"
              id="OtpSshd"
              v-model="otp.OtpSshd"
              class="form-control"
            >
            <span
              v-if="errors.OtpSshd.hasError"
              class="help-block"
            >{{errors.OtpSshd.message}}</span>
          </div>
        </div>
        <div
          v-if="view.otpIsLoaded && otp.OtpStatus && otp.OtpR2WOath"
          class="form-group"
        >
          <label
            class="col-sm-2 control-label"
            for="textInput-modal-markup"
          >{{$t('settings.OtpR2WOath_status')}}
          <doc-info
            :placement="'top'"
            :title="$t('settings.OtpR2WOath_status')"
            :chapter="'OtpR2WOath_Auth'"
            :inline="true"
          ></doc-info>
          </label>
          <div class="col-sm-5">
            <input
              type="checkbox"
              id="OtpR2WOath"
              v-model="otp.OtpR2WOath"
              class="form-control"
              disabled
            >
          </div>
        </div>
        <div class="form-group">
          <label class="col-sm-2 control-label" for="textInput-modal-markup">
            <div
              v-if="loaders.otp"
              class="spinner spinner-sm form-spinner-loader adjust-top-loader"
            ></div>
          </label>
          <div class="col-sm-2">
            <button :disabled="!otp.TokenIsValid && otp.OtpStatus" class="btn btn-primary" type="submit">{{$t('save')}}</button>
          </div>
        </div>
      </form>

      <div v-if="view.isAdmin && !accessUserSettings" class="divider"></div>
      <h3 v-if="view.isAdmin && !accessUserSettings">{{$t('settings.smart_host')}}</h3>
      <form
        v-if="view.isAdmin && !accessUserSettings"
        class="form-horizontal"
        v-on:submit.prevent="saveSettings('smarthost')"
      >
        <div :class="['form-group', errors.SmartHostStatus.hasError ? 'has-error' : '']">
          <label
            class="col-sm-2 control-label"
            for="textInput-modal-markup"
          >{{$t('settings.use_smarthost')}}</label>
          <div class="col-sm-5">
            <toggle-button
              class="min-toggle"
              :width="40"
              :height="20"
              :color="{checked: '#0088ce', unchecked: '#bbbbbb'}"
              :value="settings.smarthost.SmartHostStatus"
              :sync="true"
              @change="toggleSettingsSmartHost()"
            />
            <span
              v-if="errors.SmartHostStatus.hasError"
              class="help-block"
            >{{errors.SmartHostStatus.message}}</span>
          </div>
        </div>
        <div
          v-if="settings.smarthost.SmartHostStatus"
          :class="['form-group', errors.SmartHostName.hasError ? 'has-error' : '']"
        >
          <label
            class="col-sm-2 control-label"
            for="textInput-modal-markup"
          >{{$t('settings.smarthost_hostname')}}</label>
          <div class="col-sm-5">
            <input
              :required="settings.smarthost.SmartHostStatus"
              type="text"
              v-model="settings.smarthost.SmartHostName"
              class="form-control"
            >
            <span
              v-if="errors.SmartHostName.hasError"
              class="help-block"
            >{{$t('validation.validation_failed')}}: {{$t('validation.'+errors.SmartHostName.message)}}</span>
          </div>
        </div>
        <div
          v-if="settings.smarthost.SmartHostStatus"
          :class="['form-group', errors.SmartHostPort.hasError ? 'has-error' : '']"
        >
          <label
            class="col-sm-2 control-label"
            for="textInput-modal-markup"
          >{{$t('settings.smarthost_port')}}</label>
          <div class="col-sm-5">
            <input
              :required="settings.smarthost.SmartHostStatus"
              type="number"
              min="0"
              v-model="settings.smarthost.SmartHostPort"
              class="form-control"
            >
            <span
              v-if="errors.SmartHostPort.hasError"
              class="help-block"
            >{{errors.SmartHostPort.message}}</span>
          </div>
        </div>
        <div
          v-if="settings.smarthost.SmartHostStatus"
          :class="['form-group', errors.SmartHostUsername.hasError ? 'has-error' : '']"
        >
          <label
            class="col-sm-2 control-label"
            for="textInput-modal-markup"
          >{{$t('settings.smarthost_username')}}</label>
          <div class="col-sm-5">
            <input
              type="text"
              v-model="settings.smarthost.SmartHostUsername"
              class="form-control"
            >
            <span
              v-if="errors.SmartHostUsername.hasError"
              class="help-block"
            >{{errors.SmartHostUsername.message}}</span>
          </div>
        </div>
        <div
          v-if="settings.smarthost.SmartHostStatus"
          :class="['form-group', errors.SmartHostPassword.hasError ? 'has-error' : '']"
        >
          <label
            class="col-sm-2 control-label"
            for="textInput-modal-markup"
          >{{$t('settings.smarthost_password')}}</label>
          <div class="col-sm-3">
            <input
              :type="togglePass ? 'password' : 'text'"
              v-model="settings.smarthost.SmartHostPassword"
              class="form-control"
            >
            <span
              v-if="errors.SmartHostPassword.hasError"
              class="help-block"
            >{{errors.SmartHostPassword.message}}</span>
          </div>
          <div class="col-sm-2">
            <button class="btn btn-primary" type="button" @click="togglePassHidden()">
              <span :class="['fa', togglePass ? 'fa-eye-slash' : 'fa-eye']"></span>
            </button>
          </div>
        </div>
        <div
          v-if="settings.smarthost.SmartHostStatus"
          :class="['form-group', errors.SmartHostTlsStatus.hasError ? 'has-error' : '']"
        >
          <label
            class="col-sm-2 control-label"
            for="SmartHostTlsStatus"
          >{{$t('settings.smarthost_encrypt')}}
          <doc-info
            :placement="'top'"
            :title="$t('settings.smarthost_encrypt')"
            :chapter="'smarthost_encrypt'"
            :inline="true"
          ></doc-info>
          </label>
          <div class="col-sm-5">
            <input
              type="checkbox"
              id="SmartHostTlsStatus"
              v-model="settings.smarthost.SmartHostTlsStatus"
              class="form-control"
            >
            <span
              v-if="errors.SmartHostTlsStatus.hasError"
              class="help-block"
            >{{errors.SmartHostTlsStatus.message}}</span>
          </div>
        </div>
        <div v-if="settings.smarthost.SmartHostStatus" class="form-group">
          <form v-on:submit.prevent="testSmarthost()">
            <label
                class="col-sm-2 control-label"
                for="textInput-modal-markup"
                >{{$t('settings.smarthost_test_configuration')}}
            </label>
            <div class="col-sm-5">
              <button class="btn btn-primary" type="submit">{{$t('settings.smarthost_send_an_email')}}</button>
              <div v-if="!view.authentication && view.isWaitingAuth" class="spinner spinner-sm form-spinner"></div>
              <span v-if="view.authentication && view.credential && !view.isWaitingAuth" class="fa fa-check green check-ok"></span>
              <span v-if="view.authentication && !view.credential && !view.isWaitingAuth" class="fa fa-remove red check-ok"></span>
            </div>
          </form>
        </div>
        <div class="form-group">
          <label class="col-sm-2 control-label" for="textInput-modal-markup">
            <div
              v-if="loaders.smarthost"
              class="spinner spinner-sm form-spinner-loader adjust-top-loader"
            ></div>
          </label>
          <div class="col-sm-5">
            <button :disabled="!view.credential" class="btn btn-primary" type="submit">{{$t('save')}}</button>
          </div>
        </div>
      </form>

      <div v-if="view.isAdmin && !accessUserSettings" class="divider"></div>
      <h3 v-if="view.isAdmin && !accessUserSettings">{{$t('settings.notifications')}}</h3>
      <form
        v-if="view.isAdmin && !accessUserSettings"
        class="form-horizontal"
        v-on:submit.prevent="saveSettings('root')"
      >
        <div :class="['form-group', errors.SenderAddress.hasError ? 'has-error' : '']">
          <label
            class="col-sm-2 control-label"
            for="textInput-modal-markup"
          >{{$t('settings.notify_from')}}</label>
          <div class="col-sm-5">
            <input required type="email" v-model="settings.root.SenderAddress" class="form-control">
            <span v-if="errors.SenderAddress.hasError" class="help-block">
              {{$t('validation.validation_failed')}}:
              {{$t('validation.'+errors.SenderAddress.message)}}
            </span>
          </div>
        </div>
        <div
          v-for="(a, i) in settings.root.EmailAddress"
          v-bind:key="i"
          :class="['form-group', errors.EmailAddress.hasError ? 'has-error' : '']"
        >
          <label class="col-sm-2 control-label" for="textInput-modal-markup">
            {{i == 0 ?
            $t('settings.notify_to') : ''}}
          </label>
          <form v-on:submit.prevent="testMail(a)">
            <div class="col-sm-3">
              <input type="email" v-model="a.email" class="form-control" />
              <span v-if="errors.EmailAddress.hasError" class="help-block">
                {{$t('validation.validation_failed')}}:
                {{$t('validation.'+errors.EmailAddress.message)}}
              </span>
            </div>
            <div class="col-sm-2">
              <button class="btn btn-default" type="submit">{{$t('settings.test_mail')}}</button>
            </div>
          </form>
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
              <span class="fa fa-plus card-icon-def"></span>
              {{$t('settings.add_email')}}
            </button>
          </div>
        </div>
        <div class="form-group">
          <label class="col-sm-2 control-label" for="textInput-modal-markup">
            <div
              v-if="loaders.root"
              class="spinner spinner-sm form-spinner-loader adjust-top-loader"
            ></div>
          </label>
          <div class="col-sm-5">
            <button class="btn btn-primary" type="submit">{{$t('save')}}</button>
          </div>
        </div>
      </form>

      <div v-if="view.isAdmin && !accessUserSettings" class="divider"></div>
      <h3 v-if="view.isAdmin && !accessUserSettings">{{$t('settings.web_shell')}}</h3>
      <form
        v-if="view.isAdmin && !accessUserSettings"
        class="form-horizontal"
        v-on:submit.prevent="saveSettings('cockpit')"
      >
        <div :class="['form-group', errors.access.hasError ? 'has-error' : '']">
          <label class="col-sm-2 control-label" for="textInput-modal-markup">
            {{$t('settings.limit_access')}}
            <doc-info
              :placement="'top'"
              :title="$t('docs.limit_access')"
              :chapter="'limit_access'"
              :inline="true"
            ></doc-info>
          </label>
          <div class="col-sm-5">
            <toggle-button
              class="min-toggle"
              :width="40"
              :height="20"
              :color="{checked: '#0088ce', unchecked: '#bbbbbb'}"
              :value="settings.cockpit.access"
              :sync="true"
              @change="toggleSettingsLimitAccess()"
            />
            <span v-if="errors.access.hasError" class="help-block">
              {{$t('validation.validation_failed')}}:
              {{$t('validation.'+errors.access.message)}}
            </span>
          </div>
        </div>
        <div
          v-if="settings.cockpit.access"
          :class="['form-group', errors.LimitAccess.hasError ? 'has-error' : '']"
        >
          <label
            class="col-sm-2 control-label"
            for="textInput-modal-markup"
          >{{$t('settings.allow_only')}}</label>
          <div class="col-sm-5">
            <textarea v-model="settings.cockpit.LimitAccess" class="form-control"></textarea>
            <span v-if="errors.LimitAccess.hasError" class="help-block">
              {{$t('validation.validation_failed')}}:
              {{$t('validation.'+errors.LimitAccess.message)}}
            </span>
          </div>
        </div>
        <div class="form-group">
          <label class="col-sm-2 control-label" for="textInput-modal-markup">
            <div
              v-if="loaders.cockpit"
              class="spinner spinner-sm form-spinner-loader adjust-top-loader"
            ></div>
          </label>
          <div class="col-sm-5">
            <button class="btn btn-primary" type="submit">{{$t('save')}}</button>
          </div>
        </div>
      </form>

      <div v-if="view.isAdmin && !accessUserSettings" class="divider"></div>
      <h3 v-if="view.isAdmin && !accessUserSettings">{{$t('settings.logrotate')}}</h3>
      <form
        v-if="view.isAdmin && !accessUserSettings"
        class="form-horizontal"
        v-on:submit.prevent="saveSettings('logrotate')"
      >
        <div :class="['form-group', errors.Rotate.hasError ? 'has-error' : '']">
          <label
            class="col-sm-2 control-label"
            for="textInput-modal-markup"
          >{{$t('settings.log_rotate')}}</label>
          <div class="col-sm-5">
            <select
              required
              type="text"
              v-model="settings.logrotate.Rotate"
              class="combobox form-control"
            >
              <option value="daily">{{$t('settings.rotation_daily')}}</option>
              <option value="weekly">{{$t('settings.rotation_weekly')}}</option>
              <option value="monthly">{{$t('settings.rotation_monthly')}}</option>
            </select>
            <span v-if="errors.Rotate.hasError" class="help-block">
              {{$t('validation.validation_failed')}}:
              {{$t('validation.'+errors.Rotate.message)}}
            </span>
          </div>
        </div>

        <div :class="['form-group', errors.Times.hasError ? 'has-error' : '']">
          <label
            class="col-sm-2 control-label"
            for="textInput-modal-markup"
          >{{$t('settings.log_times')}}</label>
          <div class="col-sm-5">
            <input required type="number" v-model="settings.logrotate.Times" class="form-control">
            <span v-if="errors.Times.hasError" class="help-block">
              {{$t('validation.validation_failed')}}:
              {{$t('validation.'+errors.Times.message)}}
            </span>
          </div>
        </div>

        <div :class="['form-group', errors.Compression.hasError ? 'has-error' : '']">
          <label class="col-sm-2 control-label" for="Compression">{{$t('settings.log_compression')}}</label>
          <div class="col-sm-5">
            <input
              type="checkbox"
              id="Compression"
              :value="settings.logrotate.Compression == 'enabled'"
              v-model="settings.logrotate.Compression"
              class="form-control"
            >
            <span v-if="errors.Compression.hasError" class="help-block">
              {{$t('validation.validation_failed')}}:
              {{$t('validation.'+errors.Compression.message)}}
            </span>
          </div>
        </div>

        <div class="form-group">
          <label class="col-sm-2 control-label" for="textInput-modal-markup">
            <div
              v-if="loaders.logrotate"
              class="spinner spinner-sm form-spinner-loader adjust-top-loader"
            ></div>
          </label>
          <div class="col-sm-5">
            <button class="btn btn-primary" type="submit">{{$t('save')}}</button>
          </div>
        </div>
      </form>

      <div v-if="view.isAdmin && !accessUserSettings" class="divider"></div>
      <h3 v-if="view.isAdmin && !accessUserSettings">{{$t('settings.hints')}}</h3>
      <form v-if="view.isAdmin && !accessUserSettings" class="form-horizontal" v-on:submit.prevent="saveSettings('hints')">
        <div :class="['form-group', errors.ShowHints.hasError ? 'has-error' : '']">
          <label
            class="col-sm-2 control-label"
            for="textInput-modal-markup"
          >{{$t('settings.show_hints')}}</label>
          <div class="col-sm-5">
            <toggle-button
              class="min-toggle"
              :width="40"
              :height="20"
              :color="{checked: '#0088ce', unchecked: '#bbbbbb'}"
              :value="settings.cockpit.ShowHints"
              :sync="true"
              @change="toggleSettingsHints()"
            />
            <span v-if="errors.ShowHints.hasError" class="help-block">
              {{$t('validation.validation_failed')}}:
              {{$t('validation.'+errors.ShowHints.message)}}
            </span>
          </div>
        </div>
        <div class="form-group">
          <label class="col-sm-2 control-label" for="textInput-modal-markup">
            <div
              v-if="loaders.hints"
              class="spinner spinner-sm form-spinner-loader adjust-top-loader"
            ></div>
          </label>
          <div class="col-sm-5">
            <button class="btn btn-primary" type="submit">{{$t('save')}}</button>
          </div>
        </div>
      </form>

      <div v-if="view.isAdmin && !accessUserSettings" class="divider"></div>
      <h3 v-if="view.isAdmin && !accessUserSettings">{{$t('settings.shellPolicy')}}</h3>
      <form
        v-if="view.isAdmin && !accessUserSettings"
        class="form-horizontal"
        v-on:submit.prevent="saveSettings('shellPolicy')"
      >
        <div :class="['form-group', errors.shellPolicy.hasError ? 'has-error' : '']">
          <label
            class="col-sm-2 control-label"
            for="textInput-modal-markup"
          >
          {{$t('settings.force_the_shell')}}
          <doc-info
            :placement="'top'"
            :title="$t('settings.force_the_shell')"
            :chapter="'shell_bash_needed'"
            :inline="true"
          ></doc-info>
          </label>
          <div class="col-sm-5">
            <toggle-button
              class="min-toggle"
              :width="40"
              :height="20"
              :color="{checked: '#0088ce', unchecked: '#bbbbbb'}"
              :value="settings.shellPolicy"
              :sync="true"
              @change="toggleSettingsShellPolicy()"
            />
            <span v-if="errors.shellPolicy.hasError" class="help-block">
              {{$t('validation.validation_failed')}}:
              {{$t('validation.'+errors.shellPolicy.message)}}
            </span>
          </div>
        </div>
        <div class="form-group">
          <label class="col-sm-2 control-label" for="textInput-modal-markup">
            <div
              v-if="loaders.shellPolicy"
              class="spinner spinner-sm form-spinner-loader adjust-top-loader"
            ></div>
          </label>
          <div class="col-sm-5">
            <button class="btn btn-primary" type="submit">{{$t('save')}}</button>
          </div>
        </div>
      </form>

      <!-- user settings page on port 443 -->
      <div v-if="view.isAdmin && !accessUserSettings" class="divider"></div>
      <h3 v-if="view.isAdmin && !accessUserSettings">{{$t('settings.user_settings_page')}}</h3>
      <!-- user settings page URLs -->
      <div v-if="view.isAdmin && !accessUserSettings" class="alert alert-info">
        <span class="pficon pficon-info"></span>
        <span>{{ $t('settings.user_settings_can_be_accessed_by_these_urls') }}:</span>
        <li v-for="url in settings.userSettingsPage.urls">
          <a :href="url" target="_blank">{{ url }}</a>
        </li>
        <span>{{ $t('settings.user_settings_page_urls_explain') }}</span>
      </div>
      <form
        v-if="view.isAdmin && !accessUserSettings"
        class="form-horizontal"
        v-on:submit.prevent="openSaveUserSettingsPageModal()"
      >
        <!-- user settings page access -->
        <div :class="['form-group', errors.userSettingsPageAccess.hasError ? 'has-error' : '']">
          <label class="col-sm-2 control-label">
            {{$t('settings.enable_user_settings_page')}}
            <doc-info
              :placement="'top'"
              :chapter="'user_settings_page'"
              :inline="true"
            ></doc-info>
          </label>
          <div class="col-sm-5">
            <span
              data-toggle="tooltip"
              data-placement="right"
              :title="$t('settings.activate') + ' \'' + $t('settings.force_the_shell') + '\' ' + $t('settings.to_enable')"
            >
              <toggle-button
                class="min-toggle"
                :width="40"
                :height="20"
                :color="{checked: '#0088ce', unchecked: '#bbbbbb'}"
                :value="settings.userSettingsPage.access"
                :sync="true"
                :disabled="!settings.shellPolicy"
                @change="toggleUserSettingsPageAccess()"
              />
            </span>
            <span v-if="errors.userSettingsPageAccess.hasError" class="help-block">
              {{$t('validation.validation_failed')}}:
              {{$t('validation.'+errors.userSettingsPageAccess.message)}}
            </span>
          </div>
        </div>
        <!-- user settings page trusted networks access -->
        <div
          v-if="settings.userSettingsPage.access"
          :class="['form-group', errors.userSettingsPageTrustedNetworksAccess.hasError ? 'has-error' : '']">
          <label class="col-sm-2 control-label">
            {{$t('settings.grant_only_trusted_networks')}}
          </label>
          <div class="col-sm-5">
            <span
              data-toggle="tooltip"
              data-placement="right"
              :title="$t('settings.activate') + ' \'' + $t('settings.force_the_shell') + '\' ' + $t('settings.to_enable')"
            >
              <toggle-button
                class="min-toggle"
                :width="40"
                :height="20"
                :color="{checked: '#0088ce', unchecked: '#bbbbbb'}"
                :value="settings.userSettingsPage.trustedNetworksAccess"
                :sync="true"
                :disabled="!settings.shellPolicy"
                @change="toggleUserSettingsPageTrustedNetworksAccess()"
              />
            </span>
            <span v-if="errors.userSettingsPageTrustedNetworksAccess.hasError" class="help-block">
              {{$t('validation.validation_failed')}}:
              {{$t('validation.'+errors.userSettingsPageTrustedNetworksAccess.message)}}
            </span>
          </div>
        </div>
        <!-- user settings page save -->
        <div class="form-group">
          <label class="col-sm-2 control-label">
            <div
              v-if="loaders.userSettingsPage"
              class="spinner spinner-sm form-spinner-loader adjust-top-loader"
            ></div>
          </label>
          <div class="col-sm-5">
            <button
              class="btn btn-primary"
              type="submit"
              :disabled="!settings.shellPolicy"
            >{{$t('save')}}</button>
          </div>
        </div>
      </form>

      <!-- save user settings page modal -->
      <div
        class="modal"
        id="saveUserSettingsPageModal"
        tabindex="-1"
        role="dialog"
        data-backdrop="static"
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h4
                class="modal-title"
              >{{$t('settings.save_user_settings_page_configuration')}}</h4>
            </div>
            <form class="form-horizontal" v-on:submit.prevent="confirmSaveUserSettingsPageModal()">
              <div class="modal-body">
                <div class="alert alert-warning">
                  <span class="pficon pficon-warning-triangle-o"></span>
                  <span>
                    <strong>{{$t('warning')}}:</strong>
                    {{$t('settings.cockpit_will_be_restared')}}
                  </span>
                </div>
                <label>{{$t('are_you_sure')}}?</label>
              </div>
              <div class="modal-footer">
                <button class="btn btn-default" type="button" data-dismiss="modal">{{$t('cancel')}}</button>
                <button class="btn btn-primary" type="submit">{{$t('save')}}</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PasswordMeter from "../../directives/PasswordMeter.vue";
import QrcodeVue from 'qrcode.vue'
import { authenticator } from 'otplib';


export default {
  name: "Settings",
  components: {
    PasswordMeter,
    QrcodeVue
  },
  mounted() {
    this.initGraphics();
    this.getLoggedUser();
    this.getSettings();
    this.getHints();
    this.getAuthorizations();
  },
  data() {
    return {
      togglePass: true,
      view: {
        isLoaded: false,
        isRoot: false,
        isAdmin: false,
        otpIsLoaded: false,
        credential: false,
        authentication: false,
        isWaitingAuth: false
      },
      otp:{
        username: "",
        Token: "",
        Code: [],
        size: 200,
        OtpStatus: false,
        secrety: false,
        TokenIsValid: false,
        TokenValidationError: false,
        testTokenDone: false,
        TokenValidation: "",
        Secret: "",
        Key: "",
        OtpCockpit: false,
        OtpSshd: false,
        OtpR2WOath: false
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
        },
        shellPolicy: false,
        userSettingsPage: {
          access: false,
          trustedNetworksAccess: false,
          urls: []
        }
      },
      loaders: {
        password: false,
        smarthost: false,
        root: false,
        cockpit: false,
        hints: false,
        logrotate: false,
        shellPolicy: false,
        otp: false,
        userSettingsPage: false
      },
      errors: this.initErrors(),
      newUser: {
        newPassword: "",
        oldPassword: "",
        confirmNewPassword: "",
        passwordStrength: false,
        togglePass: false,
        canChangePassword: false
      },
      accessUserSettings: window.location.port === "",
      loggedUser: {},
      showChangePasswordError: false,
    };
  },
  methods: {
    initGraphics() {
      $("#app").css("background", "");
      $("#app").css("color", "");
    },
    toggleOtpSecretyMode() {
      this.otp.secrety = !this.otp.secrety;
      this.$forceUpdate();
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
        },
        shellPolicy: {
          hasError: false,
          message: ""
        },
        otp: {
          hasError: false,
          message: ""
        },
        OtpCockpit: {
          hasError: false,
          message: ""
        },
        OtpSshd: {
          hasError: false,
          message: ""
        },
        userSettingsPageAccess: {
          hasError: false,
          message: ""
        },
        userSettingsPageTrustedNetworksAccess: {
          hasError: false,
          message: ""
        }
      };
    },
    togglePassHidden() {
      this.togglePass = !this.togglePass;
      this.$forceUpdate();
    },
    testSmarthost() {
      var context = this;

      context.view.authentication =  false;
      context.view.credential = false;
      context.view.isWaitingAuth = true;

      nethserver.exec(
        ["system-settings/execute"],
        {
          action: "test-smarthost",
          SmartHostName: context.settings.smarthost.SmartHostName,
          SmartHostPort: context.settings.smarthost.SmartHostPort,
          SmartHostUsername: context.settings.smarthost.SmartHostUsername,
          SmartHostPassword: context.settings.smarthost.SmartHostPassword,
          SmartHostTlsStatus: context.settings.smarthost.SmartHostTlsStatus,
        },
        null,
        function(success) {
          context.view.authentication =  true;
          context.view.credential =  true;
          context.view.isWaitingAuth = false;
        },
        function(error, data) {
          context.view.authentication =  true;
          context.view.credential =  false;
          context.view.isWaitingAuth = false;
        }
      );
    },
    addEmail() {
      this.settings.root.EmailAddress.push({
        isNew: true
      });
    },
    removeEmail(alias, index) {
      this.settings.root.EmailAddress.splice(index, 1);
    },
    testMail(alias) {
      var context = this;
      context.exec(
        ["system-settings/execute"],
        {
          action: "test-mail",
          email: alias.email
        },
        function(stream) {
          console.info("settings-test-mail", stream);
        },
        function(success) {
          // notification
          context.$parent.notifications.success.message = context.$i18n.t(
            "settings.mail_sent_ok"
          );
        },
        function(error, data) {
          // notification
          context.$parent.notifications.error.message = context.$i18n.t(
            "settings.mail_sent_error"
          );
        }
      );
    },
    testToken(token) {
      var context = this;
      var secret = context.otp.Secret;
      context.otp.testTokenDone = false;
      
      context.otp.TokenIsValid = authenticator.verify({ token, secret });
      
      if (context.otp.TokenIsValid) {
        context.otp.TokenValidationError = false;
        context.otp.testTokenDone = true;
      }
      else if (!context.otp.TokenIsValid) {
        context.otp.TokenValidationError = true;
        context.otp.testTokenDone = true;
      }
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
    getAuthorizations() {
      var context = this;

      context.view.isLoaded = false;
      context.view.otpIsLoaded = false;

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
          context.view.isAdmin = success.status.isAdmin == 1;
          context.view.isRoot = success.status.isRoot == 1;
          context.otp.username = success.status.username;
          context.otp.OtpStatus = success.OtpStatus == "enabled";
          if ( success.OtpStatus == "enabled") {
              context.otp.TokenIsValid = true;
          }
          context.otp.OtpCockpit = success.OtpCockpit;
          context.otp.OtpR2WOath = success.OtpR2WOath == "enabled";
          context.otp.OtpSshd = success.OtpSshd;
          context.otp.Token = success.Token;
          context.otp.Secret = success.Secret;
          context.otp.Key = success.Key;
          context.otp.Code = success.Code;
          // if otp is disabled, the key is generated each time the page is Loaded
          // we can display the key it doesn't matter
          if (context.otp.OtpStatus === false) {
            context.otp.secrety = true;
          }
          context.view.otpIsLoaded = true;
        },
        function(error) {
          console.error(error);
        },
        false
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
          let settings = success.configuration;
          context.newUser.canChangePassword =
            success.status.canChangePassword == 1;

          if (context.view.isAdmin) {
            // root or members of domain admins group
            var emails = [{}];
            for (var s in settings) {
              if (s == "root") {
                emails = settings[s].EmailAddress.map(function(i) {
                  return {
                    email: i
                  };
                });
              }
            }
            settings.root.EmailAddress =
              emails.length == 0 ? [{}] : emails;

            //smarthost
            settings.smarthost.SmartHostStatus =
              settings.smarthost.SmartHostStatus == "enabled";
            settings.smarthost.SmartHostTlsStatus =
              settings.smarthost.SmartHostTlsStatus == "enabled";

            //logrotate
            settings.logrotate.Compression =
              settings.logrotate.Compression == "enabled";

            // cockpit
            settings.cockpit.access =
              settings.cockpit.access.indexOf("red") != -1;
            settings.cockpit.LimitAccess = settings.cockpit.LimitAccess.split(
              ","
            ).join("\n");

            // user settings page
            settings.userSettingsPage.access =
              settings.userSettingsPage.UserSettingsPage == "enabled";
            settings.userSettingsPage.trustedNetworksAccess =
              settings.userSettingsPage.UserSettingsGrantAccess == "enabled";

            settings.userSettingsPage.urls = [];
            settings.userSettingsPage.UserSettingsHosts.forEach( host => {
              settings.userSettingsPage.urls.push("https://" + host + settings.userSettingsPage.UserSettingsPageAlias);
            });

            settings.cockpit.ShowHints =
              settings.cockpit.ShowHints == "enabled";

            //shellPolicy
            settings.shellPolicy = settings.shellPolicy == "enabled";
          }
          context.settings = settings;
          context.settings.cockpit.ShowHints == "enabled";

          context.getHints(function() {
            context.$parent.hints.settings.count = context.hints.count;
          });
          context.view.isLoaded = true;
          context.updateShellPolicyTooltips();
        },
        function(error) {
          console.error(error);
        }
      );
    },
    updateShellPolicyTooltips() {
      const context = this;

      setTimeout(function() {
        $('[data-toggle="tooltip"]').tooltip();

        if (context.settings.shellPolicy) {
          $('[data-toggle="tooltip"]').tooltip('destroy');
        }
      }, 300);
    },
    toggleSettingsShellPolicy() {
      this.settings.shellPolicy = !this.settings.shellPolicy;
      this.updateShellPolicyTooltips();
    },
    toggleSettingsHints() {
      this.settings.cockpit.ShowHints = !this.settings.cockpit.ShowHints;
    },
    toggleSettingsOtp() {
      this.otp.OtpStatus = !this.otp.OtpStatus;
    },
    toggleSettingsSmartHost() {
      this.settings.smarthost.SmartHostStatus = !this.settings.smarthost
        .SmartHostStatus;
    },
    toggleSettingsLimitAccess() {
      this.settings.cockpit.access = !this.settings.cockpit.access;
    },
    toggleUserSettingsPageAccess() {
      this.settings.userSettingsPage.access = !this.settings.userSettingsPage.access;
    },
    toggleUserSettingsPageTrustedNetworksAccess() {
      this.settings.userSettingsPage.trustedNetworksAccess = !this.settings.userSettingsPage.trustedNetworksAccess;
    },
    togglePass() {
      this.newUser.togglePass = !this.newUser.togglePass;
    },
    getLoggedUser() {
      const context = this;
      let userPromise = cockpit.user();
      userPromise.done(function(user) {
        context.loggedUser = user;
      });
    },
    logout() {
      cockpit.logout();
    },
    openSaveUserSettingsPageModal() {
      $("#saveUserSettingsPageModal").modal("show");
    },
    confirmSaveUserSettingsPageModal() {
      $("#saveUserSettingsPageModal").modal("hide");
      this.saveSettings('user_settings_page');
    },
    closeChangePasswordError() {
      this.showChangePasswordError = false;
    },
    saveSettings(type) {
      var context = this;
      var settingsObj = {};
      var endpoint = "settings";
      var sudo = false;

      switch (type) {
        case "password":
          context.showChangePasswordError = false;
          settingsObj = {
            action: "password",
            confirmNewPassword: this.newUser.confirmNewPassword,
            newPassword: this.newUser.newPassword,
            currentPassword: this.newUser.oldPassword
          };
          endpoint = "password";
          sudo = false;
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
          sudo = true;
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
          sudo = true;
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
          sudo = true;
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
          sudo = true;
          break;

        case "hints":
          settingsObj = {
            action: "hints",
            ShowHints: context.settings.cockpit.ShowHints
              ? "enabled"
              : "disabled"
          };
          sudo = true;
          break;

        case "shellPolicy":
          settingsObj = {
            action: "shellPolicy",
            shellPolicy: context.settings.shellPolicy
              ? "enabled"
              : "disabled"
          };
          sudo = true;
          break;

        case "otp":
          settingsObj = {
            action: "otp",
            OtpStatus: context.otp.OtpStatus
              ? "enabled"
              : "disabled",
            OtpCockpit: context.otp.OtpCockpit,
            OtpSshd: context.otp.OtpSshd,
            username: context.otp.username,
            Key: context.otp.Key
          };
          sudo = false;
          break;

        case "user_settings_page":
          settingsObj = {
            action: "user_settings_page",
            UserSettingsPage: context.settings.userSettingsPage.access ? "enabled" : "disabled",
            UserSettingsGrantAccess: context.settings.userSettingsPage.trustedNetworksAccess ? "enabled" : "disabled"
          };
          sudo = true;
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
                context.getAuthorizations();
              });

              // reset otp 
              context.otp.TokenIsValid = false;
              context.otp.TokenValidationError = false;
              context.otp.TokenValidation = "";
              context.otp.testTokenDone = false;

              // reset test smarthost
              context.view.credential = false;
              context.view.authentication =  false;

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
              if (type === "password" && error.exit_status == 99) {
                context.$parent.notifications.error.show = false;
                context.showChangePasswordError = true;
              } else {
                context.$parent.notifications.error.message = context.$i18n.t(
                  "settings.settings_updated_error"
                );
              }
            },
            sudo
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
        sudo
      );
    }
  }
};
</script>

<style>
.mg-top-20 {
  margin-top: 20px;
}
.adjust-index {
  z-index: 1;
}
.logged-user {
  margin-top: 0;
  text-align: right;
}
.clear {
  clear: both;
}
.logout-button {
  float: right;
  clear: both;
  margin-bottom: 10px;
}
/* Chrome, Safari, Edge, Opera */

input[type=number].noArrows::-webkit-outer-spin-button,
input[type=number].noArrows::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type=number].noArrows {
  -moz-appearance: textfield;
}
.check-ok {
  margin-left: 10px;
}
</style>
