angular.module(
        'Form520ControllerModule',
        [
        ]
    )
    .controller(
        'Form520Controller',
        [
            '$scope',
			'$filter',
			'$routeParams',
            'MenuMainModel',
            'Form520Service',
            'PageHeaderModel',
            function ($scope, $filter, $routeParams, MenuMainModel, Form520Service, PageHeaderModel) {		
				MenuMainModel.setCurrentMenuItemId(4);
				PageHeaderModel.setTitle("REQUEST FOR APPROVAL OF OUTSIDE ACTIVITY");
				$scope.formId = $routeParams.id;	
				$scope.action = $routeParams.code;
				
				$scope.showPermissionError = false;
				$scope.showEditingForm = false;
				$scope.enableEditingForm = false;				
				$scope.showManagerForm = false;
				$scope.enableManagerForm = false;
				$scope.showCommitteeForm = false;
				$scope.enableCommitteeForm = false;
				$scope.showEthicsForm = false;
				$scope.enableEthicsForm = false;				
				$scope.showDesigneeForm = false;
				$scope.enableDesigneeForm = false;
				
				$scope.loadPage = function () {
					PageHeaderModel.setParagraphs([gGetWelcomeMessage($scope.email)]);	
					if ($scope.formId == '0') {
						Form520Service.initForm($scope);
					} else {
						Form520Service.getForm4User($scope);
					}
				}

				$scope.doSave = function($event) {					
					$event.stopPropagation();
					Form520Service.saveFormData($scope);
				}

				$scope.doCertify = function($event) {
					$event.stopPropagation();
					if (					
						($scope.email.toLowerCase() != $scope.formVars.signature.toLowerCase()) ||
						($filter('date')(new Date(), 'MM/dd/yyyy') != $scope.formVars._Date)
					) {
						alert ("Please check your email spelling and the date should today's date in mm/dd/yyyy format.");
						return;
					}					
					$scope.enableEditingForm = false;		
					Form520Service.signForm($scope, "Await Supervisor");
					
				}				
			

				$scope.doSupervisorCertify = function($event) {
					$event.stopPropagation();
					if (					
						$scope.email.toLowerCase() != $scope.formVars.supervisorsignature.toLowerCase()
						||
						$filter('date')(new Date(), 'MM/dd/yyyy') != $scope.formVars._Datevvvvv1
					) {
						alert ("Please check your email spelling and the date should today's date in mm/dd/yyyy format.");
						return;
					}					
					$scope.enableManagerForm = false;				
					Form520Service.signForm($scope,"Await Ethics");
				}				

				$scope.doReviewerCertify = function($event) {
					$event.stopPropagation();
					if (					
						$scope.email.toLowerCase() != $scope.formVars.reviewersignature.toLowerCase()
						||
						$filter('date')(new Date(), 'MM/dd/yyyy') != $scope.formVars._Datevvvvv2
					) {
						alert ("Please check your email spelling and the date should today's date in mm/dd/yyyy format.");
						return;
					}					
					$scope.enableCommitteeForm = false;				
					Form520Service.signForm($scope,"Await Ethics");
				}				

				$scope.doDesigneeCertify = function($event) {
					$event.stopPropagation();
					if (					
						$scope.email.toLowerCase() != $scope.formVars.designeesignature.toLowerCase()
						||
						$filter('date')(new Date(), 'MM/dd/yyyy') != $scope.formVars._Datevvvvv4
					) {
						alert ("Please check your email spelling and the date should today's date in mm/dd/yyyy format.");
						return;
					}					
					$scope.enableDesigneeForm = false;				
					Form520Service.signForm($scope,"Completed");
				}		


				$scope.doEthicsCertify = function($event) {
					$event.stopPropagation();
					if (					
						$scope.email.toLowerCase() != $scope.formVars.ethicssignature.toLowerCase()
						||
						$filter('date')(new Date(), 'MM/dd/yyyy') != $scope.formVars._Datevvvvv3
					) {
						alert ("Please check your email spelling and the date should today's date in mm/dd/yyyy format.");
						return;
					}					
					$scope.enableEthicsForm = false;				
					Form520Service.signForm($scope,"Completed");
				}								
				
				$scope.doPDF = function($event) {
					$event.stopPropagation();
					gShowBusy();
					gFetchPDF(gLibPath + "/520.pdf", function(pdffile) {
						var title = "MyNewForm";
						if ($scope.spItem) title = $scope.spItem.get_item("Title");
						gFillPDF($scope.formVars, title , pdffile);
					});
				}
				
				gWaitReady($scope);
            }
        ]
    );
	

