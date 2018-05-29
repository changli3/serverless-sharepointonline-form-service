angular.module(
        'Form348ServiceModule',
        []
    )
    .factory( 'Form348Service', function ($http, $q, $filter) {
		return {
			signForm: function ($scope, status) {
				var _comm = document.getElementById("communicator").contentWindow;
				gShowBusy();
				if (!$scope.spItem) {
					var title = "Form 348 - " + $filter('date')(new Date(), 'yyyy-MM-dd');
					_comm.createListItem(
						"FormServiceRecords",
						{
							"Title": title,
							"FormType": "Form-348",
							"CreatedByEmail": $scope.email,
							"Status": status,
							"StatusStarted": $filter('date')(new Date(), 'yyyy-MM-dd'),
							"StatusDueDate": $filter('date')(new Date(Date.now() + 5 * 24 * 3600 * 1000), 'yyyy-MM-dd'),	
							"FormVars": sjcl.encrypt(btoa($scope.email), JSON.stringify($scope.formVars))
						},
						function(item) {
							gNotify(
								{
									Title : "Form-348 notification for: " + status,
									FormType : "Form-348",
									NoteType: status,
									EmailTo: (status == 'Completed' ?  $scope.spItem.get_item("CreatedByEmail") : status.substring(6) )
								},
								function () {
									gHideBusy();
									alert("Document successfully certified and submitted.");							
								});
						}
					);
				} else {				
				_comm.updateListItem2(
					$scope.spItem,
					{
						"Status": status,
						"StatusStarted": $filter('date')(new Date(), 'yyyy-MM-dd'),
						"StatusDueDate": $filter('date')(new Date(Date.now() + 5 * 24 * 3600 * 1000), 'yyyy-MM-dd'),						
						"FormVars": sjcl.encrypt(btoa($scope.email), JSON.stringify($scope.formVars))
					},
					function() {
						gNotify(
							{
								Title : "Form-348 notification for: " + status,
								FormType : "Form-348",
								NoteType: status,
								EmailTo: (status == 'Completed' ?  $scope.spItem.get_item("CreatedByEmail") : status.substring(6) )
							},
							function () {
								gHideBusy();
								alert("Document successfully certified and submitted.");							
							});
					}	
				)}
			},
			saveFormData: function($scope) {
				gShowBusy();
				var _comm = document.getElementById("communicator").contentWindow;
				if (!$scope.spItem) {
					var title = "Form 348 - " + $filter('date')(new Date(), 'yyyy-MM-dd');
					_comm.createListItem(
						"FormServiceRecords",
						{
							"Title": title,
							"FormType": "Form-348",
							"CreatedByEmail": $scope.email,
							"Status": "Editing",
							"FormVars": sjcl.encrypt(btoa($scope.email), JSON.stringify($scope.formVars))
						},
						function(item) {
							$scope.spItem = item;
							gHideBusy();
							alert("Data successfully saved.");
						}
					);
				} else {
					_comm.updateListItem2(
						$scope.spItem,
						{
							"Status": "Editing",
							"FormVars": sjcl.encrypt(btoa($scope.email), JSON.stringify($scope.formVars))
						},
						function() {
							gHideBusy();
							alert("Data successfully saved.");
						}
					);
				}
			},
			initForm: function($scope) {
				$scope.filesAttached = [];
				$scope.formVars = {}; //angular.copy(gForm348);			
				$scope.formVars._reqdate = $filter('date')(new Date(), "MM/dd/yyyy");		
				
				$scope.showEditingForm = true;
				$scope.enableEditingForm = true;				
			},
			getForm4User: function ($scope) {
				$scope.filesAttached = [];
				$gScope = $scope;
				gShowBusy();
				document.getElementById("communicator").contentWindow.getListItemByGuid1("FormServiceRecords", 
						$scope.formId, function(item) {			
						$gScope.$apply(function() {
							$gScope.spItem = item;
							var validated = false;
							var status = item.get_item('Status');
							var createdbyemail = item.get_item('CreatedByEmail');
							var supervisoremail = item.get_item('ManagerEmail');								
							if (status == 'Editing') {
								if ($gScope.action == 'edit') {
									$gScope.showEditingForm = true;
									$gScope.enableEditingForm = true;
									validated = createdbyemail.toLowerCase() == $gScope.email.toLowerCase();
								}		
							} else if (status == 'Await Ethics') {
								if ($gScope.action == 'ethics') {
									$gScope.showEditingForm = true;
									$gScope.showEthicsForm = true;
									$gScope.enableEthicsForm = true;
									validated = supervisoremail.toLowerCase() == $gScope.email.toLowerCase();
								}		
							} else if (status == 'Completed') {
								if ($gScope.action == 'view') {
									$gScope.showEditingForm = true;
									$gScope.showEthicsForm = true;
									validated = tcreatedbyemail.toLowerCase() == $gScope.email.toLowerCase() || 
												supervisoremail.toLowerCase() == $gScope.email.toLowerCase();					
								}
							}
							if (validated) {
								$gScope.email = item.get_item('CreatedByEmail');
								$gScope.formVars = JSON.parse(sjcl.decrypt(btoa($gScope.email), item.get_item('FormVars')));							
							} else {
								$scope.showPermissionError = true;
							}
							gHideBusy();
						});

				});
			}
		}
    });
	

