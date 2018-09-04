<template>
  <div>
    <h2>{{$t('dashboard.summary')}}</h2>
    <div class="row row-dashboard">
      <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
        <form class="form-horizontal">
          <div class="form-group compact">
            <label class="col-sm-3 control-label">{{$t('dashboard.hardware')}}</label>
            <div class="col-sm-9 adjust-li">
              <p>{{system.summary.hardware}}</p>
            </div>
          </div>
          <div class="form-group compact">
            <label class="col-sm-3 control-label">{{$t('dashboard.kernel_release')}}</label>
            <div class="col-sm-9 adjust-li">
              <p>{{system.summary.kernelRelease}}</p>
            </div>
          </div>
          <div class="form-group compact">
            <label class="col-sm-3 control-label">{{$t('dashboard.operating_system')}}</label>
            <div class="col-sm-9 adjust-li">
              <p>{{system.summary.osRelease}}</p>
            </div>
          </div>
          <div class="form-group compact">
            <label class="col-sm-3 control-label">{{$t('dashboard.load')}}</label>
            <div class="col-sm-9 adjust-li">
              <p>{{system.summary.load}}</p>
            </div>
          </div>
          <div class="form-group compact">
            <label class="col-sm-3 control-label">{{$t('dashboard.uptime')}}</label>
            <div class="col-sm-9 adjust-li">
              <p>{{system.summary.uptime}}</p>
            </div>
          </div>
          <div class="form-group compact">
            <label class="col-sm-3 control-label">{{$t('dashboard.hostname')}}</label>
            <div class="col-sm-9 adjust-li">
              <p>
                <a data-toggle="modal" data-target="#hostnameChangeModal" href="#">{{system.summary.hostname}}</a>
              </p>
            </div>
          </div>
          <div class="form-group compact">
            <label class="col-sm-3 control-label">{{$t('dashboard.dns')}}</label>
            <div class="col-sm-9 adjust-li">
              <p>
                <a data-toggle="modal" data-target="#dnsChangeModal" href="#">
                  <span v-for="(d,i) in system.summary.dns" v-bind:key="i">{{d.readDns}}
                    <span v-if="!i == system.summary.dns.length - 1">, </span>
                  </span>
                </a>
              </p>
            </div>
          </div>
          <div class="form-group compact">
            <label class="col-sm-3 control-label">{{$t('dashboard.system_time')}}</label>
            <div class="col-sm-9 adjust-li">
              <p>
                <a @click="openChangeSystime()" href="#">{{system.summary.date}} {{system.summary.time}}</a>
              </p>
            </div>
          </div>
          <div class="form-group compact">
            <label class="col-sm-3 control-label">{{$t('dashboard.company')}}</label>
            <div class="col-sm-9 adjust-li">
              <p>
                <a @click="openChangeCompany()" href="#">{{system.organization.company}}</a>
              </p>
            </div>
          </div>
          <div class="form-group compact">
            <label class="col-sm-3 control-label">{{$t('dashboard.power')}}</label>
            <div class="col-sm-9">
              <div class="btn-group">
                <a href="#" @click="openPowerModal('reboot')" class="btn btn-default">
                  {{$t('dashboard.reboot')}}
                </a>
                <button data-toggle="dropdown" class="btn btn-default dropdown-toggle">
                  <span class="caret"></span>
                </button>
                <ul role="menu" class="dropdown-menu">
                  <li class="presentation">
                    <a href="#" @click="openPowerModal('reboot')" role="menuitem" data-action="restart">{{$t('dashboard.reboot')}}</a>
                  </li>
                  <li class="presentation">
                    <a href="#" @click="openPowerModal('poweroff')" role="menuitem" data-action="shutdown">{{$t('dashboard.power_off')}}</a>
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
            <label>CPU</label> %
            <div id="server_cpu_graph" class="graph zoomable-plot"></div>
          </div>
          <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 adjust-top-col">
            <label>{{$t('dashboard.memory')}}</label> Gib
            <div id="server_memory_graph" class="graph zoomable-plot"></div>
          </div>
        </div>
        <div class="row adjust-top-row">
          <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
            <label>{{$t('dashboard.disk_io')}}</label> Mib/s
            <div id="server_disk_io_graph" class="graph zoomable-plot"></div>
          </div>
          <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 adjust-top-col">
            <label>{{$t('dashboard.network')}}</label> Mbps
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
                <a class="icon-header-panel">
                  <span class="fa fa-microchip right"></span>
                </a>{{$t('dashboard.ram')}}
              </h3>
            </div>
            <div class="panel-body">
              <div id="ram-chart" class="text-center"></div>
              <div class="text-right ">{{$t('dashboard.size')}}:
                <b>
                  <span class="">{{system.memory.system.available_bytes | byteFormat}}</span>
                </b>
              </div>
            </div>
          </div>
        </div>
        <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 resources-panel">
          <div class="panel panel-default">
            <div class="panel-heading">
              <h3 class="panel-title">
                <a class="icon-header-panel">
                  <span class="fa fa-exchange right"></span>
                </a>{{$t('dashboard.swap')}}
              </h3>
            </div>
            <div class="panel-body">
              <div id="swap-chart" class="text-center"></div>
              <div class="text-right ">{{$t('dashboard.size')}}:
                <b>
                  <span class="">{{system.memory.swap.available_bytes | byteFormat}}</span>
                </b>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-lg-6">
        <h3>{{$t('dashboard.partitions')}}</h3>

        <div v-for="(k, v) in system.mountpoints" v-bind:key="v" class="col-xs-12 col-sm-6 col-md-6 col-lg-6 resources-panel">
          <div class="panel panel-default">
            <div class="panel-heading">
              <h3 class="panel-title">
                <a class="icon-header-panel">
                  <span class="fa fa-hdd-o right"></span>
                </a>{{v}}
              </h3>
            </div>
            <div class="panel-body">
              <div :id="'mount-chart-'+parseMount(v)" class="text-center"></div>
              <div class="text-right ">{{$t('dashboard.size')}}:
                <b>
                  <span class="">{{system.mountpoints[v].size_bytes | byteFormat}}</span>
                </b>
              </div>
              <div class="text-right ">{{$t('dashboard.device')}}:
                <b>
                  <span class="">{{system.mountpoints[v].device}}</span>
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
          <form class="form-horizontal" v-on:submit.prevent="saveHostname(system.summary.newHostname)">

            <div class="modal-body">
              <div class="form-group">
                <label class="col-sm-3 control-label" for="textInput-modal-markup">{{$t('dashboard.fqdn')}}</label>
                <div class="col-sm-9">
                  <input required type="text" v-model="system.summary.newHostname" class="form-control">
                </div>
              </div>
              <div v-for="(a, i) in system.summary.aliases" v-bind:key="i" class="form-group">
                <label class="col-xs-12 col-sm-3 control-label" for="textInput-modal-markup">{{i == 0 ? $t('dashboard.alias') : ''}}</label>
                <div class="col-xs-7 col-sm-6">
                  <input type="text" v-model="a.key" class="form-control">
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
                    <span class="fa fa-plus card-icon-def"></span> {{$t('dashboard.add_alias')}}
                  </button>
                </div>
              </div>
            </div>
            <div class="modal-footer submit">
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
              <div class="form-group">
                <label class="col-sm-3 control-label" for="textInput-modal-markup">1° {{$t('dashboard.dns')}}</label>
                <div class="col-sm-9">
                  <input required type="text" v-model="system.summary.dns[0].dns" class="form-control">
                </div>
              </div>
              <div class="form-group">
                <label class="col-sm-3 control-label" for="textInput-modal-markup">2° {{$t('dashboard.dns')}}</label>
                <div class="col-sm-9">
                  <input type="text" v-model="system.summary.dns[1].dns" class="form-control">
                </div>
              </div>
            </div>
            <div class="modal-footer submit">
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
                <label class="col-sm-3 control-label" for="textInput-modal-markup">{{$t('dashboard.time_zone')}}</label>
                <div class="col-sm-9">
                  <select required v-model="system.summary.newTimeZone" class="combobox form-control">
                    <option v-for="(t,i) in system.summary.timeZones" v-bind:key="i">{{t}}</option>
                  </select>
                </div>
              </div>

              <div class="form-group">
                <label class="col-sm-3 control-label" for="textInput-modal-markup">{{$t('dashboard.set_time')}}</label>
                <div class="col-sm-9">
                  <div class="dropdown">
                    <button class="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown">
                      {{system.systimeTypes[system.summary.newTimeMode]}}
                      <span class="caret"></span>
                    </button>
                    <ul class="dropdown-menu" role="menu" aria-labelledby="dropdownMenu1">
                      <li role="presentation">
                        <a role="menuitem" tabindex="-1" @click="changeSystime('manual')" href="#">{{$t('dashboard.manual')}}</a>
                      </li>
                      <li role="presentation">
                        <a role="menuitem" tabindex="-1" @click="changeSystime('ntp')" href="#">{{$t('dashboard.using_ntp_server')}}</a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div v-if="system.summary.newTimeMode == 'manual'" class="form-group">
                <label class="col-sm-3 control-label" for="textInput-modal-markup">{{$t('dashboard.date_time')}}</label>
                <div class="col-sm-6">
                  <div id="date-picker" class="input-group date">
                    <input required v-model="system.summary.newDate" type="text" class="form-control bootstrap-datepicker">
                    <span class="input-group-addon">
                      <span class="fa fa-calendar"></span>
                    </span>
                  </div>
                </div>
                <div class="col-sm-3">
                  <div class="input-group time-picker-pf" id="time-picker">
                    <input required v-model="system.summary.newTime" type="text" class="form-control">
                    <span class="input-group-addon btn btn-default">
                      <span class="fa fa-clock-o"></span>
                    </span>
                  </div>
                </div>
              </div>

              <div v-if="system.summary.newTimeMode == 'ntp'" class="form-group">
                <label class="col-sm-3 control-label" for="textInput-modal-markup">{{$t('dashboard.ntp_server')}}</label>
                <div class="col-sm-9">
                  <input required type="text" v-model="system.summary.newNtpServer" class="form-control">
                </div>
              </div>
            </div>
            <div class="modal-footer">
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
                <label class="col-sm-3 control-label" for="textInput-modal-markup">{{$t('dashboard.company')}}</label>
                <div class="col-sm-9">
                  <input required type="text" v-model="system.newOrganization.company" class="form-control">
                </div>
              </div>
              <div class="form-group">
                <label class="col-sm-3 control-label" for="textInput-modal-markup">{{$t('dashboard.city')}}</label>
                <div class="col-sm-9">
                  <input type="text" v-model="system.newOrganization.city" class="form-control">
                </div>
              </div>
              <div class="form-group">
                <label class="col-sm-3 control-label" for="textInput-modal-markup">{{$t('dashboard.department')}}</label>
                <div class="col-sm-9">
                  <input type="text" v-model="system.newOrganization.department" class="form-control">
                </div>
              </div>
              <div class="form-group">
                <label class="col-sm-3 control-label" for="textInput-modal-markup">{{$t('dashboard.phone')}}</label>
                <div class="col-sm-9">
                  <input type="text" v-model="system.newOrganization.phone" class="form-control">
                </div>
              </div>
              <div class="form-group">
                <label class="col-sm-3 control-label" for="textInput-modal-markup">{{$t('dashboard.address')}}</label>
                <div class="col-sm-9">
                  <input type="text" v-model="system.newOrganization.address" class="form-control">
                </div>
              </div>
            </div>
            <div class="modal-footer submit">
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
            <h4 class="modal-title">{{system.summary.actualPower == 'reboot' ? $t('dashboard.reboot_the_system') : $t('dashboard.shutdown_the_system')}}</h4>
          </div>
          <form class="form-horizontal" v-on:submit.prevent="powerActions(system.summary.actualPower)">

            <div class="modal-body">
              <div class="form-group">
                <label class="col-sm-3 control-label" for="textInput-modal-markup">{{$t('are_you_sure')}}?</label>
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn btn-default" type="button" data-dismiss="modal">{{$t('cancel')}}</button>
              <button class="btn btn-danger" type="submit">{{system.summary.actualPower == 'reboot' ? $t('dashboard.reboot') : $t('dashboard.power_off')}}</button>
            </div>

          </form>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
