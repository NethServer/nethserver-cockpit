<template>
  <div>
    <h2>{{$t('dns.title')}}</h2>
    <h3>{{$t('actions')}}</h3>
    <button @click="newDNS()" class="btn btn-primary btn-lg shutdown-privileged" data-action="restart" data-container="body">
      {{$t('dns.add_dns_record')}}
    </button>

    <h3>{{$t('list')}}</h3>
    <vue-good-table :customRowsPerPageDropdown="[25,50,100]" :perPage="25" :columns="columns" :rows="rows" :lineNumbers="false"
      :defaultSortBy="{field: 'name', type: 'asc'}" :globalSearch="true" :paginate="true" styleClass="table" :nextText="tableLangsTexts.nextText"
      :prevText="tableLangsTexts.prevText" :rowsPerPageText="tableLangsTexts.rowsPerPageText" :globalSearchPlaceholder="tableLangsTexts.globalSearchPlaceholder"
      :ofText="tableLangsTexts.ofText">
      <template slot="table-row" slot-scope="props">
        <td class="fancy">
          <a @click="editDNS(props.row)">
            <strong>{{ props.row.key}}</strong>
          </a>
        </td>
        <td class="fancy">{{ props.row.description}}</td>
        <td class="fancy">
          <span class="fa fa-desktop"></span>
          {{props.row.ip}}
        </td>
        <td>
          <button @click="editDNS(props.row)" class="btn btn-default">
            <span class="fa fa-pencil span-right-margin"></span>
            {{$t('edit')}}
          </button>
          <div class="dropup pull-right dropdown-kebab-pf">
            <button class="btn btn-link dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
              <span class="fa fa-ellipsis-v"></span>
            </button>
            <ul class="dropdown-menu dropdown-menu-right">
              <li>
                <a @click="openDeleteDNS(props.row)">
                  <span class="fa fa-times span-right-margin"></span>
                  {{$t('delete')}}
                </a>
              </li>
            </ul>
          </div>
        </td>
      </template>
    </vue-good-table>

    <div class="modal" id="newDNSModal" tabindex="-1" role="dialog" data-backdrop="static">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title">{{newDns.isEdit ? $t('dns.edit_dns_record') + ' '+ newDns.key : $t('dns.add_dns_record')}}</h4>
          </div>
          <form class="form-horizontal" v-on:submit.prevent="saveDNS(newDns)">

            <div class="modal-body">
              <div v-if="newDns.onTaskRunning" class="alert alert-warning alert-dismissable">
                <span class="pficon pficon-warning-triangle-o"></span>
                <strong>{{$t('dns.running_task')}}.</strong> {{newDns.errorMessage}}
              </div>

              <div :class="['form-group', newDns.errorProps['key'] ? 'has-error' : '']">
                <label class="col-sm-3 control-label" for="textInput-modal-markup">{{$t('dns.hostname')}}</label>
                <div class="col-sm-9">
                  <input :disabled="newDns.isEdit" required type="text" v-model="newDns.key" class="form-control">
                  <span v-if="newDns.errorProps['key']" class="help-block">{{newDns.errorProps['key']}}</span>
                </div>
              </div>
              <div :class="['form-group', newDns.errorProps['IpAddress'] ? 'has-error' : '']">
                <label class="col-sm-3 control-label" for="textInput-modal-markup">{{$t('dns.ip_address')}}</label>
                <div class="col-sm-9">
                  <input required type="text" v-model="newDns.ip" class="form-control">
                  <span v-if="newDns.errorProps['IpAddress']" class="help-block">{{newDns.errorProps['IpAddress']}}</span>
                </div>
              </div>
              <div class="form-group">
                <label class="col-sm-3 control-label" for="textInput-modal-markup">{{$t('dns.description')}}</label>
                <div class="col-sm-9">
                  <input type="text" v-model="newDns.description" class="form-control">
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

    <div class="modal" id="deleteDNSModal" tabindex="-1" role="dialog" data-backdrop="static">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title">{{$t('dns.delete_dns')}} {{currentDns.key}}</h4>
          </div>
          <form class="form-horizontal" v-on:submit.prevent="deleteDNS(currentDns)">

            <div class="modal-body">
              <div class="form-group">
                <label class="col-sm-3 control-label" for="textInput-modal-markup">{{$t('are_you_sure')}}?</label>
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
  </div>
