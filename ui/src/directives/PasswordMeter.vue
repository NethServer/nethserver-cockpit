<template>
  <div>
    <input v-model="confirmPassword" @input="updateMeter()" :type="$parent.newUser.togglePass ? 'text' : 'password'" class="form-control" />
    <div class="password-hints">
      <span :class="[ lowercase ? 'password-meter-check' : 'password-meter-uncheck']">{{$t('lowercase')}}</span>
      <span :class="[ uppercase ? 'password-meter-check' : 'password-meter-uncheck']">{{$t('uppercase')}}</span>
      <span :class="[ number ? 'password-meter-check' : 'password-meter-uncheck']">{{$t('number')}}</span>
      <span :class="[ symbol ? 'password-meter-check' : 'password-meter-uncheck']">{{$t('symbol')}}</span>
      <span :class="[ equal ? 'password-meter-check' : 'password-meter-uncheck']">{{$t('equal')}}</span>
      <span :class="[ length ? 'password-meter-length-check' : 'password-meter-length-uncheck']">{{confirmPassword.length}}</span>
    </div>
  </div>
</template>
<script>
export default {
  name: "PasswordMeter",
  mixins: [],
  data() {
    return {
      confirmPassword: this.$parent.newUser.confirmNewPassword,
      password: this.$parent.newUser.newPassword,
      strength: this.$parent.newUser.passwordStrength
    };
  },
  watch: {
    "$parent.newUser.newPassword": function(val) {
      this.updateMeter();
    }
  },
  methods: {
    updateMeter(obj) {
      this.lowercase = /[a-z]/.test(this.confirmPassword);
      this.uppercase = /[A-Z]/.test(this.confirmPassword);
      this.number = /\d/.test(this.confirmPassword);
      this.symbol = /\W|_/.test(this.confirmPassword);
      this.length = this.confirmPassword.length > 7;
      this.equal =
        this.confirmPassword == this.$parent.newUser.newPassword &&
        this.$parent.newUser.newPassword.length > 0 &&
        this.confirmPassword.length > 0;

      this.$parent.newUser.passwordStrength =
        this.lowercase &&
        this.uppercase &&
        this.number &&
        this.symbol &&
        this.length &&
        this.equal;

      this.$forceUpdate();
    }
  }
};
</script>
<style>
</style>