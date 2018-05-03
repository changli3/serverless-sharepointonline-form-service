
angular.module(
        'ArchiveControllerModule',
        [
        ]
    )
    .controller(
        'ArchiveController',
        [
            '$scope',
            'MenuMainModel',
            'ArchiveService',
            'PageHeaderModel',
            function ($scope, MenuMainModel, ArchiveService, PageHeaderModel) {
                MenuMainModel.setCurrentMenuItemId(3);

                ArchiveService.query(function (data) {
                    PageHeaderModel.setTitle("My Archived Forms");
                    PageHeaderModel.setParagraphs(["Welcome - jason.cai@hhs.gov"]);
					
					$.each(data, function(i, item) {
						var ele = [item.id, item.postId, item.name, item.email, cutText(item.body, 80),
							'<a href="javascript:void(0)" onclick="gMyArchiveTableAction(this)"  data-func="detail" data-table="myArchiveTable" data-id="' + item.id  + '">DETAIL</a> | ' +
							'<a href="javascript:void(0)" onclick="gMyArchiveTableAction(this)"  data-func="pdf" data-table="myArchiveTable" data-id="' + item.id  + '">PDF</a>'
						];
						$('<tr>').html("<td>" + ele.join("</td><td>") + "</td> ").appendTo('#myArchiveTable');
					});
					
					$("#myArchiveTable").DataTable(gFormTableOption);
					
					$scope.showTable = true;
                });
            }
        ]
    );

function gMyArchiveTableAction(ele) {
	console.log($(ele).attr("data-func") + ":" + $(ele).attr("data-table") + ":" + $(ele).attr("data-id")); 
}	