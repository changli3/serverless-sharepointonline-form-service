
angular.module(
	'MyActionServiceModule',
	[]
)
.factory( 'MyActionService', function ($http, $q, $filter) {
	return {
		getTableData: function($scope) {
			document.getElementById("communicator").contentWindow.getListItems (
			"FormApprovers", gRoleFields,
			function (roles) {
				document.getElementById("communicator").contentWindow.getListItemByColValStats(
				"WagSignatures","email",$scope.email,"Waiting", gWagFields,
				function(wagdata) {				
					document.getElementById("communicator").contentWindow.getListItemByStats (
					"FormServiceRecords", "Await " , gTableFields, 
					function(data) {
						var isDesignee = false;
						var isEthics = false;
						var isReviewer = false;
						
						for (var i=0; i< roles.length; i++) {
							if (roles[i].email.toLowerCase() != $scope.email.toLowerCase()) continue;
							if (roles[i].role == 'Designee')  isDesignee = gSetRoleType(isDesignee, roles[i].FormType);
							else if (roles[i].role == 'Ethics')  isEthics = gSetRoleType(isEthics, roles[i].FormType);
							else if (roles[i].role == 'Reviewer')  isReviewer = gSetRoleType(isReviewer, roles[i].FormType);
						}
						var ret = [];
						for (var i=0; i< data.length; i++) {
							var item = data[i];
							if (gGetEntitle2(item.Status, $scope.email, item.ManagerEmail)) ret.push(item);
							else if (gGetEntitle(item.Status, item.FormType, isEthics, isReviewer, isDesignee)) ret.push(item);
						}

						for (var i=0; i< wagdata.length; i++) {
							var item = wagdata[i];
							ret.push (
								{
									FormType: "Form-WAG",
									UniqueId: item.Title,
									Status: item.SigType == 'Employee' ? 'Await Employee' : 'Await Supervisor',
									StatusStarted: item.StartingDate,
									StatusDueDate: item.EndingDate,
									CreatedByEmail: item.oFormCreatedByEmail									
								}
							)
						}
						
						$scope.showTable(ret);	
					});
				});
			});
		},
	}
});


function gSetRoleType(a, tp) {
	if (!a) return ([tp]);
	if (tp == 'All') return ['All'];
	return a.push (tp);
}

function gGetEntitle2(s, m1, m2) {
	return (s=='Await Supervisor' && m1.toLowerCase()== m2.toLowerCase());
	
}


function gGetEntitle(s, ft, ise, isr, isd) {
	return (
		ise && s=='Await Ethics' &&  (ise.indexOf('All') >=0 || ise.indexOf(ft) >=0) ||
		isr && s=='Await Reviewer' &&  (isr.indexOf('All') >=0 || isr.indexOf(ft) >=0) ||
		isd && s=='Await Designee' &&  (isd.indexOf('All') >=0 || isd.indexOf(ft) >=0)
	);
}
