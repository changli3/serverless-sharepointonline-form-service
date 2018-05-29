angular.module(
        'InProgressControllerModule',
        [
        ]
    )
    .controller(
        'HomeController',
        [
            '$scope',
			'$filter',
            'InProgressService',
            'PageHeaderModel',
			'MenuMainModel',
            function ($scope, $filter, InProgressService, PageHeaderModel, MenuMainModel) {
				MenuMainModel.setCurrentMenuItemId(0);
                PageHeaderModel.setTitle("My In-progress Forms");
				$("#myInProgessTable").DataTable(gFormTableOption);			
				$gScope = $scope;

				$scope.loadPage = function () {
					PageHeaderModel.setParagraphs([gGetWelcomeMessage($scope.email)]);	
					InProgressService.getTableData($scope);
				};
				
				$scope.showTable = function (data) {
					$scope.data = data;
					
					$("#myInProgessTable").dataTable().fnDestroy();
					$("#myInProgessTable").hide();	
					$("#myInProgessTable > tbody").html('');
					
					$.each(data, function(i, item) {						
						var ele = [item.FormType, $filter('date')(Date.parse(item.Created),'MM/dd/yyyy'), 						
						$filter('date')(Date.parse(item.Modified),'MM/dd/yyyy'), item.Status, item.ManagerEmail 							
						];
						$('<tr>').html("<td>" + ele.join("</td><td>") + 
						    '</td><td nowrap>' + 
						    gMyButton(0, i, 'EDIT', 'g1Edit') + ' ' +
							gMyButton(0, i, 'VIEW PDF', 'g1ViewPDF') + ' ' +
							gMyButton(2, i, 'DELETE', 'g1Delete') + 
							"</td> ").appendTo('#myInProgessTable');
					});
					$("#myInProgessTable").DataTable(gFormTableOption);
					$("#myInProgessTable").show();	
					try {$scope.$apply()}catch (e){}
                };
				
				gWaitReady($scope);		
            }
        ]
    );
	

function gMyButton(clr, data, title, func) {
	var btn = ["btn-success", "btn-warn", "btn-danger", ""];
	return String.format('<button type="button" data-id="{3}" class="btn {2} btn-xs" onclick="event.stopPropagation(); {1}(this); return false;">{0}</button>', title, func, btn[clr], data);	
}

function g1Edit(ele) {
	var id = $(ele).attr("data-id");
	var item = $gScope.data[id];
	var route;
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
    gRoute2(route + '/edit/' + item.UniqueId);
}

function g1Delete(ele) {
	var id = $(ele).attr("data-id");
	var item = $gScope.data[id];
	document.getElementById("communicator").contentWindow.deleteListItem("FormServiceRecords", item.id, 
		function() {
			$gScope.loadPage();
		}
	);
}

function g1ViewPDF(ele) {
	gShowBusy();
	var id = $(ele).attr("data-id");
	var item = $gScope.data[id];
	var route = "";
	switch (item.FormType) {
		case 'Form-520':
			route = "/520.pdf";
			break;
		case 'Form-521':
			route = "/521.pdf";
			break;
		case 'Form-348':
			route = "/348.pdf";
			break;
		case 'WAG-Form':
			route = "/wag.pdf";
			break;
	}	
	document.getElementById("communicator").contentWindow.getListItemByGuid1 ("FormServiceRecords", item.UniqueId,
		function (data) {
			var fname = data.get_item("Title") + ".pdf";
			var formVars = JSON.parse(sjcl.decrypt(btoa(data.get_item("CreatedByEmail")), data.get_item("FormVars")));
			gFetchPDF(gLibPath + route, function(pdffile) {
				gFillPDF(formVars, fname, pdffile);
			});
		}	
	);
}


