var gForms = ['', 'Form HHS-520', 'Form HHS-521', 'Form HHS-348', 'WAG Form'];
var gLibPath = 'js/lib/forms';

angular.module(
        'NewFormControllerModule',
        [
        ]
    )
    .controller(
        'NewFormController',
        [
            '$scope',
			'$routeParams',
			'$filter',
            'MenuMainModel',
            'NewFormService',
            'PageHeaderModel',
            function ($scope, $routeParams, $filter, MenuMainModel, NewFormService, PageHeaderModel) {		
                
                MenuMainModel.setCurrentMenuItemId(4);
				var id = $routeParams.id;
				$scope.new_form = gForms[id];				
				if (id > 4 || id<0) return;
				
				$scope.showSuccess = false;
				$scope.showError = false;
				
				
				
				PageHeaderModel.setTitle($scope.new_form);
				PageHeaderModel.setParagraphs([gGetWelcomeMessage()]);			
				
				$scope.form520 = angular.copy(gForm520);
				
				$scope.formStatus = 0;
				$scope.form520._Datefiled = $filter('date')(new Date(), "MM/dd/yyyy");
				$scope.form520.signature = "";
				$scope.form520._Date = "";

				$scope.doSubmit520 = function($event, formV) {
					
					console.log(formV);
					return;
					$event.stopPropagation();
					NewFormService.send({id:1}, function(data){
						console.log(JSON.stringify(data,null,"  "));
					});

					$scope.showSuccess = true;
				}

				$scope.doCertify520 = function($event) {
					$event.stopPropagation();
					NewFormService.send({id:1}, function(data){
						console.log(JSON.stringify(data,null,"  "));
						$scope.formStatus = 1;
						//$scope.$apply();
					});
				}				

				$scope.doRevoke520 = function($event) {
					$event.stopPropagation();
					NewFormService.send({id:1}, function(data){
						console.log(JSON.stringify(data,null,"  "));
						$scope.formStatus = 0;
						//$scope.$apply();
					});
				}					
				
				$scope.doPDF520 = function($event) {
					console.log("doPDF520");
					$event.stopPropagation();
					gFetchPDF(gLibPath + "/520.pdf", function(pdffile) {
						gFillPDF($scope.form520, "myHHS520", pdffile);
					});
				}
				
				$scope.showForm = function (formName, fstatus) {
					return $scope.new_form == formName && fstatus <=$scope.formStatus;
				}
				

            }
        ]
    );
	
