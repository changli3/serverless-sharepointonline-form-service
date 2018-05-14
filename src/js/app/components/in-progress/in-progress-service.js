angular.module(
        'InProgressServiceModule',
        []
    )
    .factory( 'InProgressService', function ($http, $q, $filter) {
		return {
			getTableData: function($scope) {
				/*
				document.getElementById("communicator").contentWindow.getListItemByMe (
				"FormServiceRecords", gTableFields, 
				function(data) {
					var results = [];
					$.each(data, function( idx, item ) {
						if (item.Status=='Editing') results.push(item);
					});
					$scope.showTable(results);	
				});
				*/
				document.getElementById("communicator").contentWindow.getListItemByMeStatus (
				"FormServiceRecords", 'Editing', gTableFields, $scope.showTable);				
			},
		}
    });