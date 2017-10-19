'use strict';

/**
 * @ngdoc function
 * @name systemAngularApp.controller:CertificatesCtrl
 * @description
 * # CertificatesCtrl
 * Controller of the systemAngularApp
 */
angular.module('systemAngularApp')
  .controller('CertificatesCtrl', function ($scope, $filter) {
    // controller objects
    $scope.objects = {
      searchString: '',
      newCertificate: {},
      selfSignedCertificate: {},
      letsEncryptCertificate: {},
      showedCertificate: {}
    };

    $scope.view = {
      isLoaded: false
    };

    $scope.localSystem.certificates = [];

    // methods
    $scope.initGraphics = function () {
      var inputs = document.querySelectorAll('.inputfile');
      Array.prototype.forEach.call(inputs, function (input) {
        var label = input.previousElementSibling,
          labelVal = label.innerHTML;

        input.addEventListener('change', function (e) {
          var fileName = e.target.value.split('\\').pop() || '';
          var file = e.target.files[0];

          if (fileName) {
            label.innerHTML = ' <i class="fa fa-key span-right-margin"></i> ' + fileName;
            labelVal = label.innerHTML;

            var reader = new FileReader();
            reader.onload = function (ev) {
              $scope.objects.newCertificate[e.target.id.split('-')[0]] = atob(ev.target.result.split(',')[1]) || "";
              $scope.$apply();
            };
            reader.readAsDataURL(file);
          } else
            label.innerHTML = labelVal;
        });
      });
    };

    $scope.getAllCertificates = function () {
      nethserver.system.certificates.getAllCertificates().then(function (certificates) {
        $scope.view.isLoaded = true;
        $scope.localSystem.certificates = certificates;

        $scope.$apply();
      }, function (err) {
        console.error("couldn't read certificates: " + err);
      });
    };

    $scope.getLetsEncryptCertificateParameters = function () {
      nethserver.system.certificates.getLetsEncryptCertificateParameters().then(function (certificate) {
        $scope.objects.letsEncryptCertificate = certificate;
        $scope.objects.letsEncryptCertificate.LetsEncryptDomains = certificate.LetsEncryptDomains.join('\n');
        $scope.$apply();
      }, function (err) {
        console.error("couldn't read certificate: " + err);
      });
    };

    $scope.getSelfSignedCertificateParameters = function () {
      nethserver.system.certificates.getSelfSignedCertificateParameters().then(function (certificate) {
        $scope.objects.selfSignedCertificate = certificate;
        $scope.objects.selfSignedCertificate.SubjectAltNames = certificate.SubjectAltNames.join('\n');
        $scope.$apply();
      }, function (err) {
        console.error("couldn't read certificate: " + err);
      });
    };

    $scope.cleanErrors = function () {
      $scope.objects.newCertificate.errorMessage = null;
      $scope.objects.newCertificate.errorProps = null;
    };

    $scope.openUploadCertificate = function () {
      $scope.objects.newCertificate = {};
      $('certificate-file').val("");
      $('privateKey-file').val("");
      $('chain-file').val("");
      $('#uploadCertificateModal').modal('show');
    };
    $scope.uploadCertificate = function (certificate) {
      $scope.cleanErrors();
      nethserver.system.certificates.uploadCertificate(certificate).then(function () {
        $('#uploadCertificateModal').modal('hide');
        $scope.notifications.add({
          type: 'info',
          title: $filter('translate')('Uploaded'),
          message: $filter('translate')('Certificate uploaded with success'),
          status: 'success',
        });
        $scope.$apply();
      }, function (err) {
        console.error(err);
        $scope.objects.newCertificate.errorMessage = err.message;
        $scope.objects.newCertificate.errorProps = err.attributes;
        $scope.$apply();
      });
    };

    $scope.openEditCertificate = function () {
      $('#editCertificateModal').modal('show');
    };
    $scope.editCertificate = function (certificate) {
      $scope.cleanErrors();
      certificate.SubjectAltNames = certificate.SubjectAltNames.split(/[,\s]+/);
      nethserver.system.certificates.generateSelfSignedCertificate(certificate).then(function () {
        $('#editCertificateModal').modal('hide');
        $scope.notifications.add({
          type: 'info',
          title: $filter('translate')('Saved'),
          message: $filter('translate')('Certificate info edited with success'),
          status: 'success',
        });
        $scope.$apply();
      }, function (err) {
        console.error(err);
        $scope.objects.newCertificate.errorMessage = err.message;
        $scope.objects.newCertificate.errorProps = err.attributes;
        $scope.$apply();
      });
    };

    $scope.openRequestLetsEncrypt = function () {
      $('#requestLetsEncryptModal').modal('show');
    };
    $scope.requestLetsEncrypt = function (certificate) {
      $scope.cleanErrors();
      $scope.objects.newCertificate.testLetsEncrypt = true;
      certificate.LetsEncryptDomains = certificate.LetsEncryptDomains.split(/[,\s]+/);
      nethserver.system.certificates.requestLetsEncryptCertificate(certificate).then(function () {
        $('#requestLetsEncryptModal').modal('hide');
        $scope.objects.newCertificate.testLetsEncrypt = false;
        $scope.notifications.add({
          type: 'info',
          title: $filter('translate')('Done'),
          message: $filter('translate')('Let\'s encrypt certificate requested with success'),
          status: 'success',
        });
        $scope.$apply();
      }, function (err) {
        console.error(err);
        $scope.objects.newCertificate.testLetsEncrypt = false;
        $scope.objects.newCertificate.errorMessage = err.message;
        $scope.objects.newCertificate.errorProps = err.attributes;
        $scope.$apply();
      });
    };

    $scope.setDefault = function (certificate) {
      nethserver.system.certificates.selectDefaultCertificate(certificate).then(function () {
        $scope.notifications.add({
          type: 'info',
          title: $filter('translate')('Saved'),
          message: $filter('translate')('Certificate set as default'),
          status: 'success',
        });
        $scope.$apply();
      }, function (err) {
        console.error(err);
        $scope.notifications.add({
          type: 'info',
          title: $filter('translate')('Error'),
          message: $filter('translate')('Certificate not set as default'),
          status: 'danger',
        });
        $scope.$apply();
      });
    };

    $scope.showCertificate = function (certificate) {
      nethserver.system.certificates.showCertificate(certificate).then(function (certificate) {
        $scope.objects.showedCertificate = certificate;
        $scope.$apply();

        $('#showCertificateModal').modal('show');
      }, function (err) {
        console.error(err);
      });
    };

    $scope.initGraphics();
    $scope.getAllCertificates();
    $scope.getSelfSignedCertificateParameters();
    $scope.getLetsEncryptCertificateParameters();

    nethserver.eventMonitor.addEventListener('nsevent.succeeded', function (success) {
      $scope.getAllCertificates();
      $scope.getSelfSignedCertificateParameters();
      $scope.getLetsEncryptCertificateParameters();
    });
  });
