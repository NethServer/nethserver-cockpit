<template>
  <div v-if="view.isAuth">
    <h2>{{$t('services.title')}}</h2>
    <h3>{{$t('stats')}}</h3>
    <div v-if="!view.isLoaded" class="spinner spinner-lg"></div>
    <div v-if="view.isLoaded">
      <div class="stats-container card-pf-utilization-details">
        <span class="card-pf-utilization-card-details-count">{{stats.servicesCount}}</span>
        <span class="card-pf-utilization-card-details-description">
          <span
            class="card-pf-utilization-card-details-line-2 stats-text"
          >{{$t('services.configured')}}</span>
        </span>
      </div>
      <div class="stats-container card-pf-utilization-details">
        <span class="card-pf-utilization-card-details-count">{{stats.servicesEnabledCount}}</span>
        <span class="card-pf-utilization-card-details-description">
          <span
            class="card-pf-utilization-card-details-line-2 stats-text"
          >{{$t('services.enabled')}}</span>
        </span>
      </div>
      <div class="stats-container card-pf-utilization-details">
        <span class="card-pf-utilization-card-details-count">{{stats.servicesRunningCount}}</span>
        <span class="card-pf-utilization-card-details-description">
          <span
            class="card-pf-utilization-card-details-line-2 stats-text"
          >{{$t('services.running')}}</span>
        </span>
      </div>
    </div>

    <h3>{{$t('actions')}}</h3>
    <div class="mg-bottom-30">
      <button
        @click="openAddCustomServiceModal()"
        class="btn btn-primary btn-lg"
        data-action="addCustomService"
        data-container="body"
        v-if="view.isLoaded"
      >{{$t('services.add_custom_service')}}</button>
    </div>

    <h3>{{$t('list')}}</h3>
    <div v-if="hints.count > 0" class="alert alert-warning alert-dismissable">
      <span class="pficon pficon-warning-triangle-o"></span>
      <strong>{{$t('hints_suggested')}}:</strong>
      <li v-for="(m,t) in hints.details" v-bind:key="t">
        <strong>{{t}}</strong>
        : {{$t('hints.'+m)}}
      </li>
      <span
        v-if="hints.message && hints.message.length > 0"
      >{{hints.message && $t('hints.'+hints.message)}}</span>
    </div>
    <div v-if="!view.isLoaded" class="spinner spinner-lg"></div>
    <!-- show all / network services only -->
    <form class="form-horizontal mg-top-20" v-if="view.isLoaded">
      <div class="form-group no-mg-bottom">
        <label
          class="col-sm-3 control-label show-all-services"
          for="show-all-services"
        >{{$t('services.network_services_only')}}</label>
        <div class="col-sm-1 mg-bottom-10">
          <input
            id="show-all-services"
            type="checkbox"
            :checked="showNetworkServicesOnly"
            class="form-control mg-top-minus-2"
            @click="toggleShowNetworkServicesOnly()"
          />
        </div>
      </div>
    </form>
    <vue-good-table
      v-if="view.isLoaded"
      :pagination-options="{
        enabled: true,
        perPageDropdown: [25, 50, 100],
        perPage: 25,
        nextLabel: tableLangsTexts.nextText,
        prevLabel: tableLangsTexts.prevText,
        ofLabel: tableLangsTexts.ofText,
        rowsPerPageLabel: tableLangsTexts.rowsPerPageText,
      }"
      :columns="columns"
      :rows="filteredRows"
      :sort-options="{
        enabled: true,
        initialSortBy: {field: 'name', type: 'asc'},
      }"
      :search-options="{
        enabled: true,
        placeholder: tableLangsTexts.globalSearchPlaceholder,
      }"
      styleClass="table vgt2"
    >
      <template slot="table-row" slot-scope="props">
        <span v-if="props.column.field == 'name'">
          <span
            v-if="checkHints(props.row.name)"
            class="pficon pficon-warning-triangle-o panel-icon"
          ></span>
          <strong>{{ props.row.name}}</strong>
          <span v-if="props.row.custom" class="gray mg-left-5">(custom)</span>
        </span>
        <span v-if="props.column.field == 'description'">
          {{ props.row.description}}
        </span>
        <span v-if="props.column.field == 'enabled'">
          <span :class="['fa', props.row.enabled ? 'fa-check green' : 'fa-times red']"></span>
        </span>
        <span v-if="props.column.field == 'running'">
          <span :class="['fa', props.row.running ? 'fa-check green' : 'fa-times red']"></span>
        </span>
        <span v-if="props.column.field == 'access'">
          <span
            v-for="(zone, i) in props.row.ports.access.split(',')"
            v-bind:key="i"
            :class="['label', 'label-info', defaultZones.includes(zone) ? 'bg-' + zone : 'bg-missing', 'pad-left-right-sm']"
          >{{ zone }}</span>
          <!-- show "localhost" for network services with access=<none> -->
          <span
            v-if="!props.row.ports.access && (props.row.ports.TCP.length > 0 ||
            props.row.ports.UDP.length > 0)"
            class="label label-info bg-gray pad-left-right-sm"
          >localhost</span>
        </span>
        <span v-if="props.column.field == 'ports'">
          <span v-if="props.row.ports.TCP.length" class="mg-right-5">
            <b>TCP:</b>
            {{ props.row.ports.TCP.join(', ') }}
          </span>
          <span v-if="props.row.ports.UDP.length">
            <b>UDP:</b>
            {{ props.row.ports.UDP.join(', ') }}
          </span>
        </span>
        <span v-if="props.column.field == 'details'">
          <a @click="openDetails(props.row)">
            <span>{{$t('view')}}</span>
          </a>
        </span>
        <span v-if="props.column.field == 'action'">
          <!-- actions for systemd services -->
          <span v-if="!props.row.custom">
            <button
              @click="props.row.running ? restartService(props.row.name) : startService(props.row.name)"
              class="btn btn-default button-minimum"
            >
              <span
                :class="['fa', props.row.running ? 'fa-refresh' : 'fa-play', 'span-right-margin']"
              ></span>
              {{props.row.running ? $t('services.restart') : $t('services.start') }}
            </button>
            <div class="dropup pull-right dropdown-kebab-pf">
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
                <li>
                  <a @click="statusService(props.row.name)">
                    <span class="fa fa-search action-icon-menu"></span>
                    {{$t('services.status')}}
                  </a>
                </li>
                <li role="separator" class="divider"></li>
                <li>
                  <a
                    @click="props.row.enabled ? disableService(props.row.name) : enableService(props.row.name)"
                  >
                    <span
                      :class="['fa', props.row.enabled ? 'fa-times' : 'fa-check', 'action-icon-menu']"
                    ></span>
                    {{props.row.enabled ? $t('services.disable') : $t('services.enable') }}
                  </a>
                </li>
                <li v-if="props.row.running">
                  <a @click="stopService(props.row.name)">
                    <span class="fa fa-power-off action-icon-menu"></span>
                    {{$t('services.stop')}}
                  </a>
                </li>
                <li>
                  <a @click="openEditService(props.row)">
                    <span class="fa fa-edit span-right-margin action-icon-menu"></span>
                    {{$t('edit')}}
                  </a>
                </li>
              </ul>
            </div>
          </span>
          <!-- actions for custom services -->
          <span v-if="props.row.custom">
            <button @click="openEditService(props.row)" class="btn btn-default button-minimum">
              <span class="fa fa-edit span-right-margin"></span>
              {{ $t('edit') }}
            </button>
            <div class="dropup pull-right dropdown-kebab-pf">
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
                <li>
                  <a @click="openRemoveCustomService(props.row)">
                    <span class="fa fa-times action-icon-menu"></span>
                    {{$t('remove')}}
                  </a>
                </li>
              </ul>
            </div>
          </span>
        </span>
      </template>
    </vue-good-table>

    <div class="modal" id="statusModal" tabindex="-1" role="dialog" data-backdrop="static">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title">{{$t('services.status_of')}} {{currentDetails.name}}</h4>
          </div>
          <form class="form-horizontal">
            <div class="modal-body">
              <div class="form-group">
                <div class="col-sm-12">
                  <div v-if="!currentDetails.status" class="spinner spinner-sm"></div>
                  <pre v-if="currentDetails.status" class="prettyprint">{{currentDetails.status}}</pre>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button
                @click="cleanStatus()"
                class="btn btn-default"
                type="button"
                data-dismiss="modal"
              >{{$t('close')}}</button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <div class="modal" id="detailsModal" tabindex="-1" role="dialog" data-backdrop="static">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title">{{$t('services.details_of')}} {{currentDetails.name}}</h4>
          </div>
          <form class="form-horizontal">
            <div class="modal-body">
              <div class="form-group">
                <label
                  class="col-sm-3 control-label no-padding-top"
                  for="textInput-modal-markup"
                >{{$t('services.properties')}}</label>
                <div class="col-sm-9">
                  <dl class="dl-horizontal">
                    <span v-for="(p,kp) in currentDetails.props" v-bind:key="kp">
                      <dt>{{kp}}</dt>
                      <dd>{{p || '-'}}</dd>
                    </span>
                    <span v-if="currentDetails.props.length == 0">
                      <dt>-</dt>
                      <dd></dd>
                    </span>
                  </dl>
                </div>
              </div>
              <div class="form-group">
                <label
                  class="col-sm-3 control-label no-padding-top"
                  for="textInput-modal-markup"
                >{{$t('services.network')}}</label>
                <div class="col-sm-9">
                  <dl class="dl-horizontal">
                    <span v-for="(p,kp) in currentDetails.ports" v-bind:key="kp">
                      <dt>{{kp}}</dt>
                      <dd>{{kp == 'access' ? (p || '-') : (p.join(', ') || '-')}}</dd>
                    </span>
                  </dl>
                </div>
              </div>
            </div>
            <div class="modal-footer submit">
              <button class="btn btn-default" type="button" data-dismiss="modal">{{$t('close')}}</button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- remove service modal -->
    <div
      class="modal"
      id="removeCustomServiceModal"
      tabindex="-1"
      role="dialog"
      data-backdrop="static"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h4
              class="modal-title"
            >{{$t('services.remove_custom_service')}} {{ serviceToRemove.name }}</h4>
          </div>
          <form class="form-horizontal" v-on:submit.prevent="removeCustomService()">
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
              <button class="btn btn-danger" type="submit">{{$t('remove')}}</button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- add / edit service modal -->
    <div class="modal" id="edit-service-modal" tabindex="-1" role="dialog" data-backdrop="static">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title">
              <span v-if="currentService.isEdit">{{$t('services.edit_service')}}</span>
              <span v-else>{{$t('services.add_custom_service')}}</span>
            </h4>
          </div>
          <form
            class="form-horizontal"
            v-on:submit.prevent="currentService.isEdit ? editService() : addCustomService()"
          >
            <div class="modal-body">
              <!-- name -->
              <div
                :class="['form-group', currentService.errorProps['serviceName'] ? 'has-error' : '']"
              >
                <label class="col-sm-3 control-label">{{$t('services.name')}}</label>
                <div class="col-sm-9">
                  <input
                    required
                    type="text"
                    v-model="currentService.name"
                    class="form-control"
                    :disabled="currentService.isEdit"
                  />
                  <span
                    v-if="currentService.errorProps['serviceName']"
                    class="help-block"
                  >{{$t('validation.' + currentService.errorProps['serviceName'])}}</span>
                </div>
              </div>
              <!-- tcp ports -->
              <div
                :class="['form-group', currentService.errorProps['tcpPorts'] || currentService.errorProps['no_tcp_udp_ports'] ? 'has-error' : '']"
              >
                <label class="col-sm-3 control-label">
                  {{$t('services.tcpPorts')}}
                  <doc-info :placement="'top'" :chapter="'list_of_ports'" :inline="true"></doc-info>
                </label>
                <div class="col-sm-9">
                  <input
                    type="text"
                    v-model="currentService.tcpPorts"
                    class="form-control"
                    :disabled="!currentService.custom"
                  />
                  <span
                    v-if="currentService.errorProps['tcpPorts']"
                    class="help-block"
                  >{{$t('validation.' + currentService.errorProps['tcpPorts'])}}</span>
                </div>
              </div>
              <!-- udp ports -->
              <div
                :class="['form-group', currentService.errorProps['udpPorts'] || currentService.errorProps['no_tcp_udp_ports'] ? 'has-error' : '']"
              >
                <label class="col-sm-3 control-label">
                  {{$t('services.udpPorts')}}
                  <doc-info :placement="'top'" :chapter="'list_of_ports'" :inline="true"></doc-info>
                </label>
                <div class="col-sm-9">
                  <input
                    type="text"
                    v-model="currentService.udpPorts"
                    class="form-control"
                    :disabled="!currentService.custom"
                  />
                  <span
                    v-if="currentService.errorProps['udpPorts']"
                    class="help-block"
                  >{{$t('validation.' + currentService.errorProps['udpPorts'])}}</span>
                </div>
              </div>
              <!-- access -->
              <div :class="['form-group', currentService.errorProps['access'] ? 'has-error' : '']">
                <label class="col-sm-3 control-label">{{$t('services.access')}}</label>
                <div class="col-sm-9">
                  <select
                    @change="addZoneToCurrentService(currentService.selectedZone)"
                    v-model="currentService.selectedZone"
                    class="combobox form-control"
                  >
                    <option v-for="(zone, i) in accessZones" v-bind:key="i">{{ zone }}</option>
                  </select>
                  <span
                    v-if="currentService.errorProps['access']"
                    class="help-block"
                  >{{$t('validation.' + currentService.errorProps['access'])}}</span>
                </div>
              </div>
              <div class="form-group">
                <label class="col-sm-3 control-label"></label>
                <div class="col-sm-9">
                  <ul class="list-inline compact">
                    <li v-for="(zone, i) in currentService.access" v-bind:key="i">
                      <span
                        :class="['label', 'label-info', defaultZones.includes(zone) ? 'bg-' + zone : 'bg-missing']"
                      >
                        {{ zone }}
                        <a
                          @click="removeZoneFromcurrentService(i)"
                          class="remove-item-inline"
                        >
                          <span class="fa fa-times"></span>
                        </a>
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div class="modal-footer submit">
              <button class="btn btn-default" type="button" data-dismiss="modal">{{$t('cancel')}}</button>
              <button
                class="btn btn-primary"
                type="submit"
              >{{ currentService.isEdit ? $t('edit') : $t('add') }}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Services",
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.exec(
        ["system-authorization/read"],
        null,
        null,
        function(success) {
          try {
            success = JSON.parse(success);
          } catch (e) {
            console.error(e);
          }

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
  beforeRouteLeave(to, from, next) {
    $(".modal").modal("hide");
    next();
  },
  mounted() {
    this.initGraphics();
    this.getServices();
    this.getAccessZones();
    this.getHints();
  },
  watch: {
    rows: function() {
      var context = this;
      this.getHints(function() {
        context.$parent.hints.services.count = context.hints.count;
      });
    }
  },
  data() {
    return {
      view: {
        isLoaded: false,
        isAuth: false
      },
      tableLangsTexts: this.tableLangs(),
      columns: [
        {
          label: this.$i18n.t("services.name"),
          field: "name",
          filterable: true
        },
        {
          label: this.$i18n.t("services.description"),
          field: "description",
          filterable: true
        },
        {
          label: this.$i18n.t("services.enabled"),
          field: "enabled",
          filterable: true,
          type: "number"
        },
        {
          label: this.$i18n.t("services.running"),
          field: "running",
          filterable: true,
          type: "number"
        },
        {
          label: this.$i18n.t("services.access"),
          field: "access",
          filterable: true,
          sortable: false
        },
        {
          label: this.$i18n.t("services.ports"),
          field: "ports",
          filterable: true,
          sortable: false
        },
        {
          label: this.$i18n.t("details"),
          field: "details",
          filterable: false,
          sortable: false
        },
        {
          label: this.$i18n.t("action"),
          field: "action",
          filterable: true,
          sortable: false
        }
      ],
      rows: [],
      filteredRows: [],
      currentDetails: {
        props: {},
        ports: {},
        isLoading: false,
        status: null,
        name: ""
      },
      stats: {
        servicesCount: 0,
        servicesEnabledCount: 0,
        servicesRunningCount: 0
      },
      hints: {},
      showNetworkServicesOnly: localStorage.getItem("showNetworkServicesOnly") === "true" || false,
      currentService: this.initService(),
      serviceToRemove: {
        name: null
      },
      defaultZones: ["green", "red", "blue", "orange"],
      accessZones: []
    };
  },
  methods: {
    initGraphics() {
      $("#app").css("background", "");
      $("#app").css("color", "");
    },
    getHints(callback) {
      var context = this;
      context.execHints(
        "system-services",
        function(success) {
          context.hints = success;
          callback ? callback() : null;
        },
        function(error) {
          console.error(error);
        }
      );
    },
    checkHints(service) {
      return (
        this.hints.details &&
        this.hints.details[service] &&
        this.hints.details[service].length > 0
      );
    },
    isEmpty: function(obj) {
      if (obj) {
        return Object.keys(obj).lenght === 0;
      } else return true;
    },
    getAccessZones() {
      var context = this;

      nethserver.exec(
        ["nethserver-firewall-base/rules/read"],
        {
          action: "roles"
        },
        null,
        function(success) {
          try {
            success = JSON.parse(success);
          } catch (e) {
            console.error(e);
          }
          var roles = success.roles;

          nethserver.exec(
            ["nethserver-firewall-base/objects/read"],
            {
              action: "zones"
            },
            null,
            function(success) {
              try {
                success = JSON.parse(success);
              } catch (e) {
                console.error(e);
              }
              var zones = success.zones.map(zone => zone.name);
              context.accessZones = roles.concat(zones);
            },
            function(error) {
              console.error(error);
            }
          );
        },
        function(error) {
          console.error(error);
        }
      );
    },
    getServices() {
      var context = this;
      context.exec(
        ["system-services/read"],
        {
          action: "list"
        },
        null,
        function(success) {
          try {
            success = JSON.parse(success);
          } catch (e) {
            console.error(e);
          }
          context.view.isLoaded = true;
          for (var c in success.configuration) {
            var config = success.configuration[c];
            for (var s in success.status) {
              var status = success.status[s];
              if (status.name == config.name) {
                config.running = status.running;
                config.enabled = status.status;
              }
            }
          }
          context.rows = success.configuration;
          context.filterServices();

          context.stats.servicesCount = success.status.length;
          context.stats.servicesEnabledCount = success.status.filter(function(
            s
          ) {
            return s.status == 1;
          }).length;
          context.stats.servicesRunningCount = success.status.filter(function(
            s
          ) {
            return s.running == 1;
          }).length;
        },
        function(error) {
          console.error(error);
        }
      );
    },
    enableService(service) {
      var context = this;
      context.exec(
        ["system-services/update"],
        {
          action: "enable",
          name: service
        },
        function(stream) {
          console.info("service", stream);
        },
        function(success) {
          // notification
          context.$parent.notifications.success.message = context.$i18n.t(
            "services.service_action_ok"
          );

          // get hosts
          context.getServices();
        },
        function(error) {
          // notification
          context.$parent.notifications.error.message = context.$i18n.t(
            "dns.service_action_error"
          );
        }
      );
    },

    disableService(service) {
      var context = this;
      context.exec(
        ["system-services/update"],
        {
          action: "disable",
          name: service
        },
        function(stream) {
          console.info("service", stream);
        },
        function(success) {
          // notification
          context.$parent.notifications.success.message = context.$i18n.t(
            "services.service_action_ok"
          );

          // get hosts
          context.getServices();
        },
        function(error) {
          // notification
          context.$parent.notifications.error.message = context.$i18n.t(
            "dns.service_action_error"
          );
        }
      );
    },

    startService(service) {
      var context = this;
      context.exec(
        ["system-services/update"],
        {
          action: "start",
          name: service
        },
        function(stream) {
          console.info("service", stream);
        },
        function(success) {
          // notification
          context.$parent.notifications.success.message = context.$i18n.t(
            "services.service_action_ok"
          );

          // get hosts
          context.getServices();
        },
        function(error) {
          // notification
          context.$parent.notifications.error.message = context.$i18n.t(
            "dns.service_action_error"
          );
        }
      );
    },

    stopService(service) {
      var context = this;
      context.exec(
        ["system-services/update"],
        {
          action: "stop",
          name: service
        },
        function(stream) {
          console.info("service", stream);
        },
        function(success) {
          // notification
          context.$parent.notifications.success.message = context.$i18n.t(
            "services.service_action_ok"
          );

          // get hosts
          context.getServices();
        },
        function(error) {
          // notification
          context.$parent.notifications.error.message = context.$i18n.t(
            "dns.service_action_error"
          );
        }
      );
    },

    restartService(service) {
      var context = this;
      context.exec(
        ["system-services/update"],
        {
          action: "restart",
          name: service
        },
        function(stream) {
          console.info("service", stream);
        },
        function(success) {
          // notification
          context.$parent.notifications.success.message = context.$i18n.t(
            "services.service_action_ok"
          );

          // get hosts
          context.getServices();
        },
        function(error) {
          // notification
          context.$parent.notifications.error.message = context.$i18n.t(
            "dns.service_action_error"
          );
        }
      );
    },

    statusService(service) {
      var context = this;

      context.currentDetails.isLoading = true;
      context.currentDetails.status = null;
      context.currentDetails.name = service;

      $("#statusModal").modal("show");
      context.exec(
        ["system-services/read"],
        {
          action: "status",
          name: service
        },
        null,
        function(success) {
          try {
            success = JSON.parse(success);
          } catch (e) {
            console.error(e);
          }
          context.currentDetails.status = success.data;

          context.currentDetails.isLoading = false;
          context.$forceUpdate();
        },
        function(error) {
          console.log(error);
        }
      );
    },
    cleanStatus() {
      this.currentDetails.status = null;
    },

    openDetails(obj) {
      this.currentDetails = obj;
      $("#detailsModal").modal("show");
    },

    toggleShowNetworkServicesOnly() {
      this.showNetworkServicesOnly = !this.showNetworkServicesOnly;
      localStorage.setItem("showNetworkServicesOnly", this.showNetworkServicesOnly)
      this.filterServices();
    },

    filterServices() {
      if (this.showNetworkServicesOnly) {
        this.filteredRows = this.rows.filter(function(service) {
          return (
            service.ports.access ||
            service.ports.TCP.length > 0 ||
            service.ports.UDP.length > 0
          );
        });
      } else {
        // show all services
        this.filteredRows = this.rows;
      }
    },

    openAddCustomServiceModal() {
      this.currentService = this.initService();
      $("#edit-service-modal").modal("show");
    },

    removeZoneFromcurrentService(index) {
      this.currentService.access.splice(index, 1);
    },

    zoneAlreadyAdded(zone) {
      return this.currentService.access.indexOf(zone) > -1;
    },

    addZoneToCurrentService(zone) {
      if (zone.length > 0 && zone != "-") {
        if (!this.zoneAlreadyAdded(zone)) {
          this.currentService.access.push(zone);
        }
      }
    },

    initService() {
      return {
        name: "",
        access: [],
        tcpPorts: "",
        udpPorts: "",
        custom: 1,
        selectedZone: null,
        errorProps: [],
        isEdit: false
      };
    },

    mapService(service) {
      return {
        name: service.name,
        access:
          service.ports.access === "" ? [] : service.ports.access.split(","),
        tcpPorts: service.ports.TCP.join(", "),
        udpPorts: service.ports.UDP.join(", "),
        custom: service.custom,
        selectedZone: null,
        errorProps: [],
        isEdit: false
      };
    },

    openRemoveCustomService(service) {
      this.serviceToRemove = service;
      $("#removeCustomServiceModal").modal("show");
    },

    removeCustomService() {
      var context = this;
      $("#removeCustomServiceModal").modal("hide");

      var deleteServiceObj = {
        action: "service-delete",
        serviceName: context.serviceToRemove.name
      };

      nethserver.notifications.success = context.$i18n.t(
        "services.service_removed_successfully"
      );
      nethserver.notifications.error = context.$i18n.t(
        "services.service_removed_error"
      );

      context.exec(
        ["system-services/delete"],
        deleteServiceObj,
        function(stream) {
          console.info("service-delete", stream);
        },
        function(success) {
          context.getServices();
        },
        function(error, data) {
          console.error(error);
        }
      );
    },

    openEditService(service) {
      this.currentService = this.mapService(service);
      this.currentService.isEdit = true;
      $("#edit-service-modal").modal("show");
    },

    editService() {
      var context = this;
      var tcpPorts = [];
      var udpPorts = [];
      context.currentService.errorProps = [];

      if (context.currentService.tcpPorts) {
        // remove spaces and convert to array
        tcpPorts = context.currentService.tcpPorts
          .replace(/\s/g, "")
          .split(",");
      }

      if (context.currentService.udpPorts) {
        // remove spaces and convert to array
        udpPorts = context.currentService.udpPorts
          .replace(/\s/g, "")
          .split(",");
      }

      var editServiceObj = {
        action: "edit",
        serviceName: context.currentService.name.trim(),
        access: context.currentService.access,
        tcpPorts: tcpPorts,
        udpPorts: udpPorts,
        custom: context.currentService.custom
      };

      context.exec(
        ["system-services/validate"],
        editServiceObj,
        null,
        function(success) {
          $("#edit-service-modal").modal("hide");

          nethserver.notifications.success = context.$i18n.t(
            "services.service_edited_successfully"
          );
          nethserver.notifications.error = context.$i18n.t(
            "services.service_edited_error"
          );

          context.exec(
            ["system-services/update"],
            editServiceObj,
            function(stream) {
              console.info("serviceEdit", stream);
            },
            function(success) {
              context.currentService = context.initService();
              context.getServices();
            },
            function(error, data) {
              console.error(error);
            }
          );
        },
        function(error, data) {
          var errorData = {};

          try {
            errorData = JSON.parse(data);
            for (var e in errorData.attributes) {
              var attr = errorData.attributes[e];
              context.currentService.errorProps[attr.parameter] = attr.error;
            }
            context.$forceUpdate();
          } catch (e) {
            console.error(e);
          }
        }
      );
    },

    addCustomService() {
      var context = this;
      var tcpPorts = [];
      var udpPorts = [];
      context.currentService.errorProps = [];

      if (context.currentService.tcpPorts) {
        tcpPorts = context.currentService.tcpPorts
          .replace(/\s/g, "")
          .split(",");
      }

      if (context.currentService.udpPorts) {
        udpPorts = context.currentService.udpPorts
          .replace(/\s/g, "")
          .split(",");
      }

      var addServiceObj = {
        action: "service-create",
        serviceName: context.currentService.name.trim(),
        access: context.currentService.access,
        tcpPorts: tcpPorts,
        udpPorts: udpPorts
      };

      context.exec(
        ["system-services/validate"],
        addServiceObj,
        null,
        function(success) {
          $("#edit-service-modal").modal("hide");

          nethserver.notifications.success = context.$i18n.t(
            "services.service_added_successfully"
          );
          nethserver.notifications.error = context.$i18n.t(
            "services.service_added_error"
          );

          context.exec(
            ["system-services/create"],
            addServiceObj,
            function(stream) {
              console.info("service-create", stream);
            },
            function(success) {
              context.currentService = context.initService();
              context.getServices();
            },
            function(error, data) {
              console.error(error);
            }
          );
        },
        function(error, data) {
          var errorData = {};

          try {
            errorData = JSON.parse(data);
            for (var e in errorData.attributes) {
              var attr = errorData.attributes[e];
              context.currentService.errorProps[attr.parameter] = attr.error;
            }
            context.$forceUpdate();
          } catch (e) {
            console.error(e);
          }
        }
      );
    }
  }
};
</script>

<style>
.show-all-services {
  padding-left: 0;
  width: auto;
  margin-left: 20px;
}

.mg-top-20 {
  margin-top: 20px !important;
}

.mg-bottom-10 {
  margin-bottom: 10px;
}

.mg-bottom-30 {
  margin-bottom: 30px;
}

.mg-top-minus-2 {
  margin-top: -2px !important;
}

.mg-left-5 {
  margin-left: 5px;
}

.remove-item-inline {
  color: white !important;
}

.pad-left-right-sm {
  padding-left: 0.4em;
  padding-right: 0.4em;
}

.mg-right-5 {
  margin-right: 5px;
}

.no-mg-bottom {
  margin-bottom: 0;
}
</style>