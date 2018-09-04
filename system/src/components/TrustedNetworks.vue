<template>
  <div>
    <h2>{{$t('trusted_networks.title')}}</h2>
    <h3>{{$t('actions')}}</h3>
    <button @click="addNetwork()" class="btn btn-primary btn-lg shutdown-privileged" data-action="restart" data-container="body">
      {{$t('trusted_networks.add_network')}}
    </button>

    <h3>{{$t('list')}}</h3>
    <vue-good-table :customRowsPerPageDropdown="[25,50,100]" :perPage="25" :columns="columns" :rows="rows" :lineNumbers="false"
      :defaultSortBy="{field: 'name', type: 'asc'}" :globalSearch="true" :paginate="true" styleClass="table" :nextText="tableLangsTexts.nextText"
      :prevText="tableLangsTexts.prevText" :rowsPerPageText="tableLangsTexts.rowsPerPageText" :globalSearchPlaceholder="tableLangsTexts.globalSearchPlaceholder"
      :ofText="tableLangsTexts.ofText">
      <template slot="table-row" slot-scope="props">
        <td class="fancy">
            <strong>{{ props.row.network}}</strong>
        </td>
        <td class="fancy">{{ props.row.network_mask}}</td>
        <td class="fancy">
          {{props.row.description}}
        </td>
        <td>
          <button @click="openDeleteNetwork(props.row)" class="btn btn-danger">
            <span class="fa fa-times span-right-margin"></span>
            {{$t('delete')}}
          </button>
        </td>
      </template>
    </vue-good-table>

    <div class="modal" id="newNetworkModal" tabindex="-1" role="dialog" data-backdrop="static">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title">{{$t('trusted_networks.add_network')}}</h4>
          </div>
          <form class="form-horizontal" v-on:submit.prevent="saveNetwork(newNetwork)">

            <div class="modal-body">
              <div v-if="newNetwork.onTaskRunning" class="alert alert-warning alert-dismissable">
                <span class="pficon pficon-warning-triangle-o"></span>
                <strong>{{$t('trusted_networks.running_task')}}.</strong> {{newNetwork.errorMessage}}
              </div>

              <div :class="['form-group', newNetwork.errorProps['key'] ? 'has-error' : '']">
                <label class="col-sm-3 control-label" for="textInput-modal-markup">{{$t('trusted_networks.network_address')}}</label>
                <div class="col-sm-9">
                  <input :disabled="newNetwork.isEdit" required type="text" v-model="newNetwork.network_address" class="form-control">
                  <span v-if="newNetwork.errorProps['key']" class="help-block">{{newNetwork.errorProps['key']}}</span>
                </div>
              </div>
              <div :class="['form-group', newNetwork.errorProps['network_mask'] ? 'has-error' : '']">
                <label class="col-sm-3 control-label" for="textInput-modal-markup">{{$t('trusted_networks.network_mask')}}</label>
                <div class="col-sm-9">
                  <input required type="text" v-model="newNetwork.network_mask" class="form-control">
                  <span v-if="newNetwork.errorProps['network_mask']" class="help-block">{{newNetwork.errorProps['network_mask']}}</span>
                </div>
              </div>
              <div class="form-group">
                <label class="col-sm-3 control-label" for="textInput-modal-markup">{{$t('trusted_networks.description')}}</label>
                <div class="col-sm-9">
                  <input type="text" v-model="newNetwork.description" class="form-control">
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

    <div class="modal" id="deleteNetworkModal" tabindex="-1" role="dialog" data-backdrop="static">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title">{{$t('trusted_networks.delete_network')}} {{currentNetwork.network}}</h4>
          </div>
          <form class="form-horizontal" v-on:submit.prevent="deleteNetwork(currentNetwork)">

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
  name: "TrustedNetworks",
  mixins: [UtilService],
  mounted() {
    this.getNetworks();
  },
  data() {
    return {
      view: {
        isLoaded: false
      },
      tableLangsTexts: this.tableLangs(),
      columns: [
        {
          label: this.$i18n.t("trusted_networks.network"),
          field: "name",
          filterable: true
        },
        {
          label: this.$i18n.t("trusted_networks.network_mask"),
          field: "name",
          filterable: true
        },
        {
          label: this.$i18n.t("trusted_networks.description"),
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
          network: "192.168.5.0",
          network_mask: "255.255.255.0",
          description: "Prova test",
        },
        {
          id: 2,
          network: "192.168.6.0",
          network_mask: "255.255.255.0",
          description: "Prova test",
        }
      ],
      currentNetwork: {},
      newNetwork: {
        errorProps: {},
        isEdit: false,
        key: ''
      }
    };
  },
  methods: {
    getNetworks() {
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
      delete this.newNetwork.errorMessage;
      delete this.newNetwork.errorProps;
      delete this.newNetwork.onTaskRunning;
    },

    saveNetwork(host) {
      this.cleanErrors();
      /* if (host.isEdit) {
        nethserver.system.dns.editRemoteHost(host).then(
          function() {
            $("#newNetworkModal").modal("hide");
          },
          function(err) {
            console.log(err);
            if (err.type == "TaskRun") {
              this.newNetwork.onTaskRunning = true;
            } else {
              this.newNetwork.onTaskRunning = false;
              this.newNetwork.errorMessage = err.message;
              this.newNetwork.errorProps = err.attributes;
            }
            $scope.$apply();
          }
        );
      } else {
        nethserver.system.dns.addRemoteHost(host).then(
          function() {
            $("#newNetworkModal").modal("hide");
          },
          function(err) {
            console.log(err);
            if (err.type == "TaskRun") {
              this.newNetwork.onTaskRunning = true;
            } else {
              this.newNetwork.onTaskRunning = false;
              this.newNetwork.errorMessage = err.message;
              this.newNetwork.errorProps = err.attributes;
            }
            $scope.$apply();
          }
        );
      } */
    },
    addNetwork() {
      this.newNetwork = {};
      this.newNetwork.isEdit = false;
      this.newNetwork.errorProps = {};
      $("#newNetworkModal").modal("show");
    },
    openDeleteNetwork(host) {
      this.currentNetwork = Object.assign({}, host);
      $("#deleteNetworkModal").modal("show");
    },
    deleteNetwork(host) {
      /* nethserver.system.dns.deleteRemoteHost(host.key).then(
        function() {
          $("#deleteNetworkModal").modal("hide");
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
