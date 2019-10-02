<template>
  <div>
    <h2>{{$t('dashboard.title')}}</h2>
    <div
      v-if="(view.isAdmin && (hints.details.hostname && hints.details.hostname.count > 0)) || (view.isAdmin && (hints.details.dns && hints.details.dns.count > 0)) || (view.isAdmin && (hints.details.company && hints.details.company.count > 0))"
      class="alert alert-warning alert-dismissable"
    >
      <span class="pficon pficon-warning-triangle-o"></span>
      <strong>{{$t('hints_suggested')}}:</strong>
      <li v-if="m.count > 0" v-for="(m,t) in hints.details" v-bind:key="t">
        <strong>{{$t('hints.'+t) | capitalize}}</strong>
        :
        {{$t('hints.'+m.message)}}
      </li>
      <span
        v-if="hints.message && hints.message.length > 0"
      >{{hints.message && $t('hints.'+hints.message)}}</span>
    </div>
    <div class="row row-dashboard">
      <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
        <form class="form-horizontal">
          <div class="form-group compact">
            <label class="col-sm-3 control-label">{{$t('dashboard.hardware')}}</label>
            <div class="col-sm-9 adjust-li">
              <div v-if="loaders.summary" class="spinner spinner-xs list-spinner-loader"></div>
              <p v-if="!loaders.summary">{{system.summary.hardware}}</p>
            </div>
          </div>
          <div class="form-group compact">
            <label class="col-sm-3 control-label">{{$t('dashboard.cpu')}}</label>
            <div class="col-sm-9 adjust-li">
              <div v-if="loaders.summary" class="spinner spinner-xs list-spinner-loader"></div>
              <p v-if="!loaders.summary">{{system.summary.cpu}}</p>
            </div>
          </div>
          <div class="form-group compact">
            <label class="col-sm-3 control-label">{{$t('dashboard.kernel_release')}}</label>
            <div class="col-sm-9 adjust-li">
              <div v-if="loaders.summary" class="spinner spinner-xs list-spinner-loader"></div>
              <p v-if="!loaders.summary">{{system.summary.kernelRelease}}</p>
            </div>
          </div>
          <div class="form-group compact">
            <label class="col-sm-3 control-label">{{$t('dashboard.operating_system')}}</label>
            <div class="col-sm-9 adjust-li">
              <div v-if="loaders.summary" class="spinner spinner-xs list-spinner-loader"></div>
              <p v-if="!loaders.summary">{{system.summary.osRelease}}</p>
            </div>
          </div>
          <div class="form-group compact">
            <label class="col-sm-3 control-label">{{$t('dashboard.load')}}</label>
            <div class="col-sm-9 adjust-li">
              <div v-if="loaders.summary" class="spinner spinner-xs list-spinner-loader"></div>
              <p v-if="!loaders.summary">{{system.summary.load}}</p>
            </div>
          </div>
          <div class="form-group compact">
            <label class="col-sm-3 control-label">{{$t('dashboard.uptime')}}</label>
            <div class="col-sm-9 adjust-li">
              <div v-if="loaders.summary" class="spinner spinner-xs list-spinner-loader"></div>
              <p v-if="!loaders.summary">{{system.summary.uptime}}</p>
            </div>
          </div>
          <div class="form-group compact">
            <label class="col-sm-3 control-label">{{$t('dashboard.hostname')}}</label>
            <div class="col-sm-9 adjust-li">
              <div v-if="loaders.hostname" class="spinner spinner-xs list-spinner-loader"></div>
              <p>
                <a
                  v-bind:class="{ disable_a_href: !view.isAdmin }"
                  v-if="!loaders.hostname"
                  data-toggle="modal"
                  data-target="#hostnameChangeModal"
                  href="#"
                >{{system.summary.hostname}}</a>
              </p>
            </div>
          </div>
          <div class="form-group compact">
            <label class="col-sm-3 control-label">{{$t('dashboard.dns')}}</label>
            <div class="col-sm-9 adjust-li">
              <div v-if="loaders.dns" class="spinner spinner-xs list-spinner-loader"></div>
              <p>
                <a
                  v-bind:class="{ disable_a_href: !view.isAdmin }"
                  v-if="!loaders.dns"
                  data-toggle="modal"
                  data-target="#dnsChangeModal"
                  href="#"
                >
                  <span v-for="(d,i) in system.summary.dns" v-bind:key="i">
                    {{d.readDns}}
                    <span
                      v-if="!i == system.summary.dns.length - 1 && system.summary.dns[1].readDns.length != 0"
                    >,</span>
                  </span>
                </a>
                <a
                  v-bind:class="{ disable_a_href: !view.isAdmin }"
                  v-if="!loaders.dns && system.summary.dns[0].readDns.length == 0"
                  data-toggle="modal"
                  data-target="#dnsChangeModal"
                  href="#"
                >{{$t('edit')}}</a>
              </p>
            </div>
          </div>
          <div class="form-group compact">
            <label class="col-sm-3 control-label">{{$t('dashboard.system_time')}}</label>
            <div class="col-sm-9 adjust-li">
              <div v-if="loaders.datetime" class="spinner spinner-xs list-spinner-loader"></div>
              <p>
                <a
                  v-bind:class="{ disable_a_href: !view.isAdmin }"
                  v-if="!loaders.datetime"
                  @click="openChangeSystime()"
                  href="#"
                >{{system.summary.datetime}}</a>
              </p>
            </div>
          </div>
          <div class="form-group compact">
            <label class="col-sm-3 control-label">{{$t('dashboard.company')}}</label>
            <div class="col-sm-9 adjust-li">
              <div v-if="loaders.company" class="spinner spinner-xs list-spinner-loader"></div>
              <p>
                <a
                  v-bind:class="{ disable_a_href: !view.isAdmin }"
                  v-if="!loaders.company"
                  @click="openChangeCompany()"
                  href="#"
                >{{system.organization.company}}</a>
              </p>
            </div>
          </div>
          <div class="form-group compact">
            <label class="col-sm-3 control-label">{{$t('dashboard.power')}}</label>
            <div class="col-sm-9">
              <div class="btn-group">
                <button
                  :disabled="!view.isAdmin"
                  @click="openPowerModal('reboot')"
                  class="btn btn-default"
                >{{$t('dashboard.reboot')}}</button>
                <button
                  :disabled="!view.isAdmin"
                  data-toggle="dropdown"
                  class="btn btn-default dropdown-toggle"
                >
                  <span class="caret"></span>
                </button>
                <ul role="menu" class="dropdown-menu">
                  <li class="presentation">
                    <a
                      v-bind:class="{ disable_a_href: !view.isAdmin }"
                      href="#"
                      @click="openPowerModal('reboot')"
                      role="menuitem"
                      data-action="restart"
                    >{{$t('dashboard.reboot')}}</a>
                  </li>
                  <li class="presentation">
                    <a
                      v-bind:class="{ disable_a_href: !view.isAdmin }"
                      href="#"
                      @click="openPowerModal('poweroff')"
                      role="menuitem"
                      data-action="shutdown"
                    >{{$t('dashboard.power_off')}}</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </form>
      </div>
      <div class="col-lg-6 col-md-12 col-sm-12 col-xs-12">
        <div class="row adjust-top">
          <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
            <span class="plot-unit" id="server_cpu_unit">%</span>
            <span id="link-cpu"></span> x CPU (Core)
            <div id="server_cpu_graph" class="graph zoomable-plot"></div>
          </div>
          <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 adjust-top-col">
            <span class="plot-unit" id="server_memory_unit"></span>
            {{$t('dashboard.memory')}} & SWAP
            <div id="server_memory_graph" class="graph zoomable-plot"></div>
          </div>
        </div>
        <div class="row adjust-top-row">
          <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
            <span class="plot-unit" id="server_disk_io_unit"></span>
            {{$t('dashboard.disk_io')}}
            <div id="server_disk_io_graph" class="graph zoomable-plot"></div>
          </div>
          <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 adjust-top-col">
            <span class="plot-unit" id="server_network_traffic_unit"></span>
            {{$t('dashboard.network')}}
            <div id="server_network_traffic_graph" class="graph zoomable-plot"></div>
          </div>
        </div>
      </div>
    </div>

    <div class="row row-dashboard">
      <div class="col-lg-6">
        <h3>{{$t('dashboard.memory')}}</h3>

        <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 resources-panel">
          <div class="panel panel-default">
            <div class="panel-heading">
              <h3 class="panel-title">
                <span class="icon-header-panel">
                  <span class="fa fa-microchip right"></span>
                </span>
                {{$t('dashboard.ram')}}
              </h3>
            </div>
            <div class="panel-body">
              <div id="ram-chart" class="text-center"></div>
              <div class="text-right">
                {{$t('dashboard.size')}}:
                <b>
                  <span class>{{system.memory.system.available_bytes * 1024 | byteFormat}}</span>
                </b>
              </div>
            </div>
          </div>
        </div>
        <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 resources-panel">
          <div class="panel panel-default">
            <div class="panel-heading">
              <h3 class="panel-title">
                <span class="icon-header-panel">
                  <span class="fa fa-exchange right"></span>
                </span>
                {{$t('dashboard.swap')}}
              </h3>
            </div>
            <div class="panel-body">
              <div id="swap-chart" class="text-center"></div>
              <div class="text-right">
                {{$t('dashboard.size')}}:
                <b>
                  <span class>{{system.memory.swap.available_bytes * 1024 | byteFormat}}</span>
                </b>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="modal" id="hostnameChangeModal" tabindex="-1" role="dialog" data-backdrop="static">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title">{{$t('dashboard.change_hostname')}}</h4>
          </div>
          <form
            class="form-horizontal"
            v-on:submit.prevent="saveHostname(system.summary.newHostname)"
          >
            <div class="modal-body">
              <div v-if="system.summary.hostnameIsEdit" class="alert alert-warning">
                <span class="pficon pficon-warning-triangle-o"></span>
                <strong>{{$t('warning')}}:</strong> {{$t('dashboard.hostname_change')}}.
              </div>
              <div :class="['form-group', system.errors.hostname.hasError ? 'has-error' : '']">
                <label
                  class="col-sm-3 control-label"
                  for="textInput-modal-markup"
                >{{$t('dashboard.fqdn')}}</label>
                <div class="col-sm-9">
                  <input
                    :disabled="!system.summary.hostnameIsEdit"
                    required
                    type="text"
                    v-model="system.summary.newHostname"
                    class="form-control"
                  />
                  <span
                    v-if="system.errors.hostname.hasError"
                    class="help-block"
                  >{{$t('validation.validation_failed')}}: {{$t('validation.'+system.errors.hostname.message)}}</span>
                </div>
              </div>
              <div
                v-for="(a, i) in system.summary.aliases"
                v-bind:key="i"
                :class="['form-group', system.summary.aliases[i].hasError ? 'has-error' : '']"
              >
                <label class="col-xs-12 col-sm-3 control-label" for="textInput-modal-markup">
                  {{i == 0 ?
                  $t('dashboard.alias') : ''}}
                </label>
                <div class="col-xs-7 col-sm-6">
                  <input type="text" v-model="a.key" class="form-control" />
                  <span
                    v-if="system.summary.aliases[i].hasError"
                    class="help-block"
                  >{{$t('validation.validation_failed')}}: {{$t('validation.'+system.summary.aliases[i].message)}}</span>
                </div>
                <div class="col-xs-5 col-sm-2">
                  <button @click="removeAlias(a, i)" class="btn btn-default" type="button">
                    <span class="fa fa-minus card-icon-def"></span>
                  </button>
                </div>
              </div>
              <div class="form-group">
                <div class="col-sm-3 control-label"></div>
                <div class="col-sm-9">
                  <button @click="addAlias()" class="btn btn-default" type="button">
                    <span class="fa fa-plus card-icon-def"></span>
                    {{$t('dashboard.add_alias')}}
                  </button>
                </div>
              </div>
            </div>
            <div class="modal-footer submit">
              <div
                v-if="system.errors.aliases.isLoading || system.errors.aliases.isLoading"
                class="spinner spinner-sm form-spinner-loader"
              ></div>
              <button class="btn btn-default" type="button" data-dismiss="modal">{{$t('cancel')}}</button>
              <button class="btn btn-primary" value="submit" type="submit">{{$t('save')}}</button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <div class="modal" id="dnsChangeModal" tabindex="-1" role="dialog" data-backdrop="static">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title">{{$t('dashboard.change_dns_servers')}}</h4>
          </div>
          <form class="form-horizontal" v-on:submit.prevent="saveDNS(system.summary.dns)">
            <div class="modal-body">
              <div :class="['form-group', system.errors.dns1.hasError ? 'has-error' : '']">
                <label
                  class="col-sm-3 control-label"
                  for="textInput-modal-markup"
                >1° {{$t('dashboard.dns')}}</label>
                <div class="col-sm-9">
                  <input
                    required
                    type="text"
                    v-model="system.summary.dns[0].dns"
                    class="form-control"
                  />
                  <span
                    v-if="system.errors.dns1.hasError"
                    class="help-block"
                  >{{$t('validation.validation_failed')}}: {{$t('validation.'+system.errors.dns1.message)}}</span>
                </div>
              </div>
              <div :class="['form-group', system.errors.dns2.hasError ? 'has-error' : '']">
                <label
                  class="col-sm-3 control-label"
                  for="textInput-modal-markup"
                >2° {{$t('dashboard.dns')}}</label>
                <div class="col-sm-9">
                  <input type="text" v-model="system.summary.dns[1].dns" class="form-control" />
                  <span
                    v-if="system.errors.dns2.hasError"
                    class="help-block"
                  >{{$t('validation.validation_failed')}}: {{$t('validation.'+system.errors.dns2.message)}}</span>
                </div>
              </div>
            </div>
            <div class="modal-footer submit">
              <div
                v-if="system.errors.dns1.isLoading"
                class="spinner spinner-sm form-spinner-loader"
              ></div>
              <button class="btn btn-default" type="button" data-dismiss="modal">{{$t('cancel')}}</button>
              <button class="btn btn-primary" value="submit" type="submit">{{$t('save')}}</button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <div class="modal" id="systimeChangeModal" tabindex="-1" role="dialog" data-backdrop="static">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title">{{$t('dashboard.change_system_time')}}</h4>
          </div>
          <form class="form-horizontal" v-on:submit.prevent="saveSystime()">
            <div class="modal-body">
              <div class="form-group">
                <label
                  class="col-sm-3 control-label"
                  for="textInput-modal-markup"
                >{{$t('dashboard.time_zone')}}</label>
                <div class="col-sm-9">
                  <select
                    required
                    v-model="system.summary.newTimeZone"
                    class="combobox form-control"
                  >
                    <option v-for="(t,i) in system.summary.timeZones" v-bind:key="i">{{t}}</option>
                  </select>
                </div>
              </div>

              <div class="form-group">
                <label
                  class="col-sm-3 control-label"
                  for="textInput-modal-markup"
                >{{$t('dashboard.set_time')}}</label>
                <div class="col-sm-9">
                  <div class="dropdown">
                    <button
                      class="btn btn-default dropdown-toggle"
                      type="button"
                      id="dropdownMenu1"
                      data-toggle="dropdown"
                    >
                      {{system.systimeTypes[system.summary.newTimeMode]}}
                      <span class="caret"></span>
                    </button>
                    <ul class="dropdown-menu" role="menu" aria-labelledby="dropdownMenu1">
                      <li role="presentation">
                        <a
                          role="menuitem"
                          tabindex="-1"
                          @click="changeSystime('manual')"
                          href="#"
                        >{{$t('dashboard.manual')}}</a>
                      </li>
                      <li role="presentation">
                        <a
                          role="menuitem"
                          tabindex="-1"
                          @click="changeSystime('ntp')"
                          href="#"
                        >{{$t('dashboard.using_ntp_server')}}</a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div
                v-if="system.summary.newTimeMode == 'manual'"
                :class="['form-group', system.errors.datetime.date.hasError || system.errors.datetime.time.hasError ? 'has-error' : '']"
              >
                <label
                  class="col-sm-3 control-label"
                  for="textInput-modal-markup"
                >{{$t('dashboard.date_time')}}</label>
                <div class="col-sm-6">
                  <div id="date-picker" class="input-group date">
                    <input
                      required
                      v-model="system.summary.newDate"
                      type="text"
                      class="form-control bootstrap-datepicker"
                    />
                    <span class="input-group-addon">
                      <span class="fa fa-calendar"></span>
                    </span>
                  </div>
                  <span
                    v-if="system.errors.datetime.date.hasError"
                    class="help-block"
                  >{{$t('validation.validation_failed')}}: {{$t('validation.'+system.errors.datetime.date.message)}}</span>
                </div>
                <div class="col-sm-3">
                  <div class="input-group time-picker-pf" id="time-picker">
                    <input
                      required
                      v-model="system.summary.newTime"
                      type="text"
                      class="form-control"
                    />
                    <span class="input-group-addon btn btn-default">
                      <span class="fa fa-clock-o"></span>
                    </span>
                  </div>
                  <span
                    v-if="system.errors.datetime.time.hasError"
                    class="help-block"
                  >{{$t('validation.validation_failed')}}: {{$t('validation.'+system.errors.datetime.time.message)}}</span>
                </div>
              </div>

              <div
                v-if="system.summary.newTimeMode == 'ntp'"
                :class="['form-group', system.errors.datetime.NTPServer.hasError ? 'has-error' : '']"
              >
                <label
                  class="col-sm-3 control-label"
                  for="textInput-modal-markup"
                >{{$t('dashboard.ntp_server')}}</label>
                <div class="col-sm-9">
                  <input
                    required
                    type="text"
                    v-model="system.summary.newNtpServer"
                    class="form-control"
                  />
                  <span
                    v-if="system.errors.datetime.NTPServer.hasError"
                    class="help-block"
                  >{{$t('validation.validation_failed')}}: {{$t('validation.'+system.errors.datetime.NTPServer.message)}}</span>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <div
                v-if="system.errors.datetime.isLoading"
                class="spinner spinner-sm form-spinner-loader"
              ></div>
              <button class="btn btn-default" type="button" data-dismiss="modal">{{$t('cancel')}}</button>
              <button class="btn btn-primary" type="submit">{{$t('save')}}</button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <div class="modal" id="companyChangeModal" tabindex="-1" role="dialog" data-backdrop="static">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title">{{$t('dashboard.change_company_info')}}</h4>
          </div>
          <form class="form-horizontal" v-on:submit.prevent="saveCompany(system.newOrganization)">
            <div class="modal-body">
              <div class="form-group">
                <label
                  class="col-sm-3 control-label"
                  for="textInput-modal-markup"
                >{{$t('dashboard.company')}}</label>
                <div class="col-sm-9">
                  <input
                    required
                    type="text"
                    v-model="system.newOrganization.company"
                    class="form-control"
                  />
                </div>
              </div>
              <div class="form-group">
                <label
                  class="col-sm-3 control-label"
                  for="textInput-modal-markup"
                >{{$t('dashboard.city')}}</label>
                <div class="col-sm-9">
                  <input
                    required
                    type="text"
                    v-model="system.newOrganization.city"
                    class="form-control"
                  />
                </div>
              </div>
              <div class="form-group">
                <label
                  class="col-sm-3 control-label"
                  for="textInput-modal-markup"
                >{{$t('dashboard.department')}}</label>
                <div class="col-sm-9">
                  <input
                    required
                    type="text"
                    v-model="system.newOrganization.department"
                    class="form-control"
                  />
                </div>
              </div>
              <div class="form-group">
                <label
                  class="col-sm-3 control-label"
                  for="textInput-modal-markup"
                >{{$t('dashboard.phone')}}</label>
                <div class="col-sm-9">
                  <input
                    required
                    type="text"
                    v-model="system.newOrganization.phone"
                    class="form-control"
                  />
                </div>
              </div>
              <div class="form-group">
                <label
                  class="col-sm-3 control-label"
                  for="textInput-modal-markup"
                >{{$t('dashboard.address')}}</label>
                <div class="col-sm-9">
                  <input
                    required
                    type="text"
                    v-model="system.newOrganization.address"
                    class="form-control"
                  />
                </div>
              </div>
            </div>
            <div class="modal-footer submit">
              <div
                v-if="system.errors.company.isLoading"
                class="spinner spinner-sm form-spinner-loader"
              ></div>
              <button class="btn btn-default" type="button" data-dismiss="modal">{{$t('cancel')}}</button>
              <button class="btn btn-primary" value="submit" type="submit">{{$t('save')}}</button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <div class="modal" id="powerModal" tabindex="-1" role="dialog" data-backdrop="static">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title">
              {{system.summary.actualPower == 'reboot' ? $t('dashboard.reboot_the_system') :
              $t('dashboard.shutdown_the_system')}}
            </h4>
          </div>
          <form
            class="form-horizontal"
            v-on:submit.prevent="powerActions(system.summary.actualPower)"
          >
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
              <button class="btn btn-danger" type="submit">
                {{system.summary.actualPower == 'reboot' ?
                $t('dashboard.reboot') : $t('dashboard.power_off')}}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/*global patternfly c3*/
