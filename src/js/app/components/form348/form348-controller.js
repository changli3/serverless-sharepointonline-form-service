angular.module(
        'Form348ControllerModule',
        [
        ]
    )
    .controller(
        'Form348Controller',
        [
            '$scope',
			'$filter',
			'$routeParams',
            'MenuMainModel',
            'Form348Service',
            'PageHeaderModel',
            function ($scope, $filter, $routeParams, MenuMainModel, Form348Service, PageHeaderModel) {		
				MenuMainModel.setCurrentMenuItemId(4);
				PageHeaderModel.setTitle("REQUEST ACCEPT TRAVEL FOR PAYMENT FROM A NON FEDERAL SOURCE");
				$scope.formId = $routeParams.id;	
				$scope.action = $routeParams.code;
				
				$scope.showPermissionError = false;
				$scope.showEditingForm = false;
				$scope.enableEditingForm = false;	e;
				$scope.showEthicsForm = false;
				$scope.enableEthicsForm = false;				

				
				$scope.loadPage = function () {
					PageHeaderModel.setParagraphs([gGetWelcomeMessage($scope.email)]);	
					if ($scope.formId == '0') {
						Form348Service.initForm($scope);
					} else {
						Form348Service.getForm4User($scope);
					}
				}

				$scope.doSave = function($event) {					
					$event.stopPropagation();
					Form348Service.saveFormData($scope);
				}

				$scope.doCertify = function($event) {
					$event.stopPropagation();
					if (					
						($scope.email.toLowerCase() != $scope.formVars.signature.toLowerCase()) ||
						($filter('date')(new Date(), 'MM/dd/yyyy') != $scope.formVars._travesigdate)
					) {
						alert ("Please check your email spelling and the date should today's date in mm/dd/yyyy format.");
						return;
					}					
					$scope.enableEditingForm = false;		
					Form348Service.signForm($scope, "Await Ethics");
					
				}				
			


				$scope.doEthicsCertify = function($event) {
					$event.stopPropagation();
					if (					
						$scope.email.toLowerCase() != $scope.formVars.ethicssignature.toLowerCase()
						||
						$filter('date')(new Date(), 'MM/dd/yyyy') != $scope.formVars._daterecommend
					) {
						alert ("Please check your email spelling and the date should today's date in mm/dd/yyyy format.");
						return;
					}					
					$scope.enableEthicsForm = false;				
					Form348Service.signForm($scope,"Completed");
				}								
				
				$scope.doPDF = function($event) {
					$event.stopPropagation();
					gShowBusy();
					gFetchPDF(gLibPath + "/348.pdf", function(pdffile) {
						gFillPDF($scope.formVars, $scope.spItem.get_item("Title"), pdffile);
					});
				}
				
				gWaitReady($scope);
            }
        ]
    );
	

