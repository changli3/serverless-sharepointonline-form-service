/* global angular */
angular.module('AppComponentsModule', [
  'InProgressComponentsModule',
  'MyActionComponentsModule',
  'SubmittedComponentsModule',
  'ArchiveComponentsModule',
  'NewFormComponentsModule'
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
angular.module('NewFormComponentsModule', [
  'NewFormControllerModule',
  'NewFormServiceModule'
]);var gForms = [
    '',
    'Form HHS-520',
    'Form HHS-521',
    'Form HHS-348',
    'WAG Form'
  ];
var gLibPath = 'js/lib/forms';
angular.module('NewFormControllerModule', []).controller('NewFormController', [
  '$scope',
  '$routeParams',
  '$filter',
  'MenuMainModel',
  'NewFormService',
  'PageHeaderModel',
  function ($scope, $routeParams, $filter, MenuMainModel, NewFormService, PageHeaderModel) {
    MenuMainModel.setCurrentMenuItemId(4);
    var id = $routeParams.id;
    $scope.new_form = gForms[id];
    if (id > 4 || id < 0)
      return;
    $scope.showSuccess = false;
    $scope.showError = false;
    PageHeaderModel.setTitle($scope.new_form);
    PageHeaderModel.setParagraphs([gGetWelcomeMessage()]);
    $scope.form520 = angular.copy(gForm520);
    $scope.formStatus = 0;
    $scope.form520._Datefiled = $filter('date')(new Date(), 'MM/dd/yyyy');
    $scope.form520.signature = '';
    $scope.form520._Date = '';
    $scope.doSubmit520 = function ($event, formV) {
      console.log(formV);
      return;
      $event.stopPropagation();
      NewFormService.send({ id: 1 }, function (data) {
        console.log(JSON.stringify(data, null, '  '));
      });
      $scope.showSuccess = true;
    };
    $scope.doCertify520 = function ($event) {
      $event.stopPropagation();
      NewFormService.send({ id: 1 }, function (data) {
        console.log(JSON.stringify(data, null, '  '));
        $scope.formStatus = 1;  //$scope.$apply();
      });
    };
    $scope.doRevoke520 = function ($event) {
      $event.stopPropagation();
      NewFormService.send({ id: 1 }, function (data) {
        console.log(JSON.stringify(data, null, '  '));
        $scope.formStatus = 0;  //$scope.$apply();
      });
    };
    $scope.doPDF520 = function ($event) {
      console.log('doPDF520');
      $event.stopPropagation();
      gFetchPDF(gLibPath + '/520.pdf', function (pdffile) {
        gFillPDF($scope.form520, 'myHHS520', pdffile);
      });
    };
    $scope.showForm = function (formName, fstatus) {
      return $scope.new_form == formName && fstatus <= $scope.formStatus;
    };
  }
]);
var gForm520 = {
    signature: '',
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
  };angular.module('NewFormServiceModule', ['ngResource']).factory('NewFormService', [
  '$resource',
  function ($resource) {
    return $resource('https://jsonplaceholder.typicode.com/posts/:id', { id: '@id' }, { send: { method: 'PUT' } });
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
    template: '<div class="row col-md-12" style="height:20px"/>',
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
]);var gFormTableOption = {
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
      templateUrl: 'js/app/components/in-progress/main-view.html',
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
    }).when('/new-form/:id', {
      templateUrl: 'js/app/components/new-form/main-view.html',
      controller: 'NewFormController'
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
          gRoute2('/new-form/' + $('#newFormSelection').val());
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
    saveAs(blob, pdfName + '.pdf');
  } catch (e) {
    console.log(e);
  }
}