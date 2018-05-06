
angular.module(
        'LabelDirectiveModule',
        [
        ]
    )
    .directive(
    'myFormLabel',
    function factory() {
        return {
            restrict: 'E',
			replace: true,
			scope:   true,
            template: '<div class="row"><label style="font-weight:120">{{title}}</label></div>',
            link: function (scope, element, attrs) {
				jQuery.each(attrs, function(kn, tv) {
					scope[kn] = tv;
				});
			}
        };
    }
);
