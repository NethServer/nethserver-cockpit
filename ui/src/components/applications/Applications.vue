<template>
  <div>
    <h3>{{$t('applications.title')}}</h3>

    <div v-if="!view.isLoaded" class="spinner spinner-lg"></div>
    <button v-if="view.isLoaded" @click="refresh()" class="btn btn-primary apps-refresh">{{$t('applications.refresh')}}</button>
    <vue-good-table v-if="view.isLoaded" :customRowsPerPageDropdown="[25,50,100]" :perPage="25" :columns="columns"
      :rows="rows" :lineNumbers="false" :defaultSortBy="{field: 'name', type: 'asc'}" :globalSearch="true" :paginate="true"
      styleClass="table" :nextText="tableLangsTexts.nextText" :prevText="tableLangsTexts.prevText" :rowsPerPageText="tableLangsTexts.rowsPerPageText"
      :globalSearchPlaceholder="tableLangsTexts.globalSearchPlaceholder" :ofText="tableLangsTexts.ofText">
      <template slot="table-row" slot-scope="props">
        <td class="fancy">
          <img class="apps-icon" :src="'../'+props.row.url+'/logo.png'">
        </td>
        <td class="fancy">
          <strong>{{ props.row.name}}</strong>
        </td>
        <td class="fancy">{{ props.row.description}}</td>
        <td class="fancy">
          <strong>{{props.row.release.version}}</strong>
        </td>
        <td class="float-left">
          <a :href="'#/applications/'+props.row.url" class="btn btn-primary right">{{$t('applications.settings')}}</a>
        </td>
      </template>
    </vue-good-table>
  </div>
</template>

<script>
export default {
  name: "Applications",
  data() {
    return {
      view: {
        isLoaded: false
      },
      tableLangsTexts: this.tableLangs(),
      columns: [
        {
          label: this.$i18n.t("applications.icon"),
          field: "icon",
          filterable: false
        },
        {
          label: this.$i18n.t("applications.name"),
          field: "name",
          filterable: true
        },
        {
          label: this.$i18n.t("applications.description"),
          field: "name",
          filterable: true
        },
        {
          label: this.$i18n.t("applications.version"),
          field: "release.version",
          filterable: true
        },
        {
          label: this.$i18n.t("action"),
          field: "",
          filterable: true,
          sortable: false
        }
      ],
      rows: []
    };
  },
  mounted() {
    setTimeout(function() {
      $(parent.document.getElementById("sidebar-menu").children[1]).addClass(
        "active"
      );
      $(parent.document.getElementById("sidebar-menu").children[0]).removeClass(
        "active"
      );
    }, 50);

    // get list of installed apps
    this.getApps();
  },
  methods: {
    getApps() {
      var context = this;

      context.view.isLoaded = false;
      context.exec(
        ["system-apps/read"],
        null,
        null,
        function(success) {
          success = JSON.parse(success);
          context.rows = success;
          context.view.isLoaded = true;
        },
        function(error) {
          console.error(error);
        }
      );
    },
    refresh() {
      cockpit
        .dbus(null, { bus: "internal" })
        .call("/packages", "cockpit.Packages", "Reload", []);
      this.getApps();
    }
  }
};
</script>

<style>
</style>