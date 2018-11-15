<template>
  <div>
    <h2>{{$t('applications.title')}}</h2>

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
        <td>
          <a :href="'#/applications/'+props.row.url" class="btn btn-primary button-minimum">
            <span class="fa fa-cogs"></span>
            {{$t('applications.settings')}}
          </a>
          <div class="dropup pull-right dropdown-kebab-pf">
            <button class="btn btn-link dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true"
              aria-expanded="true">
              <span class="fa fa-ellipsis-v"></span>
            </button>
            <ul class="dropdown-menu dropdown-menu-right">
              <li>
                <a @click="removeApp(props.row)">
                  <span class="fa fa-times action-icon-menu"></span>
                  {{$t('applications.remove')}}</a>
              </li>
            </ul>
          </div>
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
    var context = this;
    setTimeout(function() {
      context.initGraphics();
    }, 150);

    // get list of installed apps
    context.getApps();
  },
  methods: {
    initGraphics() {
      $(parent.document.getElementById("sidebar-menu").children[1]).addClass(
        "active"
      );
      $(parent.document.getElementById("sidebar-menu").children[0]).removeClass(
        "active"
      );
    },
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
          context.initGraphics();
        },
        function(error) {
          context.view.isLoaded = true;
        }
      );
    },
    removeApp() {},
    refresh() {
      cockpit
        .dbus(null, {
          bus: "internal"
        })
        .call("/packages", "cockpit.Packages", "Reload", []);
      this.getApps();
    }
  }
};
</script>

<style>
</style>