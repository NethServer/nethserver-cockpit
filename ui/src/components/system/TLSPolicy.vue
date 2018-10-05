<template>
  <div v-if="view.isAuth">
    <h2>{{$t('tls_policy.title')}}</h2>
    <div v-if="!view.isLoaded" class="spinner spinner-lg"></div>
    <div v-if="view.isLoaded">
      <h3>{{$t('config')}}</h3>
      <form class="form-horizontal" v-on:submit.prevent="saveTLSPolicy(TLSPolicy)">
        <div :class="['form-group', TLSPolicy.errors.policy.hasError ? 'has-error' : '']">
          <label class="col-sm-2 control-label" for="textInput-modal-markup">{{$t('tls_policy.enforce_security')}}</label>
          <div class="col-sm-5">
            <select required type="text" v-model="TLSPolicy.policy" class="form-control">
              <option :value="p" v-for="p in TLSPolicy.policies" v-bind:key="p">{{p.length > 0 ? p : $t('tls_policy.default_policy')}}</option>
            </select>
            <span v-if="TLSPolicy.errors.policy.hasError" class="help-block">{{TLSPolicy.errors.policy.message}}</span>
          </div>
        </div>
        <div class="form-group">
          <label class="col-sm-2 control-label" for="textInput-modal-markup">
            <div v-if="TLSPolicy.isLoading" class="spinner spinner-sm form-spinner-loader adjust-top-loader"></div>
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
  name: "TLSPolicy",
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
    this.getTLSPolicy();
  },
  data() {
    return {
      view: {
        isLoaded: false,
        isAuth: false
      },
      TLSPolicy: {
        isLoading: false,
        errors: {
          policy: {
            hasError: false,
            message: ""
          }
        },
        policy: "",
        policies: []
      }
    };
  },
  methods: {
    getTLSPolicy() {
      var context = this;
      context.exec(
        ["system-tls-policy/read"],
        null,
        null,
        function(success) {
          success = JSON.parse(success);
          context.view.isLoaded = true;

          context.TLSPolicy.policies = [""];
          context.TLSPolicy.policies = context.TLSPolicy.policies.concat(
            success.status.available
          );
          context.TLSPolicy.policy = success.configuration.props.policy;
        },
        function(error) {
          console.error(error);
        }
      );
    },
    saveTLSPolicy(obj) {
      var context = this;

      var tlsObj = {
        props: {
          policy: obj.policy
        },
        name: "tls",
        type: "configuration"
      };

      context.TLSPolicy.isLoading = true;
      context.TLSPolicy.errors.policy.hasError = false;

      context.exec(
        ["system-tls-policy/validate"],
        tlsObj,
        null,
        function(success) {
          context.TLSPolicy.isLoading = false;

          // update values
          context.exec(
            ["system-tls-policy/update"],
            tlsObj,
            function(stream) {
              console.info("tls-policy", stream);
            },
            function(success) {
              // notification
              context.$parent.notifications.success.message = context.$i18n.t(
                "tls_policy.tls_policy_edit_ok"
              );

              // get tls policy
              context.getTLSPolicy();
            },
            function(error, data) {
              // notification
              context.$parent.notifications.error.message = context.$i18n.t(
                "tls_policy.tls_policy_edit_error"
              );
            }
          );
        },
        function(error, data) {
          var errorData = JSON.parse(data);
          context.TLSPolicy.isLoading = false;
          context.TLSPolicy.errors.policy.hasError = false;

          for (var e in errorData.attributes) {
            var attr = errorData.attributes[e];
            context.TLSPolicy.errors[attr.parameter].hasError = true;
            context.TLSPolicy.errors[attr.parameter].message =
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