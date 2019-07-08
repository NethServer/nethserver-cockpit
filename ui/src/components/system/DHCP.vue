<template>
  <div v-if="view.isAuth">
    <h2>{{$t('dhcp.title')}}</h2>
    <h3>{{$t('stats')}}</h3>
    <div v-if="!view.isLoaded" class="spinner spinner-lg"></div>
    <div v-if="view.isLoaded">
      <div class="stats-container card-pf-utilization-details">
        <span class="card-pf-utilization-card-details-count">{{stats.reservations}}</span>
        <span class="card-pf-utilization-card-details-description">
          <span
            class="card-pf-utilization-card-details-line-2 stats-text"
          >{{$t('dhcp.reservations')}}</span>
        </span>
      </div>
      <div class="stats-container card-pf-utilization-details">
        <span class="card-pf-utilization-card-details-count">{{stats.leases}}</span>
        <span class="card-pf-utilization-card-details-description">
          <span class="card-pf-utilization-card-details-line-2 stats-text">{{$t('dhcp.leases')}}</span>
        </span>
      </div>
    </div>
    <h3>{{$t('dhcp.interfaces')}}</h3>
    <div v-for="i in ranges" v-bind:key="i.name">
      <div class="row">
        <h4 class="dhcp-int col-sm-2">{{i.name}} <span v-if="i.nslabel" class="gray">{{i.nslabel? ' - '+i.nslabel : ''}}</span></h4>
        <toggle-button
          class="min-toggle"
          :width="40"
          :height="20"
          :color="{checked: '#0088ce', unchecked: '#bbbbbb'}"
          :value="i.props.status"
          :sync="true"
          @change="toggleInterface(i)"
        />
        <button
          v-if="i.props.status"
          @click="toggleInterface(i, false, true)"
          class="btn btn-primary dhcp-mod-btn"
        >{{$t('modify')}}</button>
        <span
          v-if="i.props.DhcpRangeStart && i.props.DhcpRangeStart.length > 0 && i.props.DhcpRangeEnd && i.props.DhcpRangeEnd.length > 0"
          class="gray margin-left-md"
        >({{i.props.DhcpRangeStart}} - {{i.props.DhcpRangeEnd}})</span>
      </div>
    </div>

    <h3>{{$t('action')}}</h3>
    <button
      @click="newIPReservation()"
      class="btn btn-primary btn-lg shutdown-privileged"
      data-action="restart"
      data-container="body"
    >{{$t('dhcp.add_ip_reservation')}}</button>

    <h3>{{$t('dhcp.ip_reservations')}}</h3>
    <div v-if="!view.isLoaded" class="spinner spinner-lg"></div>
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
            :class="[props.row.type == 'disabled' ? 'disabled' : '']"
            @click="props.row.type == 'disabled' ? null : editReservation(props.row)"
          >
            <strong>{{ props.row.name}}</strong>
          </a>
        </td>
        <td class="fancy">{{ props.row.props.Description}}</td>
        <td class="fancy">
          <span class="fa fa-desktop"></span>
          {{props.row.props.IpAddress}}
        </td>
        <td class="fancy">
          <span class="pficon pficon-plugged"></span>
          {{props.row.props.MacAddress}}
        </td>
        <td>
          <button
            v-if="props.row.type == 'disabled'"
            @click="addReservation(props.row)"
            class="btn btn-default btn-primary"
          >
            <span class="pficon pficon-network span-right-margin"></span>
            {{$t('dhcp.ip_reservation')}}
          </button>
          <button
            v-if="props.row.type != 'disabled'"
            @click="editReservation(props.row)"
            class="btn btn-default"
          >
            <span class="fa fa-pencil span-right-margin"></span>
            {{$t('edit')}}
          </button>
          <div v-if="props.row.type != 'disabled'" class="dropup pull-right dropdown-kebab-pf">
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
                <a @click="openDeleteReservation(props.row)">
                  <span class="fa fa-times span-right-margin"></span>
                  {{$t('delete')}}
                </a>
              </li>
            </ul>
          </div>
        </td>
      </template>
    </vue-good-table>

    <div class="modal" id="newReservationModal" tabindex="-1" role="dialog" data-backdrop="static">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title">
              {{newReservation.isEdit ? $t('dhcp.edit_ip_reservation') + ' '+ newReservation.name
              : $t('dhcp.add_ip_reservation')}}
            </h4>
          </div>
          <form class="form-horizontal" v-on:submit.prevent="saveReservation(newReservation)">
            <div class="modal-body">
              <div :class="['form-group', newReservation.errors.name.hasError ? 'has-error' : '']">
                <label
                  class="col-sm-3 control-label"
                  for="textInput-modal-markup"
                >{{$t('dhcp.hostname')}}</label>
                <div class="col-sm-9">
                  <input
                    :disabled="newReservation.isEdit"
                    required
                    type="text"
                    v-model="newReservation.name"
                    class="form-control"
                  >
                  <span
                    v-if="newReservation.errors.name.hasError"
                    class="help-block"
                  >{{$t('validation.validation_failed')}}: {{$t('validation.'+newReservation.errors.name.message)}}</span>
                </div>
              </div>
              <div
                :class="['form-group', newReservation.errors.IpAddress.hasError ? 'has-error' : '']"
              >
                <label
                  class="col-sm-3 control-label"
                  for="textInput-modal-markup"
                >{{$t('dhcp.ip_address')}}</label>
                <div class="col-sm-9">
                  <input
                    required
                    type="text"
                    v-model="newReservation.props.IpAddress"
                    class="form-control"
                  >
                  <span
                    v-if="newReservation.errors.IpAddress.hasError"
                    class="help-block"
                  >{{$t('validation.validation_failed')}}: {{$t('validation.'+newReservation.errors.IpAddress.message)}}</span>
                </div>
              </div>
              <div
                :class="['form-group', newReservation.errors.MacAddress.hasError ? 'has-error' : '']"
              >
                <label
                  class="col-sm-3 control-label"
                  for="textInput-modal-markup"
                >{{$t('dhcp.mac_address')}}</label>
                <div class="col-sm-9">
                  <input
                    required
                    type="text"
                    v-model="newReservation.props.MacAddress"
                    class="form-control"
                  >
                  <span
                    v-if="newReservation.errors.MacAddress.hasError"
                    class="help-block"
                  >{{$t('validation.validation_failed')}}: {{$t('validation.'+newReservation.errors.MacAddress.message)}}</span>
                </div>
              </div>
              <div
                :class="['form-group', newReservation.errors.Description.hasError ? 'has-error' : '']"
              >
                <label
                  class="col-sm-3 control-label"
                  for="textInput-modal-markup"
                >{{$t('dhcp.description')}}</label>
                <div class="col-sm-9">
                  <input
                    type="text"
                    v-model="newReservation.props.Description"
                    class="form-control"
                  >
                  <span
                    v-if="newReservation.errors.Description.hasError"
                    class="help-block"
                  >{{$t('validation.validation_failed')}}: {{$t('validation.'+newReservation.errors.Description.message)}}</span>
                </div>
              </div>
            </div>

            <div class="modal-footer">
              <div v-if="newReservation.isLoading" class="spinner spinner-sm form-spinner-loader"></div>
              <button class="btn btn-default" type="button" data-dismiss="modal">{{$t('cancel')}}</button>
              <button class="btn btn-primary" type="submit">{{$t('save')}}</button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <div
      class="modal"
      id="deleteReservationModal"
      tabindex="-1"
      role="dialog"
      data-backdrop="static"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title">{{$t('dhcp.delete_ip_reservation')}} {{currentReservation.name}}</h4>
          </div>
          <form class="form-horizontal" v-on:submit.prevent="deleteReservation(currentReservation)">
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
              <button class="btn btn-danger" type="submit">{{$t('delete')}}</button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <div
      class="modal"
      id="dhcpInterfaceSetModal"
      tabindex="-1"
      role="dialog"
      data-backdrop="static"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title">
              {{$t('dhcp.'+ currentRange.isEdit ? 'edit' : 'enable' +'_dhcp_on')}}
              {{currentRange.name}}
            </h4>
          </div>
          <form class="form-horizontal" v-on:submit.prevent="saveRange(currentRange)">
            <div class="modal-body">
              <div
                :class="['form-group', currentRange.errors.DhcpRangeStart.hasError ? 'has-error' : '']"
              >
                <label
                  class="col-sm-3 control-label"
                  for="textInput-modal-markup"
                >{{$t('dhcp.range_ip_start')}}</label>
                <div class="col-sm-9">
                  <input
                    required
                    type="text"
                    v-model="currentRange.DhcpRangeStart"
                    class="form-control"
                  >
                  <span
                    v-if="currentRange.errors.DhcpRangeStart.hasError"
                    class="help-block"
                  >{{$t('validation.validation_failed')}}: {{$t('validation.'+currentRange.errors.DhcpRangeStart.message)}}</span>
                </div>
              </div>
              <div
                :class="['form-group', currentRange.errors.DhcpRangeEnd.hasError ? 'has-error' : '']"
              >
                <label
                  class="col-sm-3 control-label"
                  for="textInput-modal-markup"
                >{{$t('dhcp.range_ip_end')}}</label>
                <div class="col-sm-9">
                  <input
                    required
                    type="text"
                    v-model="currentRange.DhcpRangeEnd"
                    class="form-control"
                  >
                  <span
                    v-if="currentRange.errors.DhcpRangeEnd.hasError"
                    class="help-block"
                  >{{$t('validation.validation_failed')}}: {{$t('validation.'+currentRange.errors.DhcpRangeEnd.message)}}</span>
                </div>
              </div>

              <legend class="fields-section-header-pf" aria-expanded="true">
                <span
                  :class="['fa fa-angle-right field-section-toggle-pf', currentRange.advanced ? 'fa-angle-down' : '']"
                ></span>
                <a
                  class="field-section-toggle-pf"
                  @click="toggleAdvancedMode()"
                >{{$t('advanced_mode')}}</a>
              </legend>

              <div
                v-show="currentRange.advanced"
                :class="['form-group', currentRange.errors.DhcpGatewayIP.hasError ? 'has-error' : '']"
              >
                <label
                  class="col-sm-3 control-label"
                  for="textInput-modal-markup"
                >{{$t('dhcp.gateway_ip')}}</label>
                <div class="col-sm-9">
                  <input type="text" v-model="currentRange.DhcpGatewayIP" class="form-control">
                  <span
                    v-if="currentRange.errors.DhcpGatewayIP.hasError"
                    class="help-block"
                  >{{$t('validation.validation_failed')}}: {{$t('validation.'+currentRange.errors.DhcpGatewayIP.message)}}</span>
                </div>
              </div>
              <div
                v-show="currentRange.advanced"
                :class="['form-group', currentRange.errors.DhcpLeaseTime.hasError ? 'has-error' : '']"
              >
                <label
                  class="col-sm-3 control-label"
                  for="textInput-modal-markup"
                >{{$t('dhcp.lease_time')}}</label>
                <div class="col-sm-9">
                  <input type="text" v-model="currentRange.DhcpLeaseTime" class="form-control">
                  <span
                    v-if="currentRange.errors.DhcpLeaseTime.hasError"
                    class="help-block"
                  >{{$t('validation.validation_failed')}}: {{$t('validation.'+currentRange.errors.DhcpLeaseTime.message)}}</span>
                </div>
              </div>
              <div
                v-show="currentRange.advanced"
                :class="['form-group', currentRange.errors.DhcpDomain.hasError ? 'has-error' : '']"
              >
                <label
                  class="col-sm-3 control-label"
                  for="textInput-modal-markup"
                >{{$t('dhcp.domain')}}</label>
                <div class="col-sm-9">
                  <input type="text" v-model="currentRange.DhcpDomain" class="form-control">
                  <span
                    v-if="currentRange.errors.DhcpDomain.hasError"
                    class="help-block"
                  >{{$t('validation.validation_failed')}}: {{$t('validation.'+currentRange.errors.DhcpDomain.message)}}</span>
                </div>
              </div>
              <div
                v-show="currentRange.advanced"
                :class="['form-group', currentRange.errors.DhcpDNS.hasError ? 'has-error' : '']"
              >
                <label class="col-sm-3 control-label" for="textInput-modal-markup">
                  {{$t('dhcp.dns_servers')}}
                  <doc-info
                    :placement="'top'"
                    :title="$t('docs.dhcp_servers')"
                    :chapter="'dhcp_comma_separated_field'"
                    :inline="true"
                  ></doc-info>
                </label>
                <div class="col-sm-9">
                  <input type="text" v-model="currentRange.DhcpDNS" class="form-control">
                  <span
                    v-if="currentRange.errors.DhcpDNS.hasError"
                    class="help-block"
                  >{{$t('validation.validation_failed')}}: {{$t('validation.'+currentRange.errors.DhcpDNS.message)}}</span>
                </div>
              </div>
              <div
                v-show="currentRange.advanced"
                :class="['form-group', currentRange.errors.DhcpWINS.hasError ? 'has-error' : '']"
              >
                <label class="col-sm-3 control-label" for="textInput-modal-markup">
                  {{$t('dhcp.wins_servers')}}
                  <doc-info
                    :placement="'top'"
                    :title="$t('docs.dhcp_servers')"
                    :chapter="'dhcp_comma_separated_field'"
                    :inline="true"
                  ></doc-info>
                </label>
                <div class="col-sm-9">
                  <input type="text" v-model="currentRange.DhcpWINS" class="form-control">
                  <span
                    v-if="currentRange.errors.DhcpWINS.hasError"
                    class="help-block"
                  >{{$t('validation.validation_failed')}}: {{$t('validation.'+currentRange.errors.DhcpWINS.message)}}</span>
                </div>
              </div>
              <div
                v-show="currentRange.advanced"
                :class="['form-group', currentRange.errors.DhcpNTP.hasError ? 'has-error' : '']"
              >
                <label class="col-sm-3 control-label" for="textInput-modal-markup">
                  {{$t('dhcp.ntp_servers')}}
                  <doc-info
                    :placement="'top'"
                    :title="$t('docs.dhcp_servers')"
                    :chapter="'dhcp_comma_separated_field'"
                    :inline="true"
                  ></doc-info>
                </label>
                <div class="col-sm-9">
                  <input type="text" v-model="currentRange.DhcpNTP" class="form-control">
                  <span
                    v-if="currentRange.errors.DhcpNTP.hasError"
                    class="help-block"
                  >{{$t('validation.validation_failed')}}: {{$t('validation.'+currentRange.errors.DhcpNTP.message)}}</span>
                </div>
              </div>
              <div
                v-show="currentRange.advanced"
                :class="['form-group', currentRange.errors.DhcpTFTP.hasError ? 'has-error' : '']"
              >
                <label class="col-sm-3 control-label" for="textInput-modal-markup">
                  {{$t('dhcp.tftp_servers')}}
                  <doc-info
                    :placement="'top'"
                    :title="$t('docs.dhcp_servers')"
                    :chapter="'dhcp_comma_separated_field'"
                    :inline="true"
                  ></doc-info>
                </label>
                <div class="col-sm-9">
                  <input type="text" v-model="currentRange.DhcpTFTP" class="form-control">
                  <span
                    v-if="currentRange.errors.DhcpTFTP.hasError"
                    class="help-block"
                  >{{$t('validation.validation_failed')}}: {{$t('validation.'+currentRange.errors.DhcpTFTP.message)}}</span>
                </div>
              </div>
            </div>

            <div class="modal-footer">
              <div v-if="currentRange.isLoading" class="spinner spinner-sm form-spinner-loader"></div>
              <button
                class="btn btn-default"
                @click="toggleInterface(currentRange, true)"
                type="button"
                data-dismiss="modal"
              >{{$t('cancel')}}</button>
              <button
                class="btn btn-primary"
                type="submit"
              >{{currentRange.isEdit ? $t('modify') : $t('save')}}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
