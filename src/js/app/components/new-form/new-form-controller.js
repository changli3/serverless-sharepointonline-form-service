
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
				if (id==1) $scope.new_form = 'Form 520';
            }
        ]
    );
	