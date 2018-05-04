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
            'MenuMainModel',
            'NewFormService',
            'PageHeaderModel',
            function ($scope, $routeParams, MenuMainModel, NewFormService, PageHeaderModel) {		
                
                MenuMainModel.setCurrentMenuItemId(4);
				var id = $routeParams.id;
				$scope.new_form = gForms[id];				
				if (id > 4 || id<0) return;
				
				$scope.showSuccess = false;
				$scope.showError = false;
				
				PageHeaderModel.setTitle($scope.new_form);
				PageHeaderModel.setParagraphs([gGetWelcomeMessage()]);			
				
				$scope.form520 = angular.copy(gForm520);

				$scope.doSubmit520 = function($event) {
					$event.stopPropagation();
					NewFormService.send({id:1}, function(data){
						console.log(JSON.stringify(data,null,"  "));
					});

					$scope.showSuccess = true;
				}
				
				$scope.doPDF520 = function($event) {
					$event.stopPropagation();
					gFetchPDF(gLibPath + "/520.pdf", function(pdffile) {
						gFillPDF($scope.form520, "myHHS520", pdffile);
					});
				}
            }
        ]
    );
	
var gForm520 = {
    _initialreq: ""
   ,_revreq: ""
   ,_renewal: ""
   ,_Datefiled: ""
   ,_empname: ""
   ,_agency: ""
   ,_subcomp: ""
   ,_titleofpos: ""
   ,_grade: ""
   ,_federal: ""
   ,_pas: ""
   ,_noncar: ""
   ,_car: ""
   ,_schc: ""
   ,_comm: ""
   ,_gs: ""
   ,_title: ""
   ,_other: ""
   ,_othertext: ""
   ,_public: ""
   ,_confid: ""
   ,_none: ""
   ,_street: ""
   ,_city: ""
   ,_offstate: ""
   ,_ZipCode: ""
   ,_OfficeTelephoneNumber: ""
   ,_OfficeFaxNumber: ""
   ,_OfficeCellNumber: ""
   ,_email: ""
   ,_namesuper: ""
   ,_titleofsuper: ""
   ,_superTelephoneNumber: ""
   ,_SuperFaxNumber: ""
   ,_SuperCellNumber: ""
   ,_superemail: ""
   ,_Agencyuse: ""
   ,_professional: ""
   ,_teaching: ""
   ,_board: ""
   ,_expert: ""
   ,_describe: ""
   ,_selfemployed: ""
   ,_self__employed: ""
   ,_subjectmatter: ""
   ,_text: ""
   ,_explain: ""
   ,_outsideentity: ""
   ,_contactperson: ""
   ,_outsidestreet: ""
   ,_state: ""
   ,_ContactTelephoneNumber: ""
   ,_contacFaxNumber: ""
   ,_ContactCellNumber: ""
   ,_Email: ""
   ,_location: ""
   ,_travelyes: ""
   ,_atownexp: ""
   ,_inkind: ""
   ,_estamt: ""
   ,_travelno: ""
   ,_periodcoveredfrom: ""
   ,_periodcoveredto: ""
   ,_hours: ""
   ,_days: ""
   ,_weeks: ""
   ,_yesoutside: ""
   ,_nooutside: ""
   ,_estimatenumber: ""
   ,_yescomp: ""
   ,_nocomp: ""
   ,_fee: ""
   ,_honor: ""
   ,_retainer: ""
   ,_salary: ""
   ,_advance: ""
   ,_royalty: ""
   ,_stock: ""
   ,_stockopt: ""
   ,_nontravel: ""
   ,_otherspecify: ""
   ,_nontravelspec: ""
   ,_compamt: ""
   ,_Payor: ""
   ,_fundyes: ""
   ,_fundno: ""
   ,_fundsource: ""
   ,_grantyes: ""
   ,_grantno: ""
   ,_granteecontractyes: ""
   ,_additionalspace: ""
   ,_position: ""
   ,_nature: ""
   ,_relation: ""
   ,_effect: ""
   ,_assignments: ""
   ,_Date: ""
   ,_superstatement: ""
   ,_approve: ""
   ,_disapprove: ""
   ,_namereviewer: ""
   ,_titlereviewer: ""
   ,_ReviewerTelephoneNumber: ""
   ,_ReviewerFaxNumber: ""
   ,_ReviewerCellNumber: ""
   ,_revieweremail: ""
   ,_organization: ""
   ,_committee: ""
   ,_concur: ""
   ,_nonconcur: ""
   ,_comments: ""
   ,_nameagencyethics: ""
   ,_titleagencyethics: ""
   ,_AgencyEthicsTelephoneNumber: ""
   ,_AgencyEthicsFaxNumber: ""
   ,_AgencyEthicsCellNumber: ""
   ,_AgencyEthicsemail: ""
   ,_requestapproved: ""
   ,_conditions: ""
   ,_requestdenied: ""
   ,_nameagencydesignee: ""
   ,_titleagencydesignee: ""
   ,_DesigneeTelephone: ""
   ,_DesigneeFax: ""
   ,_DesigneeCell: ""
   ,_DesigneeEmail: ""
   ,_approved: ""
   ,_denied: ""
   ,_specialconditions: ""
   ,_addspace: ""
   ,_addspacecont: ""
   ,_sourcecurrenta: ""
   ,_activitycurrent: ""
   ,_currentamt: ""
   ,_currentdate: ""
   ,_sourcecurrentb: ""
   ,_activitycurrentb: ""
   ,_currentamtb: ""
   ,_currentdateb: ""
   ,_sourceonea: ""
   ,_activitytwoa: ""
   ,_amtonea: ""
   ,_Dateonea: ""
   ,_sourceoneb: ""
   ,_activityoneb: ""
   ,_amtoneb: ""
   ,_Dateoneb: ""
   ,_sourcetwoa: ""
   ,_amttwoa: ""
   ,_Datetwoa: ""
   ,_sourcetwob: ""
   ,_activitytwob: ""
   ,_amttwob: ""
   ,_Datetwob: ""
   ,_sourcethreea: ""
   ,_activitythreea: ""
   ,_amtthreea: ""
   ,_Datethreea: ""
   ,_sourcethreeb: ""
   ,_activitythreeb: ""
   ,_amtthreeb: ""
   ,_Datethreeb: ""
   ,_sourcefoura: ""
   ,_activityfoua: ""
   ,_amtfoura: ""
   ,_Datefoura: ""
   ,_sourcefourb: ""
   ,_activityfourb: ""
   ,_amtfourb: ""
   ,_Datefourb: ""
   ,_sourcefivea: ""
   ,_activityfivea: ""
   ,_amtfivea: ""
   ,_Datefivea: ""
   ,_sourcefiveb: ""
   ,_activityfiveb: ""
   ,_amtfiveb: ""
   ,_Datefiveb: ""
   ,_sourcesixa: ""
   ,_activitysixa: ""
   ,_amtsixa: ""
   ,_Datesixa: ""
   ,_sourcesixb: ""
   ,_activitysixb: ""
   ,_amtsixb: ""
   ,_Datesixb: ""
   ,_attachone: ""
   ,_attachtwo: ""
   ,_attachfour: ""
   ,_attachthree: ""
   ,_attachfive: ""
   ,_attachsix: ""
   ,_attachseven: ""
   ,_attacheight: ""
   ,_attachnine: ""
   ,_attachten: ""
};
