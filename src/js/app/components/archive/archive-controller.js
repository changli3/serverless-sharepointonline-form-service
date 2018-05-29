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
					var gIsOWner = document.getElementById("communicator").contentWindow.gIsOWner;
					
					$.each(data, function(i, item) {						
						var ele = [item.FormType, $filter('date')(Date.parse(item.Created),'MM/dd/yyyy'), 						
						$filter('date')(Date.parse(item.Modified),'MM/dd/yyyy'), item.Status, 
						item.Sent2Salesforce ?  $filter('date')(Date.parse(item.Sent2Salesforce),'MM/dd/yyyy') : '',
						item.ManagerEmail 							
						];
						$('<tr>').html("<td>" + ele.join("</td><td>") + 
						    '</td><td nowrap>' + 
							gMyButton(0, i, 'VIEW PDF', 'g1ViewPDF') + ' ' +
							(!item.Sent2Salesforce && gIsOWner ? gMyButton(0, i, 'Send to Salesforce', 'g1Send2Salesforce') : '') +
							"</td> ").appendTo('#myArchiveTable');
					});
					$("#myArchiveTable").DataTable(gFormTableOption);
					$("#myArchiveTable").show();	
					try {$scope.$apply()}catch (e){}
                };
				
				gWaitReady($scope);		
            }
        ]
    );
	
function g1Send2Salesforce() {
	alert("This function has not implemented yet.")
}	