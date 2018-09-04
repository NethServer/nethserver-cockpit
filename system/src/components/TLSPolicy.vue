<template>
  <div>
    <h2>{{$t('tls_policy.title')}}</h2>
    <h3>{{$t('config')}}</h3>
    <form class="form-horizontal" v-on:submit.prevent="saveTLSPolicy(newTLSPolicy)">

      <div v-if="newTLSPolicy.onTaskRunning" class="alert alert-warning alert-dismissable">
        <span class="pficon pficon-warning-triangle-o"></span>
        <strong>{{$t('ssh.running_task')}}.</strong> {{newTLSPolicy.errorMessage}}
      </div>

      <div :class="['form-group', newTLSPolicy.errorProps['enforce_security'] ? 'has-error' : '']">
        <label class="col-sm-2 control-label" for="textInput-modal-markup">{{$t('tls_policy.enforce_security')}}</label>
        <div class="col-sm-5">
          <select :disabled="newTLSPolicy.isEdit" required type="text" v-model="newTLSPolicy.enforce_security" class="form-control">
            <option>{{$t('tls_policy.default_policy')}}</option>
          </select>
          <span v-if="newTLSPolicy.errorProps['enforce_security']" class="help-block">{{newTLSPolicy.errorProps['enforce_security']}}</span>
        </div>
      </div>

      <div class="form-group">
        <label class="col-sm-2 control-label" for="textInput-modal-markup"></label>
        <div class="col-sm-5">
          <button class="btn btn-primary" type="submit">{{$t('save')}}</button>
        </div>
      </div>

    </form>
  </div>
</template>

<script>
export default {
  name: "TLSPolicy",
  mounted() {
      this.getTLSPolicyConfig()
    },
  data() {
    return {
      newTLSPolicy: {
        errorProps: {}
      }
    };
  },
  methods: {
      getTLSPolicyConfig() {

      },
      saveTLSPolicy(obj) {

      }
    }
};
</script>

<style>

</style>
