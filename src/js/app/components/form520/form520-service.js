
angular.module(
        'Form520ServiceModule',
        []
    )
    .factory( 'Form520Service', function ($http, $q, $filter) {
		return {
			signForm: function ($scope, status) {
				gShowBusy();
				var _comm = document.getElementById("communicator").contentWindow;
				_comm.updateListItem2(
					$scope.spItem,
					{
						"ManagerEmail": $scope.formVars._superemail,
						"Status": status,
						"FormVars": sjcl.encrypt(btoa($scope.email), JSON.stringify($scope.formVars))
					},
					function() {
						gNotify(
							{
								Title : "Form-520 notification for: " + status,
								FormType : "Form-520",
								NoteType: status,
								EmailTo: status == 'Await Supervisor' ? $scope.formVars._email2 : (status == 'Completed' ?  $scope.email : status.substring(6) )
							},
							function () {
								gHideBusy();
								alert("Document successfully certified and submitted.");							
							});
					}
				);
			},
			saveFormData: function($scope) {
				gShowBusy();
				var _comm = document.getElementById("communicator").contentWindow;
				if ($scope.new_form) {
					var title = "Form 520 - " + $filter('date')(new Date(), 'yyyy-MM-dd');
					_comm.createListItem(
						"FormServiceRecords",
						{
							"Title": title,
							"FormType": "Form-520",
							"CreatedByEmail": $scope.email,
							"Status": "Editing",
							"ManagerEmail": $scope.formVars._superemail,
							"FormVars": sjcl.encrypt(btoa($scope.email), JSON.stringify($scope.formVars))
						},
						function(item) {
							$scope.spItem = item;
							$scope.new_form = false;
							gHideBusy();
							alert("Data successfully saved.");
						}
					);
				} else {
					gShowBusy();
					_comm.updateListItem2(
						$scope.spItem,
						{
							"ManagerEmail": $scope.formVars._superemail,
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
				$scope.formVars = {}; //angular.copy(gForm520);
				$scope.new_form = true;				
				$scope.formVars._Datefiled = $filter('date')(new Date(), "MM/dd/yyyy");		
				
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
							$gScope.new_form = false;
							var validated = false;
							var createdbyemail = item.get_item('CreatedByEmail');
							var supervisoremail = item.get_item('ManagerEmail');								
							var status = item.get_item('Status');
							if (status == 'Editing') {
								if ($gScope.action == 'edit') {
									$gScope.showEditingForm = true;
									$gScope.enableEditingForm = true;
									validated = createdbyemail.toLowerCase() == $gScope.email.toLowerCase();
								}		
							} else if (status == 'Await Supervisor') {
								if ($gScope.action == 'manager') {
									$gScope.showEditingForm = true;
									$gScope.showManagerForm = true;
									$gScope.enableManagerForm = true;
									validated = supervisoremail.toLowerCase() == $gScope.email.toLowerCase();
								}		
							} else if (status == 'Await Reviewer') {
								if ($gScope.action == 'review') {
									$gScope.showEditingForm = true;
									$gScope.showManagerForm = true;
									$gScope.showCommitteeForm = true;
									$gScope.enableCommitteeForm = true;
									validated = true;
								}		
							} else if (status == 'Await Ethics') {
								if ($gScope.action == 'ethics') {
									$gScope.showEditingForm = true;
									$gScope.showManagerForm = true;
									$gScope.showEthicsForm = true;
									$gScope.enableEthicsForm = true;
									validated = true;
								}		
							} else if (status == 'Await Designee') {
								if ($gScope.action == 'designee') {
									$gScope.showEditingForm = true;
									$gScope.showManagerForm = true;
									$gScope.showEthicsForm = true;
									$gScope.showCommitteeForm = true;
									$gScope.showDesigneeForm = true;
									$gScope.enableDesigneeForm = true;
									validated = true;
								}		
							} else if (status == 'Completed') {
								if ($gScope.action == 'view') {
									$gScope.showEditingForm = true;
									$gScope.showManagerForm = true;
									$gScope.showEthicsForm = true;
									$gScope.showCommitteeForm = true;
									$gScope.showDesigneeForm = true;
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
	

