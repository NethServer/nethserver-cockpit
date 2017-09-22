'use strict';

/**
 * @ngdoc function
 * @name systemAngularApp.controller:CertificatesCtrl
 * @description
 * # CertificatesCtrl
 * Controller of the systemAngularApp
 */
angular.module('systemAngularApp')
  .controller('CertificatesCtrl', function ($scope) {
    // controller objects
    $scope.objects = {
      searchString: '',
      newCertificate: {},
      selfSignedCertificate: {},
      letsEncryptCertificate: {},
      showedCertificate: {}
    };

    $scope.localSystem.certificates = [{
      name: '/etc/pki/tls/certs/NSRV.crt',
      issuer: 'NethServer, O=Example Org, ST=SomeState, OU=Main',
      expires: '2027-07-23',
      default: true,
      certificate: 'Certificate:\n      Data:\n          Version: 3 (0x2)\n          Serial Number: 1500968453 (0x5976f605)\n      Signature Algorithm: sha256WithRSAEncryption'
    }];

    // methods
    $scope.initGraphics = function () {
      var inputs = document.querySelectorAll('.inputfile');
      Array.prototype.forEach.call(inputs, function (input) {
        var label = input.previousElementSibling,
          labelVal = label.innerHTML;

        input.addEventListener('change', function (e) {
          var fileName = '';
          if (this.files && this.files.length > 1)
            fileName = (this.getAttribute('data-multiple-caption') || '').replace('{count}', this.files.length);
          else
            fileName = e.target.value.split('\\').pop();

          if (fileName)
            label.innerHTML = ' <i class="fa fa-key span-right-margin"></i> ' + fileName;
          else
            label.innerHTML = labelVal;
        });
      });
    };

    nethserver.System.certificates.getAll(function (certificates) {
      $scope.localSystem.certificates = certificates;

      // $scope.$apply();
    }, function (err) {
      console.error("couldn't read certificates: " + err);
    });

    $scope.openUploadCertificate = function () {
      $scope.objects.newCertificate = {};
      $('#uploadCertificateModal').modal('show');
    };
    $scope.uploadCertificate = function (certificate) {
      nethserver.System.certificates.uploadCertificate(certificate).then(function () {

      }, function (err) {
        console.error(err);
      });
    };

    $scope.openEditCertificate = function () {
      $scope.objects.selfSignedCertificate = {}; // get self-signed
      $('#editCertificateModal').modal('show');
    };
    $scope.editCertificate = function (certificate) {
      nethserver.System.certificates.editCertificate(certificate).then(function () {

      }, function (err) {
        console.error(err);
      });
    };

    $scope.openRequestLetsEncrypt = function () {
      $('#requestLetsEncryptModal').modal('show');
    };
    $scope.requestLetsEncrypt = function (certificate) {
      nethserver.System.certificates.requestLetsEncrypt(certificate).then(function () {

      }, function (err) {
        console.error(err);
      });
    };

    $scope.setDefault = function () {
      nethserver.System.certificates.setDefault(certificate).then(function () {

      }, function (err) {
        console.error(err);
      });
    };

    $scope.showCertificate = function (certificate) {
      $scope.objects.showedCertificate = certificate;
      $('#showCertificateModal').modal('show');
    };

    $scope.initGraphics();
  });
