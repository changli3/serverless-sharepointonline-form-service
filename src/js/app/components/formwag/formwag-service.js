
angular.module(
        'FormWAGServiceModule',
        []
    )
    .factory( 'FormWAGService', function ($http, $q, $filter) {
		return {
			putData: function(id) {
				var promise = null;
				console.log("I'm here");
				promise = $http({
					method: 'PUT',
					url: 'https://jsonplaceholder.typicode.com/posts/' + id
				}).success(function(response) {
					console.log(response);
					return response;
				}).error(function(data, status, headers, config) {
					console.log("[FormWAGService], putData() error, with status: " + status);
				});	
				return promise;
			},
			sampleSerice: function (id) {
				var defered = $q.defer();
				gSampleService(id, defered);
				return defered.promise;
			},
			initForm: function($scope) {
				$scope.filesAttached = [];
				$scope.formVars = angular.copy(gFormWAG);
				$scope.formVars._Datefiled = $filter('date')(new Date(), "MM/dd/yyyy");		
			},
			getForm4User: function ($scope, formId, formStatue) {
				$scope.filesAttached = [];
				$scope.formVars = angular.copy(gFormWAG);
				$scope.formVars._Datefiled = $filter('date')(new Date(), "MM/dd/yyyy");		
				$scope.formVars.signature = "";
				$scope.formVars._Date = "";				
			}
		}
    });

var gFormWAG = {
	   _represent:"",
   _etc:"",
   _CenterOffice1:"",
   _CenterOffice2:"",
   _CenterOffice3:"",
   _CenterOffice4:"",
   _CenterOffice5:"",
   _CenterOffice6:"",
   _EmployeesName7:"",
   _CenterOffice7:"",
   _CenterOffice8:"",
   _EmployeesName9:"",
   _CenterOffice9:"",
   _CenterOffice10:"",
   _CenterOffice11:"",
   _CenterOffice12:"",
   _CenterOffice13:"",
   _CenterOffice14:"",
   _CenterOffice15:"",
   _SupervisorsSignature15:"",
   _PointContact:"",
   _RequestDate:"",
   _TelephoneNumber:"",
   _CSCountry:"",
   _Fullname:"",
   _LocationEvent:"",
   _DateEvent:"",
   _TimeEvent:"",
   _NameConf:"",
   _CheckBox1:"",
   _CheckBox2:"",
   _CheckBox3:"",
   _CheckBox5:"",
   _CheckBox6:"",
   _WhoElse:"",
   _IfYes:"",
   _HowMany:"",
   _Ifyes2:"",
   _CheckBox7:"",
   _CheckBox8:"",
   _CheckBox9:"",
   _CheckBox10:"",
   _CheckBox11:"",
   _CheckBox12:"",
   _CheckBox13:"",
   _CheckBox14:"",
   _CheckBox15:"",
   _CheckBox16:"",
   _CheckBox17:"",
   _CheckBox18:"",
   _WhatValue:"",
   _organizationinfo:"",
   _Youroficial:"",
   _ifyesthen:"",
   _attachments:"",
   _EmployeesName1:"",
   _EmployeesSignature1:"",
   _SupervisorsName1:"",
   _SupervisorsSignature1:"",
   _EmployeesName2:"",
   _SupervisorsName2:"",
   _EmployeesName3:"",
   _SupervisorsSignature2:"",
   _EmployeesSignature3:"",
   _SupervisorsName3:"",
   _SupervisorsSignature3:"",
   _EmployeesName4:"",
   _EmployeesSignature4:"",
   _SupervisorsName4:"",
   _SupervisorsSignature4:"",
   _EmployeesName5:"",
   _EmployeesSignature5:"",
   _SupervisorsName5:"",
   _SupervisorsSignature5:"",
   _EmployeesName6:"",
   _Telephone1:"",
   _Telephone2:"",
   _EmployeesSignature2:"",
   _Telephone3:"",
   _Telephone4:"",
   _Telephone5:"",
   _Telephone6:"",
   _EmployeesSignature6:"",
   _SupervisorsName6:"",
   _SupervisorsSignature6:"",
   _Telephone7:"",
   _EmployeesSignature7:"",
   _SupervisorsName7:"",
   _SupervisorsSignature7:"",
   _EmployeesName8:"",
   _Telephone8:"",
   _EmployeesSignature8:"",
   _SupervisorsName8:"",
   _SupervisorsSignature8:"",
   _Telephone9:"",
   _EmployeesSignature9:"",
   _SupervisorsName9:"",
   _SupervisorsSignature9:"",
   _EmployeesName10:"",
   _Telephone10:"",
   _EmployeesSignature10:"",
   _SupervisorsName10:"",
   _SupervisorsSignature10:"",
   _EmployeesName11:"",
   _Telephone11:"",
   _EmployeesSignature11:"",
   _SupervisorsName11:"",
   _SupervisorsSignature11:"",
   _EmployeesName12:"",
   _Telephone12:"",
   _EmployeesSignature12:"",
   _SupervisorsName12:"",
   _SupervisorsSignature12:"",
   _EmployeesName13:"",
   _Telephone13:"",
   _EmployeesSignature13:"",
   _SupervisorsName13:"",
   _SupervisorsSignature13:"",
   _EmployeesName14:"",
   _Telephone14:"",
   _EmployeesSignature14:"",
   _SupervisorsName14:"",
   _SupervisorsSignature14:"",
   _EmployeesName15:"",
   _Telephone15:"",
   _EmployeesSignature15:"",
   _SupervisorsName15:"",
   _EthicsSig:"",
   _EthicsDate:"",
   _DeputySig:"",
   _DeputyDate:"",
   _CheckBox4:"",
   _CheckBox24:"",
   _CheckBox25:"",
   _CheckBox26:"",
   _CheckBox27:"",
   _CheckBox28:"",
   _CheckBox29:""
};