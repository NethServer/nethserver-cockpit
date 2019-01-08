<template>
  <div v-if="view.isAuth">
    <h2>{{SubscriptionConfig.enterprise ? $t('subscription.title_ent') : $t('subscription.title')}}</h2>
    <div v-if="!view.isLoaded" class="spinner spinner-lg"></div>
    <div v-if="view.isLoaded">
      <h3>{{SubscriptionConfig.enterprise ? $t('subscription.registration_ent') : $t('subscription.registration')}}</h3>
      <div
        v-if="!SubscriptionConfig.status && !SubscriptionConfig.missingToken"
        class="alert alert-info alert-dismissable"
      >
        <span class="pficon pficon-info"></span>
        {{SubscriptionConfig.enterprise ? $t('subscription.registration_description_ent') : $t('subscription.registration_description')}}.
        <br>
        <br>
        <a
          target="_blank"
          :href="SubscriptionConfig.pricingUrl"
          class="btn btn-primary"
        >{{SubscriptionConfig.enterprise ? $t('subscription.subscribe_ent') : $t('subscription.subscribe')}}</a>
        <br>
        <br>
        {{SubscriptionConfig.enterprise ? $t('subscription.registration_description_2_ent') : $t('subscription.registration_description_2')}}.
        <br>
      </div>
      <div
        v-if="!SubscriptionConfig.status && SubscriptionConfig.enterprise && SubscriptionConfig.missingToken"
        class="alert alert-info alert-dismissable"
      >
        <span class="pficon pficon-info"></span>
        {{$t('subscription.registration_description_ent_partial')}}.
        <br>
        <br>
        {{$t('subscription.registration_description_2_ent_partial')}}
        <a
          target="_blank"
          :href="'https://my.nethesis.it/#/servers?q='+SubscriptionConfig.systemId"
        >{{$t('subscription.here')}}</a>.
        <br>
      </div>
      <form
        v-if="!SubscriptionConfig.status"
        class="form-horizontal"
        v-on:submit.prevent="saveSubscription(SubscriptionConfig)"
      >
        <div :class="['form-group', SubscriptionConfig.errors.secret.hasError ? 'has-error' : '']">
          <label
            class="col-sm-2 control-label"
            for="textInput-modal-markup"
          >{{SubscriptionConfig.enterprise ? $t('subscription.token_ent') : $t('subscription.token')}}</label>
          <div class="col-sm-7">
            <input required type="text" v-model="SubscriptionConfig.secret" class="form-control">
            <span v-if="SubscriptionConfig.errors.secret.hasError" class="help-block">
              {{$t('validation.validation_failed')}}:
              {{$t('validation.'+SubscriptionConfig.errors.secret.message)}}
            </span>
          </div>
        </div>
        <div class="form-group">
          <label class="col-sm-2 control-label" for="textInput-modal-markup">
            <div
              v-if="SubscriptionConfig.isLoading"
              class="spinner spinner-sm form-spinner-loader adjust-top-loader"
            ></div>
          </label>
          <div class="col-sm-5">
            <button
              class="btn btn-primary"
              type="submit"
            >{{SubscriptionConfig.missingToken ? $t('add') : $t('register')}}</button>
          </div>
        </div>
      </form>
      <form v-if="SubscriptionConfig.status" class="form-horizontal">
        <div class="form-group compact">
          <label
            class="col-sm-2 control-label"
            for="textInput-modal-markup"
          >{{$t('subscription.system_id')}}</label>
          <div class="col-sm-7 adjust-li">
            <pre class="pre-inline">{{SubscriptionConfig.status.uuid}}</pre>
          </div>
        </div>
        <div class="form-group compact">
          <label
            class="col-sm-2 control-label"
            for="textInput-modal-markup"
          >{{$t('subscription.plan')}}</label>
          <div class="col-sm-7 adjust-li">
            <p>
              {{SubscriptionConfig.status.subscription &&
              SubscriptionConfig.status.subscription.subscription_plan.name}}
            </p>
          </div>
        </div>
        <div class="form-group compact">
          <label
            class="col-sm-2 control-label"
            for="textInput-modal-markup"
          >{{$t('subscription.expiration')}}</label>
          <div class="col-sm-7 adjust-li">
            <p>
              {{SubscriptionConfig.status.subscription && SubscriptionConfig.status.subscription.valid_until |
              dateFormat}}
            </p>
          </div>
        </div>
        <div class="form-group compact">
          <label
            class="col-sm-2 control-label"
            for="textInput-modal-markup"
          >{{$t('subscription.status')}}</label>
          <div class="col-sm-7 adjust-li">
            <span
              :class="SubscriptionConfig.status.subscription && SubscriptionConfig.status.subscription.status == 'valid' ? 'pficon pficon-ok' : 'pficon pficon-error-circle-o'"
            ></span>
          </div>
        </div>
        <div class="form-group compact">
          <label
            class="col-sm-2 control-label"
            for="textInput-modal-markup"
          >{{$t('subscription.cloud_portal')}}</label>
          <div class="col-sm-7 adjust-li">
            <a
              v-if="SubscriptionConfig.status"
              :href="SubscriptionConfig.portalURL"
              target="_blank"
              class="alert-link"
            >{{$t('subscription.access')}}</a>
          </div>
        </div>
      </form>
      <h3 v-if="SubscriptionConfig.status">{{$t('subscription.connection')}}</h3>
      <form v-if="SubscriptionConfig.status" class="form-horizontal">
        <div class="form-group compact">
          <label
            class="col-sm-2 control-label"
            for="textInput-modal-markup"
          >{{$t('subscription.check_connection')}}</label>
          <div class="col-sm-2 adjust-li">
            <button
              :disabled="view.isChecking"
              @click="checkConnection()"
              type="button"
              class="btn btn-primary"
            >{{$t('subscription.check')}}</button>
            <span v-if="view.isChecked && !view.isChecking" class="fa fa-check green copy-ok"></span>
            <span v-if="view.isCheckFail && !view.isChecking" class="fa fa-times red copy-ok"></span>
            <div v-if="view.isChecking" class="spinner spinner-sm adjust-spinner-top"></div>
          </div>
        </div>
      </form>
      <h3
        v-if="SubscriptionConfig.status"
      >{{SubscriptionConfig.enterprise ? $t('subscription.unsubscribe_ent') : $t('subscription.unsubscribe')}}</h3>
      <form v-if="SubscriptionConfig.status" class="form-horizontal">
        <div class="form-group compact">
          <label
            class="col-sm-2 control-label"
            for="textInput-modal-markup"
          >{{SubscriptionConfig.enterprise ? $t('subscription.proceed_unsubscribe_ent') : $t('subscription.proceed_unsubscribe')}}</label>
          <div class="col-sm-2 adjust-li">
            <button
              :disabled="view.isChecking"
              data-toggle="modal"
              data-target="#unsubscribeModal"
              type="button"
              class="btn btn-danger"
            >{{SubscriptionConfig.enterprise ? $t('subscription.unsubscribe_ent') : $t('subscription.unsubscribe')}}</button>
            <span v-if="view.isChecked && !view.isChecking" class="fa fa-check green copy-ok"></span>
            <span v-if="view.isCheckFail && !view.isChecking" class="fa fa-times red copy-ok"></span>
            <div v-if="view.isChecking" class="spinner spinner-sm adjust-spinner-top"></div>
          </div>
        </div>
      </form>
    </div>
    <div class="modal" id="unsubscribeModal" tabindex="-1" role="dialog" data-backdrop="static">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h4
              class="modal-title"
            >{{SubscriptionConfig.enterprise ? $t('subscription.unsubscribe_ent') : $t('subscription.unsubscribe')}}</h4>
          </div>
          <form class="form-horizontal" v-on:submit.prevent="removeSubscription()">
            <div class="modal-body">
              <div class="form-group">
                <label
                  class="col-sm-3 control-label"
                  for="textInput-modal-markup"
                >{{$t('are_you_sure')}}?</label>
              </div>
              <div class="alert alert-warning alert-dismissable">
                <span class="pficon pficon-warning-triangle-o"></span>
                <strong>{{$t('warning')}}.</strong>
                {{SubscriptionConfig.enterprise ? $t('subscription.remove_subscription_warn_ent') : $t('subscription.remove_subscription_warn')}}.
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn btn-default" type="button" data-dismiss="modal">{{$t('cancel')}}</button>
              <button
                class="btn btn-danger"
                type="submit"
              >{{SubscriptionConfig.enterprise ? $t('subscription.unsubscribe_ent') : $t('subscription.unsubscribe')}}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SSH",
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
    this.getSubscriptionConfig();

    setTimeout(function() {
      $(parent.document.getElementById("sidebar-menu").children[3]).addClass(
        "active"
      );
      $(parent.document.getElementById("sidebar-menu").children[0]).removeClass(
        "active"
      );
    }, 150);
  },
  data() {
    return {
      view: {
        isLoaded: false,
        isAuth: false,
        isChecking: false,
        isChecked: false,
        isCheckFail: false
      },
      SubscriptionConfig: {
        isLoading: false,
        errors: {
          secret: {
            hasError: false,
            message: ""
          }
        },
        secret: "",
        status: {},
        enterprise: false,
        missingToken: false,
        systemId: ""
      }
    };
  },
  methods: {
    getSubscriptionConfig() {
      var context = this;
      context.exec(
        ["system-subscription/read"],
        null,
        null,
        function(success) {
          try {
            success = JSON.parse(success);
          } catch (e) {
            console.error(e);
          }
          context.view.isLoaded = true;
          context.SubscriptionConfig.status =
            success.status && success.status.subscription
              ? success.status
              : false;
          context.SubscriptionConfig.portalURL =
            success.configuration.PortalURL;
          context.SubscriptionConfig.pricingUrl =
            success.configuration.PricingUrl;
          context.SubscriptionConfig.enterprise =
            success.configuration.enterprise == 1;
          context.SubscriptionConfig.missingToken =
            success.status &&
            !success.status.subscription &&
            success.configuration.SystemId &&
            success.configuration.SystemId.length > 0;
          context.SubscriptionConfig.systemId = success.configuration.SystemId;

          console.log(context.SubscriptionConfig.missingToken);
        },
        function(error) {
          console.error(error);
        }
      );
    },
    saveSubscription(obj) {
      var context = this;

      var subscriptionConfig = {
        Secret: this.SubscriptionConfig.secret,
        action: "register"
      };

      context.SubscriptionConfig.isLoading = true;
      context.SubscriptionConfig.errors.secret.hasError = false;

      context.exec(
        ["system-subscription/validate"],
        subscriptionConfig,
        null,
        function(success) {
          context.SubscriptionConfig.isLoading = false;

          // update values
          context.exec(
            ["system-subscription/update"],
            subscriptionConfig,
            function(stream) {
              console.info("subscription", stream);
            },
            function(success) {
              // notification
              context.$parent.notifications.success.message = context.$i18n.t(
                context.SubscriptionConfig.enterprise
                  ? "subscription.subscription_edit_ok_ent"
                  : "subscription.subscription_edit_ok"
              );

              // get subscription
              context.getSubscriptionConfig();
            },
            function(error, data) {
              // notification
              context.$parent.notifications.error.message = context.$i18n.t(
                context.SubscriptionConfig.enterprise
                  ? "subscription.subscription_edit_error_ent"
                  : "subscription.subscription_edit_error"
              );
            }
          );
        },
        function(error, data) {
          var errorData = {};
          context.SubscriptionConfig.isLoading = false;
          context.SubscriptionConfig.errors.secret.hasError = false;

          try {
            errorData = JSON.parse(data);
            for (var e in errorData.attributes) {
              var attr = errorData.attributes[e];
              context.SubscriptionConfig.errors[attr.parameter].hasError = true;
              context.SubscriptionConfig.errors[attr.parameter].message =
                attr.error;
            }
          } catch (e) {
            console.error(e);
          }
        }
      );
    },
    removeSubscription() {
      var context = this;
      context.exec(
        ["system-subscription/update"],
        {
          action: "unregister"
        },
        function(stream) {
          console.info("subscription", stream);
        },
        function(success) {
          // notification
          context.$parent.notifications.success.message = context.$i18n.t(
            context.SubscriptionConfig.enterprise
              ? "subscription.unsubscription_ok_ent"
              : "subscription.unsubscription_ok"
          );

          // get subscription
          context.getSubscriptionConfig();
        },
        function(error, data) {
          // notification
          context.$parent.notifications.error.message = context.$i18n.t(
            context.SubscriptionConfig.enterprise
              ? "subscription.unsubscription_error_ent"
              : "subscription.unsubscription_error"
          );
        }
      );
    },
    checkConnection() {
      var context = this;

      context.view.isChecking = true;
      context.exec(
        ["system-subscription/update"],
        {
          action: "send"
        },
        null,
        function(success) {
          try {
            success = JSON.parse(success);
          } catch (e) {
            console.error(e);
          }
          context.view.isChecking = false;
          context.view.isChecked = true;
          context.view.isCheckFail = false;
          setTimeout(function() {
            context.view.isChecked = false;
          }, 2000);
        },
        function(error) {
          console.error(error);
          context.view.isChecking = false;
          context.view.isChecked = false;
          context.view.isCheckFail = true;
        }
      );
    }
  }
};
</script>

<style>
</style>