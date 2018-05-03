

angular.module(
        'InProgressControllerModule',
        [
        ]
    )
    .controller(
        'HomeController',
        [
            '$scope',
            'InProgressService',
            'PageHeaderModel',
			'MenuMainModel',
            function ($scope, InProgressService, PageHeaderModel, MenuMainModel) {
				MenuMainModel.setCurrentMenuItemId(0);
				$scope.showTable = false;
				
                InProgressService.query(function (data) {
					
                    PageHeaderModel.setTitle("My In-progress Forms");
                    PageHeaderModel.setParagraphs(["Welcome - jason.cai@hhs.gov"]);
					
					$.each(data, function(i, item) {
						var ele = [item.id, item.name, item.username, item.email,
							'<a href="javascript:void(0)" onclick="gMyInProgessTableAction(this)"  data-func="edit" data-table="myInProgessTable" data-id="' + item.id  + '">EDIT</a> | ' +
							'<a href="javascript:void(0)" onclick="gMyInProgessTableAction(this)"  data-func="preview" data-table="myInProgessTable" data-id="' + item.id  + '">PREVIEW</a> | ' +
							'<a href="javascript:void(0)" onclick="gMyInProgessTableAction(this)"  data-func="delete" data-table="myInProgessTable" data-id="' + item.id  + '">DELETE</a>'
						];
						$('<tr>').html("<td>" + ele.join("</td><td>") + "</td> ").appendTo('#myInProgessTable');
					});
					
					$("#myInProgessTable").DataTable(gFormTableOption);
					
					$scope.showTable = true;
                });
            }
        ]
    );

function gMyInProgessTableAction(ele) {
	console.log($(ele).attr("data-func") + ":" + $(ele).attr("data-table") + ":" + $(ele).attr("data-id")); 
}