angular.module(
        'ArchiveServiceModule',
        []
    )
    .factory( 'ArchiveService', function ($http, $q, $filter) {
		return {
			getTableData: function($scope) {
				document.getElementById("communicator").contentWindow.getListItemByMeStatus (
				"FormServiceRecords", 'Completed', gTableFields, $scope.showTable);				
			},
		}
    });

