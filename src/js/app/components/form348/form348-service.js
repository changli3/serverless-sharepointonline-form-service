angular.module(
        'Form348ServiceModule',
        []
    )
    .factory( 'Form348Service', function ($http, $q, $filter) {
		return {
			signForm: function ($scope, status) {
				var _comm = document.getElementById("communicator").contentWindow;
				gShowBusy();
				_comm.updateListItem2(
					$scope.spItem,
					{
						"Status": status,
						"FormVars": sjcl.encrypt(btoa($scope.email), JSON.stringify($scope.formVars))
					},
					function() {
						gNotify(
							{
								Title : "Form-521 notification for: " + status,
								FormType : "Form-521",
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
				$scope.new_form = true;				
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
							$gScope.new_form = false;
							var validated = false;
							var status = item.get_item('Status');
							if (status == 'Editing') {
								if ($gScope.action == 'edit') {
									$gScope.showEditingForm = true;
									$gScope.enableEditingForm = true;
									validated = true;
								}		
							} else if (status == 'Await Ethics') {
								if ($gScope.action == 'ethics') {
									$gScope.showEditingForm = true;
									$gScope.showEthicsForm = true;
									$gScope.enableEthicsForm = true;
									validated = true;
								}		
							} else if (status == 'Completed') {
								if ($gScope.action == 'view') {
									$gScope.showEditingForm = true;
									$gScope.showEthicsForm = true;
									validated = true;									
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
	

