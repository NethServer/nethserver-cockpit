<template>
  <div>
    <h2>{{$t('ssh.title')}}</h2>
    <h3>{{$t('config')}}</h3>
    <form class="form-horizontal" v-on:submit.prevent="saveSSH(newSSHConfig)">

      <div v-if="newSSHConfig.onTaskRunning" class="alert alert-warning alert-dismissable">
        <span class="pficon pficon-warning-triangle-o"></span>
        <strong>{{$t('ssh.running_task')}}.</strong> {{newSSHConfig.errorMessage}}
      </div>

      <div :class="['form-group', newSSHConfig.errorProps['key'] ? 'has-error' : '']">
        <label class="col-sm-2 control-label" for="textInput-modal-markup">{{$t('ssh.tcp_port')}}</label>
        <div class="col-sm-5">
          <input :disabled="newSSHConfig.isEdit" required type="text" v-model="newSSHConfig.tcp_port" class="form-control">
          <span v-if="newSSHConfig.errorProps['key']" class="help-block">{{newSSHConfig.errorProps['key']}}</span>
        </div>
      </div>
      <div :class="['form-group', newSSHConfig.errorProps['network_mask'] ? 'has-error' : '']">
        <label class="col-sm-2 control-label" for="textInput-modal-markup">{{$t('ssh.allow_root_login')}}</label>
        <div class="col-sm-5">
          <input required type="checkbox" v-model="newSSHConfig.allow_root_login" class="form-control">
          <span v-if="newSSHConfig.errorProps['allow_root_login']" class="help-block">{{newSSHConfig.errorProps['allow_root_login']}}</span>
        </div>
      </div>
      <div class="form-group">
        <label class="col-sm-2 control-label" for="textInput-modal-markup">{{$t('ssh.allow_password_auth')}}</label>
        <div class="col-sm-5">
          <input type="checkbox" v-model="newSSHConfig.description" class="form-control">
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
    name: "SSH",
    mounted() {
      this.getSSHConfig()
    },
    data() {
      return {
        newSSHConfig: {
          errorProps: {}
        }
      };
    },
    methods: {
      getSSHConfig() {

      },
      saveSSH(obj) {

      }
    }
  };

</script>

<style>


</style>
