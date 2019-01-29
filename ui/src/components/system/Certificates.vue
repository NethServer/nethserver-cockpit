<template>
  <div v-if="view.isAuth">
    <h2>{{$t('certificates.title')}}</h2>
    <h3>{{$t('actions')}}</h3>
    <div class="btn-group">
      <button
        @click="openUploadCertificate()"
        class="btn btn-primary btn-lg shutdown-privileged"
        data-action="restart"
        data-container="body"
      >{{$t('certificates.upload_certificates')}}</button>
      <button
        data-toggle="dropdown"
        class="btn btn-primary btn-lg dropdown-toggle shutdown-privileged"
      >
        <span class="caret"></span>
      </button>
      <ul role="menu" class="dropdown-menu">
        <li class="presentation">
          <a
            @click="openUploadCertificate()"
            role="menuitem"
            data-action="restart"
          >{{$t('certificates.upload_certificates')}}</a>
        </li>
        <li class="presentation">
          <a
            @click="openEditCertificate()"
            role="menuitem"
            data-action="shutdown"
          >{{$t('certificates.edit_self_signed')}}</a>
        </li>
        <li class="presentation">
          <a
            @click="openRequestLetsEncrypt()"
            role="menuitem"
            data-action="restart"
          >{{$t('certificates.request_lets_encrypt')}}</a>
        </li>
      </ul>
    </div>
    <h3>{{$t('list')}}</h3>
    <div v-if="!view.isLoaded" class="spinner spinner-lg"></div>
    <vue-good-table
      v-if="view.isLoaded"
      :customRowsPerPageDropdown="[25,50,100]"
      :perPage="25"
      :columns="columns"
      :rows="rows"
      :lineNumbers="false"
      :defaultSortBy="{field: 'file', type: 'asc'}"
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
          <a @click="showCertificate(props.row.file)">
            <strong>{{ props.row.file}}</strong>
          </a>
        </td>
        <td class="fancy">{{ props.row.issuer}}</td>
        <td class="fancy">
          <span :class="['fa', props.row.expired ? 'fa-clock-o red' : '']"></span>
          <span :class="[props.row.expired ? 'red' : '', 'margin-top-small']">
            {{props.row.expiration_t * 1000 |
            dateFormat}}
          </span>
        </td>
        <td class="fancy">
          <span :class="['fa', props.row.default ? 'fa-check green' : 'fa-times red']"></span>
        </td>
        <td>
          <button @click="showCertificate(props.row.file)" class="btn btn-default">
            <span class="fa fa-search span-right-margin"></span>
            {{$t('certificates.show')}}
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
                <a @click="setDefault(props.row)">
                  <span class="fa fa-check span-right-margin"></span>
                  {{$t('certificates.set_as_default')}}
                </a>
              </li>
            </ul>
          </div>
        </td>
      </template>
    </vue-good-table>

    <div
      class="modal"
      id="uploadCertificateModal"
      tabindex="-1"
      role="dialog"
      data-backdrop="static"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title">{{$t('certificates.upload_certificate')}}</h4>
          </div>
          <form class="form-horizontal" v-on:submit.prevent="uploadCertificate(newCertificate)">
            <div class="modal-body">
              <div v-if="newCertificate.errorMessage" class="alert alert-danger alert-dismissable">
                <span class="pficon pficon-error-circle-o"></span>
                <strong>{{$t('certificates.error')}}.</strong>
                {{newCertificate.errorMessage}}
              </div>

              <div :class="['form-group', newCertificate.errors.name.hasError ? 'has-error' : '']">
                <label
                  class="col-sm-3 control-label"
                  for="textInput-modal-markup"
                >{{$t('certificates.name')}}</label>
                <div class="col-sm-9">
                  <input required type="text" v-model="newCertificate.name" class="form-control">
                  <span
                    v-if="newCertificate.errors.name.hasError"
                    class="help-block"
                  >{{$t('validation.validation_failed')}}: {{$t('validation.'+newCertificate.errors.name.message)}}</span>
                </div>
              </div>
              <div
                :class="['form-group', newCertificate.errors.certificate.hasError ? 'has-error' : '']"
              >
                <label
                  class="col-sm-3 control-label"
                  for="textInput-modal-markup"
                >{{$t('certificates.certificate')}}</label>
                <div class="col-sm-9">
                  <label for="file-upload-cert" class="custom-file-upload">
                    <i class="fa fa-cloud-upload span-right-margin"></i>
                    {{$t('certificates.choose_file')}}
                  </label>
                  <input
                    class="inputfile"
                    required
                    @change="onChangeInput($event, 'cert')"
                    id="certificate-file"
                    name="file-upload-cert"
                    type="file"
                  >
                  <span
                    v-if="newCertificate.errors.certificate.hasError"
                    class="help-block"
                  >{{$t('validation.validation_failed')}}: {{$t('validation.'+newCertificate.errors.certificate.message)}}</span>
                </div>
              </div>
              <div :class="['form-group', newCertificate.errors.key.hasError ? 'has-error' : '']">
                <label
                  class="col-sm-3 control-label"
                  for="textInput-modal-markup"
                >{{$t('certificates.private_key')}}</label>
                <div class="col-sm-9">
                  <label for="file-upload-key" class="custom-file-upload">
                    <i class="fa fa-cloud-upload span-right-margin"></i>
                    {{$t('certificates.choose_file')}}
                  </label>
                  <input
                    class="inputfile"
                    required
                    @change="onChangeInput($event, 'key')"
                    id="key-file"
                    name="file-upload-key"
                    type="file"
                  >
                  <span
                    v-if="newCertificate.errors.key.hasError"
                    class="help-block"
                  >{{$t('validation.validation_failed')}}: {{$t('validation.'+newCertificate.errors.key.message)}}</span>
                </div>
              </div>
              <div :class="['form-group', newCertificate.errors.chain.hasError ? 'has-error' : '']">
                <label
                  class="col-sm-3 control-label"
                  for="textInput-modal-markup"
                >{{$t('certificates.chain_file')}}</label>
                <div class="col-sm-9">
                  <label for="file-upload-chain" class="custom-file-upload">
                    <i class="fa fa-cloud-upload span-right-margin"></i>
                    {{$t('certificates.choose_file')}}
                  </label>
                  <input
                    class="inputfile"
                    @change="onChangeInput($event, 'chain')"
                    id="chain-file"
                    name="file-upload-chain"
                    type="file"
                  >
                  <span
                    v-if="newCertificate.errors.chain.hasError"
                    class="help-block"
                  >{{$t('validation.validation_failed')}}: {{$t('validation.'+newCertificate.errors.chain.message)}}</span>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <div
                v-if="newCertificate.errors.isLoading"
                class="spinner spinner-sm form-spinner-loader"
              ></div>
              <button class="btn btn-default" type="button" data-dismiss="modal">{{$t('cancel')}}</button>
              <button class="btn btn-primary" type="submit">{{$t('certificates.upload')}}</button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <div class="modal" id="editCertificateModal" tabindex="-1" role="dialog" data-backdrop="static">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title">{{$t('certificates.edit_certificate')}}</h4>
          </div>
          <form
            class="form-horizontal"
            v-on:submit.prevent="editCertificate(selfSignedCertificate)"
          >
            <div class="modal-body">
              <div
                :class="['form-group', selfSignedCertificate.errors.CountryCode.hasError ? 'has-error' : '']"
              >
                <label
                  class="col-sm-3 control-label"
                  for="textInput-modal-markup"
                >{{$t('certificates.country_code')}}</label>
                <div class="col-sm-9">
                  <input
                    required
                    type="text"
                    v-model="selfSignedCertificate.CountryCode"
                    class="form-control"
                  >
                  <span
                    v-if="selfSignedCertificate.errors.CountryCode.hasError"
                    class="help-block"
                  >{{$t('validation.validation_failed')}}: {{$t('validation.'+selfSignedCertificate.errors.CountryCode.message)}}</span>
                </div>
              </div>
              <div
                :class="['form-group', selfSignedCertificate.errors.State.hasError ? 'has-error' : '']"
              >
                <label
                  class="col-sm-3 control-label"
                  for="textInput-modal-markup"
                >{{$t('certificates.state')}}</label>
                <div class="col-sm-9">
                  <input
                    required
                    type="text"
                    v-model="selfSignedCertificate.State"
                    class="form-control"
                  >
                  <span
                    v-if="selfSignedCertificate.errors.State.hasError"
                    class="help-block"
                  >{{$t('validation.validation_failed')}}: {{$t('validation.'+selfSignedCertificate.errors.State.message)}}</span>
                </div>
              </div>
              <div
                :class="['form-group', selfSignedCertificate.errors.Locality.hasError ? 'has-error' : '']"
              >
                <label
                  class="col-sm-3 control-label"
                  for="textInput-modal-markup"
                >{{$t('certificates.locality')}}</label>
                <div class="col-sm-9">
                  <input
                    required
                    type="text"
                    v-model="selfSignedCertificate.Locality"
                    class="form-control"
                  >
                  <span
                    v-if="selfSignedCertificate.errors.Locality.hasError"
                    class="help-block"
                  >{{$t('validation.validation_failed')}}: {{$t('validation.'+selfSignedCertificate.errors.Locality.message)}}</span>
                </div>
              </div>
              <div
                :class="['form-group', selfSignedCertificate.errors.Organization.hasError ? 'has-error' : '']"
              >
                <label
                  class="col-sm-3 control-label"
                  for="textInput-modal-markup"
                >{{$t('certificates.organization')}}</label>
                <div class="col-sm-9">
                  <input
                    required
                    type="text"
                    v-model="selfSignedCertificate.Organization"
                    class="form-control"
                  >
                  <span
                    v-if="selfSignedCertificate.errors.Organization.hasError"
                    class="help-block"
                  >{{$t('validation.validation_failed')}}: {{$t('validation.'+selfSignedCertificate.errors.Organization.message)}}</span>
                </div>
              </div>
              <div
                :class="['form-group', selfSignedCertificate.errors.OrganizationalUnitName.hasError ? 'has-error' : '']"
              >
                <label
                  class="col-sm-3 control-label"
                  for="textInput-modal-markup"
                >{{$t('certificates.organization_unit')}}</label>
                <div class="col-sm-9">
                  <input
                    required
                    type="text"
                    v-model="selfSignedCertificate.OrganizationalUnitName"
                    class="form-control"
                  >
                  <span
                    v-if="selfSignedCertificate.errors.OrganizationalUnitName.hasError"
                    class="help-block"
                  >{{$t('validation.validation_failed')}}: {{$t('validation.'+selfSignedCertificate.errors.OrganizationalUnitName.message)}}</span>
                </div>
              </div>
              <div
                :class="['form-group', selfSignedCertificate.errors.CommonName.hasError ? 'has-error' : '']"
              >
                <label
                  class="col-sm-3 control-label"
                  for="textInput-modal-markup"
                >{{$t('certificates.common_name')}}</label>
                <div class="col-sm-9">
                  <input
                    required
                    type="text"
                    v-model="selfSignedCertificate.CommonName"
                    class="form-control"
                  >
                  <span
                    v-if="selfSignedCertificate.errors.CommonName.hasError"
                    class="help-block"
                  >{{$t('validation.validation_failed')}}: {{$t('validation.'+selfSignedCertificate.errors.CommonName.message)}}</span>
                </div>
              </div>
              <div
                :class="['form-group', selfSignedCertificate.errors.EmailAddress.hasError ? 'has-error' : '']"
              >
                <label
                  class="col-sm-3 control-label"
                  for="textInput-modal-markup"
                >{{$t('certificates.email_address')}}</label>
                <div class="col-sm-9">
                  <input
                    type="text"
                    v-model="selfSignedCertificate.EmailAddress"
                    class="form-control"
                  >
                  <span
                    v-if="selfSignedCertificate.errors.EmailAddress.hasError"
                    class="help-block"
                  >{{$t('validation.validation_failed')}}: {{$t('validation.'+selfSignedCertificate.errors.EmailAddress.message)}}</span>
                </div>
              </div>
              <div
                :class="['form-group', selfSignedCertificate.errors.SubjectAltName.hasError ? 'has-error' : '']"
              >
                <label
                  class="col-sm-3 control-label"
                  for="textInput-modal-markup"
                >{{$t('certificates.alternatives_name')}}</label>
                <div class="col-sm-9">
                  <textarea
                    :placeholder="$t('certificates.alternative_name')"
                    type="text"
                    v-model="selfSignedCertificate.SubjectAltName"
                    class="form-control"
                  ></textarea>
                  <span
                    v-if="selfSignedCertificate.errors.SubjectAltName.hasError"
                    class="help-block"
                  >{{$t('validation.validation_failed')}}: {{$t('validation.'+selfSignedCertificate.errors.SubjectAltName.message)}}</span>
                </div>
              </div>
              <div
                :class="['form-group', selfSignedCertificate.errors.CertificateDuration.hasError ? 'has-error' : '']"
              >
                <label
                  class="col-sm-3 control-label"
                  for="textInput-modal-markup"
                >{{$t('certificates.certificate_validity_days')}}</label>
                <div class="col-sm-9">
                  <input
                    required
                    type="text"
                    v-model="selfSignedCertificate.CertificateDuration"
                    class="form-control"
                  >
                  <span
                    v-if="selfSignedCertificate.errors.CertificateDuration.hasError"
                    class="help-block"
                  >{{$t('validation.validation_failed')}}: {{$t('validation.'+selfSignedCertificate.errors.CertificateDuration.message)}}</span>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <div
                v-if="selfSignedCertificate.errors.isLoading"
                class="spinner spinner-sm form-spinner-loader"
              ></div>
              <button class="btn btn-default" type="button" data-dismiss="modal">{{$t('cancel')}}</button>
              <button class="btn btn-primary" type="submit">{{$t('save')}}</button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <div
      class="modal"
      id="requestLetsEncryptModal"
      tabindex="-1"
      role="dialog"
      data-backdrop="static"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title">{{$t('certificates.request_lets_encrypt')}}</h4>
          </div>
          <form
            class="form-horizontal"
            v-on:submit.prevent="requestLetsEncrypt(letsEncryptCertificate)"
          >
            <div class="modal-body">
              <div
                v-if="letsEncryptCertificate.errorMessage"
                class="alert alert-danger alert-dismissable"
              >
                <span class="pficon pficon-error-circle-o"></span>
                <strong>{{$t('certificates.error')}}.</strong>
                {{letsEncryptCertificate.errorMessage}}
              </div>

              <div
                v-for="(a, i) in letsEncryptCertificate.LetsEncryptDomains"
                v-bind:key="i"
                :class="['form-group', letsEncryptCertificate.errors.LetsEncryptDomains.hasError ? 'has-error' : '']"
              >
                <label class="col-xs-12 col-sm-3 control-label" for="textInput-modal-markup">
                  {{i == 0 ?
                  $t('certificates.domains') : ''}}
                </label>
                <div class="col-xs-7 col-sm-6">
                  <input required type="text" v-model="a.name" class="form-control">
                  <span
                    v-if="letsEncryptCertificate.errors.LetsEncryptDomains.hasError"
                    class="help-block"
                  >{{$t('validation.validation_failed')}}: {{$t('validation.'+letsEncryptCertificate.errors.LetsEncryptDomains.message)}}</span>
                </div>
                <div class="col-xs-5 col-sm-2">
                  <button
                    v-if="i > 0"
                    @click="removeDomain(a, i)"
                    class="btn btn-default"
                    type="button"
                  >
                    <span class="fa fa-minus card-icon-def"></span>
                  </button>
                </div>
              </div>
              <div class="form-group">
                <div class="col-sm-3 control-label"></div>
                <div class="col-sm-9">
                  <button @click="addDomains()" class="btn btn-default" type="button">
                    <span class="fa fa-plus card-icon-def"></span>
                    {{$t('certificates.add_domain')}}
                  </button>
                </div>
              </div>

              <div class="advanced">
                <span>{{$t('advanced')}}</span>
                <div class="divider divider-advanced"></div>
              </div>

              <div class="form-group">
                <label
                  class="col-sm-3 control-label"
                  for="textInput-modal-markup"
                >{{$t('certificates.notification_email')}}</label>
                <div class="col-sm-9">
                  <input
                    type="email"
                    v-model="letsEncryptCertificate.LetsEncryptMail"
                    class="form-control"
                  >
                </div>
              </div>
              <div
                :class="['form-group', letsEncryptCertificate.errors.LetsEncryptRenewDays.hasError ? 'has-error' : '']"
              >
                <label
                  class="col-sm-3 control-label"
                  for="textInput-modal-markup"
                >{{$t('certificates.renew_days')}}</label>
                <div class="col-sm-9">
                  <input
                    type="number"
                    v-model="letsEncryptCertificate.LetsEncryptRenewDays"
                    class="form-control"
                  >
                  <span
                    v-if="letsEncryptCertificate.errors.LetsEncryptRenewDays.hasError"
                    class="help-block"
                  >{{$t('validation.validation_failed')}}: {{$t('validation.'+letsEncryptCertificate.errors.LetsEncryptRenewDays.message)}}</span>
                </div>
              </div>

              <div v-if="letsEncryptCertificate.testLetsEncrypt" class="form-group">
                <div class="col-sm-12">
                  <div class="spinner"></div>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <div
                v-if="letsEncryptCertificate.errors.isLoading"
                class="spinner spinner-sm form-spinner-loader"
              ></div>
              <button class="btn btn-default" type="button" data-dismiss="modal">{{$t('cancel')}}</button>
              <button class="btn btn-primary" type="submit">{{$t('certificates.request')}}</button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <div class="modal" id="showCertificateModal" tabindex="-1" role="dialog" data-backdrop="static">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title">{{$t('certificates.view_certificate')}}</h4>
          </div>

          <div class="modal-body">
            <div class="form-group">
              <div class="col-sm-12">
                <div v-if="!currentCertificate" class="spinner spinner-sm"></div>
                <pre v-if="currentCertificate" class="prettyprint">{{currentCertificate}}</pre>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-default" type="button" data-dismiss="modal">{{$t('close')}}</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Certificates",
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
            vm.$router.replace("/");
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
    this.getCertificates();
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
          label: this.$i18n.t("certificates.file"),
          field: "file",
          filterable: true
        },
        {
          label: this.$i18n.t("certificates.issuer"),
          field: "issuer",
          filterable: true
        },
        {
          label: this.$i18n.t("certificates.expires"),
          field: "expires",
          filterable: true
        },
        {
          label: this.$i18n.t("certificates.default"),
          field: "default",
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
      rows: [],
      currentCertificate: {},
      newCertificate: {
        errors: {
          isLoading: false,
          name: {
            hasError: false,
            message: ""
          },
          certificate: {
            hasError: false,
            message: ""
          },
          key: {
            hasError: false,
            message: ""
          },
          chain: {
            hasError: false,
            message: ""
          }
        },
        certFile: "",
        keyFile: "",
        chainFile: ""
      },
      selfSignedCertificate: {
        errors: {
          isLoading: false,
          CountryCode: {
            hasError: false,
            message: ""
          },
          State: {
            hasError: false,
            message: ""
          },
          Locality: {
            hasError: false,
            message: ""
          },
          Organization: {
            hasError: false,
            message: ""
          },
          OrganizationalUnitName: {
            hasError: false,
            message: ""
          },
          CommonName: {
            hasError: false,
            message: ""
          },
          EmailAddress: {
            hasError: false,
            message: ""
          },
          SubjectAltName: {
            hasError: false,
            message: ""
          },
          CertificateDuration: {
            hasError: false,
            message: ""
          }
        },
        SubjectAltName: "",
        State: "",
        EmailAddress: "",
        Organization: "",
        CertificateDuration: "",
        Locality: "",
        CommonName: "",
        CountryCode: "",
        OrganizationalUnitName: ""
      },
      letsEncryptCertificate: {
        errors: {
          isLoading: false,
          LetsEncryptMail: {
            hasError: false,
            message: ""
          },
          LetsEncryptRenewDays: {
            hasError: false,
            message: ""
          },
          LetsEncryptDomains: {
            hasError: false,
            message: ""
          }
        },
        LetsEncryptDomains: [
          {
            name: "",
            hasError: false,
            message: ""
          }
        ],
        LetsEncryptMail: "",
        LetsEncryptRenewDays: 0
      }
    };
  },
  methods: {
    initGraphics() {
      $("#app").css("background", "");
      $("#app").css("color", "");
    },
    getCertificates() {
      var context = this;
      context.exec(
        ["system-certificate/read"],
        null,
        null,
        function(success) {
          try {
            success = JSON.parse(success);
          } catch (e) {
            console.error(e);
          }
          context.rows = success.configuration.certificates;
          context.view.isLoaded = true;
          context.selfSignedCertificate.SubjectAltName =
            success.configuration.pki.props.SubjectAltName;
          context.selfSignedCertificate.State =
            success.configuration.pki.props.State;
          context.selfSignedCertificate.EmailAddress =
            success.configuration.pki.props.EmailAddress;
          context.selfSignedCertificate.Organization =
            success.configuration.pki.props.Organization;
          context.selfSignedCertificate.CertificateDuration =
            success.configuration.pki.props.CertificateDuration;
          context.selfSignedCertificate.Locality =
            success.configuration.pki.props.Locality;
          context.selfSignedCertificate.CommonName =
            success.configuration.pki.props.CommonName;
          context.selfSignedCertificate.CountryCode =
            success.configuration.pki.props.CountryCode;
          context.selfSignedCertificate.OrganizationalUnitName =
            success.configuration.pki.props.OrganizationalUnitName;

          context.letsEncryptCertificate.LetsEncryptMail =
            success.configuration.pki.props.LetsEncryptMail;
          context.letsEncryptCertificate.LetsEncryptDomains = success.configuration.pki.props.LetsEncryptDomains.split(
            ","
          ).map(function(i) {
            return { name: i };
          });
          context.letsEncryptCertificate.LetsEncryptRenewDays =
            success.configuration.pki.props.LetsEncryptRenewDays;

          context.$forceUpdate();
        },
        function(error) {
          console.error(error);
        }
      );
    },

    openUploadCertificate() {
      this.newCertificate = {
        errors: {
          isLoading: false,
          name: {
            hasError: false,
            message: ""
          },
          certificate: {
            hasError: false,
            message: ""
          },
          key: {
            hasError: false,
            message: ""
          },
          chain: {
            hasError: false,
            message: ""
          }
        },
        certFile: "",
        keyFile: "",
        chainFile: ""
      };
      $("#certificate-file").val("");
      $("#key-file").val("");
      $("#chain-file").val("");
      $("#uploadCertificateModal").modal("show");
    },
    onChangeInput(event, name) {
      var context = this;
      this.getBase64(event.target.files[0], function(resp) {
        context.newCertificate[name + "File"] = resp.split(",")[1];
      });
    },
    uploadCertificate(certificate) {
      var context = this;

      var certObj = {
        action: "upload",
        files: {
          name: certificate.name,
          certificate: certificate.certFile,
          key: certificate.keyFile,
          chain: certificate.chainFile
        }
      };

      context.newCertificate.errors.isLoading = true;
      context.newCertificate.errors.name.hasError = false;
      context.newCertificate.errors.certificate.hasError = false;
      context.newCertificate.errors.key.hasError = false;
      context.newCertificate.errors.chain.hasError = false;

      context.exec(
        ["system-certificate/validate"],
        certObj,
        null,
        function(success) {
          context.newCertificate.errors.isLoading = false;
          $("#uploadCertificateModal").modal("hide");

          // upload certificate
          context.exec(
            ["system-certificate/update"],
            certObj,
            function(stream) {
              console.info("certificates", stream);
            },
            function(success) {
              // notification
              context.$parent.notifications.success.message = context.$i18n.t(
                "dashboard.cert_upload_ok"
              );

              // get certificates
              context.getCertificates();
            },
            function(error, data) {
              // notification
              context.$parent.notifications.error.message = context.$i18n.t(
                "dashboard.cert_upload_error"
              );
            }
          );
        },
        function(error, data) {
          var errorData = {};
          context.newCertificate.errors.isLoading = false;
          context.newCertificate.errors.name.hasError = false;
          context.newCertificate.errors.certificate.hasError = false;
          context.newCertificate.errors.key.hasError = false;
          context.newCertificate.errors.chain.hasError = false;

          try {
            errorData = JSON.parse(data);
            for (var e in errorData.attributes) {
              var attr = errorData.attributes[e];
              context.newCertificate.errors[attr.parameter].hasError = true;
              context.newCertificate.errors[attr.parameter].message =
                attr.error;
            }
          } catch (e) {
            console.error(e);
          }
        }
      );
    },

    openEditCertificate() {
      $("#editCertificateModal").modal("show");
    },
    editCertificate(certificate) {
      var context = this;

      var certObj = {
        props: {
          SubjectAltName: context.selfSignedCertificate.SubjectAltName,
          State: context.selfSignedCertificate.State,
          EmailAddress: context.selfSignedCertificate.EmailAddress,
          Organization: context.selfSignedCertificate.Organization,
          CertificateDuration:
            context.selfSignedCertificate.CertificateDuration,
          Locality: context.selfSignedCertificate.Locality,
          CommonName: context.selfSignedCertificate.CommonName,
          CountryCode: context.selfSignedCertificate.CountryCode,
          OrganizationalUnitName:
            context.selfSignedCertificate.OrganizationalUnitName
        },
        action: "self-signed"
      };

      context.selfSignedCertificate.errors.isLoading = true;
      context.selfSignedCertificate.errors.CountryCode.hasError = false;
      context.selfSignedCertificate.errors.State.hasError = false;
      context.selfSignedCertificate.errors.Locality.hasError = false;
      context.selfSignedCertificate.errors.Organization.hasError = false;
      context.selfSignedCertificate.errors.OrganizationalUnitName.hasError = false;
      context.selfSignedCertificate.errors.CommonName.hasError = false;
      context.selfSignedCertificate.errors.EmailAddress.hasError = false;
      context.selfSignedCertificate.errors.SubjectAltName.hasError = false;
      context.selfSignedCertificate.errors.CertificateDuration.hasError = false;

      context.exec(
        ["system-certificate/validate"],
        certObj,
        null,
        function(success) {
          context.selfSignedCertificate.errors.isLoading = false;
          $("#editCertificateModal").modal("hide");

          // upload certificate
          context.exec(
            ["system-certificate/update"],
            certObj,
            function(stream) {
              console.info("certificates", stream);
            },
            function(success) {
              // notification
              context.$parent.notifications.success.message = context.$i18n.t(
                "certificates.cert_self_ok"
              );

              // get certificates
              context.getCertificates();

              context.$forceUpdate();
            },
            function(error, data) {
              // notification
              context.$parent.notifications.error.message = context.$i18n.t(
                "certificates.cert_self_error"
              );
            }
          );
        },
        function(error, data) {
          var errorData = {};
          context.selfSignedCertificate.errors.isLoading = false;
          context.selfSignedCertificate.errors.CountryCode.hasError = false;
          context.selfSignedCertificate.errors.State.hasError = false;
          context.selfSignedCertificate.errors.Locality.hasError = false;
          context.selfSignedCertificate.errors.Organization.hasError = false;
          context.selfSignedCertificate.errors.OrganizationalUnitName.hasError = false;
          context.selfSignedCertificate.errors.CommonName.hasError = false;
          context.selfSignedCertificate.errors.EmailAddress.hasError = false;
          context.selfSignedCertificate.errors.SubjectAltName.hasError = false;
          context.selfSignedCertificate.errors.CertificateDuration.hasError = false;

          try {
            errorData = JSON.parse(data);
            for (var e in errorData.attributes) {
              var attr = errorData.attributes[e];
              context.selfSignedCertificate.errors[
                attr.parameter
              ].hasError = true;
              context.selfSignedCertificate.errors[attr.parameter].message =
                attr.error;
            }
          } catch (e) {
            console.error(e);
          }
        }
      );
    },

    openRequestLetsEncrypt() {
      this.letsEncryptCertificate.errors.LetsEncryptMail.hasError = false;
      this.letsEncryptCertificate.errors.LetsEncryptRenewDays.hasError = false;
      this.letsEncryptCertificate.errors.LetsEncryptDomains.hasError = false;
      $("#requestLetsEncryptModal").modal("show");
    },
    requestLetsEncrypt(certificate) {
      var context = this;

      var domainsPlain = [];
      for (var d in certificate.LetsEncryptDomains) {
        var domain = certificate.LetsEncryptDomains[d];
        domainsPlain.push(domain.name);
      }

      var encrytObj = {
        props: {
          LetsEncryptMail: certificate.LetsEncryptMail,
          LetsEncryptDomains: domainsPlain.join(","),
          LetsEncryptRenewDays: certificate.LetsEncryptRenewDays
        },
        action: "lets-encrypt"
      };

      context.letsEncryptCertificate.errors.isLoading = true;
      context.letsEncryptCertificate.errors.LetsEncryptMail.hasError = false;
      context.letsEncryptCertificate.errors.LetsEncryptRenewDays.hasError = false;
      context.letsEncryptCertificate.errors.LetsEncryptDomains.hasError = false;

      context.exec(
        ["system-certificate/validate"],
        encrytObj,
        null,
        function(success) {
          context.letsEncryptCertificate.errors.isLoading = false;
          $("#requestLetsEncryptModal").modal("hide");

          for (var a in context.letsEncryptCertificate.LetsEncryptDomains) {
            context.letsEncryptCertificate.LetsEncryptDomains[
              a
            ].hasError = false;
          }

          // upload certificate
          context.exec(
            ["system-certificate/update"],
            encrytObj,
            function(stream) {
              console.info("certificates", stream);
            },
            function(success) {
              // notification
              context.$parent.notifications.success.message = context.$i18n.t(
                "dashboard.cert_encrypt_ok"
              );

              // get certificates
              context.getCertificates();
            },
            function(error, data) {
              // notification
              context.$parent.notifications.error.message = context.$i18n.t(
                "dashboard.cert_encrypt_error"
              );
            }
          );
        },
        function(error, data) {
          var errorData = {};
          context.letsEncryptCertificate.errors.isLoading = false;
          context.letsEncryptCertificate.errors.LetsEncryptMail.hasError = false;
          context.letsEncryptCertificate.errors.LetsEncryptRenewDays.hasError = false;
          context.letsEncryptCertificate.errors.LetsEncryptDomains.hasError = false;

          try {
            errorData = JSON.parse(data);
            for (var a in errorData.attributes) {
              var attr = errorData.attributes[a];
              var i = 0;

              context.letsEncryptCertificate.errors[
                attr.parameter
              ].hasError = true;
              context.letsEncryptCertificate.errors[attr.parameter].message =
                attr.error;
            }
          } catch (e) {
            console.error(e);
          }
        }
      );
    },
    addDomains(alias) {
      this.letsEncryptCertificate.LetsEncryptDomains.push({
        name: "",
        hasError: false,
        message: ""
      });
    },
    removeDomain(alias, index) {
      this.letsEncryptCertificate.LetsEncryptDomains.splice(index, 1);
    },

    setDefault(certificate) {
      var context = this;

      context.exec(
        ["system-certificate/update"],
        {
          props: {
            KeyFile: certificate.key,
            CrtFile: certificate.file,
            ChainFile: certificate.chain
          },
          action: "set-default"
        },
        function(stream) {
          console.info("certificates", stream);
        },
        function(success) {
          // notification
          context.$parent.notifications.success.message = context.$i18n.t(
            "certificates.cert_default_ok"
          );

          // get certificates
          context.getCertificates();
        },
        function(error) {
          console.error(error);

          // notification
          context.$parent.notifications.success.message = context.$i18n.t(
            "certificates.cert_default_error"
          );
        }
      );
    },

    showCertificate(certificate) {
      var context = this;

      context.currentCertificate = null;
      $("#showCertificateModal").modal("show");

      context.exec(
        ["system-certificate/read"],
        {
          name: certificate
        },
        null,
        function(success) {
          try {
            success = JSON.parse(success);
          } catch (e) {
            console.error(e);
          }
          context.currentCertificate = atob(success.certificate);
        },
        function(error) {
          console.error(error);
        }
      );
    }
  }
};
</script>

<style>
</style>