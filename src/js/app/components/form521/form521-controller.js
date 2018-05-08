angular.module(
        'Form521ControllerModule',
        [
			'angularFileUpload'
        ]
    )
    .controller(
        'Form521Controller',
        [
            '$scope',
			'$routeParams',
			'FileUploader',
            'MenuMainModel',
            'Form521Service',
            'PageHeaderModel',
            function ($scope, $routeParams, FileUploader, MenuMainModel, Form521Service, PageHeaderModel) {		
                var uploader = $scope.uploader = new FileUploader({
					url: 'upload.php'
				});
				

				// FILTERS

				uploader.filters.push({
					name: 'customFilter',
					fn: function(item /*{File|FileLikeObject}*/, options) {
						return this.queue.length < 10;
					}
				});

				
                MenuMainModel.setCurrentMenuItemId(4);
				PageHeaderModel.setTitle("ANNUAL REPORT OF OUTSIDE ACTIVITY  (DUE ANNUALLY ON FEBRUARY 28)");
				PageHeaderModel.setParagraphs([gGetWelcomeMessage()]);			

				$scope.formId = $routeParams.id;	
				$scope.formStatus = $routeParams.status;	

				if ($scope.formId == 0) {
					Form521Service.initForm($scope);
				} else {
					Form521Service.getForm4User($scope, $scope.formId, $scope.formStatus);
				}

				$scope.doSave = function($event) {					
					$event.stopPropagation();
					Form521Service.putData(1)
					.then(function (data) {
							console.log(JSON.stringify(data,null,"  "));
						});
					Form521Service.sampleSerice(1)
					.then(function (data){
							console.log(JSON.stringify(data,null,"  "));
						});
				}

				$scope.doCertify = function($event) {
					$event.stopPropagation();
					$scope.formStatus = 1;
				}				

				$scope.doRevoke = function($event) {
					$event.stopPropagation();
					$scope.formStatus = 0;
				}					

				$scope.doSupervisorCertify = function($event) {
					$event.stopPropagation();
					$scope.formStatus = 3;
				}				

				$scope.doSupervisorRevoke = function($event) {
					$event.stopPropagation();
					$scope.formStatus = 2;
				}	
				
				$scope.doReviewerRevoke = function($event) {
					$event.stopPropagation();
					$scope.formStatus = 4;
				}	

				$scope.doReviewerCertify = function($event) {
					$event.stopPropagation();
					$scope.formStatus = 5;
				}				
				$scope.doEthicsRevoke = function($event) {
					$event.stopPropagation();
					$scope.formStatus = 6;
				}	

				$scope.doDesigneeCertify = function($event) {
					$event.stopPropagation();
					$scope.formStatus = 9;
				}		

				$scope.doDesigneeRevoke = function($event) {
					$event.stopPropagation();
					$scope.formStatus = 8;
				}	

				$scope.doEthicsCertify = function($event) {
					$event.stopPropagation();
					$scope.formStatus = 7;
				}								
				
				$scope.doPDF = function($event) {
					console.log("doPDF");
					$event.stopPropagation();
					gFetchPDF(gLibPath + "/521.pdf", function(pdffile) {
						gFillPDF($scope.formVars, "myHHS521", pdffile);
					});
				}
				
				
				$scope.doUploadAttaches = function ($event) {
					$.each(uploader.queue, function(idx){
						$scope.filesAttached.push(uploader.queue[idx].file);
					});
					uploader.clearQueue();
					
				}
            }
        ]
    );
	

