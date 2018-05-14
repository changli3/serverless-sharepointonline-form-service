angular.module(
        'SubmittedServiceModule',
        []
    )
    .factory( 'SubmittedService', function ($http, $q, $filter) {
		return {
			getTableData: function($scope) {
				document.getElementById("communicator").contentWindow.getListItemByMeStatus (
				"FormServiceRecords", 'Await', gTableFields, $scope.showTable);				
			},
		}
    });

