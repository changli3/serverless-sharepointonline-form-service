
angular.module(
        'FormWAGServiceModule',
        []
    )
	.factory( 'FormWAGService', function ($http, $q, $filter) {
		return {
			signDesigneeFormLoop2: function (status, empmails, supermails, loopIndex) {
				var title = "Form WAG - Supervisor Signature Required";
				if (loopIndex >= supermails.length) {
					gNotify(
						{
							Title : "Form WAG - Attendee Signature Required",
							FormType : "Form-WAG",
							NoteType: status,
							EmailTo: empmails.join(';')
						},
						function () {
							gHideBusy();
							alert("Document successfully certified and submitted.");							
					});
					return;
				}
				var _comm = document.getElementById("communicator").contentWindow;
				_comm.createListItem(
					"WagSignatures",
					{
						"Title": title,
						"email": supermails[loopIndex],
						"SigType": 'Supervisor',
						"Status": 'Started',
						"StartingDate": new Date(Date.now() + 6 * 24 * 3600 * 1000),
						"EndingDate": new Date(Date.now() + 10 * 24 * 3600 * 1000),
						"oFormCreatedByEmail": $gScope.email
					},
					function() {
						this.signDesigneeFormLoop2(status, empmails, supermails, loopIndex+1);
					}
				);
			},			
			signDesigneeFormLoop1: function (status, empmails, supermails, loopIndex) {
				var title = "Form WAG - Attendee Signature Required";
				if (loopIndex >= empmails.length) {
					this.signDesigneeFormLoop2(status, empmails, supermails, 0);
					return;
				}
				var _comm = document.getElementById("communicator").contentWindow;
				_comm.createListItem(
					"WagSignatures",
					{
						"Title": title,
						"email": empmails[loopIndex][0],
						"SigType": 'Employee',
						"Status": 'Started',
						"StartingDate": new Date(),
						"EndingDate": new Date(Date.now() + 5 * 24 * 3600 * 1000),
						"oFormCreatedByEmail": $gScope.email,
						"oFormManagerEmail": empmails[loopIndex][1]
					},
					function() {
						this.signDesigneeFormLoop1(status, empmails, supermails, loopIndex+1);
					}
				);
			},
			signDesigneeForm: function ($scope, status, empmails, supermails) {
				gShowBusy();
				$gScope = $scope;
				this.signDesigneeFormLoop1(status, empmails, supermails, 0);	
			},
			signEmployeeForm: function ($scope, status, empmail, supermail) {
				gShowBusy();
				$gScope = $scope;
				var _comm = document.getElementById("communicator").contentWindow;
				_comm.getListItemByColVals(
					"WagSignatures", 
					{
						Title: $scope.spItem.get_item("UniqueId").toString(),
						SigType: 'Employee'
					}, gWagFields,
					function(items) {
						var allSigned = true;
						var me;
						for (var i=0; i<items.length; i++) {
							if (item.email.toLowerCase() == empmail) me = item;
							else {
								if (!item.Signed || !item.SignedDate || item.Signed == '' || item.SignedDate == '') allSigned = false;
							}
						}
						if (!me) {
							alert("System error - please contact administrator.");
							return;
						}
						if (allSigned) {
							// 1st update WagSignatures to reflect
							_comm.updateListItem(
								"WagSignatures", 
								me.id, 
								{
									"Signed" : sjcl.encrypt(btoa($scope.email), $scope.formVars.employeesignDate),
									"SignedDate": $scope.formVars.employeesignDate
								},
								function() {
									// 2nd update the FormServiceRecords to fill in all employee signatures and set status to Await Supervisor
									
									// 3rd update WagSignatures to put supervisor records into started
									
									// 4th send out notification to supermail

									var supervisorEmails = [];
									for (var i=1; i<16; i++) {
										var m = $gScope.formVars["email" + i];
										var s = $gScope.formVars["managerEmail" + i];
										if (!m || !s) continue;
										m = m.toLowerCase();
										s = s.toLowerCase();
										if (s.indexOf(s)<0) supervisorEmails.push(s);
										
										for (var j=0; j<items.length; j++) {
											item = items[j];
											if (item.email.toLowerCase() == m) {
												$gScope.formVars["_EmployeesSignature" + i] = item.SignedDate;
												break;
											}
										}										
									}
									_comm.updateListItem2(
										$gScope.spItem,
										{
											"Status": "Await Supervisor",
											"FormVars": sjcl.encrypt(btoa($gScope.email), JSON.stringify($gScope.formVars))
										},
										function() {
											gNotify(
											{
												Title : "Form-WAG notification for supersivor approval required",
												FormType : "Form-WAG",
												NoteType: "Await Supervisor",
												EmailTo: supervisorEmails.join(';')
											},
											function () {
												gHideBusy();
												alert("Document successfully certified and submitted.");							
											});
										}
									);									
								}
							)							
						} else {
							_comm.updateListItem(
								"WagSignatures", 
								me.id, 
								{
									"Signed" : sjcl.encrypt(btoa($scope.email), $scope.formVars.employeesignDate),
									"SignedDate": $scope.formVars.employeesignDate
								},
								function() {
									alert("Document successfully certified and submitted.");	
									gHideBusy();									
								}
							)
						}
					}
				);				
			},
			signSupervisorForm: function ($scope, status, supermail) {
				gShowBusy();
				$gScope = $scope;
				var _comm = document.getElementById("communicator").contentWindow;
				_comm.getListItemByColVals(
					"WagSignatures", 
					{
						Title: $scope.spItem.get_item("UniqueId").toString(),
						SigType: 'Supervisor'
					}, gWagFields,
					function(items) {
						var allSigned = true;
						var me;
						for (var i=0; i<items.length; i++) {
							if (item.email.toLowerCase() == supermail) me = item;
							else {
								if (!item.Signed || !item.SignedDate || item.Signed == '' || item.SignedDate == '') 
										allSigned = false;
							}
						}
						if (!me) {
							alert("System error - please contact administrator.");
							return;
						}
						if (allSigned) {
							// 1st update WagSignatures to reflect me signed
							_comm.updateListItem(
								"WagSignatures", 
								me.id, 
								{
									"Signed" : sjcl.encrypt(btoa($gScope.email), $gScope.formVars.managersignDate),
									"SignedDate": $gScope.formVars.managersignDate
								},
								function() {
									// 2nd update the FormServiceRecords to fill in all employee signatures and set status to Completed
									var employeeEmails = [];
									for (var i=1; i<16; i++) {
										var m = $gScope.formVars["email" + i];
										var s = $gScope.formVars["managerEmail" + i];
										if (!m || !s) continue;
										m = m.toLowerCase();
										s = s.toLowerCase();
										employeeEmails.push(m);
										for (var j=0; j<items.length; j++) {
											item = items[j];
											if (item.email.toLowerCase() == s) {
												$gScope.formVars["_SupervisorsSignature" + i] = item.SignedDate;
												break;
											}
										}										
									}
									_comm.updateListItem2(
										$gScope.spItem,
										{
											"Status": "Completed",
											"FormVars": sjcl.encrypt(btoa($gScope.email), JSON.stringify($gScope.formVars))
										},
										function() {
											gNotify(
											{
												Title : "Form-WAG notification for completion ",
												FormType : "Form-WAG",
												NoteType: "Completed",
												EmailTo: employeeEmails.join(';')
											},
											function () {
												gHideBusy();
												alert("Document successfully certified and submitted.");							
											});
										}
									);								
								}
							)							
						} else {
							_comm.updateListItem(
								"WagSignatures", 
								me.id, 
								{
									"Signed" : sjcl.encrypt(btoa($scope.email), $scope.formVars.managersignDate),
									"SignedDate": $scope.formVars.managersignDate
								},
								function() {
									alert("Document successfully certified and submitted.");	
									gHideBusy();									
								}
							)
						}
					}
				);					
			},			
			signForm: function ($scope, status) {
				gShowBusy();
				var _comm = document.getElementById("communicator").contentWindow;
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
					var title = "Form WAG - " + $filter('date')(new Date(), 'yyyy-MM-dd');
					_comm.createListItem(
						"FormServiceRecords",
						{
							"Title": title,
							"FormType": "Form-WAG",
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
				$scope.formVars = {}; //angular.copy(gFormWAG);
				$scope.new_form = true;				
				$scope.formVars._RequestDate = $filter('date')(new Date(), "MM/dd/yyyy");		
				
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
							} else if (status == 'Await Supervisor') {
								if ($gScope.action == 'manager') {
									$gScope.showEditingForm = true;
									$gScope.showEthicsForm = true;
									$gScope.showEmploeeForm = true;
									$gScope.showDesigneeForm = true;
									$gScope.showManagerForm = true;									
									$gScope.enableManagerForm = true;
									validated = true;
								}		
							} else if (status == 'Await Designee') {
								if ($gScope.action == 'designee') {
									$gScope.showEditingForm = true;
									$gScope.showEthicsForm = true;
									$gScope.enableEthicsForm = true;
									validated = true;
								}		
							} else if (status == 'Await Ethics') {
								if ($gScope.action == 'ethics') {
									$gScope.showEditingForm = true;
									$gScope.showEthicsForm = true;
									$gScope.enableEthicsForm = true;
									validated = true;
								}		
							} else if (status == 'Await Employee') {
								if ($gScope.action == 'employee') {
									$gScope.showEditingForm = true;
									$gScope.showEthicsForm = true;
									$gScope.showDesigneeForm = true;
									$gScope.enableEthicsForm = true;
									validated = true;
								}		
							} else if (status == 'Completed') {
								if ($gScope.action == 'view') {
									$gScope.showEditingForm = true;
									$gScope.showEthicsForm = true;
									$gScope.showDesigneeForm = true;
									$gScope.showSignatureForm = true;
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
	




