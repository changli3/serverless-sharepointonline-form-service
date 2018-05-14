angular.module(
        'ArchiveControllerModule',
        [
        ]
    )
    .controller(
        'ArchiveController',
        [
            '$scope',
			'$filter',
            'ArchiveService',
            'PageHeaderModel',
			'MenuMainModel',
            function ($scope, $filter, ArchiveService, PageHeaderModel, MenuMainModel) {
				MenuMainModel.setCurrentMenuItemId(3);
                PageHeaderModel.setTitle("My Completed Forms");
				$("#myArchiveTable").DataTable(gFormTableOption);			
				$gScope = $scope;

				$scope.loadPage = function () {
					PageHeaderModel.setParagraphs([gGetWelcomeMessage($scope.email)]);	
					ArchiveService.getTableData($scope);
				};
				
				$scope.showTable = function (data) {
					$scope.data = data;
					
					$("#myArchiveTable").dataTable().fnDestroy();
					$("#myArchiveTable").hide();	
					$("#myArchiveTable > tbody").html('');
					
					$.each(data, function(i, item) {						
						var ele = [item.FormType, $filter('date')(Date.parse(item.Created),'MM/dd/yyyy'), 						
						$filter('date')(Date.parse(item.Modified),'MM/dd/yyyy'), item.Status, item.ManagerEmail 							
						];
						$('<tr>').html("<td>" + ele.join("</td><td>") + 
						    '</td><td nowrap>' + 
							gMyButton(0, i, 'VIEW PDF', 'g1ViewPDF') + ' ' +
							gMyButton(0, i, 'CREATE LIKE THIS', 'g1CreateLike') +
							"</td> ").appendTo('#myArchiveTable');
					});
					$("#myArchiveTable").DataTable(gFormTableOption);
					$("#myArchiveTable").show();	
					try {$scope.apply()}catch (e){}
                };
				
				gWaitReady($scope);		
            }
        ]
    );
	
function g1CreateLike() {
	alert("This function has not implemented yet.")
}	