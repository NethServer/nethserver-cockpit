<template>
  <div v-if="view.isAuth">
    <h2>{{$t('trusted_networks.title')}}</h2>
    <doc-info
      :placement="'top'"
      :title="$t('docs.trusted_networks')"
      :chapter="'base_system'"
      :section="'trusted-networks'"
      :inline="false"
    ></doc-info>

    <h3>{{$t('actions')}}</h3>
    <button @click="addNetwork()" class="btn btn-primary btn-lg shutdown-privileged" data-action="restart"
      data-container="body">
      {{$t('trusted_networks.add_network')}}
    </button>

    <h3>{{$t('list')}}</h3>
    <div v-if="!view.isLoaded" class="spinner spinner-lg"></div>
    <vue-good-table
      v-if="view.isLoaded"
      :columns="columns"
      :rows="rows"
      :pagination-options="{
        enabled: true,
        perPageDropdown: [25, 50, 100],
        perPage: 25,
        nextLabel: tableLangsTexts.nextText,
        prevLabel: tableLangsTexts.prevText,
        ofLabel: tableLangsTexts.ofText,
        rowsPerPageLabel: tableLangsTexts.rowsPerPageText,
      }"
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
          <strong>{{ props.row.name}}</strong>
        </span>
        <span v-if="props.column.field == 'props.Mask'">
          {{ props.row.props.Mask}}
        </span>
        <span v-if="props.column.field == 'props.Description'">
          {{ props.row.props.Description }}
        </span>
        <span v-if="props.column.field == 'action'">
          <!-- allow edit and delete only for custom trusted networks -->
          <div v-if="props.row.custom">
            <button @click="editNetwork(props.row)" class="btn btn-default">
              <span class="fa fa-pencil span-right-margin"></span>
              {{$t('edit')}}
            </button>
            <div class="dropup pull-right dropdown-kebab-pf">
              <button class="btn btn-link dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                <span class="fa fa-ellipsis-v"></span>
              </button>
              <ul class="dropdown-menu dropdown-menu-right">
                <li>
                  <a @click="openDeleteNetwork(props.row)">
                    <span class="fa fa-times span-right-margin"></span>
                    {{$t('delete')}}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </span>
      </template>
    </vue-good-table>

    <div class="modal" id="newNetworkModal" tabindex="-1" role="dialog" data-backdrop="static">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title">{{newNetwork.isEdit ? $t('trusted_networks.edit_network') + ' '+ newNetwork.name :
              $t('trusted_networks.add_network')}}</h4>
          </div>
          <form class="form-horizontal" v-on:submit.prevent="saveNetwork(newNetwork)">
            <div class="modal-body">
              <div :class="['form-group', newNetwork.errors.name.hasError ? 'has-error' : '']">
                <label class="col-sm-3 control-label" for="textInput-modal-markup">{{$t('trusted_networks.network_address')}}</label>
                <div class="col-sm-9">
                  <input :disabled="newNetwork.isEdit" required type="text" v-model="newNetwork.name" class="form-control">
                  <span v-if="newNetwork.errors.name.hasError" class="help-block">{{$t('validation.validation_failed')}}: {{$t('validation.'+newNetwork.errors.name.message)}}</span>
                </div>
              </div>
              <div :class="['form-group', newNetwork.errors.Mask.hasError ? 'has-error' : '']">
                <label class="col-sm-3 control-label" for="textInput-modal-markup">{{$t('trusted_networks.network_mask')}}</label>
                <div class="col-sm-9">
                  <input required type="text" v-model="newNetwork.props.Mask" class="form-control">
                  <span v-if="newNetwork.errors.Mask.hasError" class="help-block">{{$t('validation.validation_failed')}}: {{$t('validation.'+newNetwork.errors.Mask.message)}}</span>
                </div>
              </div>
              <div :class="['form-group', newNetwork.errors.Description.hasError ? 'has-error' : '']">
                <label class="col-sm-3 control-label" for="textInput-modal-markup">{{$t('trusted_networks.description')}}</label>
                <div class="col-sm-9">
                  <input type="text" v-model="newNetwork.props.Description" class="form-control">
                  <span v-if="newNetwork.errors.Description.hasError" class="help-block">{{$t('validation.validation_failed')}}: {{$t('validation.'+newNetwork.errors.Description.message)}}</span>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <div v-if="newNetwork.isLoading" class="spinner spinner-sm form-spinner-loader"></div>
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
            <h4 class="modal-title">{{$t('trusted_networks.delete_network')}} {{currentNetwork.name}}</h4>
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
export default {
  name: "TrustedNetworks",
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
    this.getNetworks();
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
          label: this.$i18n.t("trusted_networks.network"),
          field: "name",
          filterable: true
        },
        {
          label: this.$i18n.t("trusted_networks.network_mask"),
          field: "props.Mask",
          filterable: true
        },
        {
          label: this.$i18n.t("trusted_networks.description"),
          field: "props.Description",
          filterable: true
        },
        {
          label: this.$i18n.t("action"),
          field: "action",
          filterable: true,
          sortable: false
        }
      ],
      rows: [],
      currentNetwork: {},
      newNetwork: {
        errors: {
          name: {
            hasError: false,
            message: ""
          },
          Mask: {
            hasError: false,
            message: ""
          },
          Description: {
            hasError: false,
            message: ""
          }
        },
        isEdit: false,
        isLoading: false,
        name: "",
        props: {
          Mask: "",
          Description: ""
        }
      }
    };
  },
  methods: {
    initGraphics() {
      $("#app").css("background", "");
      $("#app").css("color", "");
    },
    getNetworks() {
      var context = this;
      context.exec(
        ["system-trusted-networks/read"],
        null,
        null,
        function(success) {
          try {
            success = JSON.parse(success);
          } catch (e) {
            console.error(e);
          }
          context.rows = context.mapTrustedNetworks(success);
          context.view.isLoaded = true;
        },
        function(error) {
          console.error(error);
        }
      );
    },
    mapTrustedNetworks(trustedNetworksOutput) {
      for (var network of trustedNetworksOutput.configuration) {
        // configuration contains custom trusted networks
        network.custom = true;
      }
      var trustedNetworks = trustedNetworksOutput.configuration;

      for (var network of trustedNetworksOutput.status) {
        // status contains both custom and builtin trusted networks

        if (network.provider != 'networksdb') {
          // builtin trusted network
          var networkAddress = network.mask.split("/")[0];
          var networkMask = network.mask.split("/")[1];

          var builtinTrustedNetwork = {
            props: {
              Mask: networkMask,
              Description: network.provider,
            },
            name: networkAddress,
            type: 'network',
            custom: false
          }
          trustedNetworks.push(builtinTrustedNetwork);
        }
      }
      return trustedNetworks;
    },
    saveNetwork(network) {
      var context = this;

      var networkObj = Object.assign({}, network);
      networkObj.type = "network";
      networkObj.action = network.isEdit ? "update" : "create";

      // validate input
      context.newNetwork.isLoading = true;
      context.newNetwork.errors.name.hasError = false;
      context.newNetwork.errors.Mask.hasError = false;
      context.newNetwork.errors.Description.hasError = false;

      context.exec(
        ["system-trusted-networks/validate"],
        networkObj,
        null,
        function(success) {
          context.newNetwork.isLoading = false;
          $("#newNetworkModal").modal("hide");

          // update values
          if (network.isEdit) {
            context.exec(
              ["system-trusted-networks/update"],
              networkObj,
              function(stream) {
                console.info("trusted-networks", stream);
              },
              function(success) {
                // notification
                context.$parent.notifications.success.message = context.$i18n.t(
                  "trusted_networks.network_edit_ok"
                );

                // get trusted networks
                context.getNetworks();
              },
              function(error, data) {
                // notification
                context.$parent.notifications.error.message = context.$i18n.t(
                  "trusted_networks.network_edit_error"
                );
              }
            );
          } else {
            context.exec(
              ["system-trusted-networks/create"],
              networkObj,
              function(stream) {
                console.info("trusted-networks", stream);
              },
              function(success) {
                // notification
                context.$parent.notifications.success.message = context.$i18n.t(
                  "trusted_networks.network_create_ok"
                );

                // get trusted networks
                context.getNetworks();
              },
              function(error, data) {
                // notification
                context.$parent.notifications.error.message = context.$i18n.t(
                  "trusted_networks.network_create_error"
                );
              }
            );
          }
        },
        function(error, data) {
          var errorData = {};
          context.newNetwork.isLoading = false;
          context.newNetwork.errors.name.hasError = false;
          context.newNetwork.errors.Mask.hasError = false;
          context.newNetwork.errors.Description.hasError = false;

          try {
            errorData = JSON.parse(data);
            for (var e in errorData.attributes) {
              var attr = errorData.attributes[e];

              if (context.newNetwork.errors[attr.parameter]) {
                context.newNetwork.errors[attr.parameter].hasError = true;
                context.newNetwork.errors[attr.parameter].message = attr.error;
              }
            }
          } catch (e) {
            console.error(e);
          }
        }
      );
    },
    addNetwork() {
      this.newNetwork = {
        errors: {
          name: {
            hasError: false,
            message: ""
          },
          Mask: {
            hasError: false,
            message: ""
          },
          Description: {
            hasError: false,
            message: ""
          }
        },
        isEdit: false,
        isLoading: false,
        name: "",
        props: {
          Mask: "",
          Description: ""
        }
      };
      $("#newNetworkModal").modal("show");
    },
    editNetwork(network) {
      this.newNetwork.name = network.name;
      this.newNetwork.props.Mask = network.props.Mask;
      this.newNetwork.props.Description = network.props.Description;

      this.newNetwork.isEdit = true;
      this.newNetwork.errors = {
        name: {
          hasError: false,
          message: ""
        },
        Mask: {
          hasError: false,
          message: ""
        },
        Description: {
          hasError: false,
          message: ""
        }
      };
      $("#newNetworkModal").modal("show");
    },
    openDeleteNetwork(network) {
      this.currentNetwork = Object.assign({}, network);
      $("#deleteNetworkModal").modal("show");
    },
    deleteNetwork(network) {
      var context = this;

      $("#deleteNetworkModal").modal("hide");
      context.exec(
        ["system-trusted-networks/delete"],
        {
          name: network.name
        },
        function(stream) {
          console.info("trusted-networks", stream);
        },
        function(success) {
          // notification
          context.$parent.notifications.success.message = context.$i18n.t(
            "trusted_networks.network_delete_ok"
          );

          // get trusted networks
          context.getNetworks();
        },
        function(error, data) {
          // notification
          context.$parent.notifications.error.message = context.$i18n.t(
            "trusted_networks.network_delete_error"
          );
        }
      );
    }
  }
};
</script>

<style>
</style>