
angular.module(
        'MyActionControllerModule',
        [
        ]
    )
    .controller(
        'MyActionController',
        [
            '$scope',
            'MenuMainModel',
            'MyActionService',
            'PageHeaderModel',
            function ($scope, MenuMainModel, MyActionService, PageHeaderModel) {
                MenuMainModel.setCurrentMenuItemId(1);

                MyActionService.query(
                    function (data) {
						PageHeaderModel.setTitle("Forms Require My Action");
						PageHeaderModel.setParagraphs([gGetWelcomeMessage()]);	
						$.each(data, function(i, item) {
							var ele = [item.id, item.userId, item.title, item.body,
								'<a href="javascript:void(0)" onclick="gMyActionTableAction(this)"  data-func="approval" data-table="myActionTable" data-id="' + item.id  + '">APPROVE</a> | ' +
								'<a href="javascript:void(0)" onclick="gMyActionTableAction(this)"  data-func="reject" data-table="myActionTable" data-id="' + item.id  + '">REJECT</a>'
							];
							$('<tr>').html("<td>" + ele.join("</td><td>") + "</td> ").appendTo('#myActionTable');
						});
					
						$("#myActionTable").DataTable(gFormTableOption);
					
					$scope.showTable = true; //data.length > 0;
                });
				
				
            }
        ]
    );
	
function gMyActionTableAction(ele) {
	console.log($(ele).attr("data-func") + ":" + $(ele).attr("data-table") + ":" + $(ele).attr("data-id")); 
}