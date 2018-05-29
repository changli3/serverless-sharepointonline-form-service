
angular.module(
        'FormWAGServiceModule',
        []
    )
	.factory( 'FormWAGService', function ($http, $q, $filter) {
		return {
			signFormAndInitEmpAndSupLoop2: function (status, empmails, supermails, loopIndex) {
				var title = "Form WAG - Supervisor Signature Required";
				if (loopIndex >= supermails.length) {
					gNotify(
						{
							Title : "Form WAG - Supervisor Signature Required",
							FormType : "Form-WAG",
							NoteType: status,
							EmailTo: supermails
						});					
					gNotify(
						{
							Title : "Form WAG - Attendee Signature Required",
							FormType : "Form-WAG",
							NoteType: status,
							EmailTo: empmails
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
						this.signFormAndInitEmpAndSupLoop2(status, empmails, supermails, loopIndex+1);
					}
				);
			},			
			signFormAndInitEmpAndSupLoop1: function (status, empmails, supermails, loopIndex) {
				var title = "Form WAG - Attendee Signature Required";
				if (loopIndex >= empmails.length) {
					this.signFormAndInitEmpAndSupLoop2(status, empmails, supermails, 0);
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
						"StartingDate": $filter('date')(new Date(), 'yyyy-MM-dd'),
						"EndingDate": $filter('date')(new Date(Date.now() + 5 * 24 * 3600 * 1000), 'yyyy-MM-dd'),
						"oFormCreatedByEmail": $gScope.email,
						"oFormManagerEmail": empmails[loopIndex][1]
					},
					function() {
						this.signFormAndInitEmpAndSupLoop1(status, empmails, supermails, loopIndex+1);
					}
				);
			},
			signFormAndInitEmpAndSup: function ($scope, status, empmails, supermails) {
				gShowBusy();
				$gScope = $scope;
				this.signFormAndInitEmpAndSupLoop1(status, empmails, supermails, 0);	
			},
			signEmployeeForm: function ($scope, status, empmail, supermail) {
				gShowBusy();
				$gScope = $scope;
				var _comm = document.getElementById("communicator").contentWindow;
				_comm.getListItemByColVals(
					"WagSignatures", 
					{
						Title: $scope.spItem.get_item("UniqueId").toString()
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
							_comm.updateListItem(
								"WagSignatures", 
								me.id, 
								{
									"Signed" : sjcl.encrypt(btoa($scope.email), $scope.formVars.employeesignDate),
									"SignedDate": $scope.formVars.employeesignDate
								},
								function() {
									var employeeEmails = [];
									for (var i=1; i<16; i++) {
										var m = $gScope.formVars["email" + i];
										var s = $gScope.formVars["managerEmail" + i];
										if (!m || !s) continue;
										m = m.toLowerCase();
										s = s.toLowerCase();
										employeeEmails.push(m);
										var emps = false;
										var sups = false;
										for (var j=0; j<items.length; j++) {
											item = items[j];
											if (item.email.toLowerCase() == s) {
												$gScope.formVars["_SupervisorsSignature" + i] = item.SignedDate;
												sups = true;
											}
											else if (item.email.toLowerCase() == m) {
												$gScope.formVars["_EmployeesSignature" + i] = item.SignedDate;
												emps = false;
											}
											if (emps && sups) break;
										}										
									}
									_comm.updateListItem2(
										$gScope.spItem,
										{
											"Status": "Await Ethics",
											"FormVars": sjcl.encrypt(btoa($gScope.email), JSON.stringify($gScope.formVars))
										},
										function() {
											gNotify(
											{
												Title : "Form-WAG notification for Ethics ",
												FormType : "Form-WAG",
												NoteType: "Await Ethics",
												EmailTo: "Ethics"
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
						Title: $scope.spItem.get_item("UniqueId").toString()
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
							_comm.updateListItem(
								"WagSignatures", 
								me.id, 
								{
									"Signed" : sjcl.encrypt(btoa($gScope.email), $gScope.formVars.managersignDate),
									"SignedDate": $gScope.formVars.managersignDate
								},
								function() {
									var employeeEmails = [];
									for (var i=1; i<16; i++) {
										var m = $gScope.formVars["email" + i];
										var s = $gScope.formVars["managerEmail" + i];
										if (!m || !s) continue;
										m = m.toLowerCase();
										s = s.toLowerCase();
										employeeEmails.push(m);
										var emps = false;
										var sups = false;
										for (var j=0; j<items.length; j++) {
											item = items[j];
											if (item.email.toLowerCase() == s) {
												$gScope.formVars["_SupervisorsSignature" + i] = item.SignedDate;
												sups = true;
											}
											else if (item.email.toLowerCase() == m) {
												$gScope.formVars["_EmployeesSignature" + i] = item.SignedDate;
												emps = false;
											}
											if (emps && sups) break;
										}										
									}
									_comm.updateListItem2(
										$gScope.spItem,
										{
											"Status": "Await Ethics",
											"FormVars": sjcl.encrypt(btoa($gScope.email), JSON.stringify($gScope.formVars))
										},
										function() {
											gNotify(
											{
												Title : "Form-WAG notification for Ethics ",
												FormType : "Form-WAG",
												NoteType: "Await Ethics",
												EmailTo: "Ethics"
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
				if (!$scope.spItem) {
					var title = "Form WAG - " + $filter('date')(new Date(), 'yyyy-MM-dd');
					_comm.createListItem(
						"FormServiceRecords",
						{
							"Title": title,
							"FormType": "Form-WAG",
							"CreatedByEmail": $scope.email,
							"Status": status,
							"StatusStarted": $filter('date')(new Date(), 'yyyy-MM-dd'),
							"StatusDueDate": $filter('date')(new Date(Date.now() + 5 * 24 * 3600 * 1000), 'yyyy-MM-dd'),	
							"FormVars": sjcl.encrypt(btoa($scope.email), JSON.stringify($scope.formVars))
						},
						function(item) {
							gNotify(
							{
								Title : "Form-WAG notification for: " + status,
								FormType : "Form-WAG",
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
								Title : "Form-WAG notification for: " + status,
								FormType : "Form-WAG",
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
							} else if (status == 'Await Supervisor') {
								if ($gScope.action == 'manager') {
									$gScope.showEditingForm = true;
									$gScope.showEthicsForm = true;
									$gScope.showEmploeeForm = true;
									$gScope.showDesigneeForm = true;
									$gScope.showManagerForm = true;									
									$gScope.enableManagerForm = true;
									for (var i=1; i<16; i++) {
										var m = $gScope.formVars["email" + i];
										var s = $gScope.formVars["managerEmail" + i];
										if (!m || !s) continue;
										m = m.toLowerCase();
										s = s.toLowerCase();
										if (s == $gScope.email.toLowerCase()) {
											validated = true;
											break;
										}
									}	

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
									validated = false;
									for (var i=1; i<16; i++) {
										var m = $gScope.formVars["email" + i];
										var s = $gScope.formVars["managerEmail" + i];
										if (!m || !s) continue;
										m = m.toLowerCase();
										s = s.toLowerCase();
										if (m == $gScope.email.toLowerCase()) {
											validated = true;
											break;
										}
									}									
								}		
							} else if (status == 'Completed') {
								if ($gScope.action == 'view') {
									$gScope.showEditingForm = true;
									$gScope.showEthicsForm = true;
									$gScope.showDesigneeForm = true;
									$gScope.showSignatureForm = true;
									for (var i=1; i<16; i++) {
										var m = $gScope.formVars["email" + i];
										var s = $gScope.formVars["managerEmail" + i];
										if (!m || !s) continue;
										m = m.toLowerCase();
										s = s.toLowerCase();
										if (										
											m == $gScope.email.toLowerCase() ||
											s == $gScope.email.toLowerCase()	
										) {
											validated = true;
											break;
										}
									}								
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
	




