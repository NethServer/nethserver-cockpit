<template>
  <div>
    <h2>{{$t('software_center.title')}}</h2>
    <div v-if="hints.count > 0" class="alert alert-warning alert-dismissable">
      <span class="pficon pficon-warning-triangle-o"></span>
      <strong>{{$t('hints_suggested')}}:</strong>
      <li v-if="hints.details && hints.details.centos">
        <strong>{{$t('software_center.centos_upgrade')}}</strong>
        . {{$t('hints.centos_upgrade')}}.
        <a
          data-toggle="modal"
          data-target="#configureUpdatesModal"
        >{{$t('software_center.configure')}}</a>
      </li>
      <li v-if="hints.details && hints.details.nethserver">
        <strong>{{$t('software_center.nethserver_upgrade')}}</strong>
        : {{$t('software_center.there_is_upgrade_from')}}
        <b>{{hints.details && hints.details.nethserver && hints.details.nethserver.current_release}}</b>
        {{$t('software_center.to')}}
        <b>
          {{hints.details && hints.details.nethserver &&
          hints.details.nethserver.new_release}}
        </b>.
        <a data-toggle="modal" data-target="#upgradeModal">{{$t('software_center.upgrade_now')}}</a>
      </li>
    </div>

    <div v-if="!view.isEditable" class="alert alert-warning alert-dismissable">
      <span class="pficon pficon-warning-triangle-o"></span>
      <strong>{{$t('software_center.forbidden')}}.</strong>
      {{$t('software_center.permission_denied')}}.
    </div>

    <div v-if="view.isEditable">
      <h3>{{$t('software_center.updates')}}</h3>
      <div v-if="!view.updatesLoaded" class="spinner spinner-lg spinner-margin"></div>
      <div v-if="view.updatesLoaded" class="panel panel-default" id="provider-markup">
        <div
          :class="['panel-heading', (updates.nethserver.length + updates.other.length) > 0 ? 'has-updates' : '']"
        >
          <button
            :disabled="view.isUpdating"
            data-toggle="modal"
            data-target="#configureUpdatesModal"
            class="btn btn-default right"
          >{{$t('software_center.configure')}}</button>
          <button
            :disabled="(updates.nethserver.length + updates.other.length) == 0"
            @click="viewPackage('changelog')"
            class="btn btn-default right panel-icon"
          >{{$t('software_center.changelog')}}</button>
          <button
            :disabled="view.isUpdating || view.isInstalling || (updates.nethserver.length + updates.other.length) == 0"
            data-toggle="modal"
            data-target="#updateAllModal"
            class="btn btn-primary right starred-marging"
          >{{$t('software_center.update_all')}}</button>
          <span class="panel-title">
            <span
              v-if="(updates.nethserver.length + updates.other.length) > 0"
              class="pficon pficon-warning-triangle-o starred-marging"
            ></span>
            {{$t('software_center.updates_available')}}:
            {{updates.nethserver.length +
            updates.other.length}}
          </span>
          <span
            class="provider-details margin-left-md"
            data-toggle="collapse"
            data-parent="#provider-markup"
            href="#providerDetails"
          >{{$t('software_center.details')}}</span>
          <div v-if="view.isUpdating" class="progress-description progress-install-all">
            <div class="spinner spinner-xs spinner-inline"></div>
            <strong>{{$t('software_center.updating')}}...</strong>
          </div>
          <div
            v-if="view.isUpdating"
            class="progress progress-label-top-right progress-xs progress-striped active"
          >
            <div
              class="progress-bar"
              role="progressbar"
              aria-valuenow="100"
              aria-valuemin="0"
              aria-valuemax="100"
              :style="'width: '+view.updateProgress+'%;'"
            >
              <span v-if="false">{{view.updateProgress}}%</span>
            </div>
          </div>
        </div>
        <div id="providerDetails" class="list-group list-view-pf wizard-pf-contents-title collapse">
          <div class="list-group-item" v-for="(u,uk) in updates.nethserver" v-bind:key="uk">
            <div class="list-group-item-header">
              <div class="list-view-pf-actions compact-list-actions">
                <button
                  :disabled="view.isUpdating || view.isInstalling"
                  @click="openUpdateSingle(u)"
                  class="btn btn-primary"
                >
                  <span class="fa fa-download span-right-margin"></span>
                  {{$t('software_center.update')}}
                </button>
              </div>
              <div class="list-view-pf-main-info compact-list-info">
                <div class="list-view-pf-left">
                  <img class="logo-app" src="assets/icon.png">
                </div>
                <div class="list-view-pf-body">
                  <div class="list-view-pf-description">
                    <div class="list-group-item-heading">
                      <a class="app-name">{{u.name}}</a>
                    </div>
                    <div class="list-group-item-text">
                      <span>{{u.description}}</span>
                    </div>
                  </div>
                  <div class="list-view-pf-additional-info">
                    <div v-if="!u.isUpdating" class="list-view-pf-additional-info-item">
                      <a @click="toggleOpen(u)">{{$t('details')}}</a>
                    </div>
                    <div v-if="u.isUpdating" class="progress-description progress-install">
                      <div class="spinner spinner-xs spinner-inline"></div>
                      <strong>{{$t('software_center.updating')}}...</strong>
                    </div>
                    <div
                      v-if="u.isUpdating"
                      class="progress progress-label-top-right progress-xs progress-striped active"
                    >
                      <div
                        class="progress-bar"
                        role="progressbar"
                        aria-valuenow="100"
                        aria-valuemin="0"
                        aria-valuemax="100"
                        :style="'width: '+u.progress+'%;'"
                      >
                        <span v-if="false">{{u.progress}}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              :class="['list-group-item-container container-fluid', u.isOpen ? 'active' : 'hidden']"
            >
              <div class="row">
                <div v-for="(l,lk) in u.updates" v-bind:key="lk" class="col-xs-12">
                  <div class="list-view-pf-additional-info-item">
                    <h4 class="col-xs-4 text-align-right">{{l.name}}</h4>
                    <div class="version-details col-xs-8 text-align-left">
                      <span class="fa fa-info"></span>
                      <strong>{{l.installed_version}}-{{l.installed_release}}</strong>
                      <span class="fa fa-arrow-right"></span>
                      <strong>{{l.version}}-{{l.release}}</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <p class="addtional-updates">
            {{updates.other.length == 1 ? $t('software_center.there_is') : $t('software_center.there_are')}}
            <b
              class="addtional-number"
            >{{updates.other.length}}</b>
            {{updates.other.length == 1 ? $t('software_center.update_base_system') :
            $t('software_center.updates_base_system')}}
            <button
              v-if="updates.other.length > 0"
              @click="viewPackage()"
              class="btn btn-primary margin-left-md"
            >
              <span class="fa fa-search span-right-margin"></span>
              {{$t('software_center.view')}}
            </button>
          </p>
        </div>
      </div>

      <div class="divider"></div>

      <h3>{{$t('software_center.applications')}} ({{filteredAppsList.length}} {{$t('found')}})</h3>
      <div class="right">
        <button
          @click="openInstallPackages()"
          :disabled="selectedApps == 0 || view.isInstalling || view.isUpdating"
          class="btn btn-primary btn-lg"
        >
          <span class="fa fa-download starred-marging"></span>
          {{$t('software_center.install')}} {{selectedApps}} {{selectedApps == 1 ?
          $t('software_center.application_low')
          : $t('software_center.applications_low')}}
        </button>
      </div>
      <form class="search-pf has-button">
        <div class="form-group has-clear toolbar-pf-filter">
          <div class="input-group full-width">
            <input
              v-focus
              v-model="searchString"
              type="text"
              class="form-control input-lg"
              id="filter"
              :placeholder="$t('search')+' '+$t('software_center.applications_low')"
            >
          </div>
        </div>
      </form>
      <div v-if="view.appsLoaded" class="row row-cards-pf adjust-top">
        <div v-for="(c,ck) in categories" v-bind:key="ck" class="col-xs-12 col-sm-4 col-md-3 col-lg-2">
          <div
            @click="selectCategory(c)"
            :class="['card-pf card-pf-accented selectable-cat', c.selected ? 'selected' : '']"
            :style="'border-top-color: '+c.color+'; background: '+c.color+'; color: white;'"
          >
            <div class="card-pf-heading">
              <h2 class="card-pf-title title-category">
                {{c.name}}
                <span class="right">
                  <input type="checkbox" v-model="c.selected">
                </span>
                <img :src="c.icon" class="right filter-app panel-icon">
              </h2>
            </div>
          </div>
        </div>
      </div>
      <div v-if="view.appsLoaded" class>
        <button
          :disabled="view.isInstalling"
          @click="selectAll()"
          class="btn btn-default starred-marging"
        >
          <span class="fa fa-circle starred-marging"></span>
          {{$t('software_center.select_all')}}
        </button>
        <button :disabled="view.isInstalling" @click="deselectAll()" class="btn btn-default">
          <span class="fa fa-circle-o starred-marging"></span>
          {{$t('software_center.deselect_all')}}
        </button>
      </div>

      <div v-if="!view.appsLoaded" class="spinner spinner-lg spinner-margin"></div>
      <div v-if="view.appsLoaded" class="apps-container">
        <div class="row row-cards-pf">
          <div
            v-for="(a,ai) in filteredAppsList"
            v-bind:key="ai"
            class="col-xs-12 col-sm-6 col-md-4 col-lg-3"
          >
            <div
              :class="['card-pf card-pf-accented', view.isInstalling ? '' : 'selectable', a.selected ? 'selected' : '']"
              :style="'border-top-color: '+categoryColors[a.category]+';'"
            >
              <h2 @click="view.isInstalling ? undefined : selectApp(a)" class="card-pf-title">
                {{a.name}}
                <span class="right">
                  <input type="checkbox" v-model="a.selected">
                </span>
              </h2>
              <div
                @click="view.isInstalling ? undefined : selectApp(a)"
                :class="['card-pf-body', '']"
              >
                <p>{{a.description}}</p>
              </div>
              <div class="card-pf-footer">
                <div class="dropdown card-pf-time-frame-filter app-details">
                  <a
                    :id="'app-'+a.id"
                    href="#"
                    class="info-general popovers"
                    data-toggle="popover"
                    data-html="true"
                    data-placement="top"
                    data-close="true"
                    data-trigger="focus"
                    data-container="body"
                    :title="$t('software_center.contains')"
                    :data-content="a.content"
                  >
                    <span class="pficon pficon-info"></span>
                  </a>
                </div>
                <div v-if="a.isInstalling" class="progress-description progress-install">
                  <div class="spinner spinner-xs spinner-inline"></div>
                  <strong>{{$t('software_center.installing')}}...</strong>
                </div>
                <div
                  v-if="a.isInstalling"
                  class="progress progress-label-top-right progress-xs progress-striped active limit-progress"
                >
                  <div
                    class="progress-bar"
                    role="progressbar"
                    aria-valuenow="100"
                    aria-valuemin="0"
                    aria-valuemax="100"
                    :style="'width: '+view.installProgress+'%;'"
                  >
                    <span v-if="false">{{view.installProgress}}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="modal" id="viewDetailsModal" tabindex="-1" role="dialog" data-backdrop="static">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title">{{$t('software_center.details_for')}} {{currentPackage.title}}</h4>
          </div>
          <form class="form-horizontal">
            <div class="modal-body">
              <div class="form-group">
                <div class="col-sm-12">
                  <div v-if="!currentPackage.details" class="spinner spinner-sm"></div>
                  <pre v-if="currentPackage.details" class="prettyprint">{{currentPackage.details}}</pre>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button
                @click="cleanDetails()"
                class="btn btn-default"
                type="button"
                data-dismiss="modal"
              >{{$t('cancel')}}</button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <div class="modal" id="updateSingleModal" tabindex="-1" role="dialog" data-backdrop="static">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title">{{$t('software_center.update')}} {{currentPackage.name}}</h4>
          </div>
          <form class="form-horizontal" v-on:submit.prevent="updateSingle()">
            <div class="modal-body">
              <div class="form-group">
                <label
                  class="col-sm-3 control-label"
                  for="textInput-modal-markup"
                >{{$t('are_you_sure')}}?</label>
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn btn-default" type="button" data-dismiss="modal">{{$t('cancel')}}</button>
              <button class="btn btn-primary" type="submit">{{$t('software_center.update')}}</button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <div class="modal" id="updateAllModal" tabindex="-1" role="dialog" data-backdrop="static">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title">{{$t('software_center.update_all')}}</h4>
          </div>
          <form class="form-horizontal" v-on:submit.prevent="updateAll()">
            <div class="modal-body">
              <div class="alert alert-warning alert-dismissable">
                <span class="pficon pficon-warning-triangle-o"></span>
                <strong>{{$t('warning')}}.</strong>
                {{$t('software_center.this_action_will_install')}}
                <b>
                  {{updates.nethserver.length
                  + updates.other.length}}
                </b>
                {{updates.other.length == 1 ? $t('software_center.update_low') : $t('software_center.updates_low')}}.
              </div>
              <div class="form-group">
                <label
                  class="col-sm-3 control-label"
                  for="textInput-modal-markup"
                >{{$t('are_you_sure')}}?</label>
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn btn-default" type="button" data-dismiss="modal">{{$t('cancel')}}</button>
              <button class="btn btn-primary" type="submit">{{$t('software_center.update')}}</button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <div class="modal" id="installPackageModal" tabindex="-1" role="dialog" data-backdrop="static">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title">
              {{$t('software_center.install')}} {{selectedApps}}
              {{$t('software_center.applications_low')}}
            </h4>
          </div>
          <form class="form-horizontal" v-on:submit.prevent="installPackages()">
            <div class="modal-body">
              <div class="form-group">
                <label
                  class="col-sm-3 control-label"
                  for="textInput-modal-markup"
                >{{$t('are_you_sure')}}?</label>
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn btn-default" type="button" data-dismiss="modal">{{$t('cancel')}}</button>
              <button class="btn btn-primary" type="submit">{{$t('software_center.install')}}</button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <div class="modal" id="upgradeModal" tabindex="-1" role="dialog" data-backdrop="static">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title">
              {{$t('software_center.upgrade_nethserver')}} {{$t('software_center.to')}}
              {{hints.details && hints.details.nethserver && hints.details.nethserver.new_release}}
            </h4>
          </div>
          <form class="form-horizontal" v-on:submit.prevent="upgradeSystem()">
            <div class="modal-body">
              <div class="alert alert-warning alert-dismissable compact">
                <span class="pficon pficon-warning-triangle-o"></span>
                <strong>
                  {{$t('software_center.upgrade')}} {{$t('software_center.to')}}
                  {{hints.details && hints.details.nethserver && hints.details.nethserver.new_release}}
                </strong>
                .
                {{$t('software_center.nethserver_upgrade_message')}}.
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn btn-default" type="button" data-dismiss="modal">{{$t('cancel')}}</button>
              <button class="btn btn-primary" type="submit">{{$t('software_center.upgrade')}}</button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <div
      class="modal"
      id="configureUpdatesModal"
      tabindex="-1"
      role="dialog"
      data-backdrop="static"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title">{{$t('software_center.configure_updates_header')}}</h4>
          </div>
          <form class="form-horizontal" v-on:submit.prevent="saveConfiguration()">
            <div class="modal-body">
              <div class="form-group">
                <label
                  class="col-sm-3 control-label"
                  for="textInput-modal-markup"
                >{{$t('software_center.when_updates_available')}}</label>
              </div>
              <div class="form-group">
                <input
                  class="col-sm-4"
                  type="radio"
                  id="install-1"
                  value="download"
                  v-model="updatesConfig.install"
                >
                <label
                  for="install-1"
                  class="control-label col-sm-6 text-align-left"
                >{{$t('software_center.download')}}</label>
              </div>
              <div class="form-group">
                <input
                  class="col-sm-4"
                  type="radio"
                  id="install-2"
                  value="install"
                  v-model="updatesConfig.install"
                >
                <label
                  for="install-2"
                  class="control-label col-sm-6 text-align-left"
                >{{$t('software_center.download_install')}}</label>
              </div>
              <p class="divider"></p>
              <div class="form-group">
                <label
                  class="col-sm-3 control-label"
                  for="sendEmail"
                >{{$t('software_center.email_to_sysadmin')}}?</label>
                <div class="col-sm-6">
                  <input
                    type="checkbox"
                    id="sendEmail"
                    v-model="updatesConfig.sendEmail"
                    class="form-control"
                  >
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn btn-default" type="button" data-dismiss="modal">{{$t('cancel')}}</button>
              <button class="btn btn-primary" type="submit">{{$t('software_center.configure')}}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/*global cockpit*/
