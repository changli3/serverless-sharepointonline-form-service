angular.module(
        'SubmittedControllerModule',
        [
        ]
    )
    .controller(
        'SubmittedController',
        [
            '$scope',
			'$filter',
            'SubmittedService',
            'PageHeaderModel',
			'MenuMainModel',
            function ($scope, $filter, SubmittedService, PageHeaderModel, MenuMainModel) {
				MenuMainModel.setCurrentMenuItemId(2);
                PageHeaderModel.setTitle("My Submitted Forms - Pending for Approvals");
				$("#mySubmittedTable").DataTable(gFormTableOption);			
				$gScope = $scope;

				$scope.loadPage = function () {
					PageHeaderModel.setParagraphs([gGetWelcomeMessage($scope.email)]);	
					SubmittedService.getTableData($scope);
				};
				
				$scope.showTable = function (data) {
					$scope.data = data;
					
					$("#mySubmittedTable").dataTable().fnDestroy();
					$("#mySubmittedTable").hide();	
					$("#mySubmittedTable > tbody").html('');
					
					$.each(data, function(i, item) {						
						var ele = [item.FormType, $filter('date')(Date.parse(item.Created),'MM/dd/yyyy'), 						
						$filter('date')(Date.parse(item.Modified),'MM/dd/yyyy'), item.Status, item.ManagerEmail 							
						];
						$('<tr>').html("<td>" + ele.join("</td><td>") + 
						    '</td><td nowrap>' + 
							gMyButton(0, i, 'VIEW PDF', 'g1ViewPDF') +
							"</td> ").appendTo('#mySubmittedTable');
					});
					$("#mySubmittedTable").DataTable(gFormTableOption);
					$("#mySubmittedTable").show();	
					try {$scope.$apply()}catch (e){}
                };
				
				gWaitReady($scope);		
            }
        ]
    );
	