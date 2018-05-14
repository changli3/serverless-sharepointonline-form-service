angular.module(
        'Form521ControllerModule',
        [
        ]
    )
    .controller(
        'Form521Controller',
        [
            '$scope',
			'$filter',
			'$routeParams',
            'MenuMainModel',
            'Form521Service',
            'PageHeaderModel',
            function ($scope, $filter, $routeParams, MenuMainModel, Form521Service, PageHeaderModel) {		
				MenuMainModel.setCurrentMenuItemId(4);
				PageHeaderModel.setTitle("ANNUAL REPORT OF OUTSIDE ACTIVITY");
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

				
				$scope.loadPage = function () {
					PageHeaderModel.setParagraphs([gGetWelcomeMessage($scope.email)]);	
					if ($scope.formId == '0') {
						Form521Service.initForm($scope);
					} else {
						Form521Service.getForm4User($scope);
					}
				}
				
				$scope.updateCY = function () {
					var str = $scope.formVars.calendarYear;
					if (str.length > 3) {
						$scope.formVars._FirstDigit = str.charAt(2);
						$scope.formVars._SecondDigit = str.charAt(3);
					}
				}

				$scope.doSave = function($event) {					
					$event.stopPropagation();
					Form521Service.saveFormData($scope);
				}

				$scope.doCertify = function($event) {
					$event.stopPropagation();
					if (					
						($scope.email.toLowerCase() != $scope.formVars.signature.toLowerCase()) ||
						($filter('date')(new Date(), 'MM/dd/yyyy') != $scope.formVars._Datelast1)
					) {
						alert ("Please check your email spelling and the date should today's date in mm/dd/yyyy format.");
						return;
					}					
					$scope.enableEditingForm = false;		
					Form521Service.signForm($scope, "Await Supervisor");
					
				}				
			

				$scope.doSupervisorCertify = function($event) {
					$event.stopPropagation();
					if (					
						$scope.email.toLowerCase() != $scope.formVars.supervisorsignature.toLowerCase()
						||
						$filter('date')(new Date(), 'MM/dd/yyyy') != $scope.formVars._Datesiglast
					) {
						alert ("Please check your email spelling and the date should today's date in mm/dd/yyyy format.");
						return;
					}					
					$scope.enableManagerForm = false;				
					Form521Service.signForm($scope,"Await Ethics");
				}				

				$scope.doReviewerCertify = function($event) {
					$event.stopPropagation();
					if (					
						$scope.email.toLowerCase() != $scope.formVars.reviewersignature.toLowerCase()
						||
						$filter('date')(new Date(), 'MM/dd/yyyy') != $scope.formVars._Dateofsig
					) {
						alert ("Please check your email spelling and the date should today's date in mm/dd/yyyy format.");
						return;
					}					
					$scope.enableCommitteeForm = false;				
					Form521Service.signForm($scope,"Await Ethics");
				}				



				$scope.doEthicsCertify = function($event) {
					$event.stopPropagation();
					if (					
						$scope.email.toLowerCase() != $scope.formVars.ethicssignature.toLowerCase()
						||
						$filter('date')(new Date(), 'MM/dd/yyyy') != $scope.formVars._Dateethicssig
					) {
						alert ("Please check your email spelling and the date should today's date in mm/dd/yyyy format.");
						return;
					}					
					$scope.enableEthicsForm = false;				
					Form521Service.signForm($scope,"Completed");
				}								
				
				$scope.doPDF = function($event) {
					$event.stopPropagation();
					gShowBusy();
					gFetchPDF(gLibPath + "/521.pdf", function(pdffile) {
						gFillPDF($scope.formVars, $scope.spItem.get_item("Title"), pdffile);
					});
				}
				
				gWaitReady($scope);
            }
        ]
    );
	

