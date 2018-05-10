/* global angular */
angular.module('AppComponentsModule', [
  'InProgressComponentsModule',
  'MyActionComponentsModule',
  'SubmittedComponentsModule',
  'ArchiveComponentsModule',
  'Form520ComponentsModule',
  'Form521ComponentsModule',
  'Form348ComponentsModule',
  'FormWAGComponentsModule'
]);/* global angular */
angular.module('ArchiveComponentsModule', [
  'ArchiveControllerModule',
  'ArchiveServiceModule'
]);angular.module('ArchiveControllerModule', []).controller('ArchiveController', [
  '$scope',
  'MenuMainModel',
  'ArchiveService',
  'PageHeaderModel',
  function ($scope, MenuMainModel, ArchiveService, PageHeaderModel) {
    MenuMainModel.setCurrentMenuItemId(3);
    ArchiveService.query(function (data) {
      PageHeaderModel.setTitle('My Archived Forms');
      PageHeaderModel.setParagraphs([gGetWelcomeMessage()]);
      $.each(data, function (i, item) {
        var ele = [
            item.id,
            item.postId,
            item.name,
            item.email,
            gCutText(item.body, 80),
            '<a href="javascript:void(0)" onclick="gMyArchiveTableAction(this)"  data-func="detail" data-table="myArchiveTable" data-id="' + item.id + '">DETAIL</a> | ' + '<a href="javascript:void(0)" onclick="gMyArchiveTableAction(this)"  data-func="pdf" data-table="myArchiveTable" data-id="' + item.id + '">PDF</a>'
          ];
        $('<tr>').html('<td>' + ele.join('</td><td>') + '</td> ').appendTo('#myArchiveTable');
      });
      $('#myArchiveTable').DataTable(gFormTableOption);
      $scope.showTable = true;
    });
  }
]);
function gMyArchiveTableAction(ele) {
  console.log($(ele).attr('data-func') + ':' + $(ele).attr('data-table') + ':' + $(ele).attr('data-id'));
}angular.module('ArchiveServiceModule', ['ngResource']).factory('ArchiveService', [
  '$resource',
  function ($resource) {
    return $resource('https://jsonplaceholder.typicode.com/comments', {}, {
      query: {
        method: 'GET',
        isArray: true
      }
    });
  }
]);/* global angular */
angular.module('Form348ComponentsModule', [
  'Form348ControllerModule',
  'Form348ServiceModule'
]);angular.module('Form348ControllerModule', ['angularFileUpload']).controller('Form348Controller', [
  '$scope',
  '$routeParams',
  'FileUploader',
  'MenuMainModel',
  'Form348Service',
  'PageHeaderModel',
  function ($scope, $routeParams, FileUploader, MenuMainModel, Form348Service, PageHeaderModel) {
    var uploader = $scope.uploader = new FileUploader({ url: 'upload.php' });
    // FILTERS
    uploader.filters.push({
      name: 'customFilter',
      fn: function (item, options) {
        return this.queue.length < 10;
      }
    });
    MenuMainModel.setCurrentMenuItemId(4);
    PageHeaderModel.setTitle('REQUEST ACCEPT TRAVEL FOR PAYMENT FROM A NON FEDERAL SOURCE');
    PageHeaderModel.setParagraphs([gGetWelcomeMessage()]);
    $scope.formId = $routeParams.id;
    $scope.formStatus = $routeParams.status;
    if ($scope.formId == 0) {
      Form348Service.initForm($scope);
    } else {
      Form348Service.getForm4User($scope, $scope.formId, $scope.formStatus);
    }
    $scope.doSave = function ($event) {
      $event.stopPropagation();
      Form348Service.putData(1).then(function (data) {
        console.log(JSON.stringify(data, null, '  '));
      });
      Form348Service.sampleSerice(1).then(function (data) {
        console.log(JSON.stringify(data, null, '  '));
      });
    };
    $scope.doCertify = function ($event) {
      $event.stopPropagation();
      $scope.formStatus = 1;
    };
    $scope.doRevoke = function ($event) {
      $event.stopPropagation();
      $scope.formStatus = 0;
    };
    $scope.doSupervisorCertify = function ($event) {
      $event.stopPropagation();
      $scope.formStatus = 3;
    };
    $scope.doSupervisorRevoke = function ($event) {
      $event.stopPropagation();
      $scope.formStatus = 2;
    };
    $scope.doReviewerRevoke = function ($event) {
      $event.stopPropagation();
      $scope.formStatus = 4;
    };
    $scope.doReviewerCertify = function ($event) {
      $event.stopPropagation();
      $scope.formStatus = 5;
    };
    $scope.doEthicsRevoke = function ($event) {
      $event.stopPropagation();
      $scope.formStatus = 6;
    };
    $scope.doDesigneeCertify = function ($event) {
      $event.stopPropagation();
      $scope.formStatus = 9;
    };
    $scope.doDesigneeRevoke = function ($event) {
      $event.stopPropagation();
      $scope.formStatus = 8;
    };
    $scope.doEthicsCertify = function ($event) {
      $event.stopPropagation();
      $scope.formStatus = 7;
    };
    $scope.doPDF = function ($event) {
      console.log('doPDF');
      $event.stopPropagation();
      gFetchPDF(gLibPath + '/348.pdf', function (pdffile) {
        gFillPDF($scope.formVars, 'myHHS348', pdffile);
      });
    };
    $scope.doUploadAttaches = function ($event) {
      $.each(uploader.queue, function (idx) {
        $scope.filesAttached.push(uploader.queue[idx].file);
      });
      uploader.clearQueue();
    };
  }
]);angular.module('Form348ServiceModule', []).factory('Form348Service', [
  '$http',
  '$q',
  '$filter',
  function ($http, $q, $filter) {
    return {
      putData: function (id) {
        var promise = null;
        console.log('I\'m here');
        promise = $http({
          method: 'PUT',
          url: 'https://jsonplaceholder.typicode.com/posts/' + id
        }).success(function (response) {
          console.log(response);
          return response;
        }).error(function (data, status, headers, config) {
          console.log('[Form348Service], putData() error, with status: ' + status);
        });
        return promise;
      },
      sampleSerice: function (id) {
        var defered = $q.defer();
        gSampleService(id, defered);
        return defered.promise;
      },
      initForm: function ($scope) {
        $scope.filesAttached = [];
        $scope.formVars = angular.copy(gForm348);
        $scope.formVars._Datefiled = $filter('date')(new Date(), 'MM/dd/yyyy');
      },
      getForm4User: function ($scope, formId, formStatue) {
        $scope.filesAttached = [];
        $scope.formVars = angular.copy(gForm348);
        $scope.formVars._Datefiled = $filter('date')(new Date(), 'MM/dd/yyyy');
        $scope.formVars.signature = '';
        $scope.formVars._Date = '';
      }
    };
  }
]);
var gForm348 = {
    signature: '',
    designeesignature: '',
    _reqdate: '',
    _payscale: '',
    _nameadd: '',
    _OPDIV: '',
    _purpose: '',
    _travel: '',
    _subsistence: '',
    _USC31: '',
    _USC42: '',
    _USC5: '',
    _InKind: '',
    _inkindA: '',
    _Cash: '',
    _cashamount: '',
    _DirReimb: '',
    _reimburse: '',
    _appno: '',
    _travelvalue: '',
    _lodgingvalue: '',
    _mealsvalue: '',
    _othervalue: '',
    _roundtrip: '',
    _oneway: '',
    _partamount: '',
    _recommendation: '',
    _authname: '',
    _authtitle: '',
    _authorizationdate: '',
    _qualification: '',
    _travesigdate: '',
    _traveler: '',
    _yescheck1: '',
    _nocheck1: '',
    _letterattach: '',
    _noletterattach: '',
    _yescheck3: '',
    _nocheck3: '',
    _yescheck4: '',
    _nocheck4: '',
    _yescheck5: '',
    _nocheck5: '',
    _yescheck6: '',
    _nocheck6: '',
    _ordernumb: '',
    _meetgoals: '',
    _HHSfunds: '',
    _recofftitle: '',
    _daterecommend: '',
    _qualaccept: '',
    _startdate1: '',
    _enddate1: '',
    _from1: '',
    _desto1: '',
    _startdate2: '',
    _enddate2: '',
    _from2: '',
    _desto2: '',
    _startdate3: '',
    _enddate3: '',
    _from3: '',
    _desto3: ''
  };/* global angular */
