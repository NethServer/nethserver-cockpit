<template>
  <div>
    <span
      :class="[ length ? 'password-meter-length-check' : 'password-meter-length-uncheck', 'adjust-length-check']"
    >{{password.length}}</span>
    <div class="password-hints adjust-pass-hints">
      <span
        :class="[ lowercase ? 'password-meter-check' : 'password-meter-uncheck']"
      >{{$t('lowercase')}}</span>
      <span
        :class="[ uppercase ? 'password-meter-check' : 'password-meter-uncheck']"
      >{{$t('uppercase')}}</span>
      <span :class="[ number ? 'password-meter-check' : 'password-meter-uncheck']">{{$t('number')}}</span>
      <span :class="[ symbol ? 'password-meter-check' : 'password-meter-uncheck']">{{$t('symbol')}}</span>
    </div>
    <input
      tabindex="0"
      id="pass-meter-input"
      :disabled="!canChangePassword"
      v-model="confirmPassword"
      @input="updateMeter()"
      :type="$parent.newUser.togglePass ? 'text' : 'password'"
      class="form-control"
    >
    <div class="password-hints">
      <span :class="[ equal ? 'password-meter-check' : 'password-meter-uncheck']">{{$t('equal')}}</span>
    </div>
  </div>
</template>
<script>
export default {
  name: "PasswordMeter",
  mixins: [],
  data() {
    this.$parent.$on('password-modify', data => {
      this.confirmPassword = "";
      this.$parent.newUser.passwordStrength = false;
    });
    return {
      confirmPassword: this.$parent.newUser.confirmNewPassword,
      password: this.$parent.newUser.newPassword,
      strength: this.$parent.newUser.passwordStrength,
      canChangePassword: this.$parent.newUser.canChangePassword,
      lowercase: false,
      uppercase: false,
      number: false,
      symbol: false,
      equal: false,
      length: false
    };
  },
  watch: {
    "$parent.newUser.newPassword": function(val) {
      this.updateMeter();
    }
  },
  methods: {
    updateMeter(obj) {
      this.lowercase = /[a-z]/.test(this.$parent.newUser.newPassword);
      this.uppercase = /[A-Z]/.test(this.$parent.newUser.newPassword);
      this.number = /\d/.test(this.$parent.newUser.newPassword);
      this.symbol = /\W|_/.test(this.$parent.newUser.newPassword);
      this.length = this.$parent.newUser.newPassword.length > 7;
      this.equal =
        this.confirmPassword == this.$parent.newUser.newPassword &&
        this.$parent.newUser.newPassword.length > 0 &&
        this.confirmPassword.length > 0;

      this.$parent.newUser.equal = this.equal &&
        this.length;
      this.$parent.newUser.passwordStrength =
        this.lowercase &&
        this.uppercase &&
        this.number &&
        this.symbol &&
        this.length;

      if ($("#pass-meter-input").val().length > 0) {
        this.$parent.newUser.confirmNewPassword = this.confirmPassword;
      } else {
        this.$parent.newUser.confirmNewPassword = "";
        this.confirmPassword = "";
        /*  this.lowercase = false;
        this.uppercase = false;
        this.number = false;
        this.symbol = false;
        this.length = 0;
        this.equal = false; */
      }

      this.$forceUpdate();
    }
  }
};
</script>
<style>
.adjust-length-check {
  position: absolute;
  top: -92px;
}
.adjust-pass-hints {
  position: absolute;
  top: -72px;
  width: 90%;
  z-index: 0;
}

@media only screen and (min-width: 768px) {
  .adjust-length-check {
    position: absolute;
    top: -42px;
  }
  .adjust-pass-hints {
    position: absolute;
    top: -20px;
    width: 90%;
    z-index: 0;
  }
}
@media only screen and (min-width: 768px) and (max-width: 820px) {
  .adjust-length-check {
    position: absolute;
    top: -59px;
  }
}
</style>