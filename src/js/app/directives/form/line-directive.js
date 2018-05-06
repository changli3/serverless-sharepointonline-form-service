
angular.module(
        'LineDirectiveModule',
        [
        ]
    )
    .directive(
    'myLine',
    function factory() {
        return {
            restrict: 'E',
			replace: true,
			scope:   true,
            template: '<div class="row col-md-12" style="height:20px"/>',
            link: function (scope, element, attrs) {
				jQuery.each(attrs, function(kn, tv) {
					scope[kn] = tv;
				});
			}
        };
    }
);