angular.module('Form520ComponentsModule', [
  'Form520ControllerModule',
  'Form520ServiceModule'
]);angular.module('Form520ControllerModule', ['angularFileUpload']).controller('Form520Controller', [
  '$scope',
  '$routeParams',
  'FileUploader',
  'MenuMainModel',
  'Form520Service',
  'PageHeaderModel',
  function ($scope, $routeParams, FileUploader, MenuMainModel, Form520Service, PageHeaderModel) {
    var uploader = $scope.uploader = new FileUploader({ url: 'upload.php' });
    // FILTERS
    uploader.filters.push({
      name: 'customFilter',
      fn: function (item, options) {
        return this.queue.length < 10;
      }
    });
    MenuMainModel.setCurrentMenuItemId(4);
    PageHeaderModel.setTitle('REQUEST FOR APPROVAL OF OUTSIDE ACTIVITY');
    PageHeaderModel.setParagraphs([gGetWelcomeMessage()]);
    $scope.formId = $routeParams.id;
    $scope.formStatus = $routeParams.status;
    if ($scope.formId == 0) {
      Form520Service.initForm($scope);
    } else {
      Form520Service.getForm4User($scope, $scope.formId, $scope.formStatus);
    }
    $scope.doSave = function ($event) {
      $event.stopPropagation();
      Form520Service.putData(1).then(function (data) {
        console.log(JSON.stringify(data, null, '  '));
      });
      Form520Service.sampleSerice(1).then(function (data) {
        console.log(JSON.stringify(data, null, '  '));
      });
    };
    $scope.doCertify = function ($event) {
      $event.stopPropagation();
      $scope.formStatus = 1;
    };
    $scope.doRevoke = function ($event) {
      $event.stopPropagation();
      $scope.formStatus = 0;
    };
    $scope.doSupervisorCertify = function ($event) {
      $event.stopPropagation();
      $scope.formStatus = 3;
    };
    $scope.doSupervisorRevoke = function ($event) {
      $event.stopPropagation();
      $scope.formStatus = 2;
    };
    $scope.doReviewerRevoke = function ($event) {
      $event.stopPropagation();
      $scope.formStatus = 4;
    };
    $scope.doReviewerCertify = function ($event) {
      $event.stopPropagation();
      $scope.formStatus = 5;
    };
    $scope.doEthicsRevoke = function ($event) {
      $event.stopPropagation();
      $scope.formStatus = 6;
    };
    $scope.doDesigneeCertify = function ($event) {
      $event.stopPropagation();
      $scope.formStatus = 9;
    };
    $scope.doDesigneeRevoke = function ($event) {
      $event.stopPropagation();
      $scope.formStatus = 8;
    };
    $scope.doEthicsCertify = function ($event) {
      $event.stopPropagation();
      $scope.formStatus = 7;
    };
    $scope.doPDF = function ($event) {
      console.log('doPDF');
      $event.stopPropagation();
      gFetchPDF(gLibPath + '/520.pdf', function (pdffile) {
        gFillPDF($scope.formVars, 'myHHS520', pdffile);
      });
    };
    $scope.doUploadAttaches = function ($event) {
      $.each(uploader.queue, function (idx) {
        $scope.filesAttached.push(uploader.queue[idx].file);
      });
      uploader.clearQueue();
    };
  }
]);angular.module('Form520ServiceModule', []).factory('Form520Service', [
  '$http',
  '$q',
  '$filter',
  function ($http, $q, $filter) {
    return {
      putData: function (id) {
        var promise = null;
        console.log('I\'m here');
        promise = $http({
          method: 'PUT',
          url: 'https://jsonplaceholder.typicode.com/posts/' + id
        }).success(function (response) {
          console.log(response);
          return response;
        }).error(function (data, status, headers, config) {
          console.log('[Form520Service], putData() error, with status: ' + status);
        });
        return promise;
      },
      sampleSerice: function (id) {
        var defered = $q.defer();
        gSampleService(id, defered);
        return defered.promise;
      },
      initForm: function ($scope) {
        $scope.filesAttached = [];
        $scope.formVars = angular.copy(gForm520);
        $scope.formVars._Datefiled = $filter('date')(new Date(), 'MM/dd/yyyy');
      },
      getForm4User: function ($scope, formId, formStatue) {
        $scope.filesAttached = [];
        $scope.formVars = angular.copy(gForm520);
        $scope.formVars._Datefiled = $filter('date')(new Date(), 'MM/dd/yyyy');
        $scope.formVars.signature = '';
        $scope.formVars._Date = '';
      }
    };
  }
]);
var gForm520 = {
    signature: '',
    supersadditionreason: '',
    supervisorsignature: '',
    reviewersignature: '',
    designeesignature: '',
    _initialreq: '',
    _revreq: '',
    _renewal: '',
    _Datefiled: '',
    _empname: '',
    _agency: '',
    _subcomp: '',
    _titleofpos: '',
    _grade: '',
    _federal: '',
    _pas: '',
    _noncar: '',
    _car: '',
    _schc: '',
    _comm: '',
    _gs: '',
    _title: '',
    _other: '',
    _othertext: '',
    _public: '',
    _confid: '',
    _none: '',
    _street: '',
    _city: '',
    _offstate: '',
    _ZipCode: '',
    _OfficeTelephoneNumber: '',
    _OfficeFaxNumber: '',
    _OfficeCellNumber: '',
    _email: '',
    _namesuper: '',
    _titleofsuper: '',
    _superTelephoneNumber: '',
    _SuperFaxNumber: '',
    _SuperCellNumber: '',
    _superemail: '',
    _Agencyuse: '',
    _empnamevvvvv1: '',
    _professional: '',
    _teaching: '',
    _board: '',
    _expert: '',
    _othervvvvv1: '',
    _describe: '',
    _selfemployed: '',
    _self__employed: '',
    _subjectmatter: '',
    _text: '',
    _explain: '',
    _outsideentity: '',
    _contactperson: '',
    _titlevvvvv1: '',
    _outsidestreet: '',
    _cityvvvvv1: '',
    _state: '',
    _ZipCodevvvvv1: '',
    _empnamevvvvv2: '',
    _ContactTelephoneNumber: '',
    _contacFaxNumber: '',
    _ContactCellNumber: '',
    _Email: '',
    _location: '',
    _travelyes: '',
    _atownexp: '',
    _inkind: '',
    _estamt: '',
    _travelno: '',
    _describevvvvv1: '',
    _periodcoveredfrom: '',
    _periodcoveredto: '',
    _hours: '',
    _days: '',
    _weeks: '',
    _yesoutside: '',
    _nooutside: '',
    _estimatenumber: '',
    _yescomp: '',
    _nocomp: '',
    _fee: '',
    _honor: '',
    _retainer: '',
    _salary: '',
    _advance: '',
    _royalty: '',
    _stock: '',
    _stockopt: '',
    _nontravel: '',
    _othervvvvv2: '',
    _otherspecify: '',
    _nontravelspec: '',
    _empnamevvvvv3: '',
    _compamt: '',
    _Payor: '',
    _fundyes: '',
    _fundno: '',
    _fundsource: '',
    _grantyes: '',
    _grantno: '',
    _granteecontractyes: '',
    _empnamevvvvv4: '',
    _additionalspace: '',
    _empnamevvvvv5: '',
    _position: '',
    _nature: '',
    _relation: '',
    _effect: '',
    _assignments: '',
    _Date: '',
    _empnamevvvvv6: '',
    _superstatement: '',
    _approve: '',
    _disapprove: '',
    _Datevvvvv1: '',
    _empnamevvvvv7: '',
    _namereviewer: '',
    _titlereviewer: '',
    _ReviewerTelephoneNumber: '',
    _ReviewerFaxNumber: '',
    _ReviewerCellNumber: '',
    _revieweremail: '',
    _organization: '',
    _committee: '',
    _concur: '',
    _nonconcur: '',
    _Datevvvvv2: '',
    _comments: '',
    _empnamevvvvv8: '',
    _nameagencyethics: '',
    _titleagencyethics: '',
    _AgencyEthicsTelephoneNumber: '',
    _AgencyEthicsFaxNumber: '',
    _AgencyEthicsCellNumber: '',
    _AgencyEthicsemail: '',
    _organizationvvvvv1: '',
    _requestapproved: '',
    _conditions: '',
    _requestdenied: '',
    _othervvvvv3: '',
    _Datevvvvv3: '',
    _commentsvvvvv1: '',
    _empnamevvvvv9: '',
    _nameagencydesignee: '',
    _titleagencydesignee: '',
    _DesigneeTelephone: '',
    _DesigneeFax: '',
    _DesigneeCell: '',
    _DesigneeEmail: '',
    _organizationvvvvv2: '',
    _approved: '',
    _conditionsvvvvv1: '',
    _denied: '',
    _Datevvvvv4: '',
    _specialconditions: '',
    _commentsvvvvv2: '',
    _empnamevvvvv10: '',
    _empnamevvvvv11: '',
    _empnamevvvvv12: '',
    _empnamevvvvv13: '',
    _empnamevvvvv14: '',
    _addspace: '',
    _empnamevvvvv15: '',
    _addspacecont: '',
    _sourcecurrenta: '',
    _activitycurrent: '',
    _currentamt: '',
    _currentdate: '',
    _sourcecurrentb: '',
    _activitycurrentb: '',
    _currentamtb: '',
    _currentdateb: '',
    _sourceonea: '',
    _activitytwoa: '',
    _amtonea: '',
    _Dateonea: '',
    _sourceoneb: '',
    _activityoneb: '',
    _amtoneb: '',
    _Dateoneb: '',
    _sourcetwoa: '',
    _activitytwoavvvvv1: '',
    _amttwoa: '',
    _Datetwoa: '',
    _sourcetwob: '',
    _activitytwob: '',
    _amttwob: '',
    _Datetwob: '',
    _sourcethreea: '',
    _activitythreea: '',
    _amtthreea: '',
    _Datethreea: '',
    _sourcethreeb: '',
    _activitythreeb: '',
    _amtthreeb: '',
    _Datethreeb: '',
    _sourcefoura: '',
    _activityfoua: '',
    _amtfoura: '',
    _Datefoura: '',
    _sourcefourb: '',
    _activityfourb: '',
    _amtfourb: '',
    _Datefourb: '',
    _sourcefivea: '',
    _activityfivea: '',
    _amtfivea: '',
    _Datefivea: '',
    _sourcefiveb: '',
    _activityfiveb: '',
    _amtfiveb: '',
    _Datefiveb: '',
    _sourcesixa: '',
    _activitysixa: '',
    _amtsixa: '',
    _Datesixa: '',
    _sourcesixb: '',
    _activitysixb: '',
    _amtsixb: '',
    _Datesixb: '',
    _attachone: '',
    _attachtwo: '',
    _attachfour: '',
    _attachthree: '',
    _attachfive: '',
    _attachsix: '',
    _attachseven: '',
    _attacheight: '',
    _attachnine: '',
    _attachten: ''
  };/* global angular */
