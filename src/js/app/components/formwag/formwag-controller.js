angular.module(
        'FormWAGControllerModule',
        [
        ]
    )
    .controller(
        'FormWAGController',
        [
            '$scope',
			'$filter',
			'$routeParams',
            'MenuMainModel',
            'FormWAGService',
            'PageHeaderModel',
            function ($scope, $filter, $routeParams, MenuMainModel, FormWAGService, PageHeaderModel) {		
				MenuMainModel.setCurrentMenuItemId(4);
				PageHeaderModel.setTitle("Request to Accept the Widely Attended Gathering (WAG) Exception");
				$scope.formId = $routeParams.id;	
				$scope.action = $routeParams.code;
				
				$scope.showPermissionError = false;
				$scope.showEditingForm = false;
				$scope.enableEditingForm = false;				
				$scope.showManagerForm = false;
				$scope.enableManagerForm = false;
				$scope.showEmploeeForm = false;
				$scope.enableEmploeeForm = false;
				$scope.showEthicsForm = false;
				$scope.enableEthicsForm = false;				
				$scope.showDesigneeForm = false;
				$scope.enableDesigneeForm = false;
				$scope.showSignatureForm = false;
				
				$scope.loadPage = function () {
					PageHeaderModel.setParagraphs([gGetWelcomeMessage($scope.email)]);	
					if ($scope.formId == '0') {
						FormWAGService.initForm($scope);
					} else {
						FormWAGService.getForm4User($scope);
					}
				}

				$scope.doSave = function($event) {					
					$event.stopPropagation();
					FormWAGService.saveFormData($scope);
				}

				$scope.doCertify = function($event) {
					$event.stopPropagation();				
					$scope.enableEditingForm = false;		
					FormWAGService.signForm($scope, "Await Ethics");
					
				}				

				$scope.doEthicsCertify = function($event) {
					$event.stopPropagation();
					if (					
						$scope.email.toLowerCase() != $scope.formVars.ethicssignature.toLowerCase()
						||
						$filter('date')(new Date(), 'MM/dd/yyyy') != $scope.formVars._EthicsDate
					) {
						alert ("Please check your email spelling and the date should today's date in mm/dd/yyyy format.");
						return;
					}					
					$scope.enableEthicsForm = false;				
					FormWAGService.signForm($scope,"Await Designee");
				}					

				$scope.doDesigneeCertify = function($event) {
					$event.stopPropagation();
					if (					
						$scope.email.toLowerCase() != $scope.formVars.designeesignature.toLowerCase()
						||
						$filter('date')(new Date(), 'MM/dd/yyyy') != $scope.formVars._DeputyDate
					) {
						alert ("Please check your email spelling and the date should today's date in mm/dd/yyyy format.");
						return;
					}
					var employeeEmails = [];
					var supervisorEmails = [];					
					$scope.enableDesigneeForm = false;	
					for (var i=1; i<16; i++) {
						var m = $scope.formVars["email" + i];
						var s = $scope.formVars["managerEmail" + i];
						if (!m || !s) continue;
						m = m.toLowerCase();
						s = s.toLowerCase();
						if (employeeEmails.indexOf(m) > -1) continue;
						employeeEmails.push([m,s]);
						if (supervisorEmails.indexOf(s) > -1) continue;
						supervisorEmails.push(s);
					}
					if (employeeEmails.length == 0) {
						alert("No attendee is found or they are worngly entered.");
						return;
					}
					FormWAGService.signDesigneeForm($scope,"Await Employee", employeeEmails, employeeEmails);
				}		
				
				$scope.doEmployeeCertify = function($event) {
					$event.stopPropagation();
					if (					
						$scope.email.toLowerCase() != $scope.formVars.employeesignature.toLowerCase()
						||
						$filter('date')(new Date(), 'MM/dd/yyyy') != $scope.formVars.employeesignDate
					) {
						alert ("Please check your email spelling and the date should today's date in mm/dd/yyyy format.");
						return;
					}					

					for (var i=1; i<16; i++) {
						var m = $scope.formVars["email" + i];
						var s = $scope.formVars["managerEmail" + i];
						if (!m || !s) continue;
						if (m != $scope.email.toLowerCase()) continue;						
						$scope.enableEmployeeForm = false;				
						FormWAGService.signEmployeeForm($scope,"Await Employee", m, s);
						return;
					}
					alert ("Please check your email spelling, we do not find you in the WAG form.");
				}	
				
				$scope.doSupervisorCertify = function($event) {
					$event.stopPropagation();
					if (					
						$scope.email.toLowerCase() != $scope.formVars.managersignature.toLowerCase()
						||
						$filter('date')(new Date(), 'MM/dd/yyyy') != $scope.formVars.managersignDate
					) {
						alert ("Please check your email spelling and the date should today's date in mm/dd/yyyy format.");
						return;
					}					
					$scope.enableManagerForm = false;				

					FormWAGService.signSupervisorForm($scope,"Await Employee");
				}				
		


				$scope.doPDF = function($event) {
					$event.stopPropagation();
					gShowBusy();
					gFetchPDF(gLibPath + "/WAG.pdf", function(pdffile) {
						var title = "MyNewForm";
						if ($scope.spItem) title = $scope.spItem.get_item("Title");
						gFillPDF($scope.formVars, title , pdffile);
					});
				}
				
				gWaitReady($scope);
            }
        ]
    );