var gForm520 = {
	signature: "",
	_initialreq: "",
	_revreq: "",
	_renewal: "",
	_Datefiled: "",
	_empname: "",
	_agency: "",
	_subcomp: "",
	_titleofpos: "",
	_grade: "",
	_federal: "",
	_pas: "",
	_noncar: "",
	_car: "",
	_schc: "",
	_comm: "",
	_gs: "",
	_title: "",
	_other: "",
	_othertext: "",
	_public: "",
	_confid: "",
	_none: "",
	_street: "",
	_city: "",
	_offstate: "",
	_ZipCode: "",
	_OfficeTelephoneNumber: "",
	_OfficeFaxNumber: "",
	_OfficeCellNumber: "",
	_email: "",
	_namesuper: "",
	_titleofsuper: "",
	_superTelephoneNumber: "",
	_SuperFaxNumber: "",
	_SuperCellNumber: "",
	_superemail: "",
	_Agencyuse: "",
	_empnamevvvvv1: "",
	_professional: "",
	_teaching: "",
	_board: "",
	_expert: "",
	_othervvvvv1: "",
	_describe: "",
	_selfemployed: "",
	_self__employed: "",
	_subjectmatter: "",
	_text: "",
	_explain: "",
	_outsideentity: "",
	_contactperson: "",
	_titlevvvvv1: "",
	_outsidestreet: "",
	_cityvvvvv1: "",
	_state: "",
	_ZipCodevvvvv1: "",
	_empnamevvvvv2: "",
	_ContactTelephoneNumber: "",
	_contacFaxNumber: "",
	_ContactCellNumber: "",
	_Email: "",
	_location: "",
	_travelyes: "",
	_atownexp: "",
	_inkind: "",
	_estamt: "",
	_travelno: "",
	_describevvvvv1: "",
	_periodcoveredfrom: "",
	_periodcoveredto: "",
	_hours: "",
	_days: "",
	_weeks: "",
	_yesoutside: "",
	_nooutside: "",
	_estimatenumber: "",
	_yescomp: "",
	_nocomp: "",
	_fee: "",
	_honor: "",
	_retainer: "",
	_salary: "",
	_advance: "",
	_royalty: "",
	_stock: "",
	_stockopt: "",
	_nontravel: "",
	_othervvvvv2: "",
	_otherspecify: "",
	_nontravelspec: "",
	_empnamevvvvv3: "",
	_compamt: "",
	_Payor: "",
	_fundyes: "",
	_fundno: "",
	_fundsource: "",
	_grantyes: "",
	_grantno: "",
	_granteecontractyes: "",
	_empnamevvvvv4: "",
	_additionalspace: "",
	_empnamevvvvv5: "",
	_position: "",
	_nature: "",
	_relation: "",
	_effect: "",
	_assignments: "",
	_Date: "",
	_empnamevvvvv6: "",
	_superstatement: "",
	_approve: "",
	_disapprove: "",
	_Datevvvvv1: "",
	_empnamevvvvv7: "",
	_namereviewer: "",
	_titlereviewer: "",
	_ReviewerTelephoneNumber: "",
	_ReviewerFaxNumber: "",
	_ReviewerCellNumber: "",
	_revieweremail: "",
	_organization: "",
	_committee: "",
	_concur: "",
	_nonconcur: "",
	_Datevvvvv2: "",
	_comments: "",
	_empnamevvvvv8: "",
	_nameagencyethics: "",
	_titleagencyethics: "",
	_AgencyEthicsTelephoneNumber: "",
	_AgencyEthicsFaxNumber: "",
	_AgencyEthicsCellNumber: "",
	_AgencyEthicsemail: "",
	_organizationvvvvv1: "",
	_requestapproved: "",
	_conditions: "",
	_requestdenied: "",
	_othervvvvv3: "",
	_Datevvvvv3: "",
	_commentsvvvvv1: "",
	_empnamevvvvv9: "",
	_nameagencydesignee: "",
	_titleagencydesignee: "",
	_DesigneeTelephone: "",
	_DesigneeFax: "",
	_DesigneeCell: "",
	_DesigneeEmail: "",
	_organizationvvvvv2: "",
	_approved: "",
	_conditionsvvvvv1: "",
	_denied: "",
	_Datevvvvv4: "",
	_specialconditions: "",
	_commentsvvvvv2: "",
	_empnamevvvvv10: "",
	_empnamevvvvv11: "",
	_empnamevvvvv12: "",
	_empnamevvvvv13: "",
	_empnamevvvvv14: "",
	_addspace: "",
	_empnamevvvvv15: "",
	_addspacecont: "",
	_sourcecurrenta: "",
	_activitycurrent: "",
	_currentamt: "",
	_currentdate: "",
	_sourcecurrentb: "",
	_activitycurrentb: "",
	_currentamtb: "",
	_currentdateb: "",
	_sourceonea: "",
	_activitytwoa: "",
	_amtonea: "",
	_Dateonea: "",
	_sourceoneb: "",
	_activityoneb: "",
	_amtoneb: "",
	_Dateoneb: "",
	_sourcetwoa: "",
	_activitytwoavvvvv1: "",
	_amttwoa: "",
	_Datetwoa: "",
	_sourcetwob: "",
	_activitytwob: "",
	_amttwob: "",
	_Datetwob: "",
	_sourcethreea: "",
	_activitythreea: "",
	_amtthreea: "",
	_Datethreea: "",
	_sourcethreeb: "",
	_activitythreeb: "",
	_amtthreeb: "",
	_Datethreeb: "",
	_sourcefoura: "",
	_activityfoua: "",
	_amtfoura: "",
	_Datefoura: "",
	_sourcefourb: "",
	_activityfourb: "",
	_amtfourb: "",
	_Datefourb: "",
	_sourcefivea: "",
	_activityfivea: "",
	_amtfivea: "",
	_Datefivea: "",
	_sourcefiveb: "",
	_activityfiveb: "",
	_amtfiveb: "",
	_Datefiveb: "",
	_sourcesixa: "",
	_activitysixa: "",
	_amtsixa: "",
	_Datesixa: "",
	_sourcesixb: "",
	_activitysixb: "",
	_amtsixb: "",
	_Datesixb: "",
	_attachone: "",
	_attachtwo: "",
	_attachfour: "",
	_attachthree: "",
	_attachfive: "",
	_attachsix: "",
	_attachseven: "",
	_attacheight: "",
	_attachnine: "",
	_attachten: ""
};