angular.module('Form521ComponentsModule', [
  'Form521ControllerModule',
  'Form521ServiceModule'
]);angular.module('Form521ControllerModule', ['angularFileUpload']).controller('Form521Controller', [
  '$scope',
  '$routeParams',
  'FileUploader',
  'MenuMainModel',
  'Form521Service',
  'PageHeaderModel',
  function ($scope, $routeParams, FileUploader, MenuMainModel, Form521Service, PageHeaderModel) {
    var uploader = $scope.uploader = new FileUploader({ url: 'upload.php' });
    // FILTERS
    uploader.filters.push({
      name: 'customFilter',
      fn: function (item, options) {
        return this.queue.length < 10;
      }
    });
    MenuMainModel.setCurrentMenuItemId(4);
    PageHeaderModel.setTitle('ANNUAL REPORT OF OUTSIDE ACTIVITY  (DUE ANNUALLY ON FEBRUARY 28)');
    PageHeaderModel.setParagraphs([gGetWelcomeMessage()]);
    $scope.formId = $routeParams.id;
    $scope.formStatus = $routeParams.status;
    if ($scope.formId == 0) {
      Form521Service.initForm($scope);
    } else {
      Form521Service.getForm4User($scope, $scope.formId, $scope.formStatus);
    }
    $scope.doSave = function ($event) {
      $event.stopPropagation();
      Form521Service.putData(1).then(function (data) {
        console.log(JSON.stringify(data, null, '  '));
      });
      Form521Service.sampleSerice(1).then(function (data) {
        console.log(JSON.stringify(data, null, '  '));
      });
    };
    $scope.doCertify = function ($event) {
      $event.stopPropagation();
      $scope.formStatus = 1;
    };
    $scope.doRevoke = function ($event) {
      $event.stopPropagation();
      $scope.formStatus = 0;
    };
    $scope.doSupervisorCertify = function ($event) {
      $event.stopPropagation();
      $scope.formStatus = 3;
    };
    $scope.doSupervisorRevoke = function ($event) {
      $event.stopPropagation();
      $scope.formStatus = 2;
    };
    $scope.doReviewerRevoke = function ($event) {
      $event.stopPropagation();
      $scope.formStatus = 4;
    };
    $scope.doReviewerCertify = function ($event) {
      $event.stopPropagation();
      $scope.formStatus = 5;
    };
    $scope.doEthicsRevoke = function ($event) {
      $event.stopPropagation();
      $scope.formStatus = 6;
    };
    $scope.doDesigneeCertify = function ($event) {
      $event.stopPropagation();
      $scope.formStatus = 9;
    };
    $scope.doDesigneeRevoke = function ($event) {
      $event.stopPropagation();
      $scope.formStatus = 8;
    };
    $scope.doEthicsCertify = function ($event) {
      $event.stopPropagation();
      $scope.formStatus = 7;
    };
    $scope.doPDF = function ($event) {
      console.log('doPDF');
      $event.stopPropagation();
      gFetchPDF(gLibPath + '/521.pdf', function (pdffile) {
        gFillPDF($scope.formVars, 'myHHS521', pdffile);
      });
    };
    $scope.doUploadAttaches = function ($event) {
      $.each(uploader.queue, function (idx) {
        $scope.filesAttached.push(uploader.queue[idx].file);
      });
      uploader.clearQueue();
    };
  }
]);angular.module('Form521ServiceModule', []).factory('Form521Service', [
  '$http',
  '$q',
  '$filter',
  function ($http, $q, $filter) {
    return {
      putData: function (id) {
        var promise = null;
        console.log('I\'m here');
        promise = $http({
          method: 'PUT',
          url: 'https://jsonplaceholder.typicode.com/posts/' + id
        }).success(function (response) {
          console.log(response);
          return response;
        }).error(function (data, status, headers, config) {
          console.log('[Form521Service], putData() error, with status: ' + status);
        });
        return promise;
      },
      sampleSerice: function (id) {
        var defered = $q.defer();
        gSampleService(id, defered);
        return defered.promise;
      },
      initForm: function ($scope) {
        $scope.filesAttached = [];
        $scope.formVars = angular.copy(gForm521);
      },
      getForm4User: function ($scope, formId, formStatue) {
        $scope.filesAttached = [];
        $scope.formVars = angular.copy(gForm521);
        $scope.formVars.signature = '';
        $scope.formVars._Date = '';
      }
    };
  }
]);
var gForm521 = {
    signature: '',
    supersadditionreason: '',
    supervisorsignature: '',
    reviewersignature: '',
    designeesignature: '',
    _FirstDigit: '',
    _SecondDigit: '',
    _Dateextension: '',
    _Datereportfiled: '',
    _employeesname: '',
    _agency: '',
    _Subcomponent: '',
    _titleofposition: '',
    _gradestep: '',
    _fedsalary: '',
    _pas: '',
    _non: '',
    _career: '',
    _schedule: '',
    _commissioned: '',
    _gs: '',
    _title: '',
    _other: '',
    _public: '',
    _confidential: '',
    _none: '',
    _street: '',
    _city: '',
    _state: '',
    _ZipCode: '',
    _TelephoneNumber: '',
    _FaxTelephoneNumber: '',
    _CellTelephoneNumber: '',
    _email: '',
    _immediatesuper: '',
    _titlesupervisor: '',
    _TelephoneNumber2: '',
    _FaxTelephoneNumber2: '',
    _CellTelephoneNumber2: '',
    _email2: '',
    _agencyuseonly: '',
    _employeesnamevvvvv1: '',
    _employeesnamevvvvv2: '',
    _Datelast1: '',
    _employeesnamevvvvv3: '',
    _Datesiglast: '',
    _comments3: '',
    _employeesnamevvvvv4: '',
    _NameofReviewer: '',
    _TitleofReviewer: '',
    _TelephoneNumber3: '',
    _FaxTelephoneNumber2vvvvv1: '',
    _CellTelephoneNumber2vvvvv1: '',
    _email2vvvvv1: '',
    _Organization: '',
    _committee1: '',
    _Concur: '',
    _Nonconcur: '',
    _Dateofsig: '',
    _comments7: '',
    _employeesnamevvvvv5: '',
    _Nameofagencyethics: '',
    _Titleofagencyethics: '',
    _TelephoneNumber30: '',
    _FaxTelephoneNumber20: '',
    _CellTelephoneNumber20: '',
    _email20: '',
    _Organization6: '',
    _Concur2: '',
    _Nonconcur2: '',
    _Dateethicssig: '',
    _comments6page: '',
    _employeesnamevvvvv6: '',
    _employeesnamevvvvv7: '',
    _employeesnamevvvvv8: '',
    _employeesnamevvvvv9: '',
    _addcomments: '',
    _personororg1: '',
    _DateApproval1: '',
    _activityperformed1: '',
    _personororg2: '',
    _DateApproval2: '',
    _activityperformed2: '',
    _personororg3: '',
    _DateApproval3: '',
    _activityperformed3: '',
    _personororg4: '',
    _DateApproval4: '',
    _activityperformed4: '',
    _personororg5: '',
    _DateApproval5: '',
    _activityperformed5: '',
    _servicedates1: '',
    _hoursspent1: '',
    _leaveused1: '',
    _EndingDate1: '',
    _servicedates2: '',
    _hoursspent2: '',
    _leaveused2: '',
    _EndingDate2: '',
    _servicedates3: '',
    _hoursspent3: '',
    _leaveused3: '',
    _EndingDate3: '',
    _servicedates4: '',
    _hoursspent4: '',
    _leaveused4: '',
    _EndingDate4: '',
    _servicedates5: '',
    _hoursspent5: '',
    _leaveused5: '',
    _EndingDate5: '',
    _incomereimbursement1: '',
    _date__spaid1: '',
    _incomereimbursement2: '',
    _date__spaid2: '',
    _incomereimbursement3: '',
    _date__spaid3: '',
    _incomereimbursement4: '',
    _date__spaid4: '',
    _incomereimbursement5: '',
    _date__spaid5: '',
    _incomereimbursement12: '',
    _date__spaid12: '',
    _incomereimbursement22: '',
    _date__spaid22: '',
    _incomereimbursement32: '',
    _date__spaid32: '',
    _incomereimbursement42: '',
    _date__spaid42: '',
    _incomereimbursement52: '',
    _date__spaid52: '',
    _explanation1: '',
    _explanation2: '',
    _Explanation3: '',
    _Explanation4: '',
    _Explanation5: '',
    _noaction: '',
    _correctiveaction: '',
    _outsideactivity1: '',
    _outsideactivity2: '',
    _outsideactivity3: '',
    _outsideactivity4: '',
    _outsideactivity5: '',
    _BeginningDate1: '',
    _yes1: '',
    _no1: '',
    _BeginningDate2: '',
    _yes2: '',
    _no2: '',
    _BeginningDate3: '',
    _yes3: '',
    _no3: '',
    _BeginningDate4: '',
    _yes4: '',
    _no4: '',
    _BeginningDate5: '',
    _yes5: '',
    _no5: '',
    _payA: '',
    _amountpaid1: '',
    _payB: '',
    _amountpaid2: '',
    _payC: '',
    _amountpaid3: '',
    _payD: '',
    _amountpaid4: '',
    _payE: '',
    _amountpaid5: '',
    _nopayA: '',
    _amountpaid12: '',
    _nopayB: '',
    _amountpaid22: '',
    _nopayC: '',
    _amountpaid32: '',
    _nopayD: '',
    _amountpaid42: '',
    _nopayE: '',
    _amountpaid52: '',
    _yes5a: '',
    _no5a: '',
    _yes5ab: '',
    _no5ab: '',
    _yes5abc: '',
    _no5abc: '',
    _yes5abcd: '',
    _no5abcd: '',
    _yes5abcde: '',
    _no5abcde: ''
  };/* global angular */