</template>

<script>
import UtilService from "../services/util";
export default {
  name: "DNS",
  mixins: [UtilService],
  mounted() {
    this.getDns();
  },
  data() {
    return {
      view: {
        isLoaded: false
      },
      tableLangsTexts: this.tableLangs(),
      columns: [
        {
          label: this.$i18n.t("dns.name"),
          field: "name",
          filterable: true
        },
        {
          label: this.$i18n.t("dns.description"),
          field: "name",
          filterable: true
        },
        {
          label: this.$i18n.t("dns.ip_address"),
          field: "name",
          filterable: true
        },
        {
          label: this.$i18n.t("action"),
          field: "",
          filterable: true,
          sortable: false
        }
      ],
      rows: [
        {
          id: 1,
          key: "h1",
          description: "NethServer, O=Example Org, ST=SomeState, OU=Main",
          ip: "8.8.8.8",
        },
        {
          id: 2,
          key: "h2",
          description: "NethServer, O=Example Org, ST=SomeState, OU=Main",
          ip: "8.8.4.4",
        }
      ],
      currentDns: {},
      newDns: {
        errorProps: {},
        isEdit: false,
        key: ''
      }
    };
  },
  methods: {
    getDns() {
      /* nethserver.system.certificates.getAllCertificates().then(
              function(certificates) {
                $scope.view.isLoaded = true;
                $scope.localSystem.certificates = certificates;

                $scope.$apply();
              },
              function(err) {
                console.error("couldn't read certificates: " + err);
              }
            ); */
    },
    cleanErrors() {
      delete this.newDns.errorMessage;
      delete this.newDns.errorProps;
      delete this.newDns.onTaskRunning;
    },

    saveDNS(host) {
      this.cleanErrors();
      /* if (host.isEdit) {
        nethserver.system.dns.editRemoteHost(host).then(
          function() {
            $("#newDNSModal").modal("hide");
          },
          function(err) {
            console.log(err);
            if (err.type == "TaskRun") {
              this.newDns.onTaskRunning = true;
            } else {
              this.newDns.onTaskRunning = false;
              this.newDns.errorMessage = err.message;
              this.newDns.errorProps = err.attributes;
            }
            $scope.$apply();
          }
        );
      } else {
        nethserver.system.dns.addRemoteHost(host).then(
          function() {
            $("#newDNSModal").modal("hide");
          },
          function(err) {
            console.log(err);
            if (err.type == "TaskRun") {
              this.newDns.onTaskRunning = true;
            } else {
              this.newDns.onTaskRunning = false;
              this.newDns.errorMessage = err.message;
              this.newDns.errorProps = err.attributes;
            }
            $scope.$apply();
          }
        );
      } */
    },
    newDNS() {
      this.newDns = {};
      this.newDns.isEdit = false;
      this.newDns.errorProps = {};
      $("#newDNSModal").modal("show");
    },
    editDNS(host) {
      this.cleanErrors();
      this.newDns = host;
      this.newDns.isEdit = true;
      this.newDns.errorProps = {};
      $("#newDNSModal").modal("show");
    },
    openDeleteDNS(host) {
      this.currentDns = Object.assign({}, host);
      $("#deleteDNSModal").modal("show");
    },
    deleteDNS(host) {
      /* nethserver.system.dns.deleteRemoteHost(host.key).then(
        function() {
          $("#deleteDNSModal").modal("hide");
        },
        function(err) {
          console.error(err);
        }
      ); */
    }
  }
};
</script>

<style>

</style>
