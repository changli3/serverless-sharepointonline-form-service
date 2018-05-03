
angular.module(
        'NewFormServiceModule',
        [
            'ngResource'
        ]
    )
    .factory(
    'NewFormService',
    function ($resource) {
        return $resource(
            'https://jsonplaceholder.typicode.com/posts',
            {},
            {
                update: {
                    method: 'POST'
                }
            }
        );
    }
);