angular.module('FormWAGComponentsModule', [
  'FormWAGControllerModule',
  'FormWAGServiceModule'
]);angular.module('FormWAGControllerModule', ['angularFileUpload']).controller('FormWAGController', [
  '$scope',
  '$routeParams',
  'FileUploader',
  'MenuMainModel',
  'FormWAGService',
  'PageHeaderModel',
  function ($scope, $routeParams, FileUploader, MenuMainModel, FormWAGService, PageHeaderModel) {
    var uploader = $scope.uploader = new FileUploader({ url: 'upload.php' });
    // FILTERS
    uploader.filters.push({
      name: 'customFilter',
      fn: function (item, options) {
        return this.queue.length < 10;
      }
    });
    MenuMainModel.setCurrentMenuItemId(4);
    PageHeaderModel.setTitle('Request to Accept the Widely Attended Gathering (WAG) Exception');
    PageHeaderModel.setParagraphs([gGetWelcomeMessage()]);
    $scope.formId = $routeParams.id;
    $scope.formStatus = $routeParams.status;
    if ($scope.formId == 0) {
      FormWAGService.initForm($scope);
    } else {
      FormWAGService.getForm4User($scope, $scope.formId, $scope.formStatus);
    }
    $scope.doSave = function ($event) {
      $event.stopPropagation();
      FormWAGService.putData(1).then(function (data) {
        console.log(JSON.stringify(data, null, '  '));
      });
      FormWAGService.sampleSerice(1).then(function (data) {
        console.log(JSON.stringify(data, null, '  '));
      });
    };
    $scope.doCertify = function ($event) {
      $event.stopPropagation();
      $scope.formStatus = 1;
    };
    $scope.doRevoke = function ($event) {
      $event.stopPropagation();
      $scope.formStatus = 0;
    };
    $scope.doSupervisorCertify = function ($event) {
      $event.stopPropagation();
      $scope.formStatus = 3;
    };
    $scope.doSupervisorRevoke = function ($event) {
      $event.stopPropagation();
      $scope.formStatus = 2;
    };
    $scope.doReviewerRevoke = function ($event) {
      $event.stopPropagation();
      $scope.formStatus = 4;
    };
    $scope.doReviewerCertify = function ($event) {
      $event.stopPropagation();
      $scope.formStatus = 5;
    };
    $scope.doEthicsRevoke = function ($event) {
      $event.stopPropagation();
      $scope.formStatus = 6;
    };
    $scope.doDesigneeCertify = function ($event) {
      $event.stopPropagation();
      $scope.formStatus = 9;
    };
    $scope.doDesigneeRevoke = function ($event) {
      $event.stopPropagation();
      $scope.formStatus = 8;
    };
    $scope.doEthicsCertify = function ($event) {
      $event.stopPropagation();
      $scope.formStatus = 7;
    };
    $scope.doPDF = function ($event) {
      console.log('doPDF');
      $event.stopPropagation();
      gFetchPDF(gLibPath + '/wag.pdf', function (pdffile) {
        gFillPDF($scope.formVars, 'myHHSWAG', pdffile);
      });
    };
    $scope.doUploadAttaches = function ($event) {
      $.each(uploader.queue, function (idx) {
        $scope.filesAttached.push(uploader.queue[idx].file);
      });
      uploader.clearQueue();
    };
  }
]);angular.module('FormWAGServiceModule', []).factory('FormWAGService', [
  '$http',
  '$q',
  '$filter',
  function ($http, $q, $filter) {
    return {
      putData: function (id) {
        var promise = null;
        console.log('I\'m here');
        promise = $http({
          method: 'PUT',
          url: 'https://jsonplaceholder.typicode.com/posts/' + id
        }).success(function (response) {
          console.log(response);
          return response;
        }).error(function (data, status, headers, config) {
          console.log('[FormWAGService], putData() error, with status: ' + status);
        });
        return promise;
      },
      sampleSerice: function (id) {
        var defered = $q.defer();
        gSampleService(id, defered);
        return defered.promise;
      },
      initForm: function ($scope) {
        $scope.filesAttached = [];
        $scope.formVars = angular.copy(gFormWAG);
        $scope.formVars._Datefiled = $filter('date')(new Date(), 'MM/dd/yyyy');
      },
      getForm4User: function ($scope, formId, formStatue) {
        $scope.filesAttached = [];
        $scope.formVars = angular.copy(gFormWAG);
        $scope.formVars._Datefiled = $filter('date')(new Date(), 'MM/dd/yyyy');
        $scope.formVars.signature = '';
        $scope.formVars._Date = '';
      }
    };
  }
]);
var gFormWAG = {
    _represent: '',
    _etc: '',
    _CenterOffice1: '',
    _CenterOffice2: '',
    _CenterOffice3: '',
    _CenterOffice4: '',
    _CenterOffice5: '',
    _CenterOffice6: '',
    _EmployeesName7: '',
    _CenterOffice7: '',
    _CenterOffice8: '',
    _EmployeesName9: '',
    _CenterOffice9: '',
    _CenterOffice10: '',
    _CenterOffice11: '',
    _CenterOffice12: '',
    _CenterOffice13: '',
    _CenterOffice14: '',
    _CenterOffice15: '',
    _SupervisorsSignature15: '',
    _PointContact: '',
    _RequestDate: '',
    _TelephoneNumber: '',
    _CSCountry: '',
    _Fullname: '',
    _LocationEvent: '',
    _DateEvent: '',
    _TimeEvent: '',
    _NameConf: '',
    _CheckBox1: '',
    _CheckBox2: '',
    _CheckBox3: '',
    _CheckBox5: '',
    _CheckBox6: '',
    _WhoElse: '',
    _IfYes: '',
    _HowMany: '',
    _Ifyes2: '',
    _CheckBox7: '',
    _CheckBox8: '',
    _CheckBox9: '',
    _CheckBox10: '',
    _CheckBox11: '',
    _CheckBox12: '',
    _CheckBox13: '',
    _CheckBox14: '',
    _CheckBox15: '',
    _CheckBox16: '',
    _CheckBox17: '',
    _CheckBox18: '',
    _WhatValue: '',
    _organizationinfo: '',
    _Youroficial: '',
    _ifyesthen: '',
    _attachments: '',
    _EmployeesName1: '',
    _EmployeesSignature1: '',
    _SupervisorsName1: '',
    _SupervisorsSignature1: '',
    _EmployeesName2: '',
    _SupervisorsName2: '',
    _EmployeesName3: '',
    _SupervisorsSignature2: '',
    _EmployeesSignature3: '',
    _SupervisorsName3: '',
    _SupervisorsSignature3: '',
    _EmployeesName4: '',
    _EmployeesSignature4: '',
    _SupervisorsName4: '',
    _SupervisorsSignature4: '',
    _EmployeesName5: '',
    _EmployeesSignature5: '',
    _SupervisorsName5: '',
    _SupervisorsSignature5: '',
    _EmployeesName6: '',
    _Telephone1: '',
    _Telephone2: '',
    _EmployeesSignature2: '',
    _Telephone3: '',
    _Telephone4: '',
    _Telephone5: '',
    _Telephone6: '',
    _EmployeesSignature6: '',
    _SupervisorsName6: '',
    _SupervisorsSignature6: '',
    _Telephone7: '',
    _EmployeesSignature7: '',
    _SupervisorsName7: '',
    _SupervisorsSignature7: '',
    _EmployeesName8: '',
    _Telephone8: '',
    _EmployeesSignature8: '',
    _SupervisorsName8: '',
    _SupervisorsSignature8: '',
    _Telephone9: '',
    _EmployeesSignature9: '',
    _SupervisorsName9: '',
    _SupervisorsSignature9: '',
    _EmployeesName10: '',
    _Telephone10: '',
    _EmployeesSignature10: '',
    _SupervisorsName10: '',
    _SupervisorsSignature10: '',
    _EmployeesName11: '',
    _Telephone11: '',
    _EmployeesSignature11: '',
    _SupervisorsName11: '',
    _SupervisorsSignature11: '',
    _EmployeesName12: '',
    _Telephone12: '',
    _EmployeesSignature12: '',
    _SupervisorsName12: '',
    _SupervisorsSignature12: '',
    _EmployeesName13: '',
    _Telephone13: '',
    _EmployeesSignature13: '',
    _SupervisorsName13: '',
    _SupervisorsSignature13: '',
    _EmployeesName14: '',
    _Telephone14: '',
    _EmployeesSignature14: '',
    _SupervisorsName14: '',
    _SupervisorsSignature14: '',
    _EmployeesName15: '',
    _Telephone15: '',
    _EmployeesSignature15: '',
    _SupervisorsName15: '',
    _EthicsSig: '',
    _EthicsDate: '',
    _DeputySig: '',
    _DeputyDate: '',
    _CheckBox4: '',
    _CheckBox24: '',
    _CheckBox25: '',
    _CheckBox26: '',
    _CheckBox27: '',
    _CheckBox28: '',
    _CheckBox29: ''
  };/* global angular */
