<template>
  <div>
    <h2>{{$t('services.title')}}</h2>
    <h3>{{$t('list')}}</h3>
    <vue-good-table :customRowsPerPageDropdown="[25,50,100]" :perPage="25" :columns="columns" :rows="rows" :lineNumbers="false"
      :defaultSortBy="{field: 'name', type: 'asc'}" :globalSearch="true" :paginate="true" styleClass="table" :nextText="tableLangsTexts.nextText"
      :prevText="tableLangsTexts.prevText" :rowsPerPageText="tableLangsTexts.rowsPerPageText" :globalSearchPlaceholder="tableLangsTexts.globalSearchPlaceholder"
      :ofText="tableLangsTexts.ofText">
      <template slot="table-row" slot-scope="props">
        <td class="fancy">
          <strong>{{ props.row.name}}</strong>
        </td>
        <td class="fancy">{{ props.row.description}}</td>
        <td class="fancy">
          <span :class="['fa', props.row.enabled ? 'fa-check green' : 'fa-times red']"></span>
        </td>
        <td class="fancy">
          <span :class="['fa', props.row.running ? 'fa-check green' : 'fa-times red']"></span>
        </td>
        <td class="fancy">
          <a @click="openDetails(props.row)">
            <span>{{$t('view')}}</span>
          </a>
        </td>
        <td>
          <button @click="props.row.running ? restartService(props.row.name) : startService(props.row.name)" class="btn btn-default button-minimum">
            <span :class="['fa', props.row.running ? 'fa-refresh' : 'fa-play', 'span-right-margin']"></span>
            {{props.row.running ? $t('services.restart') : $t('services.start') }}
          </button>
          <div class="dropup pull-right dropdown-kebab-pf">
            <button class="btn btn-link dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
              <span class="fa fa-ellipsis-v"></span>
            </button>
            <ul class="dropdown-menu dropdown-menu-right">
              <li>
                <a @click="props.row.status ? disableService(props.row.name) : enableService(props.row.name)">
                  <span :class="['fa', props.row.status ? 'fa-times' : 'fa-check', 'action-icon-menu']"></span>
                  {{props.row.status ? $t('services.disable') : $t('services.enable') }}
                </a>
              </li>
              <li ng-if="props.row.running" role="separator" class="divider"></li>
              <li ng-if="props.row.running">
                <a @click="stopService(props.row.name)">
                  <span class="fa fa-power-off action-icon-menu"></span>
                  {{$t('services.stop')}}
                </a>
              </li>
            </ul>
          </div>
        </td>
      </template>
    </vue-good-table>
    <div class="modal" id="detailsModal" tabindex="-1" role="dialog" data-backdrop="static">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title">{{$t('services.details_of')}} {{currentDetails.name}}</h4>
          </div>
          <form class="form-horizontal">

            <div class="modal-body">
              <div class="form-group">
                <label class="col-sm-3 control-label no-padding-top" for="textInput-modal-markup">{{$t('services.properties')}}</label>
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
                <label class="col-sm-3 control-label no-padding-top" for="textInput-modal-markup">{{$t('services.network')}}</label>
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
              <button class="btn btn-default" type="button" data-dismiss="modal">{{$t('cancel')}}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import UtilService from "../services/util";
  export default {
    name: "Services",
    mixins: [UtilService],
    mounted() {
      this.getServices();
    },
    data() {
      return {
        view: {
          isLoaded: false
        },
        tableLangsTexts: this.tableLangs(),
        columns: [{
            label: this.$i18n.t("services.name"),
            field: "name",
            filterable: true
          },
          {
            label: this.$i18n.t("services.description"),
            field: "name",
            filterable: true
          },
          {
            label: this.$i18n.t("services.enabled"),
            field: "name",
            filterable: true
          },
          {
            label: this.$i18n.t("services.running"),
            field: "name",
            filterable: true
          },
          {
            label: this.$i18n.t("details"),
            field: "name",
            filterable: true,
            sortable: false
          },
          {
            label: this.$i18n.t("action"),
            field: "",
            filterable: true,
            sortable: false
          }
        ],
        rows: [{
            id: 1,
            name: "amavisd",
            description: "Amavisd-new is an interface between MTA and content checkers.",
            enabled: true,
            running: true,
            props: {
              SpamTag2Level: "5.0",
              SenderBlackList: null
            },
            ports: {
              access: "green",
              UDP: [],
              TCP: []
            }
          },
          {
            id: 2,
            name: "postfix",
            description: "Postfix Mail Transport Agent",
            enabled: false,
            running: false,
            props: [],
            ports: {
              access: "green",
              UDP: [],
              TCP: []
            }
          }
        ],
        currentDetails: {
          props: {},
          ports: {}
        }
      };
    },
    methods: {
      isEmpty: function (obj) {
        if (obj) {
          return Object.keys(obj).lenght === 0;
        } else return true;
      },
      getServices() {
        this.view.isLoaded = true;
      },
      enableService(service) {
        /* nethserver.system.services.enableService(service).then(
          function(services) {},
          function(err) {
            console.error(err);
          }
        ); */
      },

      disableService(service) {
        /* nethserver.system.services.disableService(service).then(
          function() {},
          function(err) {
            console.error(err);
          }
        ); */
      },

      startService(service) {
        /* nethserver.system.services.startService(service).then(
          function() {},
          function(err) {
            console.error(err);
          }
        ); */
      },

      stopService(service) {
        /* nethserver.system.services.stopService(service).then(
          function() {},
          function(err) {
            console.error(err);
          }
        ); */
      },

      restartService(service) {
        /* nethserver.system.services.restartService(service).then(
          function() {},
          function(err) {
            console.error(err);
          }
        ); */
      },
      openDetails(obj) {
        this.currentDetails = obj;
        $("#detailsModal").modal("show");
      }
    }
  };

</script>

<style>


</style>
