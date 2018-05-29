angular.module(
        'MyActionControllerModule',
        [
        ]
    )
    .controller(
        'MyActionController',
        [
            '$scope',
			'$filter',
            'MyActionService',
            'PageHeaderModel',
			'MenuMainModel',
            function ($scope, $filter, MyActionService, PageHeaderModel, MenuMainModel) {
				MenuMainModel.setCurrentMenuItemId(1);
                PageHeaderModel.setTitle("Forms Require My Action");
				$("#myActionTable").DataTable(gFormTableOption);			
				$gScope = $scope;

				$scope.loadPage = function () {
					PageHeaderModel.setParagraphs([gGetWelcomeMessage($scope.email)]);	
					MyActionService.getTableData($scope);
				};
				
				$scope.showTable = function (data) {
					$scope.data = data;
					
					$("#myActionTable").dataTable().fnDestroy();
					$("#myActionTable").hide();	
					$("#myActionTable > tbody").html('');
					
					$.each(data, function(i, item) {						
						var ele = [item.FormType, item.Status, 
						$filter('date')(Date.parse(item.StatusStarted),'MM/dd/yyyy'), 						
						$filter('date')(Date.parse(item.StatusDueDate),'MM/dd/yyyy'), item.CreatedByEmail 							
						];
						$('<tr>').html("<td>" + ele.join("</td><td>") + 
						    '</td><td nowrap>' + 
						    gMyButton(0, i, 'EDIT', 'g2Edit') + ' ' +
							gMyButton(0, i, 'VIEW PDF', 'g1ViewPDF') +
							"</td> ").appendTo('#myActionTable');
					});
					$("#myActionTable").DataTable(gFormTableOption);
					$("#myActionTable").show();	
					try {$scope.$apply()}catch (e){}
                };
				
				gWaitReady($scope);		
            }
        ]
    );
	
function g2Edit(ele) {
	var id = $(ele).attr("data-id");
	var item = $gScope.data[id];
	var route, action;
	switch (item.FormType) {
		case 'Form-520':
			route = "form520";
			break;
		case 'Form-521':
			route = "form521";
			break;
		case 'Form-348':
			route = "form348";
			break;
		case 'Form-WAG':
			route = "formwag";
			break;
	}
	switch (item.Status) {
		case 'Await Supervisor':
			action = "manager";
			break;
		case 'Await Ethics':
			action = "ethics";
			break;
		case 'Await Designee':
			action = "desginee";
			break;
		case 'Await Reviewer':
			action = "review";
			break;
		case 'Await Employee':
			action = "employee";
			break;
	}	
    gRoute2(route + '/' + action + '/' + item.UniqueId);
}	