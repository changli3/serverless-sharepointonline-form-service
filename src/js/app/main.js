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
            // 'AppFiltersModule',
            'AppLibrariesModule'
        ]
    ).config(
        [
            '$routeProvider',
            function ($routeProvider) {
                $routeProvider.when(
                    '/in-progress',
                    {
                        templateUrl: 'js/app/components/in-progress/main-view.html',
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
                    '/new-form/:id',
                    {
                        templateUrl: 'js/app/components/new-form/main-view.html',
                        controller: 'NewFormController'
                    }
                );
				//.otherwise(
                //    {
                //        redirectTo: '/in-progress'
                //    }
                //);
            }
        ]
);

function cutText(oText, toLen) {
	if (oText.length > toLen && toLen > 4) {
		return oText.substring(0,toLen-3) + '...';
	}
	return oText;
}

function route2(url) {
	var loc = document.location.href;
	var i = loc.indexOf('#');
	if (i > 0) {
		loc = loc.substring(0, i);
	}
	document.location = loc + "#" + url;
}

function showCreateNewFormDialog() {
	$( "#newFormDialog" ).dialog({
		modal: true,
		title: "Select Form",
		resizable: false,
		buttons: {
			"Cancel": function() {
				$(this).dialog("close");
			},
			"Next >>": function() {
				route2("/new-form/" + $("#newFormSelection").val());
				$(this).dialog("close");
			}
		}
	});
}