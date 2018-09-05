<template>
  <div>
    <h2>{{$t('certificates.title')}}</h2>
    <h3>{{$t('actions')}}</h3>
    <div class="btn-group">
      <button @click="openUploadCertificate()" class="btn btn-primary btn-lg shutdown-privileged" data-action="restart" data-container="body">{{$t('certificates.upload_certificates')}}</button>
      <button data-toggle="dropdown" class="btn btn-primary btn-lg dropdown-toggle shutdown-privileged">
        <span class="caret"></span>
      </button>
      <ul role="menu" class="dropdown-menu">
        <li class="presentation">
          <a @click="openUploadCertificate()" role="menuitem" data-action="restart">{{$t('certificates.upload_certificates')}}</a>
        </li>
        <li class="presentation">
          <a @click="openEditCertificate()" role="menuitem" data-action="shutdown">{{$t('certificates.edit_self_signed')}}</a>
        </li>
        <li class="presentation">
          <a @click="openRequestLetsEncrypt()" role="menuitem" data-action="restart">{{$t('certificates.request_lets_encrypt')}}</a>
        </li>
      </ul>
    </div>
    <h3>{{$t('list')}}</h3>
    <vue-good-table :customRowsPerPageDropdown="[25,50,100]" :perPage="25" :columns="columns" :rows="rows" :lineNumbers="false"
      :defaultSortBy="{field: 'name', type: 'asc'}" :globalSearch="true" :paginate="true" styleClass="table" :nextText="tableLangsTexts.nextText"
      :prevText="tableLangsTexts.prevText" :rowsPerPageText="tableLangsTexts.rowsPerPageText" :globalSearchPlaceholder="tableLangsTexts.globalSearchPlaceholder"
      :ofText="tableLangsTexts.ofText">
      <template slot="table-row" slot-scope="props">
        <td class="fancy">
          <a @-click="showCertificate(props.row.key)">
            <strong>{{ props.row.name}}</strong>
          </a>
        </td>
        <td class="fancy">{{ props.row.issuer}}</td>
        <td class="fancy">
          <span :class="['fa', props.row.expired ? 'fa-clock-o red' : '']"></span>
          <span :class="[props.row.expired ? 'red' : '', 'margin-top-small']">{{props.row.expiration_t * 1000 | dateFormat}}</span>
        </td>
        <td class="fancy">
          <span :class="['fa', props.row.default ? 'fa-check green' : 'fa-times red']"></span>
        </td>
        <td>
          <button @-click="showCertificate(props.row.key)" class="btn btn-default">
            <span class="fa fa-search span-right-margin"></span>
            {{$t('certificates.show')}}
          </button>
          <div class="dropdown pull-right dropdown-kebab-pf">
            <button class="btn btn-link dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
              <span class="fa fa-ellipsis-v"></span>
            </button>
            <ul class="dropdown-menu dropdown-menu-right">
              <li>
                <a @-click="setDefault(props.row.key)">
                  <span class="fa fa-check span-right-margin"></span>
                  {{$t('certificates.set_as_default')}}
                </a>
              </li>
            </ul>
          </div>
        </td>
      </template>
    </vue-good-table>

    <div class="modal" id="uploadCertificateModal" tabindex="-1" role="dialog" data-backdrop="static">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title">{{$t('certificates.upload_certificate')}}</h4>
          </div>
          <form class="form-horizontal" v-on:submit.prevent="uploadCertificate(newCertificate)">

            <div class="modal-body">
              <div v-if="newCertificate.errorMessage" class="alert alert-danger alert-dismissable">
                <span class="pficon pficon-error-circle-o"></span>
                <strong>{{$t('certificates.error')}}.</strong> {{newCertificate.errorMessage}}
              </div>

              <div :class="['form-group', newCertificate.errorProps['key'] ? 'has-error' : '']">
                <label class="col-sm-3 control-label" for="textInput-modal-markup">{{$t('certificates.name')}}</label>
                <div class="col-sm-9">
                  <input required type="text" v-model="newCertificate.key" class="form-control">
                  <span v-if="newCertificate.errorProps['key']" class="help-block">{{newCertificate.errorProps['key']}}</span>
                </div>
              </div>
              <div :class="['form-group', newCertificate.errorProps['certificate'] ? 'has-error' : '']">
                <label class="col-sm-3 control-label" for="textInput-modal-markup">{{$t('certificates.certificate')}}</label>
                <div class="col-sm-9">
                  <label for="file-upload-cert" class="custom-file-upload">
                    <i class="fa fa-cloud-upload span-right-margin"></i>{{$t('certificates.choose_file')}} {{newCertificate.certificate}}
                  </label>
                  <input class="inputfile" required id="certificate-file" name="file-upload-cert" type="file"/>
                  <span v-if="newCertificate.errorProps['certificate']" class="help-block">{{newCertificate.errorProps['certificate']}}</span>
                </div>
              </div>
              <div :class="['form-group', newCertificate.errorProps['privateKey'] ? 'has-error' : '']">
                <label class="col-sm-3 control-label" for="textInput-modal-markup">{{$t('certificates.private_key')}}</label>
                <div class="col-sm-9">
                  <label for="file-upload-key" class="custom-file-upload">
                    <i class="fa fa-cloud-upload span-right-margin"></i> {{$t('certificates.choose_file')}}
                  </label>
                  <input class="inputfile" required id="privateKey-file" name="file-upload-key" type="file"/>
                  <span v-if="newCertificate.errorProps['privateKey']" class="help-block">{{newCertificate.errorProps['privateKey']}}</span>
                </div>
              </div>
              <div :class="['form-group', newCertificate.errorProps['chain'] ? 'has-error' : '']">
                <label class="col-sm-3 control-label" for="textInput-modal-markup">{{$t('certificates.chain_file')}}</label>
                <div class="col-sm-9">
                  <label for="file-upload-chain" class="custom-file-upload">
                    <i class="fa fa-cloud-upload span-right-margin"></i> {{$t('certificates.choose_file')}}
                  </label>
                  <input class="inputfile" id="chain-file" name="file-upload-chain" type="file"/>
                  <span v-if="newCertificate.errorProps['chain']" class="help-block">{{newCertificate.errorProps['chain']}}</span>
                </div>
              </div>
            </div>
            <div class="modal-footer">
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
          <form class="form-horizontal" v-on:submit.prevent="editCertificate(selfSignedCertificate)">

            <div class="modal-body">
              <div class="form-group">
                <label class="col-sm-3 control-label" for="textInput-modal-markup">{{$t('certificates.country_code')}}</label>
                <div class="col-sm-9">
                  <input required type="text" v-model="selfSignedCertificate.CountryCode" class="form-control">
                </div>
              </div>
              <div class="form-group">
                <label class="col-sm-3 control-label" for="textInput-modal-markup">{{$t('certificates.state')}}</label>
                <div class="col-sm-9">
                  <input required type="text" v-model="selfSignedCertificate.State" class="form-control">
                </div>
              </div>
              <div class="form-group">
                <label class="col-sm-3 control-label" for="textInput-modal-markup">{{$t('certificates.locality')}}</label>
                <div class="col-sm-9">
                  <input required type="text" v-model="selfSignedCertificate.Locality" class="form-control">
                </div>
              </div>
              <div class="form-group">
                <label class="col-sm-3 control-label" for="textInput-modal-markup">{{$t('certificates.organization')}}</label>
                <div class="col-sm-9">
                  <input required type="text" v-model="selfSignedCertificate.Organization" class="form-control">
                </div>
              </div>
              <div class="form-group">
                <label class="col-sm-3 control-label" for="textInput-modal-markup">{{$t('certificates.organization_unit')}}</label>
                <div class="col-sm-9">
                  <input required type="text" v-model="selfSignedCertificate.OrganizationalUnitName" class="form-control">
                </div>
              </div>
              <div class="form-group">
                <label class="col-sm-3 control-label" for="textInput-modal-markup">{{$t('certificates.common_name')}}</label>
                <div class="col-sm-9">
                  <input required type="text" v-model="selfSignedCertificate.CommonName" class="form-control">
                </div>
              </div>
              <div class="form-group">
                <label class="col-sm-3 control-label" for="textInput-modal-markup">{{$t('certificates.email_address')}}</label>
                <div class="col-sm-9">
                  <input type="text" v-model="selfSignedCertificate.EmailAddress" class="form-control">
                </div>
              </div>
              <div class="form-group">
                <label class="col-sm-3 control-label" for="textInput-modal-markup">{{$t('certificates.alternatives_name')}}</label>
                <div class="col-sm-9">
                  <textarea type="text" v-model="selfSignedCertificate.SubjectAltNames" class="form-control"></textarea>
                </div>
              </div>
              <div class="form-group">
                <label class="col-sm-3 control-label" for="textInput-modal-markup">{{$t('certificates.certificate_validity_days')}}</label>
                <div class="col-sm-9">
                  <input required type="text" v-model="selfSignedCertificate.CertificateDuration" class="form-control">
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

    <div class="modal" id="requestLetsEncryptModal" tabindex="-1" role="dialog" data-backdrop="static">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title">{{$t('certificates.request_lets_encrypt')}}</h4>
          </div>
          <form class="form-horizontal" v-on:submit.prevent="requestLetsEncrypt(letsEncryptCertificate)">

            <div class="modal-body">
              <div v-if="newCertificate.errorMessage" class="alert alert-danger alert-dismissable">
                <span class="pficon pficon-error-circle-o"></span>
                <strong>{{$t('certificates.error')}}.</strong> {{newCertificate.errorMessage}}
              </div>
              <div class="form-group">
                <label class="col-sm-3 control-label" for="textInput-modal-markup">{{$t('certificates.notification_email')}}</label>
                <div class="col-sm-9">
                  <input required type="email" v-model="letsEncryptCertificate.LetsEncryptMail" class="form-control">
                </div>
              </div>
              <div class="form-group">
                <label class="col-sm-3 control-label" for="textInput-modal-markup">{{$t('certificates.domain')}}</label>
                <div class="col-sm-9">
                  <textarea required v-model="letsEncryptCertificate.LetsEncryptDomains" class="form-control"></textarea>
                </div>
              </div>
              <div v-if="newCertificate.testLetsEncrypt" class="form-group">
                <div class="col-sm-12">
                  <div class="spinner"></div>
                </div>
              </div>
            </div>
            <div class="modal-footer">
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
              <label class="col-sm-3 control-label" for="textInput-modal-markup">{{$t('certificates.certificate')}}</label>
              <div class="col-sm-9">
                <pre class="prettyprint">{{currentCertificate}}</pre>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-default" type="button" data-dismiss="modal">{{$t('cancel')}}</button>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Certificates",
  mounted() {
    this.getCertificates();
  },
  data() {
    return {
      view: {
        isLoaded: false
      },
      tableLangsTexts: this.tableLangs(),
      columns: [
        {
          label: this.$i18n.t("certificates.name"),
          field: "name",
          filterable: true
        },
        {
          label: this.$i18n.t("certificates.issuer"),
          field: "name",
          filterable: true
        },
        {
          label: this.$i18n.t("certificates.expires"),
          field: "name",
          filterable: true
        },
        {
          label: this.$i18n.t("certificates.default"),
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
      rows: [
        {
          id: 1,
          name: "/etc/pki/tls/certs/NSRV.crt",
          issuer: "NethServer, O=Example Org, ST=SomeState, OU=Main",
          expired: true,
          expiration_t: true,
          default: true,
          key: "sdfsdf"
        },
        {
          id: 2,
          name: "/etc/pki/tls/certs/NSRV.crt",
          issuer: "NethServer, O=Example Org, ST=SomeState, OU=Main",
          expired: true,
          expiration_t: true,
          default: true,
          key: "sdfsdf"
        }
      ],
      currentCertificate: {},
      newCertificate: {
        errorProps: {}
      },
      selfSignedCertificate: {},
      letsEncryptCertificate: {}
    };
  },
  methods: {
    getCertificates() {
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

    getLetsEncryptCertificateParameters() {
      /* nethserver.system.certificates.getLetsEncryptCertificateParameters().then(
          function(certificate) {
            $scope.objects.letsEncryptCertificate = certificate;
            $scope.objects.letsEncryptCertificate.LetsEncryptDomains = certificate.LetsEncryptDomains.join(
              "\n"
            );
            $scope.$apply();
          },
          function(err) {
            console.error("couldn't read certificate: " + err);
          }
        ); */
    },

    getSelfSignedCertificateParameters() {
      /* nethserver.system.certificates.getSelfSignedCertificateParameters().then(
          function(certificate) {
            $scope.objects.selfSignedCertificate = certificate;
            $scope.objects.selfSignedCertificate.SubjectAltNames = certificate.SubjectAltNames.join(
              "\n"
            );
            $scope.$apply();
          },
          function(err) {
            console.error("couldn't read certificate: " + err);
          }
        ); */
    },

    cleanErrors() {
      this.newCertificate.errorMessage = null;
      this.newCertificate.errorProps = null;
    },

    openUploadCertificate() {
      this.newCertificate = {};
      $("certificate-file").val("");
      $("privateKey-file").val("");
      $("chain-file").val("");
      $("#uploadCertificateModal").modal("show");
    },
    uploadCertificate(certificate) {
      this.cleanErrors();
      /* nethserver.system.certificates.uploadCertificate(certificate).then(
          function() {
            $("#uploadCertificateModal").modal("hide");
          },
          function(err) {
            console.error(err);
            this.newCertificate.errorMessage = err.message;
            this.newCertificate.errorProps = err.attributes;
            $scope.$apply();
          }
        ); */
    },

    openEditCertificate() {
      $("#editCertificateModal").modal("show");
    },
    editCertificate(certificate) {
      this.cleanErrors();
      certificate.SubjectAltNames = certificate.SubjectAltNames.split(/[,\s]+/);
      /* nethserver.system.certificates
          .generateSelfSignedCertificate(certificate)
          .then(
            function() {
              $("#editCertificateModal").modal("hide");
            },
            function(err) {
              console.error(err);
              this.newCertificate.errorMessage = err.message;
              this.newCertificate.errorProps = err.attributes;
              $scope.$apply();
            }
          ); */
    },

    openRequestLetsEncrypt() {
      $("#requestLetsEncryptModal").modal("show");
    },
    requestLetsEncrypt(certificate) {
      this.cleanErrors();
      this.newCertificate.testLetsEncrypt = true;
      certificate.LetsEncryptDomains = certificate.LetsEncryptDomains.split(
        /[,\s]+/
      );
      /* nethserver.system.certificates
          .requestLetsEncryptCertificate(certificate)
          .then(
            function() {
              $("#requestLetsEncryptModal").modal("hide");
              this.newCertificate.testLetsEncrypt = false;
              $scope.$apply();
            },
            function(err) {
              console.error(err);
              this.newCertificate.testLetsEncrypt = false;
              this.newCertificate.errorMessage = err.message;
              this.newCertificate.errorProps = err.attributes;
              $scope.$apply();
            }
          ); */
    },

    setDefault(certificate) {
      /* nethserver.system.certificates.selectDefaultCertificate(certificate).then(
          function() {},
          function(err) {
            console.error(err);
          }
        ); */
    },

    showCertificate(certificate) {
      /* nethserver.system.certificates.showCertificate(certificate).then(
          function(certificate) {
            $scope.objects.showedCertificate = certificate;
            $scope.$apply();

            $("#showCertificateModal").modal("show");
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
