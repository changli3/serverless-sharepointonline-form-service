
angular.module(
        'SubmittedControllerModule',
        [
        ]
    )
    .controller(
        'SubmittedController',
        [
            '$scope',
            'MenuMainModel',
            'SubmittedService',
            'PageHeaderModel',
            function ($scope, MenuMainModel, SubmittedService, PageHeaderModel) {
				
                MenuMainModel.setCurrentMenuItemId(2);

                SubmittedService.query(function (data) {
                    PageHeaderModel.setTitle("My Submitted Forms");
                    PageHeaderModel.setParagraphs(["Welcome - jason.cai@hhs.gov"]);
					
					$.each(data, function(i, item) {
						var ele = [item.id, item.name, item.username, item.email,
							'<a href="javascript:void(0)" onclick="gMySubmittedTableAction(this)"  data-func="detail" data-table="mySubmittedTable" data-id="' + item.id  + '">DETAIL</a> | ' +
							'<a href="javascript:void(0)" onclick="gMySubmittedTableAction(this)"  data-func="retract" data-table="mySubmittedTable" data-id="' + item.id  + '">RETRACT</a>'
						];
						$('<tr>').html("<td>" + ele.join("</td><td>") + "</td> ").appendTo('#mySubmittedTable');
					});
					
					$("#mySubmittedTable").DataTable(gFormTableOption);
					
					$scope.showTable = true;
                });
            }
        ]
    );
	
function gMySubmittedTableAction(ele) {
	console.log($(ele).attr("data-func") + ":" + $(ele).attr("data-table") + ":" + $(ele).attr("data-id")); 
}	