var plot = require("./../../lib/plotter.js");
var machine_info = require("./../../lib/machine-info.js");
require("jquery.flot");
require("jquery.flot/jquery.flot.selection");
require("jquery.flot/jquery.flot.time");

export default {
  name: "Dashboard",
  beforeRouteLeave(to, from, next) {
    $(".modal").modal("hide");
    next();
  },
  mounted() {
    this.getAuthorizations();
    this.initGraphics();
    this.getHints("hostname");
    this.getHints("dns");
    this.getHints("company");
    this.getHints("subscription");
    this.getSystemSummary();
    this.getSystemHostname();
    this.getSystemAliases();
    this.getSystemDns();
    this.getSystemTime();
    this.getSystemCompany();
    this.initSystemGraphs();
  },
  data() {
    return {
      view: {
        isAdmin: false
      },
      loaders: {
        summary: true,
        hostname: true,
        dns: true,
        datetime: true,
        company: true
      },
      system: {
        summary: {
          hardware: "",
          kernelRelease: "",
          osRelease: "",
          load: "",
          uptime: "",
          hostname: "",
          newHostname: "",
          hostnameIsEdit: false,
          aliases: [],
          dns: [
            {
              readDns: "",
              dns: ""
            },
            {
              readDns: "",
              dns: ""
            }
          ],
          datetime: "",
          date: "",
          time: "",
          timeMode: "",
          ntpServer: "",
          timeZone: "",
          newTimeMode: "",
          newDate: "",
          newTime: "",
          newNtpServer: "",
          newTimeZone: "",
          timeZones: ["", ""],
          actualPower: ""
        },
        newOrganization: {},
        organization: {
          company: "",
          city: "",
          department: "",
          phone: "",
          address: ""
        },
        memory: {
          system: {
            used_bytes: 0,
            available_bytes: 0
          },
          swap: {
            used_bytes: 0,
            available_bytes: 0
          }
        },
        systimeTypes: {
          manual: this.$i18n.t("dashboard.manual"),
          ntp: this.$i18n.t("dashboard.using_ntp_server")
        },
        errors: {
          hostname: {
            hasError: false,
            message: "",
            isLoading: false
          },
          aliases: {
            hasError: false,
            message: "",
            isLoading: false
          },
          dns1: {
            hasError: false,
            message: "",
            isLoading: false
          },
          dns2: {
            hasError: false,
            message: ""
          },
          datetime: {
            date: {
              hasError: false,
              message: ""
            },
            time: {
              hasError: false,
              message: ""
            },
            NTPServer: {
              hasError: false,
              message: ""
            },
            isLoading: false
          },
          company: {
            hasError: false,
            message: "",
            isLoading: false
          }
        }
      },
      hints: {
        details: {}
      }
    };
  },
  methods: {
    initGraphics() {
      this.$parent.getHints("system-subscription", "subscription");
      $("#app").css("background", "");
      $("#app").css("color", "");
    },
    getAuthorizations() {
      var context = this;
      context.exec(
        ["system-authorization/read"],
        null,
        null,
        function(success) {
          try {
            success = JSON.parse(success);
          } catch (e) {
            console.error(e);
          }
          context.view.isAdmin = success.status.isAdmin == 1;
        },
        function(error) {
          console.error(error);
        },
        false
      );
    },
    getHints(type, callback) {
      var context = this;

      context.execHints(
        "system-" + type,
        function(success) {
          context.hints.details[type] = {};
          context.hints.details[type].count = 0;

          for (var h in success.details) {
            context.hints.details[h.toLowerCase()].message = success.details[h];
            context.hints.details[h.toLowerCase()].count = success.count;
          }

          if (success.message) {
            context.hints.details[type].message = success.message;
            context.hints.details[type].count += 1;
          }

          context.$forceUpdate();

          callback ? callback() : null;
        },
        function(error) {
          console.error(error);
        }
      );
    },
    getSystemSummary() {
      var context = this;
      context.exec(
        ["system-status/read"],
        null,
        null,
        function(success) {
          try {
            success = JSON.parse(success);
          } catch (e) {
            console.error(e);
          }
          context.system.summary.hardware = success.status.hardware;
          context.system.summary.kernelRelease = success.status.kernel;
          context.system.summary.osRelease = success.status.release;
          context.system.summary.load = success.status.load.join(" / ");
          context.system.summary.uptime =
            success.status.uptime.days +
            "d " +
            success.status.uptime.hours +
            "h " +
            success.status.uptime.minutes +
            "m " +
            success.status.uptime.seconds +
            "s";
          context.system.summary.cpu =
            success.status.cpu.model + " x " + success.status.cpu.n;

          context.system.memory = {
            system: {
              used_bytes:
                success.status.memory.MemTotal -
                success.status.memory.MemAvailable,
              available_bytes: success.status.memory.MemTotal
            },
            swap: {
              used_bytes:
                success.status.memory.SwapTotal -
                success.status.memory.SwapFree,
              available_bytes: success.status.memory.SwapTotal
            }
          };

          context.loaders.summary = false;
          context.initMemoryCharts();
        },
        function(error) {
          console.error(error);
        }
      );
    },
    getSystemHostname() {
      var context = this;
      context.exec(
        ["system-hostname/read"],
        null,
        null,
        function(success) {
          try {
            success = JSON.parse(success);
          } catch (e) {
            console.error(e);
          }
          context.system.summary.hostname = success.hostname;
          context.system.summary.newHostname = success.hostname;
          context.system.summary.hostnameIsEdit = success.editable == 1;

          context.loaders.hostname = false;
          context.$forceUpdate();

          context.getHints("hostname", function() {
            context.$parent.hints.hostname.count =
              context.hints.details.hostname.count;
          });
        },
        function(error) {
          console.error(error);
        }
      );
    },
    saveHostname(hostname) {
      var context = this;

      // validate input promises
      var promises = [];

      // hostname
      context.system.errors.hostname.isLoading = true;
      promises.push(
        new Promise(function(resolve, reject) {
          context.exec(
            ["system-hostname/validate"],
            {
              hostname: context.system.summary.newHostname
            },
            null,
            function(success) {
              context.system.errors.hostname.hasError = false;
              resolve();
            },
            function(error, data) {
              var errorData = {};
              context.system.errors.hostname.hasError = true;

              try {
                errorData = JSON.parse(data);
                context.system.errors.hostname.message =
                  errorData.attributes[0].error;
              } catch (e) {
                console.error(e);
              }
              reject();
            }
          );
        })
      );

      //aliases
      var aliasObj = {
        configuration: []
      };
      for (var a in context.system.summary.aliases) {
        var alias = context.system.summary.aliases[a];
        aliasObj.configuration.push({
          props: {
            Description: ""
          },
          name: alias.key,
          type: "self"
        });
      }
      context.system.errors.aliases.isLoading = true;
      promises.push(
        new Promise(function(resolve, reject) {
          context.exec(
            ["system-aliases/validate"],
            aliasObj,
            null,
            function(success) {
              for (var a in context.system.summary.aliases) {
                context.system.summary.aliases[a].hasError = false;
              }
              context.$forceUpdate();

              resolve();
            },
            function(error, data) {
              var errorData = {};
              try {
                errorData = JSON.parse(data);
                for (var a in errorData.attributes) {
                  var attr = errorData.attributes[a];
                  var i = 0;
                  for (var l in context.system.summary.aliases) {
                    var al = context.system.summary.aliases[l];
                    context.system.summary.aliases[l].hasError = false;
                    if (al.key == attr.value) {
                      i = l;
                    }
                  }

                  context.system.summary.aliases[i].hasError = true;
                  context.system.summary.aliases[i].message = attr.error;

                  context.$forceUpdate();
                }
              } catch (e) {
                console.error(e);
              }
              reject();
            }
          );
        })
      );

      Promise.all(promises)
        .then(function(values) {
          context.system.errors.hostname.isLoading = false;
          context.system.errors.aliases.isLoading = false;
          $("#hostnameChangeModal").modal("hide");

          var hostnameChanged =
            context.system.summary.newHostname !=
            context.system.summary.hostname;

          // update hostname
          if (hostnameChanged) {
            context.exec(
              ["system-hostname/update"],
              {
                hostname: context.system.summary.newHostname
              },
              function(stream) {
                console.info("hostname", stream);
              },
              function(success) {
                // update aliases
                context.exec(
                  ["system-aliases/update"],
                  aliasObj,
                  function(stream) {
                    console.info("aliases", stream);
                  },
                  function(success) {
                    // get aliases
                    context.getSystemAliases();

                    // get hostname
                    context.getSystemHostname();

                    // notification
                    context.$parent.notifications.success.message = context.$i18n.t(
                      "dashboard.hostname_and_aliases_save_ok"
                    );
                  },
                  function(error, data) {
                    // notification
                    context.$parent.notifications.error.message = context.$i18n.t(
                      "dashboard.hostname_and_aliases_save_error"
                    );
                  }
                );
              },
              function(error, data) {
                // notification
                context.$parent.notifications.error.message = context.$i18n.t(
                  "dashboard.hostname_and_aliases_save_error"
                );
              }
            );
          }

          // update aliases
          if (!hostnameChanged) {
            context.exec(
              ["system-aliases/update"],
              aliasObj,
              function(stream) {
                console.info("aliases", stream);
              },
              function(success) {
                // get aliases
                context.getSystemAliases();

                // notification
                context.$parent.notifications.success.message = context.$i18n.t(
                  "dashboard.hostname_and_aliases_save_ok"
                );
              },
              function(error, data) {
                // notification
                context.$parent.notifications.error.message = context.$i18n.t(
                  "dashboard.hostname_and_aliases_save_error"
                );
              }
            );
          }
        })
        .catch(function(error) {
          context.system.errors.hostname.isLoading = false;
          context.system.errors.aliases.isLoading = false;
        });
    },
    getSystemAliases() {
      var context = this;
      context.exec(
        ["system-aliases/read"],
        null,
        null,
        function(success) {
          try {
            success = JSON.parse(success);
          } catch (e) {
            console.error(e);
          }
          context.system.summary.aliases = [];
          for (var i in success.configuration) {
            var alias = success.configuration[i].name;
            context.system.summary.aliases.push({
              key: alias
            });
          }
          context.$forceUpdate();
        },
        function(error) {
          console.error(error);
        }
      );
    },
    addAlias(alias) {
      this.system.summary.aliases.push({
        isNew: true
      });
    },
    removeAlias(alias, index) {
      this.system.summary.aliases.splice(index, 1);
    },
    getSystemDns() {
      var context = this;
      context.exec(
        ["system-dns/read"],
        null,
        null,
        function(success) {
          try {
            success = JSON.parse(success);
          } catch (e) {
            console.error(e);
          }
          if (
            success.configuration.props.NameServers.split(",")[0] !== undefined
          ) {
            context.system.summary.dns[0] = {
              readDns: success.configuration.props.NameServers.split(",")[0],
              dns: success.configuration.props.NameServers.split(",")[0]
            };
          }

          if (
            success.configuration.props.NameServers.split(",")[1] !== undefined
          ) {
            context.system.summary.dns[1] = {
              readDns: success.configuration.props.NameServers.split(",")[1],
              dns: success.configuration.props.NameServers.split(",")[1]
            };
          }

          context.loaders.dns = false;
          context.$forceUpdate();

          context.getHints("dns", function() {
            context.$parent.hints.upstreamDns.count =
              context.hints.details.dns.count;
          });
        },
        function(error) {
          console.error(error);
        }
      );
    },
    saveDNS(dns) {
      var context = this;
      var dnsObj = {
        props: {
          NameServers: dns[0].dns + "," + dns[1].dns
        },
        name: "dns",
        type: "configuration"
      };

      // validate
      context.system.errors.dns1.isLoading = true;
      context.exec(
        ["system-dns/validate"],
        dnsObj,
        null,
        function(success) {
          context.system.errors.dns1.hasError = false;
          context.system.errors.dns2.hasError = false;
          context.system.errors.dns1.isLoading = false;

          $("#dnsChangeModal").modal("hide");

          // update value
          context.exec(
            ["system-dns/update"],
            dnsObj,
            function(stream) {
              console.info("dns", stream);
            },
            function(success) {
              // notification
              context.$parent.notifications.success.message = context.$i18n.t(
                "dashboard.dns_save_ok"
              );

              // get aliases
              context.getSystemDns();
            },
            function(error, data) {
              // notification
              context.$parent.notifications.error.message = context.$i18n.t(
                "dashboard.dns_save_error"
              );
            }
          );
        },
        function(error, data) {
          var errorData = {};
          context.system.errors.dns1.isLoading = false;

          context.system.errors.dns1.hasError = false;
          context.system.errors.dns2.hasError = false;
          try {
            errorData = JSON.parse(data);
            for (var e in errorData.attributes) {
              var attr = errorData.attributes[e];
              context.system.errors[attr.parameter].hasError = true;
              context.system.errors[attr.parameter].message = attr.error;
            }
          } catch (e) {
            console.error(e);
          }
        }
      );
    },
    getSystemTime() {
      var context = this;
      context.exec(
        ["system-time/read"],
        null,
        null,
        function(success) {
          try {
            success = JSON.parse(success);
          } catch (e) {
            console.error(e);
          }
          context.system.summary.datetime = success.status.datetime;
          context.system.summary.date = success.status.date;
          context.system.summary.time = success.status.time;
          context.system.summary.timeMode =
            success.configuration.chronyd.props.status == "enabled"
              ? "ntp"
              : "manual";
          context.system.summary.ntpServer =
            success.configuration.chronyd.props.NTPServer;
          context.system.summary.timeZone = success.configuration.timezone;
          context.system.summary.newTimeMode =
            success.configuration.chronyd.props.status == "enabled"
              ? "ntp"
              : "manual";
          context.system.summary.newDate = success.status.date;
          context.system.summary.newTime = success.status.time;
          context.system.summary.newNtpServer =
            success.configuration.chronyd.props.NTPServer;
          context.system.summary.newTimeZone = success.configuration.timezone;
          context.system.summary.timeZones = success.configuration.timezones;

          context.loaders.datetime = false;
          context.$forceUpdate();
        },
        function(error) {
          console.error(error);
        }
      );
    },
    openChangeSystime() {
      this.system.summary.newTimeZone = this.system.summary.timeZone;
      this.system.summary.newTimeMode = this.system.summary.timeMode;
      this.system.summary.newDate = this.system.summary.date;
      this.system.summary.newTime = this.system.summary.time;
      this.system.summary.newNtpServer = this.system.summary.ntpServer;
      $("#systimeChangeModal").modal("show");
    },
    changeSystime(value) {
      this.system.summary.newTimeMode = value;
    },
    saveSystime() {
      var context = this;
      var timeObj = {
        chronyd: {
          props: {
            NTPServer: context.system.summary.newNtpServer,
            status:
              context.system.summary.newTimeMode == "manual"
                ? "disabled"
                : "enabled"
          },
          name: "chronyd",
          type: "service"
        },
        timezone: context.system.summary.newTimeZone,
        time: context.system.summary.newTime,
        date: context.system.summary.newDate
      };

      // validate
      context.system.errors.datetime.isLoading = true;
      context.exec(
        ["system-time/validate"],
        timeObj,
        null,
        function(success) {
          context.system.errors.datetime.hasError = false;
          context.system.errors.datetime.isLoading = false;

          $("#systimeChangeModal").modal("hide");

          // update value
          context.exec(
            ["system-time/update"],
            timeObj,
            function(stream) {
              console.info("time", stream);
            },
            function(success) {
              // notification
              context.$parent.notifications.success.message = context.$i18n.t(
                "dashboard.datetime_save_ok"
              );

              // get aliases
              context.getSystemTime();
            },
            function(error, data) {
              // notification
              context.$parent.notifications.error.message = context.$i18n.t(
                "dashboard.datetime_save_error"
              );
            }
          );
        },
        function(error, data) {
          var errorData = {};
          context.system.errors.datetime.isLoading = false;

          context.system.errors.datetime.date.hasError = false;
          context.system.errors.datetime.time.hasError = false;
          context.system.errors.datetime.NTPServer.hasError = false;

          try {
            errorData = JSON.parse(data);
            for (var a in errorData.attributes) {
              var attr = errorData.attributes[a];
              context.system.errors.datetime[attr.parameter].hasError = true;
              context.system.errors.datetime[attr.parameter].message =
                attr.error;
            }
          } catch (e) {
            console.error(e);
          }
        }
      );
    },
    getSystemCompany() {
      var context = this;
      context.exec(
        ["system-company/read"],
        null,
        null,
        function(success) {
          try {
            success = JSON.parse(success);
          } catch (e) {
            console.error(e);
          }
          context.system.organization = {
            company: success.configuration.props.Company,
            city: success.configuration.props.City,
            department: success.configuration.props.Department,
            phone: success.configuration.props.PhoneNumber,
            address: success.configuration.props.Street
          };

          context.loaders.company = false;
          context.$forceUpdate();

          context.getHints("company", function() {
            context.$parent.hints.company.count =
              context.hints.details.company.count;
          });
        },
        function(error) {
          console.error(error);
        }
      );
    },
    openChangeCompany() {
      $("#companyChangeModal").modal("show");
      this.system.newOrganization = Object.assign({}, this.system.organization);
    },
    saveCompany(organization) {
      var context = this;
      var companyObj = {
        props: {
          Department: context.system.newOrganization.department,
          Street: context.system.newOrganization.address,
          PhoneNumber: context.system.newOrganization.phone,
          City: context.system.newOrganization.city,
          State: "",
          CountryCode: "",
          Company: context.system.newOrganization.company
        },
        name: "OrganizationContact",
        type: "configuration"
      };

      // validate
      context.system.errors.company.isLoading = true;
      context.exec(
        ["system-company/validate"],
        companyObj,
        null,
        function(success) {
          context.system.errors.company.hasError = false;
          context.system.errors.company.isLoading = false;

          $("#companyChangeModal").modal("hide");

          // update value
          context.exec(
            ["system-company/update"],
            companyObj,
            function(stream) {
              console.info("company", stream);
            },
            function(success) {
              // notification
              context.$parent.notifications.success.message = context.$i18n.t(
                "dashboard.company_save_ok"
              );

              // get aliases
              context.getSystemCompany();
            },
            function(error, data) {
              // notification
              context.$parent.notifications.error.message = context.$i18n.t(
                "dashboard.company_save_error"
              );
            }
          );
        },
        function(error, data) {
          var errorData = {};
          context.system.errors.company.isLoading = false;
          context.system.errors.company.hasError = true;

          try {
            errorData = JSON.parse(data);
            context.system.errors.company.message =
              errorData.attributes.name[0][0];
          } catch (e) {
            console.error(e);
          }
        }
      );
    },
    openPowerModal(action) {
      this.system.summary.actualPower = action;
      $("#powerModal").modal("show");
    },
    powerActions(action) {
      var context = this;
      context.exec(
        ["system-shutdown/update"],
        {
          action: action
        },
        null,
        function(success) {
          $("#powerModal").modal("hide");
        },
        function(error, data) {
          // notification
          context.$parent.notifications.error.message = context.$i18n.t(
            "dashboard.shutdown_error"
          );
        }
      );
    },
    initMemoryCharts() {
      var c3ChartDefaults = patternfly.c3ChartDefaults();
      var ramConfig = c3ChartDefaults.getDefaultDonutConfig("A");
      var swapConfig = c3ChartDefaults.getDefaultDonutConfig("A");
      ramConfig.bindto = "#ram-chart";
      swapConfig.bindto = "#swap-chart";

      ramConfig.data = {
        type: "donut",
        columns: [
          ["Used", this.system.memory.system.used_bytes * 1024],
          ["Available", this.system.memory.system.available_bytes * 1024]
        ],
        groups: [["used", "available"]],
        order: null
      };
      swapConfig.data = {
        type: "donut",
        columns: [
          ["Used", this.system.memory.swap.used_bytes * 1024],
          ["Available", this.system.memory.swap.available_bytes * 1024]
        ],
        groups: [["used", "available"]],
        order: null
      };
      ramConfig.size = {
        width: 180,
        height: 180
      };
      swapConfig.size = {
        width: 180,
        height: 180
      };

      ramConfig.tooltip = {
        contents: patternfly.pfGetUtilizationDonutTooltipContentsFn("GB")
      };
      swapConfig.tooltip = {
        contents: patternfly.pfGetUtilizationDonutTooltipContentsFn("GB")
      };

      c3.generate(ramConfig);
      c3.generate(swapConfig);
      patternfly.pfSetDonutChartTitle(
        "#ram-chart",
        this.$options.filters.byteFormat(
          this.system.memory.system.used_bytes * 1024
        ),
        " Used"
      );
      patternfly.pfSetDonutChartTitle(
        "#swap-chart",
        this.$options.filters.byteFormat(
          this.system.memory.swap.used_bytes * 1024
        ),
        " Used"
      );
    },
    initSystemGraphs() {
      var series;

      /* CPU graph */
      var cpu_data = {
        direct: [
          "kernel.all.cpu.nice",
          "kernel.all.cpu.user",
          "kernel.all.cpu.sys"
        ],
        internal: ["cpu.basic.nice", "cpu.basic.user", "cpu.basic.system"],
        units: "millisec",
        derive: "rate",
        factor: 0.1 // millisec / sec -> percent
      };

      var cpu_options = plot.plot_simple_template();
      $.extend(cpu_options.yaxis, {
        tickFormatter: function(v) {
          return v.toFixed(0);
        },
        max: 100
      });
      this.cpu_plot = new plot.Plot($("#server_cpu_graph"), 300);
      this.cpu_plot.set_options(cpu_options);

      /* Memory graph */
      var memory_data = {
        direct: ["mem.util.used"],
        internal: ["memory.used"],
        units: "bytes"
      };

      var memory_options = plot.plot_simple_template();
      $.extend(memory_options.yaxis, {
        ticks: plot.memory_ticks,
        tickFormatter: plot.format_bytes_tick_no_unit
      });
      memory_options.setup_hook = function memory_setup_hook(pl) {
        var axes = pl.getAxes();
        $("#server_memory_unit").text(plot.bytes_tick_unit(axes.yaxis));
      };

      this.memory_plot = new plot.Plot($("#server_memory_graph"), 300);
      this.memory_plot.set_options(memory_options);
      series = this.memory_plot.add_metrics_sum_series(memory_data, {});

      var context = this;
      machine_info.cpu_ram_info().done(function(info) {
        $("#link-cpu").text(info.cpus);
        cpu_data.factor = 0.1 / info.cpus; // millisec / sec -> percent
        context.cpu_plot.add_metrics_sum_series(cpu_data, {});

        if (info.swap) {
          memory_options.yaxis.max = info.memory + info.swap * 0.25;
          memory_options.yaxis.tickFormatter = function(v) {
            return v <= info.memory
              ? plot.format_bytes_tick_no_unit(v, memory_options.yaxis)
              : plot.format_bytes_tick_no_unit(
                  v + (v - info.memory) * 4,
                  memory_options.yaxis
                );
          };
          memory_options.colors[1] = "#CC0000";
          memory_options.grid.markings = [
            {
              yaxis: { from: info.memory, to: info.memory + info.swap * 0.25 },
              color: "#ededed"
            }
          ];
          var swap_data = {
            internal: ["memory.swap-used"],
            units: "bytes",
            factor: 0.25,
            threshold: info.memory,
            offset: info.memory
          };
          context.memory_plot.add_metrics_sum_series(swap_data, {});
          $("#link-memory").hide();
          $("#link-memory-and-swap").show();
        } else {
          memory_options.yaxis.max = info.memory;
        }
        context.memory_plot.set_options(memory_options);
      });

      /* Network graph */
      var network_data = {
        direct: ["network.interface.total.bytes"],
        internal: ["network.interface.tx", "network.interface.rx"],
        "omit-instances": ["lo"],
        units: "bytes",
        derive: "rate"
      };

      var network_options = plot.plot_simple_template();
      $.extend(network_options.yaxis, {
        tickFormatter: plot.format_bits_per_sec_tick_no_unit
      });
      network_options.setup_hook = function network_setup_hook(pl) {
        var axes = pl.getAxes();
        if (axes.yaxis.datamax < 100000) axes.yaxis.options.max = 100000;
        else axes.yaxis.options.max = null;
        axes.yaxis.options.min = 0;

        $("#server_network_traffic_unit").text(
          plot.bits_per_sec_tick_unit(axes.yaxis)
        );
      };

      this.network_plot = new plot.Plot(
        $("#server_network_traffic_graph"),
        300
      );
      this.network_plot.set_options(network_options);
      series = this.network_plot.add_metrics_sum_series(network_data, {});

      /* Disk IO graph */
      var disk_data = {
        direct: ["disk.all.total_bytes"],
        internal: ["disk.all.read", "disk.all.written"],
        units: "bytes",
        derive: "rate"
      };

      var disk_options = plot.plot_simple_template();
      $.extend(disk_options.yaxis, {
        ticks: plot.memory_ticks,
        tickFormatter: plot.format_bytes_per_sec_tick_no_unit
      });
      disk_options.setup_hook = function disk_setup_hook(pl) {
        var axes = pl.getAxes();
        if (axes.yaxis.datamax < 100000) axes.yaxis.options.max = 100000;
        else axes.yaxis.options.max = null;
        axes.yaxis.options.min = 0;

        $("#server_disk_io_unit").text(
          plot.bytes_per_sec_tick_unit(axes.yaxis)
        );
      };

      this.disk_plot = new plot.Plot($("#server_disk_io_graph"), 300);
      this.disk_plot.set_options(disk_options);
      series = this.disk_plot.add_metrics_sum_series(disk_data, {});

      this.cpu_plot.start_walking();
      this.memory_plot.start_walking();
      this.disk_plot.start_walking();
      this.network_plot.start_walking();

      $(window).on(
        "resize.server",
        {
          c: this.cpu_plot,
          m: this.memory_plot,
          d: this.disk_plot,
          n: this.network_plot
        },
        function(response) {
          response.data.c.resize();
          response.data.m.resize();
          response.data.d.resize();
          response.data.n.resize();
        }
      );
    }
  }
};
</script>

<style>
</style>
