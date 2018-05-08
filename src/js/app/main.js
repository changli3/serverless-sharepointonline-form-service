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
					'/form520/:id/:status',
					{
						templateUrl: 'js/app/components/form520/form520-view.html',
						controller: 'Form520Controller'
					}
				).when(
					'/form521/:id/:status',
					{
						templateUrl: 'js/app/components/form521/form521-view.html',
						controller: 'Form521Controller'
					}
				).when(
					'/form348/:id/:status',
					{
						templateUrl: 'js/app/components/form348/form348-view.html',
						controller: 'Form348Controller'
					}
				).when(
					'/formwag/:id/:status',
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
							gRoute2($("#newFormSelection").val() + '/0/0');
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

function gGetWelcomeMessage() {
	return "Welcome - " + gGetUserName();
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
	} catch (e) {
		console.log(e);
	}

}

/** Sample service here **/

gSampleService = function(id,defered) {
	$.get('https://jsonplaceholder.typicode.com/comments',
		function(data) {
			console.log (id + ' here');
			defered.resolve(data);
		}
	);
}

/** Talking points to communicator **/

function waitForMe() {
	return _communicatorFlag;
}

function waitFor(condition, callback) {
    if(!condition()) {
        setTimeout(waitFor.bind(null, condition, callback), 500); 
    } else {
        callback();
    }
}

function showApplication (){
   $("#AngularApp").show();
}

$(document).ready(function() {
	waitFor(waitForMe, showApplication);
});