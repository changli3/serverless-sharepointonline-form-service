var gLibPath = 'js/lib/forms';

var gFormTableOption = {
	"paging":   false,
	"ordering": false,
	"language": {
			"search": 'Quick Filter:',
			"searchPlaceholder": "search for ...",
			"emptyTable": "No such forms found in the database.",
			"info": "Total _TOTAL_ forms",
			"infoEmpty": "",
			"infoFiltered": "(filtered from _MAX_ records)"								
	}
};


angular.module(
		'MainApp',
		[
			'AppComponentsModule',
			'AppDirectivesModule',
			'AppLibrariesModule'
		]
	).config(
		[
			'$routeProvider',
			function ($routeProvider) {
				$routeProvider.when(
					'/in-progress',
					{
						templateUrl: 'js/app/components/in-progress/main-view.html?',
						controller: 'HomeController'
					}
				).when(
					'/my-action',
					{
						templateUrl: 'js/app/components/my-action/main-view.html',
						controller: 'MyActionController'
					}
				).when(
					'/submitted',
					{
						templateUrl: 'js/app/components/submitted/main-view.html',
						controller: 'SubmittedController'
					}
				).when(
					'/archive',
					{
						templateUrl: 'js/app/components/archive/main-view.html',
						controller: 'ArchiveController'
					}
				).when(
					'/form520/:code/:id',
					{
						templateUrl: 'js/app/components/form520/form520-view.html',
						controller: 'Form520Controller'
					}
				).when(
					'/form521/:code/:id',
					{
						templateUrl: 'js/app/components/form521/form521-view.html',
						controller: 'Form521Controller'
					}
				).when(
					'/form348/:code/:id',
					{
						templateUrl: 'js/app/components/form348/form348-view.html',
						controller: 'Form348Controller'
					}
				).when(
					'/formwag/:code/:id',
					{
						templateUrl: 'js/app/components/formwag/formwag-view.html',
						controller: 'FormWAGController'
					}
				)
				.otherwise(
					{
						redirectTo: '/in-progress'
					}
				);
			}
		]
);	

function gCutText(oText, toLen) {
	if (oText.length > toLen && toLen > 4) {
		return oText.substring(0,toLen-3) + '...';
	}
	return oText;
}

function gRoute2(url) {
	var loc = document.location.href;
	var i = loc.indexOf('#');
	if (i > 0) {
		loc = loc.substring(0, i);
	}
	document.location = loc + "#" + url;
}

function gShowCreateNewFormDialog(btx) {
	$( "#newFormDialog" ).dialog({
		modal: true,
		title: "Select a Form",
		resizable: false,
		buttons: [
			{
				text : 	"Cancel",
				click : function() {
							$(this).dialog("close");
						}
			},
			{
				text : 	btx,
				click : function() {
							gRoute2($("#newFormSelection").val() + '/edit/0');
							$(this).dialog("close");
						}
			}
		],
		width: "450"
	});
}

function gGetUserName() {
	return "jason.cai@hhs.gov";
}

function gGetWelcomeMessage(m) {
	return "Welcome - " + (m ? m : gGetUserName());
}


function gFetchPDF(url, onload) {
	var xhr = new XMLHttpRequest();
	xhr.open('GET', url, true);
	xhr.responseType = 'arraybuffer';

	xhr.onload = function() {
		if (this.status == 200) {
			onload(this.response);
		} else {
			console.log('Failed to load URL (code: ' + this.status + ')');
		}
	};
	xhr.send();
}

function gFillPDF(fmObj, pdfName, buf) {
	var fields = {};
	jQuery.each(fmObj, function(kn, tv) {
		var key = kn.substring(1).replace('__','-');
		fields[key] = [fmObj[kn]];
	});
	var filled_pdf;
	try {
		filled_pdf = pdfform(minipdf_js).transform(buf, fields);
		var blob = new Blob([filled_pdf], {type: 'application/pdf'});				     
		 saveAs(blob, pdfName + '.pdf');
	   // var fileURL = URL.createObjectURL(blob);
	   // window.open(fileURL, pdfName);
	} catch (e) {
		console.log(e);
	}
	gHideBusy();
}


function communicatorReady() {	
   _communicatorFlag = true;
}

/** Talking points to communicator **/
function waitForCommunicator(defered, param) {
    if(!_communicatorFlag) {		
        setTimeout(waitForCommunicator.bind(null, defered, param), 1500); 
		return;
    } 
	var toWait = true;
	try {
		if(document.getElementById("communicator").contentWindow.getListItemByMe) toWait = false;
	} catch (e) {}	
    if(toWait) {		
        setTimeout(waitForCommunicator.bind(null, defered, param), 1500); 
		return;
    } 
	defered(param);
	$("#AngularApp").show();
}

String.prototype.format = function () {
	var args = [].slice.call(arguments);
	return this.replace(/(\{\d+\})/g, function (a){
		return args[+(a.substr(1,a.length-2))||0];
	});
};

String.format = function() {
	var s = arguments[0]
	var args = [].slice.call(arguments, 1);
	return s.replace(/(\{\d+\})/g, function (a){
		return args[+(a.substr(1,a.length-2))||0];
	});
};


var gTableFields = [
"Id",
"UniqueId",
"Title",
"Status",
"StatusDueDate",
"StatusStarted",
"FormType",
"ManagerEmail",
"CreatedByEmail",
"FormVars",
"Created", 
"Modified"
];

window.$gScope;	

var gRoleFields = [
"Id",
"email",
"role",
"FormType"
];

var gWagFields = [
"Id",
"email",
"Title",
"SigType",
"Status",
"StartingDate",
"EndingDate",
"Signed",
"SignedDate",
"oFormCreatedByEmail",
"oFormManagerEmail"
];

var gNotificationsFields = [
	"Id",
	"Title",
	"FormType",
	"NoteType",
	"EmailTo",
	"EmailCc"
];

function gWaitReady($scope) {
	gShowBusy();
	waitForCommunicator(_gWaitReady, $scope);

}
function _gWaitReady($scope) {
	var _comm = document.getElementById("communicator").contentWindow;
	$scope.user = _comm.getCurrentUser();
	$scope.email = $scope.user.get_email();
	if (!$scope.email || $scope.email=="") {
		$scope.email = $scope.user.get_loginName();
		$scope.email = $scope.email.substring($scope.email.lastIndexOf('|')+1);
	}	
	$scope.loadPage();	
	gHideBusy();
}


function gShowBusy() {	
/*
	$("#AngularApp").LoadingOverlay("show", {
		background  : "rgba(150, 150, 150, 0.5)"
	});
*/	$.LoadingOverlay("show");
}

function gHideBusy() {
//	$("#AngularApp").LoadingOverlay("hide", true);
	$.LoadingOverlay("hide");
}