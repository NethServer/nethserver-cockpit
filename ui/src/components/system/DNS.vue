<template>
  <div v-if="view.isAuth">
    <h2>{{$t('dns.title')}}</h2>
    <h3>{{$t('actions')}}</h3>
    <button @click="newDNS()" class="btn btn-primary btn-lg shutdown-privileged" data-action="restart" data-container="body">
      {{$t('dns.add_dns_record')}}
    </button>

    <h3>{{$t('list')}}</h3>
    <div v-if="!view.isLoaded" class="spinner spinner-lg"></div>
    <vue-good-table v-if="view.isLoaded" :customRowsPerPageDropdown="[25,50,100]" :perPage="25" :columns="columns" :rows="rows" :lineNumbers="false"
      :defaultSortBy="{field: 'name', type: 'asc'}" :globalSearch="true" :paginate="true" styleClass="table" :nextText="tableLangsTexts.nextText"
      :prevText="tableLangsTexts.prevText" :rowsPerPageText="tableLangsTexts.rowsPerPageText" :globalSearchPlaceholder="tableLangsTexts.globalSearchPlaceholder"
      :ofText="tableLangsTexts.ofText">
      <template slot="table-row" slot-scope="props">
        <td class="fancy">
          <a @click="editDNS(props.row)">
            <strong>{{ props.row.name}}</strong>
          </a>
        </td>
        <td class="fancy">{{ props.row.props.Description}}</td>
        <td class="fancy">
          <span class="fa fa-desktop"></span>
          {{props.row.props.IpAddress}}
        </td>
        <td class="fancy">
          <span :class="['fa', props.row.props.WildcardMode ? 'fa-check green' : 'fa-remove red']"></span>
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
            <h4 class="modal-title">{{newDns.isEdit ? $t('dns.edit_dns_record') + ' '+ newDns.name : $t('dns.add_dns_record')}}</h4>
          </div>
          <form class="form-horizontal" v-on:submit.prevent="saveDNS(newDns)">

            <div class="modal-body">
              <div :class="['form-group', newDns.errors.name.hasError ? 'has-error' : '']">
                <label class="col-sm-3 control-label" for="textInput-modal-markup">{{$t('dns.hostname')}}</label>
                <div class="col-sm-9">
                  <input :disabled="newDns.isEdit" required type="text" v-model="newDns.name" class="form-control">
                  <span v-if="newDns.errors.name.hasError" class="help-block">{{$t('validation.validation_failed')}}: {{$t('validation.'+newDns.errors.name.message)}}</span>
                </div>
              </div>
              <div :class="['form-group', newDns.errors.IpAddress.hasError ? 'has-error' : '']">
                <label class="col-sm-3 control-label" for="textInput-modal-markup">{{$t('dns.ip_address')}}</label>
                <div class="col-sm-9">
                  <input required type="text" v-model="newDns.props.IpAddress" class="form-control">
                  <span v-if="newDns.errors.IpAddress.hasError" class="help-block">{{$t('validation.validation_failed')}}: {{$t('validation.'+newDns.errors.IpAddress.message)}}</span>
                </div>
              </div>
              <div :class="['form-group', newDns.errors.Description.hasError ? 'has-error' : '']">
                <label class="col-sm-3 control-label" for="textInput-modal-markup">{{$t('dns.description')}}</label>
                <div class="col-sm-9">
                  <input type="text" v-model="newDns.props.Description" class="form-control">
                  <span v-if="newDns.errors.Description.hasError" class="help-block">{{$t('validation.validation_failed')}}: {{$t('validation.'+newDns.errors.Description.message)}}</span>
                </div>
              </div>
              <div :class="['form-group', newDns.errors.WildcardMode.hasError ? 'has-error' : '']">
                <label class="col-sm-3 control-label" for="textInput-modal-markup">{{$t('dns.wildcard')}}</label>
                <div class="col-sm-9">
                  <input type="checkbox" :value="newDns.props.WildcardMode == 'enabled'" v-model="newDns.props.WildcardMode" class="form-control">
                  <span v-if="newDns.errors.WildcardMode.hasError" class="help-block">{{$t('validation.validation_failed')}}: {{$t('validation.'+newDns.errors.WildcardMode.message)}}</span>
                </div>
              </div>
            </div>

            <div class="modal-footer">
              <div v-if="newDns.isLoading" class="spinner spinner-sm form-spinner-loader"></div>
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
            <h4 class="modal-title">{{$t('dns.delete_dns')}} {{currentDns.name}}</h4>
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
export default {
  name: "DNS",
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.exec(
        ["system-authorization/read"],
        null,
        null,
        function(success) {
          success = JSON.parse(success);

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
    $("#newDNSModal").modal("hide");
    $("#deleteDNSModal").modal("hide");
    next();
  },
  mounted() {
    this.getDns();
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
          label: this.$i18n.t("dns.name"),
          field: "name",
          filterable: true
        },
        {
          label: this.$i18n.t("dns.description"),
          field: "props.Description",
          filterable: true
        },
        {
          label: this.$i18n.t("dns.ip_address"),
          field: "props.IpAddress",
          filterable: true
        },
        {
          label: this.$i18n.t("dns.wildcard"),
          field: "props.WildcardMode",
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
      currentDns: {},
      newDns: {
        isLoading: false,
        isEdit: false,
        props: {
          IpAddress: "",
          Description: "",
          WildcardMode: false
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
          Description: {
            hasError: false,
            message: ""
          },
          WildcardMode: {
            hasError: false,
            message: ""
          }
        }
      }
    };
  },
  methods: {
    getDns() {
      var context = this;
      context.exec(
        ["system-hosts/read"],
        null,
        null,
        function(success) {
          success = JSON.parse(success);
          context.view.isLoaded = true;
          for (var h in success.configuration) {
            success.configuration[h].props.WildcardMode =
              success.configuration[h].props.WildcardMode == "enabled";
          }
          context.rows = success.configuration;
        },
        function(error) {
          console.error(error);
        }
      );
    },
    saveDNS(host) {
      var context = this;

      var hostObj = Object.assign({}, host);
      host.props.WildcardMode = host.props.WildcardMode
        ? "enabled"
        : "disabled";
      hostObj.type = "remote";
      hostObj.action = host.isEdit ? "update" : "create";

      // validate input
      context.newDNS.isLoading = true;
      context.newDns.errors.name.hasError = false;
      context.newDns.errors.IpAddress.hasError = false;
      context.newDns.errors.Description.hasError = false;
      context.newDns.errors.WildcardMode.hasError = false;

      context.exec(
        ["system-hosts/validate"],
        hostObj,
        null,
        function(success) {
          context.newDNS.isLoading = false;
          $("#newDNSModal").modal("hide");

          // update values
          if (host.isEdit) {
            context.exec(
              ["system-hosts/update"],
              hostObj,
              function(stream) {
                console.info("hosts", stream);
              },
              function(success) {
                // notification
                context.$parent.notifications.success.message = context.$i18n.t(
                  "dns.host_edit_ok"
                );

                // get hosts
                context.getDns();
              },
              function(error, data) {
                // notification
                context.$parent.notifications.error.message = context.$i18n.t(
                  "dns.host_edit_error"
                );
              }
            );
          } else {
            context.exec(
              ["system-hosts/create"],
              hostObj,
              function(stream) {
                console.info("hosts", stream);
              },
              function(success) {
                // notification
                context.$parent.notifications.success.message = context.$i18n.t(
                  "dns.host_create_ok"
                );

                // get hosts
                context.getDns();
              },
              function(error, data) {
                // notification
                context.$parent.notifications.error.message = context.$i18n.t(
                  "dns.host_create_error"
                );
              }
            );
          }
        },
        function(error, data) {
          var errorData = JSON.parse(data);
          context.newDns.isLoading = false;
          context.newDns.errors.name.hasError = false;
          context.newDns.errors.IpAddress.hasError = false;
          context.newDns.errors.Description.hasError = false;
          context.newDns.errors.WildcardMode.hasError = false;

          for (var e in errorData.attributes) {
            var attr = errorData.attributes[e];
            context.newDns.errors[attr.parameter].hasError = true;
            context.newDns.errors[attr.parameter].message = attr.error;
          }
        }
      );
    },
    newDNS() {
      this.newDns = {
        isLoading: false,
        isEdit: false,
        name: "",
        props: {
          IpAddress: "",
          Description: "",
          WildcardMode: false
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
          Description: {
            hasError: false,
            message: ""
          },
          WildcardMode: {
            hasError: false,
            message: ""
          }
        }
      };
      $("#newDNSModal").modal("show");
    },
    editDNS(host) {
      this.newDns.name = host.name;
      this.newDns.props.IpAddress = host.props.IpAddress;
      this.newDns.props.Description = host.props.Description;
      this.newDns.props.WildcardMode = host.props.WildcardMode;

      this.newDns.isEdit = true;
      this.newDns.errors = {
        name: {
          hasError: false,
          message: ""
        },
        IpAddress: {
          hasError: false,
          message: ""
        },
        Description: {
          hasError: false,
          message: ""
        },
        WildcardMode: {
          hasError: false,
          message: ""
        }
      };
      $("#newDNSModal").modal("show");
    },
    openDeleteDNS(host) {
      this.currentDns = Object.assign({}, host);
      $("#deleteDNSModal").modal("show");
    },
    deleteDNS(host) {
      var context = this;

      $("#deleteDNSModal").modal("hide");
      context.exec(
        ["system-hosts/delete"],
        {
          name: host.name
        },
        function(stream) {
          console.info("hosts", stream);
        },
        function(success) {
          // notification
          context.$parent.notifications.success.message = context.$i18n.t(
            "dns.host_delete_ok"
          );

          // get hosts
          context.getDns();
        },
        function(error, data) {
          // notification
          context.$parent.notifications.error.message = context.$i18n.t(
            "dns.host_delete_error"
          );
        }
      );
    }
  }
};
</script>

<style>
</style>
