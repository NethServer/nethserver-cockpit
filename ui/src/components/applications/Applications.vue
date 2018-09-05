<template>
  <div>
    <h3>NethServer Applications</h3>

    <div class="row row-app">
      <div class="col-xs-12 col-sm-6 col-md-4 col-lg-3">
        <div class="panel panel-default">
          <div class="panel-heading">
            <h3 class="panel-title">NethServer Firewall
              <img class="app-header-logo" :src="'../nethserver-applications/assets/icon.png'" />
            </h3>
          </div>
          <div class="panel-body">
            <h4 class="no-margin-top">NethServer Firewall UTM</h4>
            <h5>1.0.0</h5>
            <button class="btn btn-primary right">Settings</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Main",
  data() {
    return {
      msg: "Welcome to Your NethServer Module"
    };
  },
  mounted() {
    $(parent.document.getElementById("sidebar-menu").children[1]).addClass(
      "active"
    );
    $(parent.document.getElementById("sidebar-menu").children[0]).removeClass(
      "active"
    );
  }
};
</script>

<style>
</style>
