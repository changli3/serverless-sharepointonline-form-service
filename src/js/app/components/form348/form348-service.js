
angular.module(
        'Form348ServiceModule',
        []
    )
    .factory( 'Form348Service', function ($http, $q, $filter) {
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
					console.log("[Form348Service], putData() error, with status: " + status);
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
				$scope.formVars = angular.copy(gForm348);
				$scope.formVars._Datefiled = $filter('date')(new Date(), "MM/dd/yyyy");		
			},
			getForm4User: function ($scope, formId, formStatue) {
				$scope.filesAttached = [];
				$scope.formVars = angular.copy(gForm348);
				$scope.formVars._Datefiled = $filter('date')(new Date(), "MM/dd/yyyy");		
				$scope.formVars.signature = "";
				$scope.formVars._Date = "";				
			}
		}
    });

var gForm348 = {
	signature: "",
	designeesignature:"",	
   _reqdate:"",
   _payscale:"",
   _nameadd:"",
   _OPDIV:"",
   _purpose:"",
   _travel:"",
   _subsistence:"",
   _USC31:"",
   _USC42:"",
   _USC5:"",
   _InKind:"",
   _inkindA:"",
   _Cash:"",
   _cashamount:"",
   _DirReimb:"",
   _reimburse:"",
   _appno:"",
   _travelvalue:"",
   _lodgingvalue:"",
   _mealsvalue:"",
   _othervalue:"",
   _roundtrip:"",
   _oneway:"",
   _partamount:"",
   _recommendation:"",
   _authname:"",
   _authtitle:"",
   _authorizationdate:"",
   _qualification:"",
   _travesigdate:"",
   _traveler:"",
   _yescheck1:"",
   _nocheck1:"",
   _letterattach:"",
   _noletterattach:"",
   _yescheck3:"",
   _nocheck3:"",
   _yescheck4:"",
   _nocheck4:"",
   _yescheck5:"",
   _nocheck5:"",
   _yescheck6:"",
   _nocheck6:"",
   _ordernumb:"",
   _meetgoals:"",
   _HHSfunds:"",
   _recofftitle:"",
   _daterecommend:"",
   _qualaccept:"",
   _startdate1:"",
   _enddate1:"",
   _from1:"",
   _desto1:"",
   _startdate2:"",
   _enddate2:"",
   _from2:"",
   _desto2:"",
   _startdate3:"",
   _enddate3:"",
   _from3:"",
   _desto3:""
};