angular.module('InProgressComponentsModule', [
  'InProgressControllerModule',
  'InProgressServiceModule'
]);angular.module('InProgressControllerModule', []).controller('HomeController', [
  '$scope',
  'InProgressService',
  'PageHeaderModel',
  'MenuMainModel',
  function ($scope, InProgressService, PageHeaderModel, MenuMainModel) {
    MenuMainModel.setCurrentMenuItemId(0);
    $scope.showTable = false;
    InProgressService.query(function (data) {
      PageHeaderModel.setTitle('My In-progress Forms');
      PageHeaderModel.setParagraphs([gGetWelcomeMessage()]);
      $.each(data, function (i, item) {
        var ele = [
            item.id,
            item.name,
            item.username,
            item.email,
            '<a href="javascript:void(0)" onclick="gMyInProgessTableAction(this)"  data-func="edit" data-table="myInProgessTable" data-id="' + item.id + '">EDIT</a> | ' + '<a href="javascript:void(0)" onclick="gMyInProgessTableAction(this)"  data-func="preview" data-table="myInProgessTable" data-id="' + item.id + '">PREVIEW</a> | ' + '<a href="javascript:void(0)" onclick="gMyInProgessTableAction(this)"  data-func="delete" data-table="myInProgessTable" data-id="' + item.id + '">DELETE</a>'
          ];
        $('<tr>').html('<td>' + ele.join('</td><td>') + '</td> ').appendTo('#myInProgessTable');
      });
      $('#myInProgessTable').DataTable(gFormTableOption);
      $scope.showTable = true;
    });
  }
]);
function gMyInProgessTableAction(ele) {
  console.log($(ele).attr('data-func') + ':' + $(ele).attr('data-table') + ':' + $(ele).attr('data-id'));
}angular.module('InProgressServiceModule', ['ngResource']).factory('InProgressService', [
  '$resource',
  function ($resource) {
    return $resource('https://jsonplaceholder.typicode.com/users', {}, {
      query: {
        method: 'GET',
        isArray: true
      }
    });
  }
]);/* global angular */
angular.module('MyActionComponentsModule', [
  'MyActionControllerModule',
  'MyActionServiceModule'
]);angular.module('MyActionControllerModule', []).controller('MyActionController', [
  '$scope',
  'MenuMainModel',
  'MyActionService',
  'PageHeaderModel',
  function ($scope, MenuMainModel, MyActionService, PageHeaderModel) {
    MenuMainModel.setCurrentMenuItemId(1);
    MyActionService.query(function (data) {
      PageHeaderModel.setTitle('Forms Require My Action');
      PageHeaderModel.setParagraphs([gGetWelcomeMessage()]);
      $.each(data, function (i, item) {
        var ele = [
            item.id,
            item.userId,
            item.title,
            item.body,
            '<a href="javascript:void(0)" onclick="gMyActionTableAction(this)"  data-func="approval" data-table="myActionTable" data-id="' + item.id + '">APPROVE</a> | ' + '<a href="javascript:void(0)" onclick="gMyActionTableAction(this)"  data-func="reject" data-table="myActionTable" data-id="' + item.id + '">REJECT</a>'
          ];
        $('<tr>').html('<td>' + ele.join('</td><td>') + '</td> ').appendTo('#myActionTable');
      });
      $('#myActionTable').DataTable(gFormTableOption);
      $scope.showTable = true;  //data.length > 0;
    });
  }
]);
function gMyActionTableAction(ele) {
  console.log($(ele).attr('data-func') + ':' + $(ele).attr('data-table') + ':' + $(ele).attr('data-id'));
}angular.module('MyActionServiceModule', ['ngResource']).factory('MyActionService', [
  '$resource',
  function ($resource) {
    return $resource('https://jsonplaceholder.typicode.com/posts', {}, {
      query: {
        method: 'GET',
        isArray: true
      }
    });
  }
]);/* global angular */
angular.module('SubmittedComponentsModule', [
  'SubmittedControllerModule',
  'SubmittedServiceModule'
]);angular.module('SubmittedControllerModule', []).controller('SubmittedController', [
  '$scope',
  'MenuMainModel',
  'SubmittedService',
  'PageHeaderModel',
  function ($scope, MenuMainModel, SubmittedService, PageHeaderModel) {
    MenuMainModel.setCurrentMenuItemId(2);
    SubmittedService.query(function (data) {
      PageHeaderModel.setTitle('My Submitted Forms');
      PageHeaderModel.setParagraphs([gGetWelcomeMessage()]);
      $.each(data, function (i, item) {
        var ele = [
            item.id,
            item.name,
            item.username,
            item.email,
            '<a href="javascript:void(0)" onclick="gMySubmittedTableAction(this)"  data-func="detail" data-table="mySubmittedTable" data-id="' + item.id + '">DETAIL</a> | ' + '<a href="javascript:void(0)" onclick="gMySubmittedTableAction(this)"  data-func="retract" data-table="mySubmittedTable" data-id="' + item.id + '">RETRACT</a>'
          ];
        $('<tr>').html('<td>' + ele.join('</td><td>') + '</td> ').appendTo('#mySubmittedTable');
      });
      $('#mySubmittedTable').DataTable(gFormTableOption);
      $scope.showTable = true;
    });
  }
]);
function gMySubmittedTableAction(ele) {
  console.log($(ele).attr('data-func') + ':' + $(ele).attr('data-table') + ':' + $(ele).attr('data-id'));
}angular.module('SubmittedServiceModule', ['ngResource']).factory('SubmittedService', [
  '$resource',
  function ($resource) {
    return $resource('https://jsonplaceholder.typicode.com/users', {}, {
      query: {
        method: 'GET',
        isArray: true
      }
    });
  }
]);/* global angular */
angular.module('AppDirectivesModule', [
  'PageDirectivesModule',
  'MenuDirectivesModule',
  'FormDirectivesModule'
]);/* global angular */
angular.module('FormDirectivesModule', [
  'LabelDirectiveModule',
  'LineDirectiveModule'
]);angular.module('LabelDirectiveModule', []).directive('myFormLabel', function factory() {
  return {
    restrict: 'E',
    replace: true,
    scope: true,
    template: '<div class="row"><label style="font-weight:120">{{title}}</label></div>',
    link: function (scope, element, attrs) {
      jQuery.each(attrs, function (kn, tv) {
        scope[kn] = tv;
      });
    }
  };
});angular.module('LineDirectiveModule', []).directive('myLine', function factory() {
  return {
    restrict: 'E',
    replace: true,
    scope: true,
    template: '<div class="row"><div class="col-md-12" style="height:20px"/>',
    link: function (scope, element, attrs) {
      jQuery.each(attrs, function (kn, tv) {
        scope[kn] = tv;
      });
    }
  };
});/* global angular */
angular.module('MenuDirectivesModule', [
  'MenuMainDirectiveModule',
  'MenuMainControllerModule',
  'MenuMainModelModule'
]);/* global angular */
/**
 * @ngdoc object
 * @name MenuMainController
 * @requires $scope
 * @requires MenuMainModel
 * @description
 *
 * Set the value of the model on the controller.
 *
 */
