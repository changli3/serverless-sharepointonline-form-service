angular.module(
        'ArchiveServiceModule',
        []
    )
    .factory( 'ArchiveService', function ($http, $q, $filter) {
		
		return {
			getTableData: function($scope) {
				var _comm = document.getElementById("communicator").contentWindow;
				if (!_comm.gIsOWner) _comm.getListItemByMeStatus ("FormServiceRecords", 'Completed', gTableFields, $scope.showTable);	
				else {
					_comm.getListItemByStats ("FormServiceRecords", 'Completed', gTableFields, $scope.showTable);
				}
			},
		}
    });