export default {
  name: "SoftwareCenter",
  data() {
    return {
      view: {
        updatesLoaded: false,
        appsLoaded: true,
        isUpdating: false,
        isInstalling: false,
        updateProgress: 100,
        installProgress: 100,
        isEditable: true
      },
      hints: {},
      applications: [],
      categories: [],
      categoryColors: {},
      updates: {
        nethserver: [],
        other: []
      },
      updatesConfig: {
        install: "download",
        sendEmail: false
      },
      currentPackage: {
        details: null,
        name: "",
        type: "changelog",
        isUpdating: false
      },
      searchString: ""
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

    // get list of configurations, updates and apps
    context.getConfiguration();
    context.getApplications();
  },
  computed: {
    filteredAppsList() {
      var returnObj = [];
      for (var a in this.applications) {
        var app = this.applications[a];
        if (
          this.selectedCategories.length == 0 ||
          this.selectedCategories.indexOf(app.category) >= 0
        ) {
          if (
            app.name.toLowerCase().includes(this.searchString.toLowerCase()) ||
            app.id.toLowerCase().includes(this.searchString.toLowerCase())
          ) {
            returnObj.push(app);
          }
        }
      }

      return returnObj;
    },
    selectedApps() {
      var count = 0;
      for (var a in this.applications) {
        var app = this.applications[a];
        if (app.selected) {
          count++;
        }
      }
      return count;
    },
    selectedCategories() {
      var selected = [];
      for (var c in this.categories) {
        var category = this.categories[c];
        if (category.selected) {
          selected.push(category.id);
        }
      }
      return selected;
    }
  },
  methods: {
    initGraphics() {
      $(parent.document.getElementById("sidebar-menu").children[2]).addClass(
        "active"
      );
      $(parent.document.getElementById("sidebar-menu").children[0]).removeClass(
        "active"
      );

      this.$parent.getHints("system-subscription", "subscription");
      $("#app").css("background", "");
      $("#app").css("color", "");
    },
    toggleOpen(u) {
      u.isOpen = !u.isOpen;
    },
    selectCategory(cat) {
      cat.selected = !cat.selected;
    },
    selectApp(app) {
      app.selected = !app.selected;
    },
    getConfiguration() {
      var context = this;

      context.exec(
        ["system-packages/read"],
        {
          action: "get-config"
        },
        null,
        function(success) {
          try {
            success = JSON.parse(success);
          } catch (e) {
            console.error(e);
          }
          context.view.isEditable = success.editable == 1;
          context.updatesConfig.install =
            success.applyUpdate == "yes" ? "install" : "download";
          context.updatesConfig.sendEmail =
            success.messages == "yes" ? true : false;
        },
        function(error) {
          console.error(error);
        }
      );
    },
    getUpdates() {
      var context = this;

      context.updates = {
        nethserver: [],
        other: []
      };
      context.view.updatesLoaded = false;
      context.exec(
        ["system-packages/read"],
        {
          action: "list-updates"
        },
        null,
        function(success) {
          try {
            success = JSON.parse(success);
          } catch (e) {
            console.error(e);
          }

          context.hints = success.hints || {};
          if (
            context.hints.details &&
            context.hints.details.nethserver &&
            context.hints.details.nethserver.new_release.length > 0
          ) {
            $("#upgradeModal").modal("show");
          }

          for (var u in success.updates) {
            var update = success.updates[u];
            update.isUpdating = false;
            update.details = null;
            update.isOpen = false;
            update.progress = 100;

            if (update.nethserver) {
              context.updates.nethserver.push(...update.updates);
            } else {
              context.updates.other.push(...update.updates);
            }
          }
          context.view.updatesLoaded = true;
        },
        function(error) {
          context.view.updatesLoaded = true;
        }
      );
    },
    getApplications() {
      var context = this;

      context.view.appsLoaded = false;
      context.exec(
        ["system-packages/read"],
        {
          action: "list-available"
        },
        null,
        function(success) {
          success = JSON.parse(success);

          for (var a in success.groups) {
            var app = success.groups[a];
            app.isInstalling = false;
            app.selected = false;

            var content = "<pre>";

            var keysM = Object.keys(app.mandatory_packages);
            for (var k in keysM) {
              var key = keysM[k];
              content += key + "<br/>";
            }
            var keysO = Object.keys(app.optional_packages);
            for (var k in keysO) {
              var key = keysO[k];
              content += key + "<br/>";
            }
            app.content = content + "</pre>";
          }
          context.applications = success.groups;

          for (var c in success.categories) {
            var category = success.categories[c];
            category.selected = false;
            context.categoryColors[category.id] = category.color;
          }
          context.categories = success.categories;
          context.view.appsLoaded = true;

          context.getUpdates();

          setTimeout(function() {
            $(".popovers")
              .popovers()
              .on("hidden.bs.popover", function(e) {
                $(e.target).data("bs.popover").inState.click = false;
              });
          }, 150);
        },
        function(error) {
          console.error(error);
          context.view.appsLoaded = true;
        }
      );
    },
    refresh() {
      cockpit
        .dbus(null, {
          bus: "internal"
        })
        .call("/packages", "cockpit.Packages", "Reload", []);
    },
    viewPackage(pack) {
      if (pack) {
        this.currentPackage.title = this.$i18n.t("software_center.updates_low");
        this.currentPackage.type = "changelog";

        // open details for packages
        var context = this;

        context.exec(
          ["system-packages/read"],
          {
            action: "changelog"
          },
          null,
          function(success) {
            try {
              success = JSON.parse(success);
            } catch (e) {
              console.error(e);
            }
            context.currentPackage.details = success.data || "-";
          },
          function(error) {
            console.error(error);
          }
        );
      } else {
        // open packages list
        this.currentPackage.title = this.$i18n.t(
          "software_center.base_system_updates"
        );
        this.currentPackage.type = "list";

        var details = "";
        for (var o in this.updates.other) {
          var pack = this.updates.other[o];
          details += pack.name + " ";
          details +=
            "@" +
            pack.version +
            "-" +
            pack.release +
            " " +
            this.$i18n.t("from") +
            " " +
            pack.repo;
          details += "\n";
        }
        this.currentPackage.details = details;
      }

      $("#viewDetailsModal").modal("show");
    },
    cleanDetails() {
      this.currentPackage.details = null;
    },
    openInstallPackages() {
      $("#installPackageModal").modal("show");
    },
    installPackages() {
      var context = this;
      var appToInstall = [];

      for (var a in this.filteredAppsList) {
        var app = this.filteredAppsList[a];
        if (app.selected) {
          app.isInstalling = true;
          appToInstall.push(app.id);
        }
      }
      this.deselectAll();
      $("#installPackageModal").modal("hide");

      context.exec(
        ["system-packages/update"],
        {
          action: "install",
          packages: appToInstall
        },
        function(stream) {
          context.view.isInstalling = true;
          context.view.installProgress = 100;
          console.info("packages-install", stream);
        },
        function(success) {
          context.view.isInstalling = false;

          // notification
          context.$parent.notifications.success.message = context.$i18n.t(
            appToInstall.length == 1
              ? "software_center.install_ok_s"
              : "software_center.install_ok"
          );

          context.$parent.checkSystemTasks();

          // get updates
          context.getApplications();
        },
        function(error, data) {
          context.view.isInstalling = false;

          // get updates
          context.getApplications();

          // notification
          context.$parent.notifications.error.message = context.$i18n.t(
            appToInstall.length == 1
              ? "software_center.install_error_s"
              : "software_center.install_error"
          );
        }
      );
    },
    openUpdateSingle(pack) {
      this.currentPackage = pack;
      $("#updateSingleModal").modal("show");
    },
    updateSingle() {
      var context = this;
      var updatePackages = [];
      if (this.currentPackage.id == "core") {
        updatePackages = this.currentPackage.updates.map(function(i) {
          return i.name;
        });
      } else {
        updatePackages = [this.currentPackage.id];
      }

      $("#updateSingleModal").modal("hide");
      context.exec(
        ["system-packages/update"],
        {
          action: "update",
          packages: updatePackages
        },
        function(stream) {
          context.currentPackage.isUpdating = true;
          console.info("packages-update", stream);
        },
        function(success) {
          context.currentPackage.isUpdating = false;

          // notification
          context.$parent.notifications.success.message = context.$i18n.t(
            "software_center.updates_ok"
          );

          context.$parent.checkSystemTasks();

          // get updates
          context.getUpdates();
        },
        function(error, data) {
          context.currentPackage.isUpdating = false;

          // notification
          context.$parent.notifications.error.message = context.$i18n.t(
            "software_center.updates_error"
          );
        }
      );
    },
    updateAll() {
      var context = this;
      $("#updateAllModal").modal("hide");

      context.exec(
        ["system-packages/update"],
        {
          action: "update",
          packages: []
        },
        function(stream) {
          context.view.isUpdating = true;
          context.view.updateProgress = 100;
        },
        function(success) {
          context.view.isUpdating = false;

          // notification
          context.$parent.notifications.success.message = context.$i18n.t(
            "software_center.updates_ok"
          );

          context.$parent.checkSystemTasks();

          // get updates
          context.getUpdates();
        },
        function(error, data) {
          context.view.isUpdating = false;

          // notification
          context.$parent.notifications.error.message = context.$i18n.t(
            "software_center.updates_error"
          );
        }
      );
    },
    upgradeSystem() {
      var context = this;
      $("#upgradeModal").modal("hide");

      context.exec(
        ["system-packages/update"],
        {
          action: "upgrade"
        },
        function(stream) {
          context.view.isUpdating = true;
          context.view.updateProgress = 100;
          console.info("packages-upgrade", stream);
        },
        function(success) {
          context.view.isUpdating = false;

          // notification
          context.$parent.notifications.success.message = context.$i18n.t(
            "software_center.upgrade_ok"
          );

          context.$parent.checkSystemTasks();

          // get updates
          context.getUpdates();
        },
        function(error, data) {
          context.view.isUpdating = false;

          // notification
          context.$parent.notifications.error.message = context.$i18n.t(
            "software_center.upgrade_error"
          );
        }
      );
    },
    selectAll() {
      for (var a in this.filteredAppsList) {
        var app = this.filteredAppsList[a];
        app.selected = true;
      }
    },
    deselectAll() {
      for (var a in this.applications) {
        var app = this.applications[a];
        app.selected = false;
      }
    },
    saveConfiguration() {
      var context = this;
      $("#configureUpdatesModal").modal("hide");

      context.exec(
        ["system-packages/update"],
        {
          action: "set-config",
          applyUpdate: this.updatesConfig.install == "install" ? "yes" : "no",
          download:
            this.updatesConfig.install == "download"
              ? "yes"
              : this.updatesConfig.install == "install"
              ? "yes"
              : "no",
          messages: this.updatesConfig.sendEmail ? "yes" : "no"
        },
        function(stream) {
          console.info("packages-update", stream);
        },
        function(success) {
          // notification
          context.$parent.notifications.success.message = context.$i18n.t(
            "software_center.config_ok"
          );

          // get updates
          context.getConfiguration();
        },
        function(error, data) {
          // notification
          context.$parent.notifications.error.message = context.$i18n.t(
            "software_center.config_error"
          );
        }
      );
    }
  }
};
</script>

<style>
.logo-app {
  width: 25px !important;
}

@media (min-width: 992px) {
  .list-view-pf .list-group-item-heading {
    flex: 1 0 calc(50% - 20px) !important;
  }
}

.app-name {
  text-decoration: none !important;
  cursor: inherit !important;
}

.addtional-updates {
  padding-top: 10px !important;
  padding-left: 15px;
  margin-bottom: 0px;
  border-top: 1px solid #ededec;
  line-height: 25px !important;
}

.addtional-number {
  margin-left: 2px !important;
  margin-right: 2px !important;
}

.compact-list-actions {
  margin-top: 10px;
  margin-bottom: 10px;
}

.compact-list-info {
  padding-top: 10px;
  padding-bottom: 10px;
}

.info-general {
  font-size: 14px;
}

.apps-container {
  margin-top: 10px !important;
}

.card-pf {
  box-shadow: 0px 0px 2px rgba(3, 3, 3, 0.5) !important;
}

.card-pf-title {
  padding: 15px 0;
  padding-bottom: 10px;
  margin: 0px;
}

.title-category {
  padding-bottom: 15px;
}

.card-pf-body {
  max-height: 60px !important;
  min-height: 60px !important;
  margin-top: 0px;
  padding-top: 0px;
}

.card-pf-footer {
  padding: 10px 20px 10px !important;
  min-height: 53px !important;
}

.app-details {
  margin-top: 2px !important;
}

.progress-install {
  margin-top: 0px !important;
  margin-bottom: 0px !important;
}

.progress-install-all {
  margin-top: 8px !important;
  margin-bottom: 0px !important;
}

.progress-label-top-right .progress-bar span {
  max-width: 47%;
  top: -21px;
  height: 20px;
  line-height: 20px;
}

.spinner-margin {
  margin-top: 15px;
  margin-bottom: 15px;
}

.list-view-pf-additional-info > .progress.progress-label-top-right.progress-xs {
  width: 100%;
}

.filter-app {
  width: 25px;
  margin-top: -5px;
}

.selectable-cat:hover {
  cursor: pointer;
  background: #7dc3e8 !important;
}

.selectable:hover {
  cursor: pointer;
  background: #def3ff;
}

.selected {
  background: #0088ce;
}

.selected > .card-pf-title {
  color: white;
}

.selected > .card-pf-body {
  color: white;
}

.search-pf {
  width: 50%;
}

.inline {
  display: inline;
}

.adjust-label-top {
  margin-top: 4px;
}

.list-group-item-container {
  border-bottom: 1px solid #bababa;
  border-top: 1px solid #ecedec;
}

.version-details {
  margin-left: 20px;
}

.has-updates {
  border: 1px solid #ec7a08 !important;
  background-color: #fdf2e5 !important;
}

.limit-progress {
  width: 85%;
}
</style>