angular.module('MenuMainControllerModule', []).controller('MenuMainController', [
  '$scope',
  'MenuMainModel',
  function ($scope, MenuMainModel) {
    $scope.menuMainModel = MenuMainModel;
  }
]);/* global angular */
/**
 * @ngdoc directive
 * @name prMenuMain
 * @description
 *
 * Define the prMenuMain directive - set the value of `templateUrl` accordingly
 *
 */
angular.module('MenuMainDirectiveModule', []).directive('prMenuMain', function factory() {
  return {
    restrict: 'E',
    scope: true,
    templateUrl: 'js/app/directives/menu/menu-main-view.html',
    link: function () {
    }
  };
});/* global angular */
/**
 * @ngdoc object
 * @name MenuMainModel
 * @function
 * @description
 *
 * This is the model for the main menu.
 *
 * @note Because the code structure is tightly linked to the menu structure,
 * the menu items are defined here, rather than retrieving them from a service.
 *
 */
angular.module('MenuMainModelModule', []).factory('MenuMainModel', function () {
  var _currentMenuItemId = 0, _menuItems = [
      {
        'id': 0,
        'text': 'In-progress',
        'url': '#/in-progress'
      },
      {
        'id': 1,
        'text': 'Require My Action',
        'url': '#/my-action'
      },
      {
        'id': 2,
        'text': 'Submitted for Approval',
        'url': '#/submitted'
      },
      {
        'id': 3,
        'text': 'Completed Forms',
        'url': '#/archive'
      },
      {
        'id': 4,
        'text': '',
        'url': '#/new-form'
      }
    ];
  return {
    getCurrentMenuItemId: function () {
      return _currentMenuItemId;
    },
    setCurrentMenuItemId: function (newCurrentMenuItemId) {
      _currentMenuItemId = newCurrentMenuItemId;
    },
    getMenuItems: function () {
      return _menuItems;
    }
  };
});/* global angular */
angular.module('PageDirectivesModule', [
  'PageHeaderDirectiveModule',
  'PageHeaderControllerModule',
  'PageHeaderModelModule',
  'PageFooterDirectiveModule',
  'PageFooterControllerModule',
  'PageFooterModelModule'
]);/* global angular */
/**
 * @ngdoc object
 * @name PageFooterController
 * @requires $scope
 * @requires PageFooterModel
 * @description
 *
 * Set the value of the model on the controller.
 *
 */