export default {
  name: "DHCP",
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
    this.getRanges();
    this.getReservations();
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
          label: this.$i18n.t("dhcp.hostname"),
          field: "name",
          filterable: true
        },
        {
          label: this.$i18n.t("dhcp.description"),
          field: "props.Description",
          filterable: true
        },
        {
          label: this.$i18n.t("dhcp.ip_address"),
          field: "props.IpAddress",
          filterable: true,
          sortFn: function(a, b, col, rowX, rowY) {
            a = a.split(".");
            b = b.split(".");
            for (var i = 0; i < a.length; i++) {
              if ((a[i] = parseInt(a[i])) < (b[i] = parseInt(b[i]))) return -1;
              else if (a[i] > b[i]) return 1;
            }
          }
        },
        {
          label: this.$i18n.t("dhcp.mac_address"),
          field: "props.MacAddress",
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
      ranges: [],
      currentRange: this.initRange(),
      currentReservation: {},
      newReservation: this.initReservation(),
      stats: {
        reservations: 0,
        leases: 0
      }
    };
  },
  methods: {
    toggleAdvancedMode() {
      this.currentRange.advanced = !this.currentRange.advanced;
      this.$forceUpdate();
    },
    initGraphics() {
      $("#app").css("background", "");
      $("#app").css("color", "");
    },
    initReservation() {
      return {
        isLoading: false,
        isEdit: false,
        props: {
          IpAddress: "",
          MacAddress: "",
          Description: ""
        },
        errors: {
          name: {
            hasError: false,
            message: ""
          },
          IpAddress: {
            hasError: false,
            message: ""
          },
          MacAddress: {
            hasError: false,
            message: ""
          },
          Description: {
            hasError: false,
            message: ""
          }
        }
      };
    },
    initRange() {
      return {
        DhcpRangeStart: "",
        DhcpRangeEnd: "",
        DhcpGatewayIP: "",
        DhcpLeaseTime: "",
        DhcpDomain: "",
        DhcpDNS: "",
        DhcpWINS: "",
        DhcpNTP: "",
        DhcpTFTP: "",
        advanced: false,
        errors: {
          DhcpRangeStart: {
            hasError: false,
            message: ""
          },
          DhcpRangeEnd: {
            hasError: false,
            message: ""
          },
          DhcpGatewayIP: {
            hasError: false,
            message: ""
          },
          DhcpLeaseTime: {
            hasError: false,
            message: ""
          },
          DhcpDomain: {
            hasError: false,
            message: ""
          },
          DhcpDNS: {
            hasError: false,
            message: ""
          },
          DhcpWINS: {
            hasError: false,
            message: ""
          },
          DhcpNTP: {
            hasError: false,
            message: ""
          },
          DhcpTFTP: {
            hasError: false,
            message: ""
          }
        },
        isLoading: false
      };
    },
    getRanges() {
      var context = this;
      context.exec(
        ["system-dhcp/read"],
        null,
        null,
        function(success) {
          try {
            success = JSON.parse(success);
          } catch (e) {
            console.error(e);
          }
          context.view.isLoaded = true;
          context.ranges = success.configuration.ranges;

          for (var i in context.ranges) {
            context.ranges[i].props.status =
              context.ranges[i].props.status == "disabled" ? false : true;
          }
        },
        function(error) {
          console.error(error);
          context.view.isLoaded = true;
        }
      );
    },
    toggleInterface(range, reset, isEdit) {
      if (reset) {
        this.currentRange.original.props.status = !this.currentRange.original
          .props.status;
        this.getRanges();
      } else {
        if (!range.props.status || (range.props.status && isEdit)) {
          this.currentRange = this.initRange();
          this.currentRange.name = range.name;
          this.currentRange.DhcpRangeStart = range.props.DhcpRangeStart;
          this.currentRange.DhcpRangeEnd = range.props.DhcpRangeEnd;
          this.currentRange.DhcpGatewayIP = range.props.DhcpGatewayIP;
          this.currentRange.DhcpLeaseTime = range.props.DhcpLeaseTime;
          this.currentRange.DhcpDomain = range.props.DhcpDomain;
          this.currentRange.DhcpDNS = range.props.DhcpDNS;
          this.currentRange.DhcpWINS = range.props.DhcpWINS;
          this.currentRange.DhcpNTP = range.props.DhcpNTP;
          this.currentRange.DhcpTFTP = range.props.DhcpTFTP;
          this.currentRange.isEdit = isEdit;
          this.currentRange.original = range;
          $("#dhcpInterfaceSetModal").modal("show");
        } else {
          var context = this;

          var rangeObj = Object.assign({}, range.props);
          rangeObj.action = "update-range";
          rangeObj.status = "disabled";
          rangeObj.name = range.name;

          context.exec(
            ["system-dhcp/update"],
            rangeObj,
            null,
            function(success) {
              try {
                success = JSON.parse(success);
              } catch (e) {
                console.error(e);
              }

              // get ranges
              context.getRanges();
            },
            function(error) {
              console.error(error);
            }
          );
        }
      }
    },
    saveRange(range) {
      var context = this;
      null;
      var rangeObj = Object.assign({}, range);
      rangeObj.action = "update-range";
      rangeObj.status = "enabled";

      // validate input
      context.currentRange.isLoading = true;
      context.currentRange.errors.DhcpRangeStart.hasError = false;
      context.currentRange.errors.DhcpRangeEnd.hasError = false;
      context.currentRange.errors.DhcpGatewayIP.hasError = false;
      context.currentRange.errors.DhcpLeaseTime.hasError = false;
      context.currentRange.errors.DhcpDomain.hasError = false;
      context.currentRange.errors.DhcpDNS.hasError = false;
      context.currentRange.errors.DhcpWINS.hasError = false;
      context.currentRange.errors.DhcpNTP.hasError = false;
      context.currentRange.errors.DhcpTFTP.hasError = false;

      var servers = ["DhcpDNS", "DhcpWINS", "DhcpNTP", "DhcpTFTP"];
      servers.forEach(function(el) {
        if (!Array.isArray(rangeObj[el])) {
          if (typeof rangeObj[el] == "string") {
            rangeObj[el] = rangeObj[el].split(",");
          }
        }
      });

      context.exec(
        ["system-dhcp/validate"],
        rangeObj,
        null,
        function(success) {
          context.currentRange.isLoading = false;
          $("#dhcpInterfaceSetModal").modal("hide");

          // update values
          context.exec(
            ["system-dhcp/update"],
            rangeObj,
            function(stream) {
              console.info("range-update", stream);
            },
            function(success) {
              // notification
              context.$parent.notifications.success.message = context.$i18n.t(
                "dhcp.range_update_ok"
              );

              // get reservations
              context.getRanges();
            },
            function(error, data) {
              // notification
              context.$parent.notifications.error.message = context.$i18n.t(
                "dhcp.range_update_error"
              );
            }
          );
        },
        function(error, data) {
          var errorData = {};
          context.currentRange.isLoading = false;
          context.currentRange.errors.DhcpRangeStart.hasError = false;
          context.currentRange.errors.DhcpRangeEnd.hasError = false;
          context.currentRange.errors.DhcpGatewayIP.hasError = false;
          context.currentRange.errors.DhcpLeaseTime.hasError = false;
          context.currentRange.errors.DhcpDomain.hasError = false;
          context.currentRange.errors.DhcpDNS.hasError = false;
          context.currentRange.errors.DhcpWINS.hasError = false;
          context.currentRange.errors.DhcpNTP.hasError = false;
          context.currentRange.errors.DhcpTFTP.hasError = false;

          try {
            errorData = JSON.parse(data);
            for (var e in errorData.attributes) {
              var attr = errorData.attributes[e];
              context.currentRange.errors[attr.parameter].hasError = true;
              context.currentRange.errors[attr.parameter].message = attr.error;
            }
          } catch (e) {
            console.error(e);
          }
        }
      );
    },
    getReservations() {
      var context = this;
      context.exec(
        ["system-dhcp/read"],
        null,
        null,
        function(success) {
          try {
            success = JSON.parse(success);
          } catch (e) {
            console.error(e);
          }
          context.view.isLoaded = true;
          var results = success.configuration.reservations;

          var valid_macs = results.map(function(i) {
            return i.props.MacAddress.toLowerCase();
          });
          context.stats.reservations = valid_macs.length;

          for (var s in success.status) {
            var lease = success.status[s];

            if (valid_macs.indexOf(lease.mac.toLowerCase()) == -1) {
              results.push({
                name: lease.name,
                props: {
                  Description: "",
                  IpAddress: lease.ip,
                  MacAddress: lease.mac
                },
                type: "disabled"
              });
              context.stats.leases++;
            }
          }

          context.rows = results;
        },
        function(error) {
          console.error(error);
          context.rows = [];
          context.view.isLoaded = true;
        }
      );
    },
    saveReservation(ipres) {
      var context = this;

      var reservObj = {
        action: ipres.isEdit ? "update-reservation" : "create-reservation",
        name: ipres.name,
        MacAddress: ipres.props.MacAddress,
        IpAddress: ipres.props.IpAddress,
        Description: ipres.props.Description
      };

      // validate input
      context.newReservation.isLoading = true;
      context.newReservation.errors.name.hasError = false;
      context.newReservation.errors.IpAddress.hasError = false;
      context.newReservation.errors.MacAddress.hasError = false;
      context.newReservation.errors.Description.hasError = false;

      context.exec(
        ["system-dhcp/validate"],
        reservObj,
        null,
        function(success) {
          context.newReservation.isLoading = false;
          $("#newReservationModal").modal("hide");

          // update values
          if (ipres.isEdit) {
            context.exec(
              ["system-dhcp/update"],
              reservObj,
              function(stream) {
                console.info("ip-reservation-update", stream);
              },
              function(success) {
                // notification
                context.$parent.notifications.success.message = context.$i18n.t(
                  "dhcp.ip_reservation_edit_ok"
                );

                // get reservations
                context.getReservations();
              },
              function(error, data) {
                // notification
                context.$parent.notifications.error.message = context.$i18n.t(
                  "dhcp.ip_reservation_edit_error"
                );
              }
            );
          } else {
            context.exec(
              ["system-dhcp/create"],
              reservObj,
              function(stream) {
                console.info("ip-reservation-create", stream);
              },
              function(success) {
                // notification
                context.$parent.notifications.success.message = context.$i18n.t(
                  "dhcp.ip_reservation_create_ok"
                );

                // get reservations
                context.getReservations();
              },
              function(error, data) {
                // notification
                context.$parent.notifications.error.message = context.$i18n.t(
                  "dhcp.ip_reservation_create_error"
                );
              }
            );
          }
        },
        function(error, data) {
          var errorData = {};
          context.newReservation.isLoading = false;
          context.newReservation.errors.name.hasError = false;
          context.newReservation.errors.IpAddress.hasError = false;
          context.newReservation.errors.MacAddress.hasError = false;
          context.newReservation.errors.Description.hasError = false;

          try {
            errorData = JSON.parse(data);
            for (var e in errorData.attributes) {
              var attr = errorData.attributes[e];
              context.newReservation.errors[attr.parameter].hasError = true;
              context.newReservation.errors[attr.parameter].message =
                attr.error;
            }
          } catch (e) {
            console.error(e);
          }
        }
      );
    },
    addReservation(ipres) {
      this.newReservation = this.initReservation();
      this.newReservation.name = ipres.name;
      this.newReservation.props.Description = ipres.props.Description;
      this.newReservation.props.IpAddress = ipres.props.IpAddress;
      this.newReservation.props.MacAddress = ipres.props.MacAddress;
      $("#newReservationModal").modal("show");
    },
    newIPReservation() {
      this.newReservation = this.initReservation();
      $("#newReservationModal").modal("show");
    },
    editReservation(ipres) {
      this.newReservation.name = ipres.name;
      this.newReservation.props.IpAddress = ipres.props.IpAddress;
      this.newReservation.props.MacAddress = ipres.props.MacAddress;
      this.newReservation.props.Description = ipres.props.Description;

      this.newReservation.isEdit = true;
      this.newReservation.errors = {
        name: {
          hasError: false,
          message: ""
        },
        IpAddress: {
          hasError: false,
          message: ""
        },
        MacAddress: {
          hasError: false,
          message: ""
        },
        Description: {
          hasError: false,
          message: ""
        }
      };
      $("#newReservationModal").modal("show");
    },
    openDeleteReservation(ipres) {
      this.currentReservation = Object.assign({}, ipres);
      $("#deleteReservationModal").modal("show");
    },
    deleteReservation(ipres) {
      var context = this;

      $("#deleteReservationModal").modal("hide");
      context.exec(
        ["system-dhcp/delete"],
        {
          name: ipres.name,
          action: "delete-reservation"
        },
        function(stream) {
          console.info("ip-reservation-delete", stream);
        },
        function(success) {
          // notification
          context.$parent.notifications.success.message = context.$i18n.t(
            "dhcp.ip_reservation_delete_ok"
          );

          // get reservations
          context.getReservations();
        },
        function(error, data) {
          // notification
          context.$parent.notifications.error.message = context.$i18n.t(
            "dhcp.ip_reservation_delete_error"
          );
        }
      );
    }
  }
};
</script>

<style>
</style>
