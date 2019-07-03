<template>
  <div>
    <h2>{{$t('applications.title')}}</h2>

    <div v-if="!view.isLoaded" class="spinner spinner-lg"></div>
    <button
      v-if="view.isLoaded"
      @click="refresh()"
      class="btn btn-primary apps-refresh"
    >{{$t('applications.refresh')}}</button>

    <vue-good-table
      v-if="view.isLoaded"
      :customRowsPerPageDropdown="[25,50,100]"
      :perPage="25"
      :columns="columns"
      :rows="rows"
      :lineNumbers="false"
      :defaultSortBy="{field: 'name', type: 'asc'}"
      :globalSearch="true"
      :paginate="true"
      styleClass="table"
      :nextText="tableLangsTexts.nextText"
      :prevText="tableLangsTexts.prevText"
      :rowsPerPageText="tableLangsTexts.rowsPerPageText"
      :globalSearchPlaceholder="tableLangsTexts.globalSearchPlaceholder"
      :ofText="tableLangsTexts.ofText"
    >
      <template slot="table-row" slot-scope="props">
        <td class="fancy">
          <a
            v-if="(props.row.url || props.row.url.length > 0 ) && !props.row.legacy"
            target="_blank"
            :href="'/'+props.row.url"
          >
            <img
              class="apps-icon"
              :src="props.row.legacy ? 'assets/legacy.png' : '../'+props.row.id+'/logo.png'"
            >
          </a>
          <span v-if="!props.row.url || props.row.url.length == 0 || props.row.legacy">
            <img
              class="apps-icon"
              :src="props.row.legacy ? 'assets/legacy.png' : '../'+props.row.id+'/logo.png'"
            >
          </span>
        </td>
        <td class="fancy">
          <strong>
            <a
              v-if="(props.row.url || props.row.url.length > 0 ) && !props.row.legacy"
              target="_blank"
              :href="props.row.url"
            >{{props.row.name}}</a>
            <span
              v-if="!props.row.url || props.row.url.length == 0 || props.row.legacy"
            >{{props.row.name}}</span>
          </strong>
        </td>
        <td class="fancy">{{ props.row.description}}</td>
        <td class="fancy">
          settings
          <strong>{{props.row.release.version | capitalize}}</strong>
        </td>
        <td>
          <a
            :target="(props.row.legacy || props.row.external) ? '_blank' : ''"
            :href="(props.row.legacy || props.row.external) ? (props.row.legacy ? legacyUrl : '' )+props.row.url : '#/applications/'+props.row.id"
            class="btn btn-primary button-minimum"
          >
            <span
              :class="['fa', (props.row.legacy || props.row.external) ? 'fa-external-link' : 'fa-cogs']"
            ></span>
            {{(props.row.legacy || props.row.external) ? $t('applications.open') : $t('applications.settings')}}
          </a>
          <div
            v-if="props.row.editable == 1 && !props.row.legacy"
            class="dropup pull-right dropdown-kebab-pf"
          >
            <button
              class="btn btn-link dropdown-toggle"
              type="button"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="true"
            >
              <span class="fa fa-ellipsis-v"></span>
            </button>
            <ul class="dropdown-menu dropdown-menu-right">
              <li v-if="props.row.editable == 1 && !props.row.external" role="presentation">
                <a
                  @click="props.row.shortcut == 1 ? removeShortcut(props.row.id) : addShortcut(props.row.id)"
                >
                  <span
                    :class="['fa', props.row.shortcut == 1 ? 'fa-unlink' : 'fa-link', 'action-icon-menu']"
                  ></span>
                  {{props.row.shortcut == 1
                  ? $t('remove_shortcut') : $t('add_shortcut')}}
                </a>
              </li>
              <li
                v-if="props.row.editable == 1 && !props.row.external"
                role="presentation"
                class="divider"
              ></li>
              <li>
                <a @click="openRemoveApp(props.row)">
                  <span class="fa fa-times action-icon-menu"></span>
                  {{$t('applications.remove')}}
                </a>
              </li>
            </ul>
          </div>
        </td>
      </template>
    </vue-good-table>

    <div class="modal" id="removeAppModal" tabindex="-1" role="dialog" data-backdrop="static">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title">{{$t('applications.remove')}} {{currentApp.name}}</h4>
          </div>
          <form class="form-horizontal" v-on:submit.prevent="removeApp()">
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
                {{$t('applications.remove_applications_warn')}}.
              </div>
              <div class="form-group">
                <label
                  class="col-sm-3 control-label"
                  for="textInput-modal-markup"
                >{{$t('applications.list')}}</label>
                <div class="col-sm-9">
                  <div v-if="!currentApp.listRemoveRead" class="spinner spinner-sm"></div>
                  <pre v-if="currentApp.listRemoveRead" class="prettyprint">{{currentApp.listRemoveRead}}</pre>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn btn-default" type="button" data-dismiss="modal">{{$t('cancel')}}</button>
              <button
                :disabled="!currentApp.listRemoveRead"
                class="btn btn-danger"
                type="submit"
              >{{$t('delete')}}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
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
      rows: [],
      currentApp: {
        listRemove: [],
        listRemoveRead: null
      },
      legacyUrl:
        window.location.protocol +
        "//" +
        window.location.hostname +
        ":980/en-US/"
    };
  },
  beforeRouteLeave(to, from, next) {
    $(".modal").modal("hide");
    next();
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

      this.$parent.getHints("system-subscription", "subscription");
      $("#app").css("background", "");
      $("#app").css("color", "");
    },
    getApps(silently) {
      var context = this;

      context.view.isLoaded = silently ? true : false;
      context.exec(
        ["system-apps/read"],
        {
          action: "list",
          location: window.location
        },
        null,
        function(success) {
          try {
            success = JSON.parse(success);
          } catch (e) {
            console.error(e);
          }
          for (var a in success) {
            var app = success[a];
            if (app.url.length > 0 && app.url.startsWith("/")) {
              app.url =
                window.location.protocol +
                "//" +
                window.location.hostname +
                app.url;
            }
          }
          context.rows = success;
          context.view.isLoaded = true;
        },
        function(error) {
          context.view.isLoaded = true;
        },
        false
      );
    },
    openRemoveApp(app) {
      var context = this;
      this.currentApp = app;

      $("#removeAppModal").modal("show");
      context.exec(
        ["system-packages/read"],
        {
          action: "list-removed",
          packages: [app.id]
        },
        null,
        function(success) {
          try {
            success = JSON.parse(success);
          } catch (e) {
            console.error(e);
          }
          context.currentApp.listRemove = success.packages;
          context.currentApp.listRemoveRead = success.packages.join("\n");
          context.$forceUpdate();
        },
        function(error) {
          console.error(error);
        }
      );
    },
    removeApp() {
      var context = this;

      $("#removeAppModal").modal("hide");
      context.exec(
        ["system-packages/update"],
        {
          action: "remove",
          packages: context.currentApp.listRemove
        },
        function(stream) {
          console.info("packages-remove", stream);
        },
        function(success) {
          // notification
          context.$parent.notifications.success.message = context.$i18n.t(
            "applications.remove_ok"
          );

          context.getApps();
        },
        function(error) {
          // notification
          context.$parent.notifications.error.message = context.$i18n.t(
            "applications.remove_error"
          );
        }
      );
    },
    addShortcut(application) {
      var context = this;

      context.exec(
        ["system-apps/update"],
        {
          action: "add-shortcut",
          name: application
        },
        null,
        function(success) {
          context.getApps(true);
          context.refresh();
        },
        function(error) {
          console.error(error);
        }
      );
    },
    removeShortcut(application) {
      var context = this;

      context.exec(
        ["system-apps/update"],
        {
          action: "remove-shortcut",
          name: application
        },
        null,
        function(success) {
          context.getApps(true);
          context.refresh();
        },
        function(error) {
          console.error(error);
        }
      );
    },
    refresh() {
      cockpit
        .dbus(null, {
          bus: "internal"
        })
        .call("/packages", "cockpit.Packages", "Reload", []);

      var context = this;
      setTimeout(function() {
        context.initGraphics();
      }, 1500);
    }
  }
};
</script>

<style>
</style>