angular.module('PageFooterControllerModule', []).controller('PageFooterController', [
  '$scope',
  'PageFooterModel',
  function ($scope, PageFooterModel) {
    $scope.pageFooterModel = PageFooterModel;
  }
]);/* global angular */
/**
 * @ngdoc directive
 * @name prPageFooter
 * @description
 *
 * Define the prPageFooter directive - set the value of `templateUrl` accordingly
 *
 */
angular.module('PageFooterDirectiveModule', []).directive('prPageFooter', function factory() {
  return {
    restrict: 'E',
    scope: true,
    templateUrl: 'js/app/directives/page/page-footer-view.html',
    link: function () {
    }
  };
});/* global angular */
/**
 * @ngdoc object
 * @name PageFooterModel
 * @function
 * @description
 *
 * This is the model for the page footer.
 *
 * @note This is not currently used.
 *
 */
angular.module('PageFooterModelModule', []).factory('PageFooterModel', function () {
  var PageFooterModel = {};
  // TODO: complete
  return PageFooterModel;
});/* global angular */
/**
 * @ngdoc object
 * @name PageHeaderController
 * @requires $scope
 * @requires PageHeaderModel
 * @description
 *
 * Set the value of the model on the controller.
 *
 */
angular.module('PageHeaderControllerModule', []).controller('PageHeaderController', [
  '$scope',
  'PageHeaderModel',
  function ($scope, PageHeaderModel) {
    $scope.pageHeaderModel = PageHeaderModel;
  }
]);/* global angular */
/**
 * @ngdoc directive
 * @name prPageHeader
 * @description
 *
 * Define the prPageHeader directive - set the value of `templateUrl` accordingly
 *
 */