window.plotter = require("./../lib/plotter.js");
require("jquery.flot");
require("jquery.flot/jquery.flot.selection");
require("jquery.flot/jquery.flot.time");

export default {
  name: "Dashboard",
  mounted() {
    this.initSystemGraphs();
    this.initMemoryCharts();
    this.initStorageCharts();
  },
  data() {
    return {
      system: {
        summary: {
          hardware: "innotek GmbH VirtualBox",
          kernelRelease: "3.10.0-693.el7.x86_64",
          osRelease: "NethServer release 7.4.1708 (Final)",
          load: "0 / 0.02 / 0.05",
          uptime: "2d 0h 23m",
          hostname: "ns7.edo.nethesis.it",
          newHostname: "ns7.edo.nethesis.it",
          dns: [
            {
              readDns: "8.8.8.8",
              dns: "8.8.8.8"
            },
            {
              readDns: "8.8.4.4",
              dns: "8.8.4.4"
            }
          ],
          date: "2018-05-10",
          time: "10:30",
          timeMode: "ntp",
          ntpServer: "pool.nethserver.org",
          timeZone: "Europe/Italy",
          actualPower: "reboot",
          newTimeMode: "",
          newTimeMode: "",
          newDate: "",
          newTime: "",
          newNtpServer: "",
          newTimeZone: "",
          aliases: [],
          timeZones: ["Europe/Italy", "Europe/Germany"]
        },
        newOrganization: {},
        organization: {
          company: "Example Org",
          city: "Pesaro",
          department: "Main",
          phone: "0721405516",
          address: "Strada degli Olmi, 12"
        },
        memory: {
          system: {
            used_bytes: 845612,
            available_bytes: 987654
          },
          swap: {
            used_bytes: 845612,
            available_bytes: 987654
          }
        },
        mountpoints: {
          "/": {
            size_bytes: 845621,
            used_bytes: 6523100,
            available_bytes: 123456,
            device: "sda1"
          },
          "/home": {
            size_bytes: 845621,
            used_bytes: 6523100,
            available_bytes: 123456,
            device: "sda1"
          }
        },
        systimeTypes: {
          manual: this.$i18n.t("dashboard.manual"),
          ntp: this.$i18n.t("dashboard.using_ntp_server")
        }
      }
    };
  },
  methods: {
    initMemoryCharts() {
      var c3ChartDefaults = patternfly.c3ChartDefaults();
      var ramConfig = c3ChartDefaults.getDefaultDonutConfig("A");
      var swapConfig = c3ChartDefaults.getDefaultDonutConfig("A");
      ramConfig.bindto = "#ram-chart";
      swapConfig.bindto = "#swap-chart";
      ramConfig.data = {
        type: "donut",
        columns: [
          ["Used", this.system.memory.system.used_bytes],
          ["Available", this.system.memory.system.available_bytes]
        ],
        groups: [["used", "available"]],
        order: null
      };
      swapConfig.data = {
        type: "donut",
        columns: [
          ["Used", this.system.memory.swap.used_bytes],
          ["Available", this.system.memory.swap.available_bytes]
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
        this.$options.filters.byteFormat(850623),
        " Used"
      );
      patternfly.pfSetDonutChartTitle(
        "#swap-chart",
        this.$options.filters.byteFormat(850623),
        " Used"
      );
    },
    parseMount(value) {
      return "m" + value.substring(1);
    },
    initStorageCharts() {
      var c3ChartDefaults = patternfly.c3ChartDefaults();
      var mountConfig = c3ChartDefaults.getDefaultDonutConfig("A");

      for (var m in this.system.mountpoints) {
        var mount = this.system.mountpoints[m];

        mountConfig.bindto = "#mount-chart-" + this.parseMount(m);
        mountConfig.data = {
          type: "donut",
          columns: [
            ["Used", mount.used_bytes],
            ["Available", mount.available_bytes]
          ],
          groups: [["used", "available"]],
          order: null
        };

        mountConfig.size = {
          width: 180,
          height: 180
        };

        mountConfig.tooltip = {
          contents: patternfly.pfGetUtilizationDonutTooltipContentsFn("GB")
        };

        c3.generate(mountConfig);
        patternfly.pfSetDonutChartTitle(
          "#mount-chart-" + this.parseMount(m),
          this.$options.filters.byteFormat(mount.used_bytes),
          " Used"
        );
      }
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

      var cpu_options = plotter.plot_simple_template();
      $.extend(cpu_options.yaxis, {
        tickFormatter: function(v) {
          return v.toFixed(0);
        },
        max: 100
      });
      this.cpu_plot = plotter.plot($("#server_cpu_graph"), 300);
      this.cpu_plot.set_options(cpu_options);
      series = this.cpu_plot.add_metrics_sum_series(cpu_data, {});

      /* Memory graph */

      var memory_data = {
        direct: ["mem.util.used"],
        internal: ["memory.used"],
        units: "bytes"
      };

      var memory_options = plotter.plot_simple_template();
      $.extend(memory_options.yaxis, {
        ticks: plotter.memory_ticks,
        tickFormatter: plotter.format_bytes_tick_no_unit
      });
      memory_options.setup_hook = function memory_setup_hook(pl) {
        var axes = pl.getAxes();
        $("#server_memory_unit").text(plotter.bytes_tick_unit(axes.yaxis));
      };

      this.memory_plot = plotter.plot($("#server_memory_graph"), 300);
      this.memory_plot.set_options(memory_options);
      series = this.memory_plot.add_metrics_sum_series(memory_data, {});

      /* Network graph */

      var network_data = {
        direct: ["network.interface.total.bytes"],
        internal: ["network.interface.tx", "network.interface.rx"],
        "omit-instances": ["lo"],
        units: "bytes",
        derive: "rate"
      };

      var network_options = plotter.plot_simple_template();
      $.extend(network_options.yaxis, {
        tickFormatter: plotter.format_bits_per_sec_tick_no_unit
      });
      network_options.setup_hook = function network_setup_hook(pl) {
        var axes = pl.getAxes();
        if (axes.yaxis.datamax < 100000) axes.yaxis.options.max = 100000;
        else axes.yaxis.options.max = null;
        axes.yaxis.options.min = 0;

        $("#server_network_traffic_unit").text(
          plotter.bits_per_sec_tick_unit(axes.yaxis)
        );
      };

      this.network_plot = plotter.plot($("#server_network_traffic_graph"), 300);
      this.network_plot.set_options(network_options);
      series = this.network_plot.add_metrics_sum_series(network_data, {});

      /* Disk IO graph */

      var disk_data = {
        direct: ["disk.all.total_bytes"],
        internal: ["disk.all.read", "disk.all.written"],
        units: "bytes",
        derive: "rate"
      };

      var disk_options = plotter.plot_simple_template();
      $.extend(disk_options.yaxis, {
        ticks: plotter.memory_ticks,
        tickFormatter: plotter.format_bytes_per_sec_tick_no_unit
      });
      disk_options.setup_hook = function disk_setup_hook(pl) {
        var axes = pl.getAxes();
        if (axes.yaxis.datamax < 100000) axes.yaxis.options.max = 100000;
        else axes.yaxis.options.max = null;
        axes.yaxis.options.min = 0;

        $("#server_disk_io_unit").text(
          plotter.bytes_per_sec_tick_unit(axes.yaxis)
        );
      };

      this.disk_plot = plotter.plot($("#server_disk_io_graph"), 300);
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
    },
    saveHostname(hostname) {
      $("#hostnameChangeModal").modal("hide");

      // set hostname
      /* if (
                this.system.summary.hostname !==
                this.system.summary.newHostname
              ) {
                nethserver.system.summary.setHostname(hostname).then(
                  function() {
                    this.system.summary.hostname = hostname;
                    $scope.$apply();
                  },
                  function(err) {}
                );
              } */

      // set aliases
      /* nethserver.system.dns
                .setAliases(
                  this.system.summary.aliases.map(function(val) {
                    return val.key;
                  })
                )
                .then(
                  function() {},
                  function(err) {
                    console.error(err);
                  }
                ); */
    },
    addAlias(alias) {
      this.system.summary.aliases.push({
        isNew: true
      });
    },
    removeAlias(alias, index) {
      this.system.summary.aliases.splice(index, 1);
    },
    saveDNS(dns) {
      var dnsToSave = [];
      if (dns[0].dns.length > 0) {
        dnsToSave.push(dns[0].dns);
      }
      if (dns[1].dns.length > 0) {
        dnsToSave.push(dns[1].dns);
      }
      /* nethserver.system.dns.setDNS(dnsToSave).then(
                function() {
                  $("#dnsChangeModal").modal("hide");
                  this.system.summary.dns = dnsToSave.map(function(val) {
                    return {
                      readDns: val,
                      dns: val
                    };
                  });
                  $scope.$apply();
                },
                function(err) {
                  console.error(err);
                }
              ); */
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
      console.log(value);
      this.system.summary.newTimeMode = value;
    },
    saveSystime() {
      $("#systimeChangeModal").modal("hide");

      /* nethserver.system.date
              .setDate({
                DateTime:
                  this.system.summary.newDate + " " + this.system.summary.newTime,
                TimeZone: this.system.summary.newTimeZone,
                NTPServer: this.system.summary.newNtpServer
              })
              .then(
                function(info) {
                  $("#systimeChangeModal").modal("hide");
                },
                function(err) {
                  console.error(err);
                }
              ); */
    },
    openChangeCompany() {
      $("#companyChangeModal").modal("show");
      this.system.newOrganization = Object.assign({}, this.system.organization);
    },
    saveCompany(organization) {
      $("#companyChangeModal").modal("hide");

      /* nethserver.system.organization.saveInfo(organization).then(
          function () {
            this.system.organization = organization;
            $scope.$apply();
          },
          function (err) {
            console.error(err);
          }
        ); */
    },
    openPowerModal(action) {
      this.system.summary.actualPower = action;
      $("#powerModal").modal("show");
    },
    powerActions(action) {
      $("#powerModal").modal("hide");
      switch (action) {
        case "reboot":
          /* nethserver.system.power.reboot().then(
                function() {
                  $scope.notifications.add({
                    type: "info",
                    title: $filter("translate")("Reboot"),
                    message: $filter("translate")("Rebooting the system..."),
                    status: "warning"
                  });
                  $scope.$apply();
                },
                function(err) {
                  console.error(err);
                }
              ); */
          break;

        case "poweroff":
          /* nethserver.system.power.poweroff().then(
                function() {
                  $scope.notifications.add({
                    type: "info",
                    title: $filter("translate")("Power off"),
                    message: $filter("translate")("Shutting down the system..."),
                    status: "warning"
                  });
                  $scope.$apply();
                },
                function(err) {
                  console.error(err);
                }
              ); */
          break;
      }
    }
  }
};
</script>

<style>

</style>