angular.module('PageHeaderDirectiveModule', []).directive('prPageHeader', function factory() {
  return {
    restrict: 'E',
    scope: true,
    templateUrl: 'js/app/directives/page/page-header-view.html',
    link: function () {
    }
  };
});/* global angular */
/**
 * @ngdoc object
 * @name PageHeaderModel
 * @function
 * @description
 *
 * This is the model for the page header.
 *
 */
angular.module('PageHeaderModelModule', []).factory('PageHeaderModel', function () {
  var _title = '', _paragraphs = [];
  return {
    setTitle: function (newTitle) {
      _title = newTitle;
    },
    getTitle: function () {
      return _title;
    },
    setParagraphs: function (newParagraphs) {
      _paragraphs = newParagraphs;
    },
    getParagraphs: function () {
      return _paragraphs;
    }
  };
});/* global angular */
angular.module('AppLibrariesModule', [
  'ngAnimate',
  'ngRoute',
  'ngSanitize',
  'ui.bootstrap'
]);var gLibPath = 'js/lib/forms';
var gFormTableOption = {
    'paging': false,
    'ordering': false,
    'language': {
      'search': 'Quick Filter:',
      'searchPlaceholder': 'search for ...',
      'emptyTable': 'No such forms found in the database.',
      'info': 'Total _TOTAL_ forms',
      'infoEmpty': '',
      'infoFiltered': '(filtered from _MAX_ records)'
    }
  };
angular.module('MainApp', [
  'AppComponentsModule',
  'AppDirectivesModule',
  'AppLibrariesModule'
]).config([
  '$routeProvider',
  function ($routeProvider) {
    $routeProvider.when('/in-progress', {
      templateUrl: 'js/app/components/in-progress/main-view.html?',
      controller: 'HomeController'
    }).when('/my-action', {
      templateUrl: 'js/app/components/my-action/main-view.html',
      controller: 'MyActionController'
    }).when('/submitted', {
      templateUrl: 'js/app/components/submitted/main-view.html',
      controller: 'SubmittedController'
    }).when('/archive', {
      templateUrl: 'js/app/components/archive/main-view.html',
      controller: 'ArchiveController'
    }).when('/form520/:id/:status', {
      templateUrl: 'js/app/components/form520/form520-view.html',
      controller: 'Form520Controller'
    }).when('/form521/:id/:status', {
      templateUrl: 'js/app/components/form521/form521-view.html',
      controller: 'Form521Controller'
    }).when('/form348/:id/:status', {
      templateUrl: 'js/app/components/form348/form348-view.html',
      controller: 'Form348Controller'
    }).when('/formwag/:id/:status', {
      templateUrl: 'js/app/components/formwag/formwag-view.html',
      controller: 'FormWAGController'
    }).otherwise({ redirectTo: '/in-progress' });
  }
]);
function gCutText(oText, toLen) {
  if (oText.length > toLen && toLen > 4) {
    return oText.substring(0, toLen - 3) + '...';
  }
  return oText;
}
function gRoute2(url) {
  var loc = document.location.href;
  var i = loc.indexOf('#');
  if (i > 0) {
    loc = loc.substring(0, i);
  }
  document.location = loc + '#' + url;
}
function gShowCreateNewFormDialog(btx) {
  $('#newFormDialog').dialog({
    modal: true,
    title: 'Select a Form',
    resizable: false,
    buttons: [
      {
        text: 'Cancel',
        click: function () {
          $(this).dialog('close');
        }
      },
      {
        text: btx,
        click: function () {
          gRoute2($('#newFormSelection').val() + '/0/0');
          $(this).dialog('close');
        }
      }
    ],
    width: '450'
  });
}
function gGetUserName() {
  return 'jason.cai@hhs.gov';
}
function gGetWelcomeMessage() {
  return 'Welcome - ' + gGetUserName();
}
function gFetchPDF(url, onload) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.responseType = 'arraybuffer';
  xhr.onload = function () {
    if (this.status == 200) {
      onload(this.response);
    } else {
      console.log('Failed to load URL (code: ' + this.status + ')');
    }
  };
  xhr.send();
}
function gFillPDF(fmObj, pdfName, buf) {
  var fields = {};
  jQuery.each(fmObj, function (kn, tv) {
    var key = kn.substring(1).replace('__', '-');
    fields[key] = [fmObj[kn]];
  });
  var filled_pdf;
  try {
    filled_pdf = pdfform(minipdf_js).transform(buf, fields);
    var blob = new Blob([filled_pdf], { type: 'application/pdf' });
    saveAs(blob, pdfName + '.pdf');  // var fileURL = URL.createObjectURL(blob);
                                     // window.open(fileURL, pdfName);
  } catch (e) {
    console.log(e);
  }
}
/** Sample service here **/
gSampleService = function (id, defered) {
  $.get('https://jsonplaceholder.typicode.com/comments', function (data) {
    console.log(id + ' here');
    defered.resolve(data);
  });
};
/** Talking points to communicator **/
function waitForMe() {
  return _communicatorFlag;
}
function waitFor(condition, callback) {
  if (!condition()) {
    setTimeout(waitFor.bind(null, condition, callback), 500);
  } else {
    callback();
  }
}
function showApplication() {
  $('#AngularApp').show();
}
$(document).ready(function () {
  waitFor(waitForMe, showApplication);
});